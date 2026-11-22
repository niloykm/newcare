"use client";

import { useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useStore, StoredAppointment } from "@/store/useStore";

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
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const queueAppointments = appointments.filter(
    (a) => a.doctorId === currentDoctor.id || a.doctorName === currentDoctor.name
  );

  const todayConfirmed = queueAppointments.filter((a) => a.status === "Confirmed");
  const todayCompleted = queueAppointments.filter((a) => a.status === "Completed");

  const handleSaveNotes = () => {
    if (!activeNoteAppt) return;
    addConsultationNote(activeNoteAppt.id, clinicalNotes.trim());
    updateAppointmentStatus(activeNoteAppt.id, "Completed");
    toast.success("Clinical notes saved and consultation completed.");
    setActiveNoteAppt(null);
    setClinicalNotes("");
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleAppt) return;
    rescheduleAppointment(rescheduleAppt.id, rescheduleAppt.slotDate, newSlotTime);
    toast.success(`Rescheduled to ${newSlotTime}.`);
    setRescheduleAppt(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
            <Image
              src={currentDoctor.avatarUrl || currentDoctor.image}
              alt={currentDoctor.name}
              fill
              sizes="56px"
              className="object-cover object-top"
              unoptimized
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {currentDoctor.license}
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-0.5">
              {currentDoctor.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {currentDoctor.degree} · {currentDoctor.hospitalName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto">
          <select
            aria-label="Select physician schedule"
            value={currentDoctor.id}
            onChange={(e) => setActiveDoctorId(e.target.value)}
            className="min-h-[40px] px-3 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 cursor-pointer"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              toggleDoctorAvailability(currentDoctor.id);
              toast.success(
                currentDoctor.isAvailableToday
                  ? "Availability set to Offline."
                  : "Availability set to Accepting Visits."
              );
            }}
            className={`min-h-[40px] inline-flex items-center gap-2 px-3.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
              currentDoctor.isAvailableToday
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentDoctor.isAvailableToday ? "bg-emerald-600 dark:bg-emerald-400" : "bg-slate-400"
              }`}
            />
            <span>{currentDoctor.isAvailableToday ? "Accepting Visits" : "Offline"}</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Waiting in Queue</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {todayConfirmed.length}
          </p>
        </div>
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Completed Visits</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {todayCompleted.length}
          </p>
        </div>
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Consultation Fee</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            ${currentDoctor.consultationFee}
          </p>
        </div>
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Patient Rating</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {currentDoctor.rating.toFixed(1)}
            <span className="text-xs font-normal text-slate-500 ml-1">
              ({currentDoctor.reviewsCount})
            </span>
          </p>
        </div>
      </div>

      {/* Consultation Queue */}
      <div className="card p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Patient Consultation Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Record visit notes, reschedule time windows, or update consultation status.
          </p>
        </div>

        {/* Mobile Card Queue (Zero Horizontal Clipping) */}
        <div className="md:hidden space-y-3">
          {queueAppointments.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">
              No appointments currently scheduled for {currentDoctor.name}.
            </p>
          ) : (
            queueAppointments.map((appt) => {
              const isConfirmed = appt.status === "Confirmed";
              const isCompleted = appt.status === "Completed";
              const isCancelled = appt.status === "Cancelled";
              const isConfirming = confirmCancelId === appt.id;

              return (
                <div
                  key={appt.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {appt.patientName}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                        Age {appt.patientAge} · {appt.patientPhone}
                      </p>
                    </div>
                    <span
                      className={`badge-clinical shrink-0 ${
                        isCompleted
                          ? "badge-verified"
                          : isCancelled
                            ? "badge-danger"
                            : "badge-info"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      {appt.slotDate}, {appt.slotTime} ·{" "}
                      {appt.consultationType === "HD Video Consultation"
                        ? "Telehealth Video"
                        : "In-Clinic"}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">{appt.reason}</p>
                  </div>

                  {(isConfirmed || isCompleted) && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      {isConfirmed && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNoteAppt(appt);
                              setClinicalNotes(appt.notes || "");
                            }}
                            className="min-h-[36px] px-3 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer"
                          >
                            Record Notes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRescheduleAppt(appt);
                              setNewSlotTime(appt.slotTime);
                            }}
                            className="min-h-[36px] px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11161d] text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                          >
                            Reschedule
                          </button>
                          {isConfirming ? (
                            <button
                              type="button"
                              onClick={() => {
                                cancelAppointment(appt.id);
                                setConfirmCancelId(null);
                                toast.success("Appointment cancelled.");
                              }}
                              className="min-h-[36px] px-3 rounded-md bg-red-700 text-white text-xs font-semibold cursor-pointer"
                            >
                              Confirm Cancel
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmCancelId(appt.id)}
                              className="min-h-[36px] px-2.5 text-red-700 dark:text-red-400 text-xs font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNoteAppt(appt);
                            setClinicalNotes(appt.notes || "");
                          }}
                          className="min-h-[36px] px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11161d] text-teal-700 dark:text-teal-400 text-xs font-semibold cursor-pointer"
                        >
                          Edit Notes
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table Queue */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Schedule</th>
                <th className="py-2.5 px-3">Visit Reason</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {queueAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No appointments currently scheduled for {currentDoctor.name}.
                  </td>
                </tr>
              ) : (
                queueAppointments.map((appt) => {
                  const isConfirmed = appt.status === "Confirmed";
                  const isCompleted = appt.status === "Completed";
                  const isCancelled = appt.status === "Cancelled";
                  const isConfirming = confirmCancelId === appt.id;

                  return (
                    <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {appt.patientName}
                        </p>
                        <p className="text-[11px] text-slate-500 tabular-nums">
                          Age {appt.patientAge} · {appt.patientPhone}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {appt.slotDate}, {appt.slotTime}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {appt.consultationType === "HD Video Consultation"
                            ? "Telehealth Video"
                            : "In-Clinic"}
                        </p>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-slate-700 dark:text-slate-300 truncate" title={appt.reason}>
                          {appt.reason}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`badge-clinical ${
                            isCompleted
                              ? "badge-verified"
                              : isCancelled
                                ? "badge-danger"
                                : "badge-info"
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
                                className="min-h-[36px] px-2.5 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer"
                              >
                                Record Notes
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRescheduleAppt(appt);
                                  setNewSlotTime(appt.slotTime);
                                }}
                                className="min-h-[36px] px-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                              >
                                Reschedule
                              </button>
                              {isConfirming ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    cancelAppointment(appt.id);
                                    setConfirmCancelId(null);
                                    toast.success("Appointment cancelled.");
                                  }}
                                  className="min-h-[36px] px-2.5 rounded-md bg-red-700 text-white text-xs font-semibold cursor-pointer"
                                >
                                  Confirm
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmCancelId(appt.id)}
                                  className="min-h-[36px] px-2.5 text-red-700 dark:text-red-400 hover:underline text-xs font-medium cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </>
                          )}
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveNoteAppt(appt);
                                setClinicalNotes(appt.notes || "");
                              }}
                              className="min-h-[36px] px-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
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

      {/* Radix Dialog: Clinical Notes */}
      <Dialog.Root
        open={Boolean(activeNoteAppt)}
        onOpenChange={(open) => {
          if (!open) setActiveNoteAppt(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-[#11161d] border border-slate-200 dark:border-slate-800 shadow-lg p-6 focus:outline-none">
            {activeNoteAppt && (
              <>
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <div>
                    <Dialog.Title className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      Clinical Consultation Notes
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-500 mt-0.5">
                      Patient: {activeNoteAppt.patientName} (Age {activeNoteAppt.patientAge})
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close notes dialog"
                      className="w-10 h-10 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <label
                  htmlFor="clinical-notes-textarea"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Clinical Observations &amp; Follow-Up Plan
                </label>
                <textarea
                  id="clinical-notes-textarea"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Vitals, assessment findings, medication updates, follow-up interval..."
                  rows={5}
                  className="input py-2 resize-y mb-5"
                />

                <div className="flex justify-end gap-2.5">
                  <Dialog.Close asChild>
                    <button type="button" className="btn-secondary text-xs">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="btn-primary text-xs"
                  >
                    Save &amp; Mark Completed
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Radix Dialog: Reschedule */}
      <Dialog.Root
        open={Boolean(rescheduleAppt)}
        onOpenChange={(open) => {
          if (!open) setRescheduleAppt(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-[#11161d] border border-slate-200 dark:border-slate-800 shadow-lg p-6 focus:outline-none">
            {rescheduleAppt && (
              <>
                <Dialog.Title className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  Reschedule Appointment
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 mt-0.5 mb-4">
                  {rescheduleAppt.patientName} ({rescheduleAppt.slotDate})
                </Dialog.Description>

                <label
                  htmlFor="reschedule-slot-select"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  New Time Slot
                </label>
                <select
                  id="reschedule-slot-select"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="input cursor-pointer mb-5"
                >
                  {[
                    "09:30 AM",
                    "11:00 AM",
                    "02:00 PM",
                    "03:30 PM",
                    "05:00 PM",
                    "06:15 PM",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2.5">
                  <Dialog.Close asChild>
                    <button type="button" className="btn-secondary text-xs">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={handleConfirmReschedule}
                    className="btn-primary text-xs"
                  >
                    Save Slot
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
