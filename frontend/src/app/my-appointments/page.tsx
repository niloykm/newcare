"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import api from "@/lib/api";
import { useStore, StoredAppointment } from "@/store/useStore";

interface AppointmentItem {
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
  appointmentType?: string;
  onlineInfo?: {
    platform?: string;
    meetingLink?: string;
  };
}

function formatSlotDate(key: string): string {
  if (!key) return "Upcoming";
  if (key.includes("Today") || key.includes("Tomorrow") || key.includes(",")) return key;
  const parts = key.split("_");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  }
  return key;
}

function mapStoredToAppointments(stored: StoredAppointment[]): AppointmentItem[] {
  return stored.map((s) => ({
    _id: s.id,
    docData: {
      name: s.doctorName,
      image: s.doctorAvatar,
      speciality: s.doctorSpecialty,
      fees: s.amount,
      address: { line1: s.doctorHospital, line2: s.roomNumber || "New York, NY" },
    },
    slotDate: s.slotDate,
    slotTime: s.slotTime,
    amount: s.amount,
    cancelled: s.status === "Cancelled",
    isCompleted: s.status === "Completed",
    appointmentType:
      s.consultationType === "HD Video Consultation" ? "online" : "offline",
    onlineInfo:
      s.consultationType === "HD Video Consultation"
        ? { platform: "Video", meetingLink: s.meetingLink }
        : undefined,
  }));
}

export default function MyAppointmentsPage() {
  const { appointments: storedAppointments, cancelAppointment: cancelStored } = useStore();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get<{
        success?: boolean;
        appointments?: AppointmentItem[];
      }>("/api/user/appointments");
      if (
        res.data?.success &&
        Array.isArray(res.data.appointments) &&
        res.data.appointments.length > 0
      ) {
        setAppointments([...res.data.appointments].reverse());
      } else {
        setAppointments(mapStoredToAppointments(storedAppointments));
      }
    } catch {
      setAppointments(mapStoredToAppointments(storedAppointments));
    } finally {
      setLoading(false);
    }
  }, [storedAppointments]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirmCancel = async (id: string) => {
    cancelStored(id);
    setConfirmCancelId(null);
    try {
      await api.post("/api/user/cancel-appointment", { appointmentId: id });
    } catch {
      // Store already updated locally
    }
    toast.success("Appointment cancelled.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 pb-20">
      <section className="bg-white dark:bg-[#11161d] border-b border-slate-200 dark:border-slate-800 py-10">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
            Patient Schedule
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            My Appointments
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review upcoming and completed physician visits across in-clinic and telehealth care.
          </p>
        </div>
      </section>

      <section className="container pt-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="card p-10 text-center max-w-md mx-auto my-8">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
              No appointments scheduled
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Browse our specialist directory to schedule an in-clinic or telehealth visit.
            </p>
            <Link href="/doctors" className="btn-primary">
              Browse Specialists
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {appointments.map((appt) => {
              const isCancelled = appt.cancelled;
              const isCompleted = appt.isCompleted;
              const isConfirming = confirmCancelId === appt._id;

              return (
                <article
                  key={appt._id}
                  className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                      <Image
                        src={appt.docData?.image || "/assets/doc6.png"}
                        alt={appt.docData?.name || "Physician"}
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {appt.docData?.name || "Attending Physician"}
                        </h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {appt.docData?.speciality}
                        </span>
                        <span
                          className={`badge-clinical ${
                            isCancelled
                              ? "badge-danger"
                              : isCompleted
                                ? "badge-verified"
                                : "badge-info"
                          }`}
                        >
                          {isCancelled
                            ? "Cancelled"
                            : isCompleted
                              ? "Completed"
                              : "Confirmed"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                            {formatSlotDate(appt.slotDate)}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                            {appt.slotTime}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="truncate max-w-[220px]">
                            {appt.docData?.address?.line1 || "NewCare Clinic"}
                          </span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          ${appt.docData?.fees || appt.amount}
                        </span>
                      </div>

                      {appt.appointmentType === "online" &&
                        appt.onlineInfo?.meetingLink &&
                        !isCancelled && (
                          <div className="mt-2 text-xs">
                            <span className="inline-flex items-center gap-1.5 font-medium text-teal-700 dark:text-teal-400">
                              <Video className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Telehealth Visit Ready in Patient Portal</span>
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                    <Link href="/dashboard/patient" className="btn-secondary text-xs px-3">
                      View Pass
                    </Link>

                    {!isCancelled && !isCompleted && (
                      isConfirming ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleConfirmCancel(appt._id)}
                            className="min-h-[40px] px-3 rounded-md bg-red-700 hover:bg-red-800 text-white text-xs font-semibold cursor-pointer"
                          >
                            Confirm Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCancelId(null)}
                            className="btn-secondary text-xs px-2.5"
                          >
                            Keep
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(appt._id)}
                          className="btn-secondary text-xs px-3 text-red-700 dark:text-red-400"
                        >
                          Cancel
                        </button>
                      )
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
