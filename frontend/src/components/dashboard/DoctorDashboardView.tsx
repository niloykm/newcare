"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Stethoscope, Calendar, Clock, Video, MapPin, CheckCircle2,
  XCircle, FileText, User, ShieldCheck, AlertCircle, RefreshCw,
  Edit3, Check, Star, Users
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore, StoredAppointment } from "@/store/useStore";

export default function DoctorDashboardView() {
  const {
    doctors,
    activeDoctorId,
    setActiveDoctorId,
    toggleDoctorAvailability,
    appointments,
    updateAppointmentStatus,
    addConsultationNote,
    rescheduleAppointment,
    cancelAppointment,
  } = useStore();

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  // Active notes modal
  const [activeNoteAppt, setActiveNoteAppt] = useState<StoredAppointment | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState("");

  // Reschedule modal
  const [rescheduleAppt, setRescheduleAppt] = useState<StoredAppointment | null>(null);
  const [newSlotTime, setNewSlotTime] = useState("05:30 PM");

  // Filter appointments for this doctor (or all for demo queue)
  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === currentDoctor.id || a.doctorName === currentDoctor.name
  );
  const queueAppointments = doctorAppointments.length > 0 ? doctorAppointments : appointments;

  const todayConfirmed = queueAppointments.filter((a) => a.status === "Confirmed");
  const todayCompleted = queueAppointments.filter((a) => a.status === "Completed");

  const handleSaveNotes = () => {
    if (!activeNoteAppt) return;
    addConsultationNote(activeNoteAppt.id, clinicalNotes);
    toast.success("Consultation notes recorded and consultation marked completed!");
    setActiveNoteAppt(null);
    setClinicalNotes("");
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleAppt) return;
    rescheduleAppointment(rescheduleAppt.id, rescheduleAppt.slotDate, newSlotTime);
    toast.success(`Slot rescheduled to ${newSlotTime}!`);
    setRescheduleAppt(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Doctor Desk Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0284c7 100%)",
          borderRadius: "24px",
          padding: "2rem 2.5rem",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          boxShadow: "0 15px 35px rgba(13, 148, 136, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              position: "relative",
              width: 76,
              height: 76,
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              border: "2px solid rgba(255,255,255,0.4)",
              flexShrink: 0,
            }}
          >
            <Image
              src={currentDoctor.avatarUrl || currentDoctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"}
              alt={currentDoctor.name}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(6px)",
                padding: "3px 12px",
                borderRadius: "50px",
                fontSize: "0.74rem",
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              🩺 CLINICAL DESK • {currentDoctor.license}
            </div>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 900, marginBottom: "3px", letterSpacing: "-0.02em" }}>
              {currentDoctor.name}
            </h2>
            <p style={{ opacity: 0.9, fontSize: "0.88rem" }}>
              {currentDoctor.degree} • {currentDoctor.hospitalName}
            </p>
          </div>
        </div>

        {/* Doctor Switcher & Availability Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Doctor Profile Selector */}
          <select
            value={currentDoctor.id}
            onChange={(e) => setActiveDoctorId(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id} style={{ color: "#0f172a" }}>
                Dr. {d.name.replace("Dr. ", "")} ({d.specialty})
              </option>
            ))}
          </select>

          {/* Availability Toggle */}
          <button
            onClick={() => {
              toggleDoctorAvailability(currentDoctor.id);
              toast.success(
                currentDoctor.isAvailableToday
                  ? "Status set to Offline / Busy"
                  : "Status set to Available Today (Queue Open)!"
              );
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "12px",
              border: "none",
              background: currentDoctor.isAvailableToday ? "#ffffff" : "rgba(255,255,255,0.2)",
              color: currentDoctor.isAvailableToday ? "#0f766e" : "#ffffff",
              fontSize: "0.85rem",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: currentDoctor.isAvailableToday ? "#10b981" : "#fca5a5",
              }}
            />
            {currentDoctor.isAvailableToday ? "🟢 Live Queue Active" : "⚪ Offline"}
          </button>
        </div>
      </div>

      {/* Doctor Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Waiting in Queue</span>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary)", marginTop: "4px" }}>
            {todayConfirmed.length} Patients
          </p>
          <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>● Next Slot: {todayConfirmed[0]?.slotTime || "4:30 PM"}</span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Completed Today</span>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10b981", marginTop: "4px" }}>
            {todayCompleted.length} Consultations
          </p>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Clinical Notes Recorded</span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Monthly Volume</span>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text)", marginTop: "4px" }}>
            142 Visits
          </p>
          <span style={{ fontSize: "0.72rem", color: "#0ea5e9", fontWeight: 700 }}>+12% vs last month</span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Clinical Rating</span>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#f59e0b", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
            ★ {currentDoctor.rating?.toFixed(1) || "4.9"}
          </p>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Based on {currentDoctor.reviewsCount || 168} verified patients</span>
        </div>
      </div>

      {/* Live Patient Queue Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "1.75rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)" }}>
              Today&apos;s Patient Queue &amp; Clinical Schedule
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Review patient symptoms, accept check-ins, record clinical consultation notes, or reschedule appointments.
            </p>
          </div>
          <span
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              padding: "4px 12px",
              borderRadius: "50px",
              fontSize: "0.76rem",
              fontWeight: 800,
            }}
          >
            ● Synchronized Zustand State
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Patient</th>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Schedule & Format</th>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Reason & Symptoms</th>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Status</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "right" }}>Clinical Actions</th>
              </tr>
            </thead>
            <tbody>
              {queueAppointments.map((appt) => {
                const isConfirmed = appt.status === "Confirmed";
                const isCompleted = appt.status === "Completed";
                const isCancelled = appt.status === "Cancelled";

                return (
                  <tr
                    key={appt.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.15s ease",
                    }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/40"
                  >
                    {/* Patient Name & Details */}
                    <td style={{ padding: "16px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: "rgba(14, 165, 233, 0.1)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          {appt.patientName.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>
                            {appt.patientName}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            Age: {appt.patientAge} • ID: {appt.bookingId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Schedule & Format */}
                    <td style={{ padding: "16px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 800, color: "var(--text)" }}>
                          {appt.slotTime}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          {appt.slotDate}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: appt.consultationType === "HD Video Consultation" ? "#6366f1" : "#0ea5e9",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            marginTop: "2px",
                          }}
                        >
                          {appt.consultationType === "HD Video Consultation" ? <Video size={11} /> : <MapPin size={11} />}
                          {appt.consultationType}
                        </span>
                      </div>
                    </td>

                    {/* Symptoms */}
                    <td style={{ padding: "16px 14px", maxWidth: "260px" }}>
                      <p style={{ fontSize: "0.82rem", color: "var(--text)", fontWeight: 600, marginBottom: "4px" }}>
                        {appt.reason}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {appt.symptoms?.map((s) => (
                          <span
                            key={s}
                            style={{
                              background: "var(--bg-secondary)",
                              color: "var(--text-secondary)",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      {appt.notes && (
                        <p style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, marginTop: "4px" }}>
                          ✓ Note: &ldquo;{appt.notes}&rdquo;
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 10px",
                          borderRadius: "50px",
                          fontSize: "0.76rem",
                          fontWeight: 800,
                          background: isConfirmed
                            ? "rgba(14, 165, 233, 0.12)"
                            : isCompleted
                            ? "rgba(16, 185, 129, 0.12)"
                            : "rgba(239, 68, 68, 0.12)",
                          color: isConfirmed
                            ? "#0284c7"
                            : isCompleted
                            ? "#10b981"
                            : "#ef4444",
                        }}
                      >
                        {isConfirmed && "● Confirmed"}
                        {isCompleted && "✓ Completed"}
                        {isCancelled && "✕ Cancelled"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 14px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => {
                                setActiveNoteAppt(appt);
                                setClinicalNotes(appt.notes || "");
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                background: "rgba(16, 185, 129, 0.1)",
                                color: "#10b981",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              <Edit3 size={12} /> Complete &amp; Note
                            </button>

                            <button
                              onClick={() => {
                                setRescheduleAppt(appt);
                                setNewSlotTime(appt.slotTime);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                background: "var(--bg-secondary)",
                                color: "var(--text)",
                                border: "1px solid var(--border)",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              <RefreshCw size={11} /> Reschedule
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Cancel slot for ${appt.patientName}?`)) {
                                  cancelAppointment(appt.id);
                                  toast.success("Appointment cancelled");
                                }
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                padding: "4px 8px",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {isCompleted && (
                          <button
                            onClick={() => {
                              setActiveNoteAppt(appt);
                              setClinicalNotes(appt.notes || "");
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: "none",
                              border: "none",
                              color: "var(--primary)",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Edit Notes
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consultation Notes Modal */}
      {activeNoteAppt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem",
          }}
          onClick={() => setActiveNoteAppt(null)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "24px",
              padding: "2rem",
              maxWidth: 520,
              width: "100%",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)" }}>
                  Clinical Consultation Notes
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Patient: {activeNoteAppt.patientName} (Age: {activeNoteAppt.patientAge})
                </p>
              </div>
              <button
                onClick={() => setActiveNoteAppt(null)}
                style={{
                  background: "var(--bg-secondary)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                  color: "var(--text)",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", marginBottom: "6px", display: "block" }}>
                Clinical Observations & Prescription / Next Steps:
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="e.g. Patient vitals stable. BP 124/82 mmHg. Prescribed lifestyle modification and scheduled 3-month follow-up..."
                rows={5}
                className="input"
                style={{ resize: "vertical", lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setActiveNoteAppt(null)}
                className="btn-secondary"
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="btn-primary"
                style={{ padding: "8px 20px" }}
              >
                Save Notes & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Slot Modal */}
      {rescheduleAppt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem",
          }}
          onClick={() => setRescheduleAppt(null)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "24px",
              padding: "2rem",
              maxWidth: 440,
              width: "100%",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginBottom: "6px" }}>
              Reschedule Slot
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Pick a new available time for {rescheduleAppt.patientName}.
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", marginBottom: "6px", display: "block" }}>
                Select New Time Slot:
              </label>
              <select
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="input"
                style={{ cursor: "pointer" }}
              >
                {["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM", "05:30 PM", "06:15 PM"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setRescheduleAppt(null)}
                className="btn-secondary"
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="btn-primary"
                style={{ padding: "8px 20px" }}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
