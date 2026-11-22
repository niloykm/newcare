"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { DoctorProfile } from "@/data/doctorsData";
import { useStore, ConsultationType, StoredAppointment } from "@/store/useStore";
import {
  FieldErrors,
  validateEmail,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";

interface MultiStepBookingProps {
  doctor: DoctorProfile;
}

type IntakeField = "patientName" | "patientEmail" | "patientPhone";

const COMMON_SYMPTOMS = [
  "Blood Pressure Review",
  "Preventive Annual Visit",
  "Medication Review",
  "Post-Op Follow-up",
  "Persistent Fatigue",
  "Skin Irritation",
  "Joint / Mobility Pain",
  "Headache / Migraine",
];

function getUpcomingDays(count = 7) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label =
      i === 0
        ? `Today, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : i === 1
          ? `Tomorrow, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
          : d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

    days.push({
      label,
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
  const initialSlot = searchParams?.get("slot") || doctor.availableSlots[0] || "10:30 AM";
  const initialTypeParam = searchParams?.get("type");
  const initialType: ConsultationType =
    initialTypeParam === "HD Video Consultation"
      ? "HD Video Consultation"
      : "In-Clinic Visit";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [consultationType, setConsultationType] = useState<ConsultationType>(initialType);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(initialSlot);

  const [patientName, setPatientName] = useState("Hannah Morales");
  const [patientEmail, setPatientEmail] = useState("hannah.morales@example.com");
  const [patientPhone, setPatientPhone] = useState("(212) 480-0148");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored) as { name?: string; email?: string };
        if (parsed.name?.trim()) setPatientName(parsed.name.trim());
        if (parsed.email?.trim()) setPatientEmail(parsed.email.trim());
      }
    } catch {
      // Default intake values remain
    }
  }, []);
  const [patientAge, setPatientAge] = useState("38");
  const [patientGender, setPatientGender] = useState("Female");
  const [reason, setReason] = useState(
    "Preventive consultation and care-plan review"
  );
  const [symptoms, setSymptoms] = useState<string[]>(["Preventive Annual Visit"]);
  const [errors, setErrors] = useState<FieldErrors<IntakeField>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<StoredAppointment | null>(null);

  const availableTimeSlots = [
    "09:30 AM",
    "10:30 AM",
    "11:30 AM",
    "02:00 PM",
    "03:30 PM",
    "04:30 PM",
    "05:15 PM",
  ];

  const toggleSymptom = (item: string) => {
    setSymptoms((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleConfirmBooking = () => {
    const nextErrors: FieldErrors<IntakeField> = {
      patientName: validateRequiredText(patientName, "Patient full name"),
      patientEmail: validateEmail(patientEmail),
      patientPhone: validatePhone(patientPhone),
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      toast.error("Please complete the required patient fields.");
      return;
    }

    setErrors({});
    const newBooking = addAppointment({
      doctorId: doctor.id || doctor._id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorHospital: doctor.hospitalName,
      doctorAvatar: doctor.avatarUrl || doctor.image,
      doctorDegree: doctor.degree,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: Number(patientAge) || 35,
      reason: reason.trim() || "Specialist consultation",
      symptoms,
      consultationType,
      slotDate: days[selectedDayIndex].label,
      slotTime: selectedSlot,
      amount: doctor.consultationFee,
    });

    setConfirmedBooking(newBooking);
    setStep(3);
    toast.success("Appointment confirmed.");
  };

  const handleDownloadSlip = () => {
    if (!confirmedBooking) return;
    const slipText = [
      "NEWCARE APPOINTMENT CONFIRMATION",
      "================================",
      `Booking ID: ${confirmedBooking.bookingId}`,
      `Status: CONFIRMED`,
      `Date & Time: ${confirmedBooking.slotDate} at ${confirmedBooking.slotTime}`,
      `Format: ${confirmedBooking.consultationType}`,
      `Physician: ${doctor.name} (${doctor.degree})`,
      `Specialty: ${doctor.specialty}`,
      `Location: ${doctor.hospitalName}`,
      `Patient: ${confirmedBooking.patientName} (Age ${confirmedBooking.patientAge})`,
      `Fee: $${confirmedBooking.amount} USD`,
    ].join("\n");

    const file = new Blob([slipText], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NewCare_${confirmedBooking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Confirmation slip downloaded.");
  };

  const handleExportICS = () => {
    if (!confirmedBooking) return;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//NewCare Health//Appointments//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Appointment with ${doctor.name} (${confirmedBooking.consultationType})`,
      `DESCRIPTION:Booking ${confirmedBooking.bookingId} — ${confirmedBooking.reason}`,
      `LOCATION:${doctor.hospitalName}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `NewCare-${confirmedBooking.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Calendar invite (.ics) downloaded.");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Clinician Summary */}
      <div className="card p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-18 h-18 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
          <Image
            src={doctor.avatarUrl || doctor.image}
            alt={doctor.name}
            fill
            sizes="72px"
            className="object-cover object-top"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              {doctor.specialty}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              {doctor.license}
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {doctor.name}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {doctor.degree} · {doctor.hospitalName}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
              <strong className="text-slate-900 dark:text-slate-100 tabular-nums">
                {doctor.rating.toFixed(1)}
              </strong>
              <span className="tabular-nums">({doctor.reviewsCount} reviews)</span>
            </span>
            <span className="tabular-nums">{doctor.experienceYears} yrs experience</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              ${doctor.consultationFee} / visit
            </span>
          </div>
        </div>
      </div>

      {/* 3-Step Indicator */}
      <ol className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-6">
        {[
          { num: 1, label: "Schedule", sub: "Format & time" },
          { num: 2, label: "Intake", sub: "Patient info" },
          { num: 3, label: "Confirm", sub: "Digital pass" },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <li
              key={s.num}
              className={`p-2.5 sm:p-3 rounded-lg border flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-2.5 transition-colors ${
                isActive
                  ? "bg-white dark:bg-[#11161d] border-teal-700 dark:border-teal-400"
                  : isDone
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900"
                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 tabular-nums ${
                  isDone
                    ? "bg-emerald-700 text-white"
                    : isActive
                      ? "bg-teal-700 dark:bg-teal-400 text-white dark:text-slate-950"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> : s.num}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {s.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                  {s.sub}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Step 1: Modality, Date & Time */}
      {step === 1 && (
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Select Visit Format &amp; Time
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Choose an in-clinic visit or encrypted video consultation with {doctor.name}.
            </p>
          </div>

          <fieldset>
            <legend className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Consultation Format
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    type: "In-Clinic Visit" as ConsultationType,
                    title: "In-Clinic Visit",
                    desc: doctor.hospitalName,
                    icon: MapPin,
                  },
                  {
                    type: "HD Video Consultation" as ConsultationType,
                    title: "Telehealth Video",
                    desc: "Encrypted browser video room",
                    icon: Video,
                  },
                ] as const
              ).map(({ type, title, desc, icon: Icon }) => {
                const selected = consultationType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setConsultationType(type)}
                    className={`p-4 rounded-lg border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      selected
                        ? "border-teal-700 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/30"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11161d] hover:border-slate-400"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        selected ? "text-teal-700 dark:text-teal-400" : "text-slate-500"
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Date
            </legend>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {days.map((d, index) => {
                const isSelected = selectedDayIndex === index;
                return (
                  <button
                    key={d.label}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDayIndex(index)}
                    className={`min-h-[64px] py-2 px-1.5 rounded-md border text-center transition-colors flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? "bg-teal-700 dark:bg-teal-400 border-teal-700 dark:border-teal-400 text-white dark:text-slate-950"
                        : "bg-white dark:bg-[#11161d] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <span className="text-[11px] font-medium opacity-80">{d.dayName}</span>
                    <span className="text-base font-semibold tabular-nums">{d.dayNumber}</span>
                    <span className="text-[10px] opacity-80">{d.month}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Available Times ({days[selectedDayIndex].label})
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableTimeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedSlot(slot)}
                    className={`min-h-[44px] px-3 rounded-md border text-xs font-semibold tabular-nums transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-teal-700 dark:bg-teal-400 border-teal-700 dark:border-teal-400 text-white dark:text-slate-950"
                        : "bg-white dark:bg-[#11161d] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Fee:{" "}
              <strong className="text-slate-900 dark:text-slate-100 tabular-nums">
                ${doctor.consultationFee}
              </strong>{" "}
              · Free reschedule up to 24h prior
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary px-5"
            >
              <span>Continue to Patient Info</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Patient Intake */}
      {step === 2 && (
        <div className="card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Patient Intake Details
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Confirm contact information and visit objective for {doctor.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="patient-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Patient Full Name *
              </label>
              <input
                id="patient-name"
                type="text"
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  if (errors.patientName) setErrors({ ...errors, patientName: undefined });
                }}
                aria-invalid={Boolean(errors.patientName)}
                aria-describedby={errors.patientName ? "booking-name-error" : undefined}
                className="input"
              />
              {errors.patientName && (
                <p id="booking-name-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                  {errors.patientName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="patient-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Email Address *
              </label>
              <input
                id="patient-email"
                type="email"
                value={patientEmail}
                onChange={(e) => {
                  setPatientEmail(e.target.value);
                  if (errors.patientEmail) setErrors({ ...errors, patientEmail: undefined });
                }}
                aria-invalid={Boolean(errors.patientEmail)}
                aria-describedby={errors.patientEmail ? "booking-email-error" : undefined}
                className="input"
              />
              {errors.patientEmail && (
                <p id="booking-email-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                  {errors.patientEmail}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="patient-phone"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Phone Number *
              </label>
              <input
                id="patient-phone"
                type="tel"
                value={patientPhone}
                onChange={(e) => {
                  setPatientPhone(e.target.value);
                  if (errors.patientPhone) setErrors({ ...errors, patientPhone: undefined });
                }}
                aria-invalid={Boolean(errors.patientPhone)}
                aria-describedby={errors.patientPhone ? "booking-phone-error" : undefined}
                className="input"
              />
              {errors.patientPhone && (
                <p id="booking-phone-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                  {errors.patientPhone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="patient-age"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Age
                </label>
                <input
                  id="patient-age"
                  type="number"
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="input tabular-nums"
                />
              </div>
              <div>
                <label
                  htmlFor="patient-gender"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Gender
                </label>
                <select
                  id="patient-gender"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="input cursor-pointer"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="visit-reason"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Reason for Visit
            </label>
            <textarea
              id="visit-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="input py-2 resize-y"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Relevant Topics (Optional)
            </span>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((item) => {
                const active = symptoms.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleSymptom(item)}
                    className={`min-h-[36px] px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? "bg-teal-700 dark:bg-teal-400 text-white dark:text-slate-950 border-teal-700 dark:border-teal-400"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back</span>
            </button>
            <button type="button" onClick={handleConfirmBooking} className="btn-primary px-5">
              <span>Confirm Appointment</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation Pass */}
      {step === 3 && confirmedBooking && (
        <div className="card p-6 space-y-6">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Appointment Confirmed
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Confirmation ID{" "}
                <strong className="font-mono text-slate-900 dark:text-slate-100">
                  {confirmedBooking.bookingId}
                </strong>{" "}
                has been saved to your Patient Portal.
              </p>
            </div>
          </div>

          <dl className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">Physician</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                {doctor.name} ({doctor.specialty})
              </dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">Schedule</dt>
              <dd className="font-semibold text-teal-700 dark:text-teal-400 tabular-nums text-right">
                {confirmedBooking.slotDate} at {confirmedBooking.slotTime}
              </dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">Format</dt>
              <dd className="text-slate-900 dark:text-slate-100 text-right">
                {confirmedBooking.consultationType}
              </dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">Patient</dt>
              <dd className="text-slate-900 dark:text-slate-100 text-right">
                {confirmedBooking.patientName} (Age {confirmedBooking.patientAge})
              </dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">Consultation Fee</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums text-right">
                ${confirmedBooking.amount}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <button type="button" onClick={handleDownloadSlip} className="btn-secondary text-xs">
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download Slip</span>
            </button>
            <button type="button" onClick={handleExportICS} className="btn-secondary text-xs">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Add to Calendar (.ics)</span>
            </button>
            <Link href="/dashboard/patient" className="btn-primary text-xs px-4">
              <span>View in Patient Portal</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
