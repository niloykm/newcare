"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, Video, QrCode, Download,
  CheckCircle2, XCircle, ArrowRight, ShieldCheck, FileText,
  AlertCircle, DollarSign, Plus, Eye, User
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore, StoredAppointment } from "@/store/useStore";

export default function PatientDashboardView() {
  const { appointments, cancelAppointment } = useStore();
  const [selectedPass, setSelectedPass] = useState<StoredAppointment | null>(null);
  const [patientUser, setPatientUser] = useState<{ name?: string; email?: string; image?: string } | null>(null);

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
  const totalSpent = appointments
    .filter((a) => a.status !== "Cancelled")
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const handleDownloadSlip = (appt: StoredAppointment) => {
    const slipText = `
=============================================
NEWCARE CLINICAL APPOINTMENT CONFIRMATION SLIP
=============================================
Booking ID:        ${appt.bookingId}
Status:            ${appt.status.toUpperCase()}
Date & Time:       ${appt.slotDate} at ${appt.slotTime}
Consultation Type: ${appt.consultationType}

DOCTOR:
Name:              ${appt.doctorName}
Specialty:         ${appt.doctorSpecialty}
Hospital:          ${appt.doctorHospital}

PATIENT:
Name:              ${appt.patientName} (Age: ${appt.patientAge})
Contact:           ${appt.patientEmail} | ${appt.patientPhone}
Reason:            ${appt.reason}
Symptoms:          ${appt.symptoms.join(", ")}
Amount:            $${appt.amount} USD

Access / Location: ${appt.roomNumber || appt.meetingLink || "Health Plaza NY"}
=============================================
`;
    const element = document.createElement("a");
    const file = new Blob([slipText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `NewCare_Slip_${appt.bookingId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Appointment record downloaded");
  };

  return (
    <div className="flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
      {/* Patient Header Card */}
      <div className="card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {patientUser?.image ? (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
              <Image
                src={patientUser.image}
                alt={patientUser.name || "Patient photo"}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center text-xl font-semibold shrink-0">
              {patientUser?.name?.trim().charAt(0).toUpperCase() || "A"}
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-1">
              <span>Patient Portal</span>
              <span className="text-neutral-400">•</span>
              <span className="font-mono text-[11px]">ID #NC-PT-9021</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {patientUser?.name || "Alexander Hayes"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Clinical appointments, verified check-in tokens, and health ledger
            </p>
          </div>
        </div>

        <Link
          href="/doctors"
          className="btn-primary text-xs sm:text-sm px-4 py-2 font-semibold self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Book Appointment</span>
        </Link>
      </div>

      {/* Patient Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Upcoming Visits</span>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            {upcomingAppointments.length}
          </p>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Active in Queue
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Completed Visits</span>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            {pastAppointments.filter((a) => a.status === "Completed").length}
          </p>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Records Synchronized
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Consultation Spend</span>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            ${totalSpent}
          </p>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Transparent Pricing
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Coverage Status</span>
          <p className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-1 truncate">
            Verified Patient
          </p>
          <span className="text-[11px] font-medium text-sky-600 dark:text-sky-400">
            Direct Scheduling Active
          </span>
        </div>
      </div>

      {/* Upcoming Scheduled Visits */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Upcoming Scheduled Consultations ({upcomingAppointments.length})
          </h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Synchronized with physician queue
          </span>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="card p-8 text-center max-w-md mx-auto my-4">
            <Calendar className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              No Active Appointments
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Select an accredited physician from the directory to lock in a consultation window.
            </p>
            <Link href="/doctors" className="btn-primary text-xs px-4 py-2 font-semibold">
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Doctor Info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
                    <Image
                      src={appt.doctorAvatar}
                      alt={appt.doctorName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="badge-clinical badge-neutral text-xs">
                        {appt.doctorSpecialty}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        Token: {appt.bookingId}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {appt.doctorName}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {appt.doctorHospital}
                    </p>
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="flex flex-col gap-1 text-xs text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{appt.slotDate}</span>
                    <Clock className="w-3.5 h-3.5 text-neutral-400 ml-1" />
                    <span className="tabular-nums">{appt.slotTime}</span>
                  </div>
                  <div>
                    {appt.consultationType === "HD Video Consultation" ? (
                      <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                        <Video className="w-3.5 h-3.5" />
                        <span>Telehealth Video</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>In-Clinic ({appt.roomNumber || "Suite 402"})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800 justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPass(appt)}
                    className="btn-primary text-xs px-3 py-1.5 font-semibold"
                  >
                    <QrCode className="w-3.5 h-3.5 mr-1" />
                    <span>Pass Token</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadSlip(appt)}
                    className="btn-secondary text-xs px-3 py-1.5"
                    title="Download receipt slip"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to cancel this appointment?")) {
                        cancelAppointment(appt.id);
                        toast.success("Appointment cancelled");
                      }
                    }}
                    className="btn-secondary text-xs px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:border-rose-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Consultation History */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
            Consultation History ({pastAppointments.length})
          </h2>
          <div className="flex flex-col gap-2.5">
            {pastAppointments.map((appt) => {
              const isCancelled = appt.status === "Cancelled";
              return (
                <div
                  key={appt.id}
                  className="card p-3.5 sm:p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
                      <Image src={appt.doctorAvatar} alt={appt.doctorName} fill className="object-cover" unoptimized />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {appt.doctorName} ({appt.doctorSpecialty})
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {appt.slotDate} • {appt.slotTime}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                          Clinical Note: &ldquo;{appt.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`badge-clinical text-xs ${
                        isCancelled
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                          : "badge-verified"
                      }`}
                    >
                      {appt.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadSlip(appt)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                      title="Download receipt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Digital Pass Modal */}
      {selectedPass && (
        <div
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPass(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl p-5 sm:p-6 max-w-sm w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  DIGITAL PASS TOKEN
                </span>
                <h3 className="text-sm font-semibold text-white tracking-wide font-mono mt-0.5">
                  {selectedPass.bookingId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-3 rounded-lg text-neutral-950 text-center mb-4">
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src={selectedPass.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedPass.bookingId}`}
                  alt="QR Pass"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-xs font-semibold mt-2">Touchless Kiosk Check-In</p>
              <p className="text-[11px] text-neutral-500">Scan upon clinic reception arrival</p>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-300 mb-5">
              <p><strong className="text-neutral-400">Doctor:</strong> {selectedPass.doctorName} ({selectedPass.doctorSpecialty})</p>
              <p><strong className="text-neutral-400">Schedule:</strong> {selectedPass.slotDate} at {selectedPass.slotTime}</p>
              <p><strong className="text-neutral-400">Format:</strong> {selectedPass.consultationType}</p>
              <p><strong className="text-neutral-400">Patient:</strong> {selectedPass.patientName} (Age: {selectedPass.patientAge})</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDownloadSlip(selectedPass)}
                className="btn-secondary text-xs py-2 justify-center bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
              >
                Download Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                className="btn-primary text-xs py-2 justify-center"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
