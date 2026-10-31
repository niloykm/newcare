"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star, ShieldCheck, MapPin, Calendar, Clock, Video, CheckCircle2,
  ArrowRight, ArrowLeft, Download, QrCode, FileText, Sparkles, User,
  Phone, Mail, Tag, AlertCircle, Share2
} from "lucide-react";
import toast from "react-hot-toast";
import { DoctorProfile } from "@/data/doctorsData";
import { useStore, ConsultationType } from "@/store/useStore";

interface MultiStepBookingProps {
  doctor: DoctorProfile;
}

const COMMON_SYMPTOMS = [
  "Chest Discomfort",
  "Arrhythmia",
  "Hypertension",
  "Chronic Fatigue",
  "Severe Headache",
  "Skin Rash / Eczema",
  "Joint Stiffness",
  "Routine Annual Review",
  "Prescription Refill",
  "Post-Op Follow-up",
];

function getUpcomingDays(count = 7) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const isToday = i === 0;
    const isTomorrow = i === 1;
    const label = isToday
      ? `Today, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : isTomorrow
      ? `Tomorrow, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    days.push({
      label,
      dateStr: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
}

export default function MultiStepBooking({ doctor }: MultiStepBookingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addAppointment, appointments } = useStore();

  const days = getUpcomingDays(7);
  const initialSlot = searchParams?.get("slot") || "04:30 PM";
  const initialType = (searchParams?.get("type") as ConsultationType) || "In-Clinic Visit";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [consultationType, setConsultationType] = useState<ConsultationType>(initialType);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(initialSlot);

  // Patient inputs
  const [patientName, setPatientName] = useState("Alexander Hayes");
  const [patientEmail, setPatientEmail] = useState("alexander.hayes@example.com");
  const [patientPhone, setPatientPhone] = useState("+1 (555) 382-9912");
  const [patientAge, setPatientAge] = useState("34");
  const [patientGender, setPatientGender] = useState("Male");
  const [reason, setReason] = useState("Cardiovascular preventative screening & blood pressure consultation");
  const [symptoms, setSymptoms] = useState<string[]>(["Chest Discomfort", "Routine Annual Review"]);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const availableTimeSlots = [
    "09:30 AM", "10:30 AM", "11:30 AM",
    "02:00 PM", "03:30 PM", "04:30 PM", "05:15 PM"
  ];

  const toggleSymptom = (s: string) => {
    if (symptoms.includes(s)) {
      setSymptoms(symptoms.filter((item) => item !== s));
    } else {
      setSymptoms([...symptoms, s]);
    }
  };

  const handlePreFillDemo = () => {
    setPatientName("Alexander Hayes");
    setPatientEmail("alexander.hayes@example.com");
    setPatientPhone("+1 (555) 382-9912");
    setPatientAge("34");
    setPatientGender("Male");
    setReason("Follow-up evaluation on mild chest discomfort and blood pressure check");
    setSymptoms(["Chest Discomfort", "Hypertension", "Routine Annual Review"]);
    toast.success("Demo credentials loaded!");
  };

  const handleConfirmBooking = () => {
    if (!patientName.trim()) {
      toast.error("Please enter patient name");
      return;
    }

    const newBooking = addAppointment({
      doctorId: doctor.id || doctor._id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty || doctor.speciality || "General Physician",
      doctorHospital: doctor.hospitalName || "NewCare Medical Center",
      doctorAvatar: doctor.avatarUrl || doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      doctorDegree: doctor.degree || "MBBS, MD",
      patientName,
      patientEmail,
      patientPhone,
      patientAge: Number(patientAge) || 30,
      reason,
      symptoms,
      consultationType,
      slotDate: days[selectedDayIndex].label,
      slotTime: selectedSlot,
      amount: doctor.consultationFee || doctor.fees || 50,
    });

    setConfirmedBooking(newBooking);
    setStep(3);
    toast.success("Appointment Confirmed Instantly!");
  };

  const handleDownloadSlip = () => {
    if (!confirmedBooking) return;
    const slipText = `
=============================================
NEWCARE CLINICAL APPOINTMENT CONFIRMATION SLIP
=============================================
Booking ID:        ${confirmedBooking.bookingId}
Status:            CONFIRMED (Touchless QR Ready)
Date & Time:       ${confirmedBooking.slotDate} at ${confirmedBooking.slotTime}
Consultation Type: ${confirmedBooking.consultationType}

DOCTOR DETAILS:
Name:              ${doctor.name}
Credentials:       ${doctor.degree}
Specialty:         ${doctor.specialty}
Hospital / Clinic: ${doctor.hospitalName}
License:           ${doctor.license}

PATIENT DETAILS:
Patient:           ${confirmedBooking.patientName} (Age: ${confirmedBooking.patientAge})
Contact:           ${confirmedBooking.patientEmail} | ${confirmedBooking.patientPhone}
Reason for Visit:  ${confirmedBooking.reason}
Symptoms:          ${confirmedBooking.symptoms.join(", ")}
Fee Paid:          $${confirmedBooking.amount} USD

Location/Link:     ${confirmedBooking.roomNumber || confirmedBooking.meetingLink || "Health Plaza NY"}
Check-In QR:       ${confirmedBooking.qrCodeUrl}
=============================================
Thank you for choosing NewCare Healthcare Network.
`;
    const element = document.createElement("a");
    const file = new Blob([slipText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `NewCare_Slip_${confirmedBooking.bookingId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Confirmation slip downloaded!");
  };

  const handleExportICS = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NewCare Healthcare//Appointments//EN
BEGIN:VEVENT
SUMMARY:Appointment with ${doctor.name} (${confirmedBooking.consultationType})
DESCRIPTION:NewCare Booking ${confirmedBooking.bookingId}. Reason: ${confirmedBooking.reason}
LOCATION:${doctor.hospitalName}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Appointment-${confirmedBooking.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Calendar invite (.ics) generated!");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Doctor Summary Banner */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "1.75rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          boxShadow: "var(--shadow-sm)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 84,
            height: 84,
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            flexShrink: 0,
          }}
        >
          <Image
            src={doctor.avatarUrl || doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"}
            alt={doctor.name}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                background: "rgba(14, 165, 233, 0.12)",
                color: "var(--primary)",
                fontWeight: 700,
                fontSize: "0.78rem",
                padding: "3px 10px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              {doctor.specialty}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#10b981", fontSize: "0.76rem", fontWeight: 700 }}>
              <ShieldCheck size={14} /> ✓ BMDC / Board Verified
            </span>
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text)", lineHeight: 1.2 }}>
            {doctor.name}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500, marginBottom: "4px" }}>
            {doctor.degree} • {doctor.hospitalName}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.82rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Star size={14} fill="#f59e0b" style={{ color: "#f59e0b" }} />
              <span style={{ fontWeight: 800, color: "var(--text)" }}>{doctor.rating?.toFixed(1) || "4.9"}</span>
              <span style={{ color: "var(--text-muted)" }}>({doctor.reviewsCount || 128} reviews)</span>
            </div>
            <span style={{ color: "var(--text-secondary)" }}>•</span>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{doctor.experienceYears}+ Yrs Clinical Experience</span>
            <span style={{ color: "var(--text-secondary)" }}>•</span>
            <span style={{ color: "var(--primary)", fontWeight: 800 }}>${doctor.consultationFee || 50} / visit</span>
          </div>
        </div>
      </div>

      {/* 3-Step Progress Tracker */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { num: 1, label: "Format & Slot", sub: "Choose time & visit type" },
          { num: 2, label: "Patient & Symptoms", sub: "Enter details & symptoms" },
          { num: 3, label: "Digital Pass", sub: "Instant QR confirmation" },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div
              key={s.num}
              style={{
                background: isActive
                  ? "rgba(14, 165, 233, 0.08)"
                  : isDone
                  ? "rgba(16, 185, 129, 0.08)"
                  : "var(--bg-card)",
                border: isActive
                  ? "2px solid var(--primary)"
                  : isDone
                  ? "1.5px solid #10b981"
                  : "1px solid var(--border)",
                borderRadius: "16px",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: isDone
                    ? "#10b981"
                    : isActive
                    ? "var(--primary)"
                    : "var(--border)",
                  color: isDone || isActive ? "white" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                {isDone ? <CheckCircle2 size={16} /> : s.num}
              </div>
              <div>
                <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {s.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Format & Slot Selection ── */}
      {step === 1 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "2.2rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem" }}>
            Step 1: Consultation Type & Schedule
          </h3>

          {/* Consultation Format Options */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "block" }}>
              Select Consultation Format:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div
                onClick={() => setConsultationType("In-Clinic Visit")}
                style={{
                  border: consultationType === "In-Clinic Visit" ? "2px solid var(--primary)" : "1px solid var(--border)",
                  background: consultationType === "In-Clinic Visit" ? "rgba(14, 165, 233, 0.08)" : "var(--bg-secondary)",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  transition: "all 0.2s ease",
                }}
              >
                <MapPin size={22} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>
                    In-Clinic Visit
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Visit {doctor.hospitalName}. Fast-track touchless QR check-in at reception desk.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setConsultationType("HD Video Consultation")}
                style={{
                  border: consultationType === "HD Video Consultation" ? "2px solid #6366f1" : "1px solid var(--border)",
                  background: consultationType === "HD Video Consultation" ? "rgba(99, 102, 241, 0.08)" : "var(--bg-secondary)",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  transition: "all 0.2s ease",
                }}
              >
                <Video size={22} style={{ color: "#6366f1", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>
                    HD Video Consultation
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Connect directly via encrypted telehealth video link from your phone or laptop.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Date Picker Carousel */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", display: "block" }}>
              Select Date:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px" }}>
              {days.map((d, index) => {
                const isSelected = selectedDayIndex === index;
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setSelectedDayIndex(index)}
                    style={{
                      padding: "12px 8px",
                      borderRadius: "14px",
                      border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: isSelected ? "var(--primary)" : "var(--bg-secondary)",
                      color: isSelected ? "white" : "var(--text)",
                      textAlign: "center",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, opacity: isSelected ? 0.9 : 0.7 }}>
                      {d.dayName}
                    </span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900 }}>
                      {d.dayNumber}
                    </span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, opacity: isSelected ? 0.9 : 0.7 }}>
                      {d.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 30-Minute Time Slots */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>
                Available 30-Minute Time Slots on {days[selectedDayIndex].label}:
              </label>
              <span style={{ fontSize: "0.76rem", color: "#10b981", fontWeight: 700 }}>
                ⚡ Real-time Calendar Sync
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "10px" }}>
              {availableTimeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: isSelected ? "rgba(14, 165, 233, 0.15)" : "var(--bg-secondary)",
                      color: isSelected ? "var(--primary)" : "var(--text)",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Clock size={13} style={{ color: isSelected ? "var(--primary)" : "var(--text-muted)" }} />
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proceed Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{
                padding: "12px 28px",
                fontSize: "0.95rem",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Next: Patient Details <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Patient Details & Symptoms ── */}
      {step === 2 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "2.2rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)" }}>
              Step 2: Patient Information & Symptoms
            </h3>
            <button
              type="button"
              onClick={handlePreFillDemo}
              style={{
                background: "rgba(14, 165, 233, 0.1)",
                color: "var(--primary)",
                border: "1px solid rgba(14, 165, 233, 0.3)",
                padding: "6px 14px",
                borderRadius: "10px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Sparkles size={13} /> ⚡ Pre-fill Demo Patient
            </button>
          </div>

          {/* Patient Form Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                Patient Full Name *
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} style={{ position: "absolute", left: 12, color: "#94a3b8" }} />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Alexander Hayes"
                  className="input"
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                Email Address *
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, color: "#94a3b8" }} />
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="e.g. alexander@example.com"
                  className="input"
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                Contact Phone Number
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={16} style={{ position: "absolute", left: 12, color: "#94a3b8" }} />
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="input"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                  Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reason for Visit */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Reason for Visit / Clinical Concern
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Describe your symptoms, medical history, or consultation goals..."
              className="input"
              style={{ resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          {/* Interactive Symptom Tags */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
              Select Relevant Symptoms / Clinical Tags:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {COMMON_SYMPTOMS.map((s) => {
                const isSelected = symptoms.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "50px",
                      border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: isSelected ? "rgba(14, 165, 233, 0.15)" : "var(--bg-secondary)",
                      color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Tag size={12} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ArrowLeft size={16} /> Back to Schedule
            </button>

            <button
              type="button"
              onClick={handleConfirmBooking}
              className="btn-primary"
              style={{
                padding: "12px 28px",
                fontSize: "0.95rem",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Confirm & Issue Digital Pass <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Instant Confirmation & Digital Appointment Pass ── */}
      {step === 3 && confirmedBooking && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "28px",
            padding: "2.5rem",
            boxShadow: "var(--shadow-xl)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Success Banner */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <div
              style={{
                display: "inline-block",
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                fontSize: "0.78rem",
                fontWeight: 800,
                padding: "4px 14px",
                borderRadius: "50px",
                marginBottom: "8px",
              }}
            >
              ✓ BOOKING CONFIRMED & SYNCHRONIZED
            </div>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text)" }}>
              Digital Appointment Pass Ready
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
              Your appointment is recorded in the synchronized Zustand store across Patient, Doctor, and Admin dashboards.
            </p>
          </div>

          {/* The High-Craft Digital Clinical Pass */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "20px",
              padding: "1.75rem",
              color: "white",
              marginBottom: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  NEWCARE HEALTHCARE PASS
                </span>
                <h4 style={{ fontSize: "1.3rem", fontWeight: 900, marginTop: "2px" }}>
                  Booking ID: {confirmedBooking.bookingId}
                </h4>
              </div>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#4ade80",
                  padding: "4px 12px",
                  borderRadius: "50px",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                }}
              >
                ● Status: Confirmed & Paid
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem", alignItems: "center" }} className="pass-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.86rem" }}>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "0.74rem", textTransform: "uppercase" }}>Doctor:</span>
                  <p style={{ fontWeight: 800, fontSize: "1rem" }}>{doctor.name} ({doctor.specialty})</p>
                  <p style={{ color: "#cbd5e1", fontSize: "0.78rem" }}>{doctor.hospitalName}</p>
                </div>

                <div>
                  <span style={{ color: "#94a3b8", fontSize: "0.74rem", textTransform: "uppercase" }}>Schedule:</span>
                  <p style={{ fontWeight: 800, color: "#38bdf8" }}>{confirmedBooking.slotDate} at {confirmedBooking.slotTime}</p>
                </div>

                <div>
                  <span style={{ color: "#94a3b8", fontSize: "0.74rem", textTransform: "uppercase" }}>Patient:</span>
                  <p style={{ fontWeight: 700 }}>{confirmedBooking.patientName} (Age: {confirmedBooking.patientAge})</p>
                </div>

                <div>
                  <span style={{ color: "#94a3b8", fontSize: "0.74rem", textTransform: "uppercase" }}>Format / Access:</span>
                  <p style={{ fontWeight: 600 }}>
                    {confirmedBooking.consultationType === "HD Video Consultation"
                      ? `Virtual Link: ${confirmedBooking.meetingLink}`
                      : `In-Person Room: ${confirmedBooking.roomNumber}`}
                  </p>
                </div>
              </div>

              {/* QR Code Block */}
              <div style={{ textAlign: "center", background: "white", padding: "1rem", borderRadius: "16px", color: "#0f172a" }}>
                <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto" }}>
                  <Image
                    src={confirmedBooking.qrCodeUrl}
                    alt="Check-in QR Code"
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
                <p style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>
                  Touchless Clinic QR
                </p>
                <p style={{ fontSize: "0.65rem", color: "#64748b" }}>
                  Scan at kiosk upon arrival
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
            <button
              onClick={handleDownloadSlip}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <Download size={15} /> Download Slip (.txt)
            </button>

            <button
              onClick={handleExportICS}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <Calendar size={15} /> Export Calendar (.ics)
            </button>

            <Link
              href="/dashboard/patient"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                color: "white",
                fontWeight: 800,
                fontSize: "0.88rem",
                textDecoration: "none",
                boxShadow: "0 6px 16px rgba(14, 165, 233, 0.3)",
              }}
            >
              View in Patient Dashboard <ArrowRight size={15} />
            </Link>

            <Link
              href="/dashboard/doctor"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              Check in Doctor Queue <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
