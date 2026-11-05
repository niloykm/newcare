"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Calendar, Clock, X, CheckCircle2, AlertCircle, DollarSign, MapPin, Video, Stethoscope, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { useStore, StoredAppointment } from "@/store/useStore";

interface Appointment {
  _id: string;
  docData: {
    name: string;
    image: string;
    speciality: string;
    fees: number;
    address: { line1: string; line2: string };
  };
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
  isCompleted: boolean;
  payment: boolean;
  date: number;
  appointmentType?: string;
  onlineInfo?: {
    time?: string;
    platform?: string;
    meetingLink?: string;
    otherInfo?: string;
  };
  offlineInfo?: {
    serialNumber?: string;
    place?: string;
    expectedTime?: string;
    location?: string;
    otherInfo?: string;
  };
}

function formatSlotDate(key: string) {
  if (!key) return "Upcoming";
  if (key.includes("Today") || key.includes("Tomorrow") || key.includes(",")) return key;
  const parts = key.split("_");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }
  }
  return key;
}

function AppointmentSkeleton() {
  return (
    <div className="card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3.5">
        <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          <div className="h-3 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { appointments: storedAppointments, cancelAppointment: cancelStored } = useStore();

  const mapStoredToAppointments = (stored: StoredAppointment[]): Appointment[] => {
    return stored.map((s) => ({
      _id: s.id,
      docData: {
        name: s.doctorName,
        image: s.doctorAvatar,
        speciality: s.doctorSpecialty,
        fees: s.amount,
        address: { line1: s.doctorHospital, line2: s.roomNumber || "Health Plaza NY" },
      },
      slotDate: s.slotDate,
      slotTime: s.slotTime,
      amount: s.amount,
      cancelled: s.status === "Cancelled",
      isCompleted: s.status === "Completed",
      payment: s.paymentStatus === "Paid",
      date: Date.now(),
      appointmentType: s.consultationType === "HD Video Consultation" ? "online" : "offline",
      onlineInfo: s.consultationType === "HD Video Consultation" ? {
        platform: "Zoom",
        meetingLink: s.meetingLink || "https://meet.newcare.health",
        otherInfo: s.reason,
      } : undefined,
      offlineInfo: s.consultationType === "In-Clinic Visit" ? {
        serialNumber: s.roomNumber || "#01",
        place: s.doctorHospital,
        location: "Suite 402, New York, NY",
        otherInfo: s.reason,
      } : undefined,
    }));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/user/appointments");
      if (res.data?.success && Array.isArray(res.data.appointments) && res.data.appointments.length > 0) {
        setAppointments(res.data.appointments.reverse());
      } else {
        setAppointments(mapStoredToAppointments(storedAppointments));
      }
    } catch {
      setAppointments(mapStoredToAppointments(storedAppointments));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    cancelStored(id);
    try {
      await api.post("/api/user/cancel-appointment", { appointmentId: id });
    } catch {
      // Offline fallback handling
    }
    toast.success("Appointment cancelled");
    fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-16">
      {/* Header Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-6 sm:py-8">
        <div className="container">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-2">
            <span>Patient Appointment Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Active and archived healthcare consultations with synchronized clinical status.
          </p>
        </div>
      </div>

      <main className="container pt-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            <AppointmentSkeleton />
            <AppointmentSkeleton />
            <AppointmentSkeleton />
          </div>
        ) : appointments.length === 0 ? (
          <div className="card p-8 sm:p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1.5">
              No Appointments Found
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              You do not have any scheduled appointments. Select a specialist from the directory to book a consultation.
            </p>
            <Link href="/doctors" className="btn-primary text-xs px-4 py-2">
              Browse Doctors Directory
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((appt) => {
              const isCancelled = appt.cancelled;
              const isCompleted = appt.isCompleted;

              return (
                <div
                  key={appt._id}
                  className="card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Doctor Info & Schedule */}
                  <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
                      <Image
                        src={appt.docData?.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600"}
                        alt={appt.docData?.name || "Clinician"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {appt.docData?.name || "Dr. Practitioner"}
                        </h3>
                        <span className="badge-clinical badge-neutral text-xs text-neutral-700 dark:text-neutral-300">
                          {appt.docData?.speciality}
                        </span>
                        {isCancelled ? (
                          <span className="badge-clinical bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs">
                            Cancelled
                          </span>
                        ) : isCompleted ? (
                          <span className="badge-clinical badge-verified text-xs">
                            Completed
                          </span>
                        ) : (
                          <span className="badge-clinical bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs">
                            Confirmed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="tabular-nums font-medium text-neutral-800 dark:text-neutral-200">
                            {formatSlotDate(appt.slotDate)}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="tabular-nums font-medium text-neutral-800 dark:text-neutral-200">
                            {appt.slotTime}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[200px]">
                            {appt.docData?.address?.line1 || "NewCare Medical Center"}
                          </span>
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          ${appt.docData?.fees || appt.amount}
                        </span>
                      </div>

                      {/* Online/Offline Channel */}
                      {appt.appointmentType === "online" && appt.onlineInfo?.meetingLink && !isCancelled && (
                        <div className="mt-2 text-xs">
                          <a
                            href={appt.onlineInfo.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Launch Telehealth Room ({appt.onlineInfo.platform || "Video"})</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800 w-full md:w-auto justify-end">
                    <Link
                      href="/dashboard/patient"
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      <span>Digital Pass</span>
                    </Link>

                    {!isCancelled && !isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleCancel(appt._id)}
                        className="btn-secondary text-xs px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:border-rose-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
