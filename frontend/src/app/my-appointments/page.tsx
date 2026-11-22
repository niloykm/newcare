"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Calendar, Clock, Download, MapPin, QrCode, Video, X } from "lucide-react";
import api from "@/lib/api";
import { useStore, StoredAppointment } from "@/store/useStore";

interface AppointmentItem {
  _id: string;
  bookingId: string;
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
  qrCodeUrl?: string;
}

type StatusFilter = "All" | "Confirmed" | "Completed" | "Cancelled";

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
    bookingId: s.bookingId,
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
    qrCodeUrl: s.qrCodeUrl,
  }));
}

export default function MyAppointmentsPage() {
  const { appointments: storedAppointments, cancelAppointment: cancelStored } = useStore();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [selectedPass, setSelectedPass] = useState<AppointmentItem | null>(null);

  const fetchAppointments = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setAppointments(mapStoredToAppointments(storedAppointments));
      setLoading(false);
      return;
    }

    try {
      const res = await api.get<{
        success?: boolean;
        appointments?: Array<Omit<AppointmentItem, "bookingId"> & { bookingId?: string }>;
      }>("/api/user/appointments");
      if (
        res.data?.success &&
        Array.isArray(res.data.appointments) &&
        res.data.appointments.length > 0
      ) {
        const mapped: AppointmentItem[] = [...res.data.appointments].reverse().map((a) => ({
          ...a,
          bookingId: a.bookingId || `NC-${a._id.slice(-4).toUpperCase()}-NY`,
        }));
        setAppointments(mapped);
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      if (statusFilter === "All") return true;
      if (statusFilter === "Cancelled") return appt.cancelled;
      if (statusFilter === "Completed") return appt.isCompleted && !appt.cancelled;
      return !appt.cancelled && !appt.isCompleted;
    });
  }, [appointments, statusFilter]);

  const handleConfirmCancel = async (id: string) => {
    cancelStored(id);
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, cancelled: true } : a))
    );
    setConfirmCancelId(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        await api.post("/api/user/cancel-appointment", { appointmentId: id });
      } catch {
        // Local state already updated
      }
    }
    toast.success("Appointment cancelled.");
  };

  const handleDownloadSlip = (appt: AppointmentItem) => {
    const slipText = [
      "NEWCARE APPOINTMENT CONFIRMATION",
      "================================",
      `Booking ID: ${appt.bookingId}`,
      `Status: ${appt.cancelled ? "CANCELLED" : appt.isCompleted ? "COMPLETED" : "CONFIRMED"}`,
      `Date & Time: ${formatSlotDate(appt.slotDate)} at ${appt.slotTime}`,
      `Format: ${appt.appointmentType === "online" ? "HD Video Consultation" : "In-Clinic Visit"}`,
      `Physician: ${appt.docData?.name || "Attending Physician"} (${appt.docData?.speciality || "Specialist"})`,
      `Clinic: ${appt.docData?.address?.line1 || "NewCare Clinic"}`,
      `Fee: $${appt.docData?.fees || appt.amount} USD`,
    ].join("\n");

    const file = new Blob([slipText], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NewCare_${appt.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Confirmation slip downloaded.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 pb-20">
      <section className="bg-white dark:bg-[#11161d] border-b border-slate-200 dark:border-slate-800 py-10">
        <div className="container flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
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

          <div
            role="tablist"
            aria-label="Filter appointments by status"
            className="inline-flex flex-wrap rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1 self-start sm:self-auto"
          >
            {(["All", "Confirmed", "Completed", "Cancelled"] as const).map((tab) => {
              const active = statusFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab)}
                  className={`relative min-h-[36px] px-3 text-xs font-semibold rounded transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                    active
                      ? "text-slate-900 dark:text-slate-50"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="appointments-filter-pill"
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 rounded bg-white dark:bg-slate-800 shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container pt-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="card p-10 text-center max-w-md mx-auto my-8">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
              {statusFilter === "All"
                ? "No appointments scheduled"
                : `No ${statusFilter.toLowerCase()} appointments`}
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
            {filteredAppointments.map((appt) => {
              const isCancelled = appt.cancelled;
              const isCompleted = appt.isCompleted;
              const isConfirming = confirmCancelId === appt._id;

              return (
                <article
                  key={appt._id}
                  className="card card-interactive p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
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
                              <span>Telehealth Visit Ready</span>
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => setSelectedPass(appt)}
                        className="btn-secondary text-xs px-3"
                      >
                        <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View Pass</span>
                      </button>
                    )}

                    {isCancelled && (
                      <Link href="/doctors" className="btn-secondary text-xs px-3">
                        Rebook Visit
                      </Link>
                    )}

                    {!isCancelled && !isCompleted && (
                      isConfirming ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleConfirmCancel(appt._id)}
                            className="min-h-[44px] px-3 rounded-md bg-red-700 hover:bg-red-800 text-white text-xs font-semibold cursor-pointer"
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

      {/* Accessible Radix Dialog: Appointment Check-In Pass */}
      <Dialog.Root
        open={Boolean(selectedPass)}
        onOpenChange={(open) => {
          if (!open) setSelectedPass(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px]" />
          <Dialog.Content className="dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-[#11161d] border border-slate-200 dark:border-slate-800 shadow-lg p-6 focus:outline-none">
            {selectedPass && (
              <>
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <Dialog.Title className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      Check-In Pass
                    </Dialog.Title>
                    <Dialog.Description className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedPass.bookingId}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close check-in pass"
                      className="w-10 h-10 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="my-5 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="relative w-32 h-32 mx-auto bg-white p-2 rounded-md">
                    <Image
                      src={
                        selectedPass.qrCodeUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          selectedPass.bookingId
                        )}`
                      }
                      alt={`Check-in QR code for ${selectedPass.bookingId}`}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-3">
                    Present this code at clinic check-in
                  </p>
                </div>

                <dl className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-5">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Physician</dt>
                    <dd className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                      {selectedPass.docData?.name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Schedule</dt>
                    <dd className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums text-right">
                      {formatSlotDate(selectedPass.slotDate)}, {selectedPass.slotTime}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Location</dt>
                    <dd className="text-slate-900 dark:text-slate-100 text-right">
                      {selectedPass.docData?.address?.line1 || "NewCare Clinic"}
                    </dd>
                  </div>
                </dl>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadSlip(selectedPass)}
                    className="btn-secondary text-xs"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Download Slip</span>
                  </button>
                  <Dialog.Close asChild>
                    <button type="button" className="btn-primary text-xs">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
