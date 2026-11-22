"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  QrCode,
  Download,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore, StoredAppointment } from "@/store/useStore";

export default function PatientDashboardView() {
  const { appointments, cancelAppointment } = useStore();
  const [selectedPass, setSelectedPass] = useState<StoredAppointment | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [patientUser, setPatientUser] = useState<{
    name?: string;
    email?: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("userData");
      if (stored) {
        try {
          setPatientUser(JSON.parse(stored));
        } catch {
          setPatientUser(null);
        }
      } else {
        setPatientUser(null);
      }
    };
    checkUser();
    window.addEventListener("authChange", checkUser);
    return () => window.removeEventListener("authChange", checkUser);
  }, []);

  const upcomingAppointments = appointments.filter((a) => a.status === "Confirmed");
  const pastAppointments = appointments.filter((a) => a.status !== "Confirmed");
  const completedCount = pastAppointments.filter((a) => a.status === "Completed").length;
  const totalSpent = appointments
    .filter((a) => a.status !== "Cancelled")
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const handleDownloadSlip = (appt: StoredAppointment) => {
    const slipText = [
      "NEWCARE APPOINTMENT CONFIRMATION",
      "================================",
      `Booking ID: ${appt.bookingId}`,
      `Status: ${appt.status.toUpperCase()}`,
      `Date & Time: ${appt.slotDate} at ${appt.slotTime}`,
      `Format: ${appt.consultationType}`,
      `Physician: ${appt.doctorName} (${appt.doctorSpecialty})`,
      `Clinic: ${appt.doctorHospital}`,
      `Patient: ${appt.patientName} (Age ${appt.patientAge})`,
      `Fee: $${appt.amount} USD`,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {patientUser?.image ? (
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
              <Image
                src={patientUser.image}
                alt={patientUser.name || "Patient"}
                fill
                sizes="56px"
                className="object-cover object-top"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-lg bg-teal-700 dark:bg-teal-400 text-white dark:text-slate-950 flex items-center justify-center text-lg font-semibold shrink-0">
              {patientUser?.name?.trim().charAt(0).toUpperCase() || "H"}
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Patient Portal · <span className="font-mono">ID #NC-PT-9021</span>
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-0.5">
              {patientUser?.name || "Hannah Morales"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Scheduled visits, check-in passes, and clinical visit summaries
            </p>
          </div>
        </div>

        <Link href="/doctors" className="btn-primary text-sm self-stretch sm:self-auto">
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Book Specialist Visit</span>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="card card-interactive p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Upcoming Visits</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {upcomingAppointments.length}
          </p>
        </div>
        <div className="card card-interactive p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Completed Visits</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {completedCount}
          </p>
        </div>
        <div className="card card-interactive p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Consultation Spend</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            ${totalSpent}
          </p>
        </div>
        <div className="card card-interactive p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Records</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {appointments.length}
          </p>
        </div>
      </div>

      {/* Upcoming Visits */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
          Upcoming Consultations ({upcomingAppointments.length})
        </h3>

        {upcomingAppointments.length === 0 ? (
          <div className="card p-8 text-center">
            <Calendar className="w-7 h-7 text-slate-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              No upcoming consultations
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-5">
              Select a board-certified specialist to schedule an in-clinic or video visit.
            </p>
            <Link href="/doctors" className="btn-primary text-xs">
              Browse Specialists
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appt) => {
              const isConfirming = confirmCancelId === appt.id;
              return (
                <div
                  key={appt.id}
                  className="card card-interactive p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                      <Image
                        src={appt.doctorAvatar}
                        alt={appt.doctorName}
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                        {appt.doctorSpecialty} ·{" "}
                        <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">
                          {appt.bookingId}
                        </span>
                      </p>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {appt.doctorName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {appt.doctorHospital}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>{appt.slotDate}</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" aria-hidden="true" />
                      <span className="tabular-nums">{appt.slotTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {appt.consultationType === "HD Video Consultation" ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                          <span>Telehealth Video</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          <span>In-Clinic ({appt.roomNumber || "Suite 402"})</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedPass(appt)}
                      className="btn-primary text-xs px-3"
                    >
                      <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Digital Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSlip(appt)}
                      className="btn-secondary text-xs px-3"
                      aria-label={`Download confirmation slip for ${appt.bookingId}`}
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    {isConfirming ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            cancelAppointment(appt.id);
                            setConfirmCancelId(null);
                            toast.success("Appointment cancelled.");
                          }}
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
                        onClick={() => setConfirmCancelId(appt.id)}
                        className="btn-secondary text-xs px-3 text-red-700 dark:text-red-400"
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
      </div>

      {/* History */}
      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Consultation History ({pastAppointments.length})
          </h3>
          <div className="space-y-2.5">
            {pastAppointments.map((appt) => {
              const isCancelled = appt.status === "Cancelled";
              return (
                <div
                  key={appt.id}
                  className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                      <Image
                        src={appt.doctorAvatar}
                        alt={appt.doctorName}
                        fill
                        sizes="44px"
                        className="object-cover object-top"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {appt.doctorName} · {appt.doctorSpecialty}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        {appt.slotDate} · {appt.slotTime}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                          Note: {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span
                      className={`badge-clinical ${
                        isCancelled ? "badge-danger" : "badge-verified"
                      }`}
                    >
                      {appt.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadSlip(appt)}
                      aria-label={`Download receipt for ${appt.bookingId}`}
                      className="w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accessible Radix Dialog: Digital Pass */}
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
                      aria-label="Close pass dialog"
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
                        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedPass.bookingId}`
                      }
                      alt={`Check-in QR code for ${selectedPass.bookingId}`}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-3">
                    Scan at clinic reception on arrival
                  </p>
                </div>

                <dl className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-5">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Physician</dt>
                    <dd className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                      {selectedPass.doctorName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Schedule</dt>
                    <dd className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums text-right">
                      {selectedPass.slotDate}, {selectedPass.slotTime}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Patient</dt>
                    <dd className="text-slate-900 dark:text-slate-100 text-right">
                      {selectedPass.patientName}
                    </dd>
                  </div>
                </dl>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadSlip(selectedPass)}
                    className="btn-secondary text-xs"
                  >
                    Download Slip
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
