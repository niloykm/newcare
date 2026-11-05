"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star, ShieldCheck, MapPin, Calendar, Clock, Video, CheckCircle2,
  ArrowRight, ArrowLeft, Download, User, Phone, Mail, Tag
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
  const searchParams = useSearchParams();
  const { addAppointment } = useStore();

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
    toast.success("Demo intake data loaded");
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
    toast.success("Appointment Confirmed and Synchronized");
  };

  const handleDownloadSlip = () => {
    if (!confirmedBooking) return;
    const slipText = `
=============================================
NEWCARE CLINICAL APPOINTMENT CONFIRMATION SLIP
=============================================
Booking ID:        ${confirmedBooking.bookingId}
Status:            CONFIRMED
Date & Time:       ${confirmedBooking.slotDate} at ${confirmedBooking.slotTime}
Consultation Type: ${confirmedBooking.consultationType}

DOCTOR DETAILS:
Name:              ${doctor.name}
Credentials:       ${doctor.degree}
Specialty:         ${doctor.specialty}
Hospital / Clinic: ${doctor.hospitalName}

PATIENT DETAILS:
Patient:           ${confirmedBooking.patientName} (Age: ${confirmedBooking.patientAge})
Contact:           ${confirmedBooking.patientEmail} | ${confirmedBooking.patientPhone}
Reason for Visit:  ${confirmedBooking.reason}
Symptoms:          ${confirmedBooking.symptoms.join(", ")}
Fee:               $${confirmedBooking.amount} USD

Location/Link:     ${confirmedBooking.roomNumber || confirmedBooking.meetingLink || "Health Plaza NY"}
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
    toast.success("Confirmation slip downloaded");
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
    toast.success("Calendar invite (.ics) generated");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Doctor Summary Banner */}
      <div className="card p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
          <Image
            src={doctor.avatarUrl || doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"}
            alt={doctor.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="badge-clinical badge-neutral text-xs text-neutral-700 dark:text-neutral-300">
              {doctor.specialty}
            </span>
            <span className="badge-clinical badge-verified text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified Faculty
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
            {doctor.name}
          </h2>

          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {doctor.degree} • {doctor.hospitalName}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="inline-flex items-center gap-1 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                {doctor.rating?.toFixed(1) || "4.9"}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">
                ({doctor.reviewsCount || 128} reviews)
              </span>
            </span>
            <span>•</span>
            <span className="tabular-nums font-medium">{doctor.experienceYears}+ yrs practice</span>
            <span>•</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
              ${doctor.consultationFee || 50} / visit
            </span>
          </div>
        </div>
      </div>

      {/* 3-Step Progress Tracker */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { num: 1, label: "Schedule", sub: "Format & time" },
          { num: 2, label: "Intake", sub: "Patient details" },
          { num: 3, label: "Confirmation", sub: "Digital pass" },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div
              key={s.num}
              className={`p-2.5 sm:p-3 rounded-lg border transition-colors flex items-center gap-2.5 ${
                isActive
                  ? "bg-white dark:bg-neutral-800 border-neutral-900 dark:border-neutral-100 shadow-xs"
                  : isDone
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                  : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-70"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 tabular-nums ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isActive
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {s.label}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:block truncate">
                  {s.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Format & Slot Selection ── */}
      {step === 1 && (
        <div className="card p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Step 1: Consultation Modality & Schedule
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Select how and when you would like to consult with {doctor.name}.
            </p>
          </div>

          {/* Consultation Modality Toggles */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Consultation Modality
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType("In-Clinic Visit")}
                className={`p-3.5 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  consultationType === "In-Clinic Visit"
                    ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-900 dark:ring-neutral-100"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400"
                }`}
              >
                <MapPin className="w-5 h-5 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    In-Clinic Consultation
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    In-person visit at {doctor.hospitalName}. Fast-track QR check-in at reception.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType("HD Video Consultation")}
                className={`p-3.5 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  consultationType === "HD Video Consultation"
                    ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-900 dark:ring-neutral-100"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400"
                }`}
              >
                <Video className="w-5 h-5 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Telehealth Video Consultation
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    Encrypted HD virtual consultation room from your phone or browser.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Compact Timeline Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Select Appointment Date
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {days.map((d, index) => {
                const isSelected = selectedDayIndex === index;
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setSelectedDayIndex(index)}
                    className={`py-2 px-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-950"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-[11px] font-medium opacity-80 uppercase tracking-tight">
                      {d.dayName}
                    </span>
                    <span className="text-base sm:text-lg font-semibold tabular-nums leading-snug">
                      {d.dayNumber}
                    </span>
                    <span className="text-[10px] font-medium opacity-80">
                      {d.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 30-Minute Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Available Time Slots ({days[selectedDayIndex].label})
              </label>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                Live Sync
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableTimeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`h-10 px-3 rounded-lg border text-xs font-semibold tabular-nums transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-950 shadow-xs"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary text-xs sm:text-sm px-5 py-2.5 font-semibold"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Patient Intake & Clinical Reason ── */}
      {step === 2 && (
        <div className="card p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Step 2: Patient Intake Details
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Verify contact information and clinical symptoms for the clinician.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePreFillDemo}
              className="btn-secondary text-xs px-2.5 py-1.5"
              title="Autofill standard test profile"
            >
              Autofill Demo
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient-name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Patient Full Name *
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  id="patient-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="patient-email" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address *
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  id="patient-email"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="patient-phone" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Contact Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  id="patient-phone"
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="input pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="patient-age" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Age
                </label>
                <input
                  id="patient-age"
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="input tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="patient-gender" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Gender
                </label>
                <select
                  id="patient-gender"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="input cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Primary Reason for Visit */}
          <div>
            <label htmlFor="visit-reason" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Clinical Concern / Reason for Visit
            </label>
            <textarea
              id="visit-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Primary symptoms or consultation objective..."
              className="input resize-y"
            />
          </div>

          {/* Symptom Tag Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Primary Symptom Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOMS.map((s) => {
                const isSelected = symptoms.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors inline-flex items-center gap-1 ${
                      isSelected
                        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 border-neutral-900 dark:border-neutral-100"
                        : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary text-xs sm:text-sm px-4 py-2 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Schedule</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmBooking}
              className="btn-primary text-xs sm:text-sm px-5 py-2.5 font-semibold"
            >
              <span>Confirm & Lock Appointment</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Digital Clinical Pass ── */}
      {step === 3 && confirmedBooking && (
        <div className="card p-5 sm:p-6 space-y-6">
          <div className="text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 mb-2">
              Appointment Synchronized
            </div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Clinical Confirmation Record
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Appointment record has been registered in the clinic database.
            </p>
          </div>

          {/* High-Density Structural Pass */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 p-5 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800 mb-4">
              <div>
                <span className="text-neutral-400 text-[10px] uppercase tracking-wider block">CLINICAL PASS TOKEN</span>
                <span className="text-sm font-semibold text-white tracking-wide">{confirmedBooking.bookingId}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                CONFIRMED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase block">CLINICIAN</span>
                  <span className="text-neutral-200 font-medium">{doctor.name} ({doctor.specialty})</span>
                  <span className="text-neutral-400 block text-[11px]">{doctor.hospitalName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase block">SCHEDULE</span>
                  <span className="text-sky-400 font-semibold">{confirmedBooking.slotDate} at {confirmedBooking.slotTime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase block">PATIENT</span>
                  <span className="text-neutral-200 font-medium">{confirmedBooking.patientName} (Age: {confirmedBooking.patientAge})</span>
                  <span className="text-neutral-400 block text-[11px]">{confirmedBooking.patientEmail}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase block">MODALITY / ACCESS</span>
                  <span className="text-neutral-200">
                    {confirmedBooking.consultationType === "HD Video Consultation"
                      ? `Virtual Link: ${confirmedBooking.meetingLink || "https://meet.newcare.health"}`
                      : `In-Person Room: ${confirmedBooking.roomNumber || "Suite 402"}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadSlip}
              className="btn-secondary text-xs px-3.5 py-2 font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Download Record (.txt)</span>
            </button>

            <button
              type="button"
              onClick={handleExportICS}
              className="btn-secondary text-xs px-3.5 py-2 font-semibold"
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Export Calendar (.ics)</span>
            </button>

            <Link
              href="/dashboard/patient"
              className="btn-primary text-xs px-4 py-2 font-semibold"
            >
              <span>View in Patient Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
