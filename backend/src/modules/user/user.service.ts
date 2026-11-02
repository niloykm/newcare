import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { User } from '../../schemas/user.schema';
import { Doctor } from '../../schemas/doctor.schema';
import { Appointment } from '../../schemas/appointment.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async register(body: any) {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      throw new BadRequestException({ message: 'Please enter all fields' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException({ message: 'Please enter valid email' });
    }

    if (password.length < 8) {
      throw new BadRequestException({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException({ message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return {
      success: true,
      token,
      userData: {
        name: user.name,
        email: user.email,
        image: user.image || '',
      },
    };
  }

  async login(body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException({ success: false, message: 'Please enter all fields' });
    }

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return {
        success: true,
        token,
        userData: {
          name: user.name,
          email: user.email,
          image: user.image || '',
        },
      };
    }
    throw new BadRequestException({ success: false, message: 'Invalid credentials' });
  }

  async forgotPassword(body: any) {
    const { email } = body;
    if (!email) {
      throw new BadRequestException({ success: false, message: 'Please provide an email address' });
    }

    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Return success without revealing user existence for security
      return {
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      };
    }

    // Generate 6-digit OTP code or secure reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    user.set('resetPasswordToken', resetToken);
    user.set('resetPasswordExpires', expires);
    await user.save();

    console.log(`🔑 [PASSWORD RESET] Token for ${email}: ${resetToken}`);

    return {
      success: true,
      message: 'Password reset code generated. Please check your email or enter your code.',
      resetToken, // Returned so UI can autofill or display in development/demo mode
    };
  }

  async resetPassword(body: any) {
    const { email, token, newPassword } = body;
    if (!email || !token || !newPassword) {
      throw new BadRequestException({ success: false, message: 'Email, code, and new password are required' });
    }

    if (newPassword.length < 8) {
      throw new BadRequestException({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const user = await this.userModel.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException({ success: false, message: 'Invalid or expired reset code' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.set('resetPasswordToken', null);
    user.set('resetPasswordExpires', null);
    await user.save();

    return {
      success: true,
      message: 'Password has been reset successfully! You can now sign in with your new password.',
    };
  }

  async getProfile(userId: string) {
    const userData = await this.userModel.findById(userId).select('-password');
    if (!userData) {
      throw new NotFoundException({ success: false, message: 'User not found' });
    }
    return { success: true, userData };
  }

  async updateProfile(userId: string, body: any, imageFile: any) {
    const { name, phone, address, dob, gender } = body;
    if (!name || !phone || !dob || !gender) {
      throw new BadRequestException({ message: 'Name, phone, dob and gender is required' });
    }

    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    await this.userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      const imageUrl = imageUpload.secure_url;
      await this.userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    return { success: true, message: 'Profile updated successfully' };
  }

  async bookAppointment(userId: string, body: any) {
    const { docId, slotDate, slotTime, appointmentType, onlineInfo, offlineInfo } = body;
    if (!userId || !docId || !slotDate || !slotTime) {
      throw new BadRequestException({
        success: false,
        message: 'Missing required fields for booking',
      });
    }

    // Try to book slot atomically
    const acquireQuery = {
      _id: docId,
      available: true,
      $or: [
        { [`slots_booked.${slotDate}`]: { $exists: false } },
        { [`slots_booked.${slotDate}`]: { $ne: slotTime } },
      ],
    };

    const acquireAction = {
      $addToSet: {
        [`slots_booked.${slotDate}`]: slotTime,
      },
    };

    const docData = await this.doctorModel.findOneAndUpdate(acquireQuery, acquireAction, { new: true }).select('-password');
    if (!docData) {
      throw new BadRequestException({
        success: false,
        message: 'Slot is already booked or doctor is not available',
      });
    }

    const userData = await this.userModel.findById(userId).select('-password');
    if (!userData) {
      throw new NotFoundException({ success: false, message: 'User not found' });
    }

    const docDataCopy = docData.toObject();
    delete docDataCopy.slots_booked;

    const type = appointmentType === 'online' ? 'online' : 'offline';
    let computedOnlineInfo = null;
    let computedOfflineInfo = null;

    if (type === 'online') {
      computedOnlineInfo = {
        time: onlineInfo?.time || slotTime,
        platform: onlineInfo?.platform || 'Google Meet',
        meetingLink: onlineInfo?.meetingLink || `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
        otherInfo: onlineInfo?.otherInfo || '',
      };
    } else {
      const existingCount = await this.appointmentModel.countDocuments({ docId, slotDate });
      const serialNum = `#${(existingCount + 1).toString().padStart(2, '0')}`;
      const doctorAddress = docDataCopy.address ? `${docDataCopy.address.line1}, ${docDataCopy.address.line2}` : 'Main Clinic';
      computedOfflineInfo = {
        serialNumber: offlineInfo?.serialNumber || serialNum,
        place: offlineInfo?.place || doctorAddress,
        expectedTime: offlineInfo?.expectedTime || slotTime,
        location: offlineInfo?.location || doctorAddress,
        otherInfo: offlineInfo?.otherInfo || '',
      };
    }

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: docDataCopy,
      amount: docData.fees,
      date: Date.now(),
      appointmentType: type,
      onlineInfo: computedOnlineInfo,
      offlineInfo: computedOfflineInfo,
    };

    const newAppointment = new this.appointmentModel(appointmentData);
    await newAppointment.save();

    return { success: true, message: 'Appointment booked successfully' };
  }

  async listAppointment(userId: string) {
    const appointments = await this.appointmentModel.find({ userId });
    return { success: true, appointments };
  }

  async cancelAppointment(userId: string, body: any) {
    const { appointmentId } = body;
    const appointmentData = await this.appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    if (appointmentData.userId !== userId) {
      throw new ForbiddenException({
        success: false,
        message: 'You are not authorized to cancel this appointment',
      });
    }

    await this.appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await this.doctorModel.findById(docId);
    if (docData) {
      const slots_booked = docData.slots_booked || {};
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((time: string) => time !== slotTime);
        await this.doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    return { success: true, message: 'Appointment cancelled successfully' };
  }

  async rescheduleAppointment(userId: string, body: any) {
    const { appointmentId, newSlotDate, newSlotTime } = body;
    if (!appointmentId || !newSlotDate || !newSlotTime) {
      throw new BadRequestException({ success: false, message: 'Missing required fields for rescheduling' });
    }

    const appointmentData = await this.appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    if (appointmentData.userId !== userId) {
      throw new ForbiddenException({
        success: false,
        message: 'You are not authorized to reschedule this appointment',
      });
    }

    if (appointmentData.cancelled || appointmentData.isCompleted) {
      throw new BadRequestException({
        success: false,
        message: 'Cannot reschedule cancelled or completed appointments',
      });
    }

    const { docId, slotDate: oldSlotDate, slotTime: oldSlotTime } = appointmentData;

    // Acquire new slot atomically
    const acquireQuery = {
      _id: docId,
      available: true,
      $or: [
        { [`slots_booked.${newSlotDate}`]: { $exists: false } },
        { [`slots_booked.${newSlotDate}`]: { $ne: newSlotTime } },
      ],
    };

    const acquireAction = {
      $addToSet: {
        [`slots_booked.${newSlotDate}`]: newSlotTime,
      },
    };

    const updatedDoc = await this.doctorModel.findOneAndUpdate(acquireQuery, acquireAction, { new: true });
    if (!updatedDoc) {
      throw new BadRequestException({
        success: false,
        message: 'The requested new slot is already booked or doctor is not available',
      });
    }

    // Release old slot
    const releaseAction = {
      $pull: {
        [`slots_booked.${oldSlotDate}`]: oldSlotTime,
      },
    };
    await this.doctorModel.findByIdAndUpdate(docId, releaseAction);

    // Update appointment
    await this.appointmentModel.findByIdAndUpdate(appointmentId, {
      slotDate: newSlotDate,
      slotTime: newSlotTime,
    });

    return { success: true, message: 'Appointment rescheduled successfully' };
  }

  async googleAuth(body: any) {
    const { credential } = body;
    if (!credential) {
      throw new BadRequestException({ success: false, message: 'Google credential token missing' });
    }

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!response.ok) {
      throw new BadRequestException({ success: false, message: 'Invalid Google token' });
    }

    const payload = await response.json();
    const { email, name, picture, email_verified } = payload;

    if (email_verified !== 'true' && email_verified !== true) {
      throw new BadRequestException({ success: false, message: 'Google email is not verified' });
    }

    let user = await this.userModel.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const userData = {
        name,
        email,
        password: hashedPassword,
        image: picture || '',
      };

      const newUser = new this.userModel(userData);
      user = await newUser.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return {
      success: true,
      token,
      userData: {
        name: user.name,
        email: user.email,
        image: user.image || '',
      },
      message: 'Authenticated successfully',
    };
  }

  getGoogleOAuthUrl() {
    const clientId = (process.env.GOOGLE_CLIENT_ID || '1089608603127-v3lig04qohrvth72o4gefodv559gh936.apps.googleusercontent.com').trim();
    const redirectUri = `https://newcare.vercel.app/login`;
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'token');
    url.searchParams.set('scope', 'openid email profile');
    url.searchParams.set('prompt', 'select_account');
    return { success: true, url: url.toString() };
  }

  async googleAuthWithAccessToken(body: any) {
    const { accessToken } = body;
    if (!accessToken) {
      throw new BadRequestException({ success: false, message: 'Access token missing' });
    }

    // Fetch user info from Google using access token
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new BadRequestException({ success: false, message: 'Invalid Google access token' });
    }

    const payload = await response.json();
    const { email, name, picture, email_verified } = payload;

    if (!email_verified) {
      throw new BadRequestException({ success: false, message: 'Google email is not verified' });
    }

    let user = await this.userModel.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      const newUser = new this.userModel({ name, email, password: hashedPassword, image: picture || '' });
      user = await newUser.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return {
      success: true,
      token,
      userData: {
        name: user.name,
        email: user.email,
        image: user.image || '',
      },
      message: 'Authenticated successfully',
    };
  }

  async addReview(userId: string, body: any) {
    const { appointmentId, rating, review } = body;
    if (!appointmentId || !rating) {
      throw new BadRequestException({ success: false, message: 'Missing appointment ID or rating' });
    }

    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException({ success: false, message: 'Unauthorized action' });
    }

    if (!appointment.isCompleted) {
      throw new BadRequestException({ success: false, message: 'Can only review completed appointments' });
    }

    await this.appointmentModel.findByIdAndUpdate(appointmentId, {
      rating: Number(rating),
      review: review || '',
      isReviewed: true,
    });

    return { success: true, message: 'Review submitted successfully' };
  }

  async mockPayment(userId: string, body: any) {
    const { appointmentId, status } = body;
    if (!appointmentId || !status) {
      throw new BadRequestException({ success: false, message: 'Missing required fields' });
    }

    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException({ success: false, message: 'Unauthorized action' });
    }

    if (status === 'success') {
      await this.appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
      return { success: true, message: 'Payment processed successfully!' };
    } else {
      throw new BadRequestException({ success: false, message: 'Payment transaction declined by processor.' });
    }
  }

  async contactForm(body: any) {
    const { name, email, subject, message } = body;
    if (!name || !email || !message) {
      throw new BadRequestException({ success: false, message: 'Name, email and message are required' });
    }

    console.log(`📧 Contact Form Submission:
  From: ${name} <${email}>
  Subject: ${subject || 'No subject'}
  Message: ${message}`);

    return { success: true, message: "Message received! We'll get back to you within 24 hours." };
  }
}
