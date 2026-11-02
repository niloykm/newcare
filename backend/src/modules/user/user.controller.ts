import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserService } from './user.service';
import { UserGuard } from '../../guards/user.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() body: any) {
    return this.userService.register(body);
  }

  @Post('login')
  async loginUser(@Body() body: any) {
    return this.userService.login(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    return this.userService.forgotPassword(body);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    return this.userService.resetPassword(body);
  }

  @Post('google-auth')
  async googleAuth(@Body() body: any) {
    return this.userService.googleAuth(body);
  }

  @Get('google-oauth-url')
  @Header('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600')
  async getGoogleOAuthUrl() {
    return this.userService.getGoogleOAuthUrl();
  }

  @Post('google-auth-token')
  async googleAuthWithToken(@Body() body: any) {
    return this.userService.googleAuthWithAccessToken(body);
  }

  @Get('get-profile')
  @UseGuards(UserGuard)
  async getProfile(@Req() req: any) {
    return this.userService.getProfile(req.userId);
  }

  @Post('update-profile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @UseGuards(UserGuard)
  async updateProfile(
    @Req() req: any,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfile(req.userId, body, file);
  }

  @Post('book-appointment')
  @UseGuards(UserGuard)
  async bookAppointment(@Req() req: any, @Body() body: any) {
    return this.userService.bookAppointment(req.userId, body);
  }

  @Get('appointments')
  @UseGuards(UserGuard)
  async listAppointment(@Req() req: any) {
    return this.userService.listAppointment(req.userId);
  }

  @Post('cancel-appointment')
  @UseGuards(UserGuard)
  async cancelAppointment(@Req() req: any, @Body() body: any) {
    return this.userService.cancelAppointment(req.userId, body);
  }

  @Post('reschedule-appointment')
  @UseGuards(UserGuard)
  async rescheduleAppointment(@Req() req: any, @Body() body: any) {
    return this.userService.rescheduleAppointment(req.userId, body);
  }

  @Post('add-review')
  @UseGuards(UserGuard)
  async addReview(@Req() req: any, @Body() body: any) {
    return this.userService.addReview(req.userId, body);
  }

  @Post('mock-payment')
  @UseGuards(UserGuard)
  async mockPayment(@Req() req: any, @Body() body: any) {
    return this.userService.mockPayment(req.userId, body);
  }

  @Post('contact')
  async contactForm(@Body() body: any) {
    return this.userService.contactForm(body);
  }
}
