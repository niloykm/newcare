"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Star, Clock, Award, MapPin, ChevronLeft, CheckCircle2, ShieldCheck, ArrowRight, Video } from "lucide-react";
import api from "@/lib/api";
import { FALLBACK_DOCTORS } from "@/data/doctorsData";
import { useStore } from "@/store/useStore";
import DoctorCard from "@/components/DoctorCard";

interface Doctor {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  experience: number;
  fees: number;
  available: boolean;
  rating?: number;
  reviewCount?: number;
  degree?: string;
  about?: string;
  address?: { line1: string; line2: string };
  slots_booked?: Record<string, string[]>;
}

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM"
];

function getNextDays(n: number) {
  const days = [];
  const now = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const key = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`;
    days.push({
      date: d,
      key,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      display: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    });
  }
  return days;
}

export default function AppointmentPage({ params }: { params: Promise<{ docId: string }> }) {
  const unwrappedParams = use(params);
  const docId = unwrappedParams.docId;
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(() => {
    return (FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId) as any) || (FALLBACK_DOCTORS[0] as any);
  });
  const [days] = useState(() => getNextDays(7));
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>("10:30 AM");
  const [booking, setBooking] = useState(false);
  const [related, setRelated] = useState<any[]>(() => {
    const doc = FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId) || FALLBACK_DOCTORS[0];
    return FALLBACK_DOCTORS.filter((d) => d.id !== doc.id && d.specialty === doc.specialty).slice(0, 3);
  });
  const [appointmentType, setAppointmentType] = useState<"online" | "offline">("offline");
  const [platform, setPlatform] = useState("Google Meet");
  const [notes, setNotes] = useState("");

  const { addAppointment } = useStore();

  useEffect(() => {
    const fallback = FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId);
    if (fallback) {
      setDoctor(fallback as any);
      setRelated(FALLBACK_DOCTORS.filter((d) => d.id !== fallback.id && d.specialty === fallback.specialty).slice(0, 3));
    }

    const fetchDoctor = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data?.success) {
          const all: Doctor[] = res.data.doctors;
          const found = all.find((d) => d._id === docId || (d as any).id === docId);
          if (found) {
            setDoctor(found);
            const rel = all
              .filter((d) => (d._id !== docId && (d as any).id !== docId) && d.speciality === found.speciality)
              .slice(0, 3);
            if (rel.length > 0) setRelated(rel);
          }
        }
      } catch {
        // Fallback already assigned
      }
    };
    if (docId) fetchDoctor();
  }, [docId]);

  const bookedSlots = doctor?.slots_booked?.[days[selectedDay]?.key] || [];

  const handleBook = async () => {
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }

    setBooking(true);
    let success = false;

    try {
      const res = await api.post("/api/user/book-appointment", {
        docId,
        slotDate: days[selectedDay].key,
        slotTime: selectedTime,
        appointmentType,
        onlineInfo: appointmentType === "online" ? { platform, otherInfo: notes } : undefined,
        offlineInfo: appointmentType === "offline" ? { place: doctor?.address?.line1 || "Main Clinic", otherInfo: notes } : undefined,
      });

      if (res.data?.success) {
        success = true;
      }
    } catch {
      // Offline fallback handling
    }

    addAppointment({
      doctorId: docId,
      doctorName: doctor?.name || "Dr. Practitioner",
      doctorSpecialty: doctor?.speciality || "General Practice",
      doctorHospital: doctor?.address?.line1 || "NewCare Medical Center",
      doctorAvatar: doctor?.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      doctorDegree: doctor?.degree || "MBBS, MD",
      patientName: "Alexander Hayes",
      patientEmail: "alexander.hayes@example.com",
      patientPhone: "+1 (555) 382-9912",
      patientAge: 34,
      reason: notes || "Primary Clinical Consultation",
      symptoms: ["Routine Check-up"],
      consultationType: appointmentType === "online" ? "HD Video Consultation" : "In-Clinic Visit",
      slotDate: days[selectedDay].display,
      slotTime: selectedTime,
      amount: doctor?.fees || 50,
    });

    setBooking(false);
    toast.success("Appointment successfully scheduled");
    router.push("/dashboard/patient");
  };

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="card p-8 text-center max-w-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Doctor record not found</p>
          <button onClick={() => router.push("/doctors")} className="btn-primary text-xs px-4 py-2">
            Back to Specialist Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-6 sm:py-8">
      <div className="container max-w-4xl">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <button
            onClick={() => router.push("/doctors")}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>All Doctors</span>
          </button>
          <span>/</span>
          <span>{doctor.speciality}</span>
          <span>/</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{doctor.name}</span>
        </nav>

        {/* Doctor Summary Header Card */}
        <div className="card p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
              <Image
                src={doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"}
                alt={doctor.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {doctor.name}
                </h1>
                <span className="badge-clinical badge-neutral text-xs text-neutral-700 dark:text-neutral-300">
                  {doctor.speciality}
                </span>
                <span className="badge-clinical badge-verified text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Verified Faculty
                </span>
              </div>

              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                {doctor.degree || "MBBS, MD"} • {doctor.experience || 5} yrs clinical practice
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {(doctor.rating || 4.9).toFixed(1)}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">
                    ({doctor.reviewCount || 128})
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{doctor.address?.line1 || "NewCare Medical Center"}</span>
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  ${doctor.fees || 50} / consultation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Slot & Modality Booking Card */}
        <div className="card p-5 sm:p-6 mb-8 space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Select Appointment Slot
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Choose your consultation format and open time window.
            </p>
          </div>

          {/* Consultation Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Consultation Modality
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAppointmentType("offline")}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  appointmentType === "offline"
                    ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-900 dark:ring-neutral-100"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400"
                }`}
              >
                <MapPin className="w-4 h-4 text-neutral-700 dark:text-neutral-300 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    In-Clinic Appointment
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Physical consultation at {doctor.address?.line1 || "NewCare Medical Center"}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAppointmentType("online")}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  appointmentType === "online"
                    ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-900 dark:ring-neutral-100"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400"
                }`}
              >
                <Video className="w-4 h-4 text-neutral-700 dark:text-neutral-300 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Telehealth Video Visit
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Encrypted virtual consultation link
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Timeline Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Select Date
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {days.map((day, i) => {
                const isSelected = selectedDay === i;
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => {
                      setSelectedDay(i);
                      setSelectedTime(null);
                    }}
                    className={`py-2 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-950"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-[11px] font-medium opacity-80 uppercase tracking-tight">
                      {day.dayName}
                    </span>
                    <span className="text-base sm:text-lg font-semibold tabular-nums leading-snug">
                      {day.dayNumber}
                    </span>
                    <span className="text-[10px] font-medium opacity-80">
                      {day.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Toggles */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Available 30-Minute Windows ({days[selectedDay]?.display})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {TIME_SLOTS.map((slot) => {
                const booked = bookedSlots.includes(slot);
                const selected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => !booked && setSelectedTime(slot)}
                    disabled={booked}
                    className={`h-9 px-2.5 rounded-lg border text-xs font-semibold tabular-nums transition-all flex items-center justify-center gap-1 ${
                      booked
                        ? "bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 line-through cursor-not-allowed"
                        : selected
                        ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-950 shadow-xs"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clinical Intake Notes */}
          <div>
            <label htmlFor="intake-notes" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Clinical Intake Notes / Reason for Consultation (Optional)
            </label>
            <textarea
              id="intake-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Primary symptoms or questions for the physician..."
              className="input resize-y"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <span>Appointment Fee: </span>
              <strong className="text-neutral-900 dark:text-neutral-100 tabular-nums">${doctor.fees || 50}</strong>
              <span> • Synchronized with patient queue</span>
            </div>

            <button
              type="button"
              onClick={handleBook}
              disabled={booking || !selectedTime}
              className="btn-primary text-xs sm:text-sm px-6 py-2.5 font-semibold disabled:opacity-50"
            >
              {booking ? "Locking Slot..." : `Confirm Booking with ${doctor.name}`}
            </button>
          </div>
        </div>

        {/* Related Specialists */}
        {related.length > 0 && (
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
              Other {doctor.speciality} Clinicians
            </h3>
            <div className="flex flex-col gap-3">
              {related.map((relDoc) => (
                <DoctorCard key={relDoc._id || relDoc.id} doctor={relDoc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
