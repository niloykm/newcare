"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar, Clock, CheckCircle2, XCircle, FileText,
  User, Video, MapPin, RefreshCw, AlertCircle, ChevronRight,
  TrendingUp, Award, Activity, Phone, Mail
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore, StoredAppointment } from "@/store/useStore";
import { FALLBACK_DOCTORS } from "@/data/doctorsData";

export default function DoctorDashboardView() {
  const {
    doctors,
    appointments,
    updateAppointmentStatus,
    addConsultationNote,
    toggleDoctorAvailability,
    rescheduleAppointment,
    cancelAppointment,
  } = useStore();

  const [activeDoctorId, setActiveDoctorId] = useState<string>("doc-1");
  const [activeNoteAppt, setActiveNoteAppt] = useState<StoredAppointment | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [rescheduleAppt, setRescheduleAppt] = useState<StoredAppointment | null>(null);
  const [newSlotTime, setNewSlotTime] = useState("05:00 PM");

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const queueAppointments = appointments.filter((a) => {
    return a.doctorId === currentDoctor.id || a.doctorName === currentDoctor.name;
  });

  const todayConfirmed = queueAppointments.filter((a) => a.status === "Confirmed");
  const todayCompleted = queueAppointments.filter((a) => a.status === "Completed");

  const handleSaveNotes = () => {
    if (!activeNoteAppt) return;
    addConsultationNote(activeNoteAppt.id, clinicalNotes);
    updateAppointmentStatus(activeNoteAppt.id, "Completed");
    toast.success("Consultation notes logged and appointment completed");
    setActiveNoteAppt(null);
    setClinicalNotes("");
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleAppt) return;
    rescheduleAppointment(rescheduleAppt.id, rescheduleAppt.slotDate, newSlotTime);
    toast.success(`Slot rescheduled to ${newSlotTime}`);
    setRescheduleAppt(null);
  };

  return (
    <div className="flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
      {/* Doctor Desk Header */}
      <div className="card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
            <Image
              src={currentDoctor.avatarUrl || currentDoctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"}
              alt={currentDoctor.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-1">
              <span>Physician Clinical Desk</span>
              <span className="text-neutral-400">•</span>
              <span className="font-mono text-[11px]">{currentDoctor.license}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {currentDoctor.name}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {currentDoctor.degree} • {currentDoctor.hospitalName}
            </p>
          </div>
        </div>

        {/* Doctor Switcher & Availability Controls */}
        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto">
          <select
            value={currentDoctor.id}
            onChange={(e) => setActiveDoctorId(e.target.value)}
            className="h-10 px-3 text-xs sm:text-sm font-semibold bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none cursor-pointer"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id} className="bg-white dark:bg-neutral-900">
                Dr. {d.name.replace("Dr. ", "")} ({d.specialty})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              toggleDoctorAvailability(currentDoctor.id);
              toast.success(
                currentDoctor.isAvailableToday
                  ? "Schedule status: Busy / In-Consult"
                  : "Schedule status: Open for Same-Day Consults"
              );
            }}
            className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs font-semibold rounded-lg border transition-colors ${
              currentDoctor.isAvailableToday
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentDoctor.isAvailableToday ? "bg-emerald-600 dark:bg-emerald-400" : "bg-neutral-400"
              }`}
            />
            <span>{currentDoctor.isAvailableToday ? "Queue Active" : "Offline"}</span>
          </button>
        </div>
      </div>

      {/* Doctor Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Queue Waiting</span>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            {todayConfirmed.length}
          </p>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Next: {todayConfirmed[0]?.slotTime || "Open"}
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Completed Today</span>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            {todayCompleted.length}
          </p>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Notes Logged
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Monthly Consultations</span>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            142
          </p>
          <span className="text-[11px] font-medium text-sky-600 dark:text-sky-400 tabular-nums">
            +12% vs prior month
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Patient Rating</span>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            ★ {currentDoctor.rating?.toFixed(1) || "4.9"}
          </p>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 tabular-nums">
            {currentDoctor.reviewsCount || 168} verified evaluations
          </span>
        </div>
      </div>

      {/* Patient Queue Ledger */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Live Patient Consultation Queue
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Review intake concerns, accept check-ins, record clinical observation notes, or adjust schedule slots.
            </p>
          </div>
          <span className="badge-clinical badge-neutral text-xs font-mono self-start sm:self-auto">
            Queue Sync: Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Slot & Modality</th>
                <th className="py-2.5 px-3">Intake Reason</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {queueAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                    No active patients in queue for Dr. {currentDoctor.name}.
                  </td>
                </tr>
              ) : (
                queueAppointments.map((appt) => {
                  const isConfirmed = appt.status === "Confirmed";
                  const isCompleted = appt.status === "Completed";
                  const isCancelled = appt.status === "Cancelled";

                  return (
                    <tr key={appt.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {appt.patientName}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 tabular-nums">
                          Age: {appt.patientAge} • {appt.patientPhone}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          {appt.slotTime}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {appt.consultationType === "HD Video Consultation" ? "Telehealth Video" : "In-Clinic"}
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <div className="truncate text-neutral-800 dark:text-neutral-200" title={appt.reason}>
                          {appt.reason}
                        </div>
                        {appt.symptoms && appt.symptoms.length > 0 && (
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                            Tags: {appt.symptoms.join(", ")}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`badge-clinical text-xs ${
                            isCompleted
                              ? "badge-verified"
                              : isCancelled
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                              : "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {isConfirmed && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveNoteAppt(appt);
                                  setClinicalNotes(appt.notes || "");
                                }}
                                className="btn-primary text-xs px-2.5 py-1"
                              >
                                <span>Record Notes</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRescheduleAppt(appt);
                                  setNewSlotTime(appt.slotTime);
                                }}
                                className="btn-secondary text-xs px-2 py-1"
                              >
                                Reschedule
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Cancel consultation slot for ${appt.patientName}?`)) {
                                    cancelAppointment(appt.id);
                                    toast.success("Appointment slot cancelled");
                                  }
                                }}
                                className="text-rose-600 dark:text-rose-400 hover:underline px-1.5 py-1 text-xs"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveNoteAppt(appt);
                                setClinicalNotes(appt.notes || "");
                              }}
                              className="text-sky-600 dark:text-sky-400 hover:underline px-2 py-1 text-xs font-semibold"
                            >
                              Edit Notes
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consultation Notes Modal */}
      {activeNoteAppt && (
        <div
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setActiveNoteAppt(null)}
        >
          <div
            className="card bg-white dark:bg-neutral-900 p-5 sm:p-6 max-w-lg w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Clinical Consultation Notes
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Patient: {activeNoteAppt.patientName} (Age: {activeNoteAppt.patientAge})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveNoteAppt(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="clinical-obs" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Clinical Observations &amp; Prescription Instructions:
              </label>
              <textarea
                id="clinical-obs"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Vitals, diagnostic notes, prescribed therapies, follow-up timeline..."
                rows={5}
                className="input resize-y"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveNoteAppt(null)}
                className="btn-secondary text-xs px-3.5 py-2 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="btn-primary text-xs px-4 py-2 font-semibold"
              >
                Save Observations & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Slot Modal */}
      {rescheduleAppt && (
        <div
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setRescheduleAppt(null)}
        >
          <div
            className="card bg-white dark:bg-neutral-900 p-5 sm:p-6 max-w-sm w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
              Reschedule Slot
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Patient: {rescheduleAppt.patientName} ({rescheduleAppt.slotDate})
            </p>

            <div className="mb-5">
              <label htmlFor="new-slot-select" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Select Alternate Time Slot:
              </label>
              <select
                id="new-slot-select"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="input cursor-pointer"
              >
                {["09:30 AM", "11:00 AM", "02:00 PM", "03:30 PM", "05:00 PM", "06:15 PM"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRescheduleAppt(null)}
                className="btn-secondary text-xs px-3 py-1.5 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="btn-primary text-xs px-3.5 py-1.5 font-semibold"
              >
                Lock New Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
