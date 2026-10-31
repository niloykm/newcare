"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, Video, QrCode, Download,
  CheckCircle2, XCircle, ArrowRight, ShieldCheck, FileText,
  AlertCircle, DollarSign, Plus, Eye
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore, StoredAppointment } from "@/store/useStore";

export default function PatientDashboardView() {
  const { appointments, cancelAppointment, updateAppointmentStatus } = useStore();
  const [selectedPass, setSelectedPass] = useState<StoredAppointment | null>(null);

  // Compute patient-specific appointments
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
    toast.success("Appointment slip downloaded!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Patient Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
          borderRadius: "24px",
          padding: "2rem 2.5rem",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          boxShadow: "0 15px 35px rgba(2, 132, 199, 0.25)",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              padding: "4px 12px",
              borderRadius: "50px",
              fontSize: "0.76rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            👤 PATIENT VIEW • ID #NC-PT-9021
          </div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 900, marginBottom: "4px", letterSpacing: "-0.02em" }}>
            Welcome back, Alexander Hayes
          </h2>
          <p style={{ opacity: 0.9, fontSize: "0.92rem" }}>
            Track your healthcare schedule, download digital passes, and manage specialist appointments.
          </p>
        </div>

        <Link
          href="/doctors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "white",
            color: "#0284c7",
            padding: "12px 24px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "0.92rem",
            textDecoration: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Plus size={16} /> Book New Visit
        </Link>
      </div>

      {/* Patient Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Upcoming Visits</span>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary)", marginTop: "4px" }}>
            {upcomingAppointments.length}
          </p>
          <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>● Active in Queue</span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Completed Visits</span>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text)", marginTop: "4px" }}>
            {pastAppointments.filter((a) => a.status === "Completed").length}
          </p>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Medical Records Synced</span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Total Spent</span>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10b981", marginTop: "4px" }}>
            ${totalSpent}
          </p>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>100% Transparent Fees</span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>Health Network</span>
          <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginTop: "8px" }}>
            Prime Care Active
          </p>
          <span style={{ fontSize: "0.72rem", color: "#0ea5e9", fontWeight: 700 }}>✓ Board Verified Clinicians</span>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)" }}>
            Upcoming Scheduled Visits ({upcomingAppointments.length})
          </h3>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Syncs with Doctor & Admin Portals
          </span>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 1.5rem",
              background: "var(--bg-card)",
              borderRadius: "20px",
              border: "1px dashed var(--border)",
            }}
          >
            <Calendar size={36} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>
              No Upcoming Appointments
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Book an appointment with any verified specialist in 3 clicks.
            </p>
            <Link href="/doctors" className="btn-primary">
              Find a Doctor Now
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Doctor Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ position: "relative", width: 62, height: 62, borderRadius: "16px", overflow: "hidden", flexShrink: 0 }}>
                    <Image
                      src={appt.doctorAvatar}
                      alt={appt.doctorName}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <span
                        style={{
                          background: "rgba(14, 165, 233, 0.12)",
                          color: "var(--primary)",
                          fontWeight: 700,
                          fontSize: "0.74rem",
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {appt.doctorSpecialty}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
                        ID: {appt.bookingId}
                      </span>
                    </div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)" }}>
                      {appt.doctorName}
                    </h4>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      {appt.doctorHospital}
                    </p>
                  </div>
                </div>

                {/* Schedule Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text)", fontWeight: 700, fontSize: "0.88rem" }}>
                    <Calendar size={15} style={{ color: "var(--primary)" }} />
                    <span>{appt.slotDate}</span>
                    <Clock size={15} style={{ color: "var(--primary)", marginLeft: "4px" }} />
                    <span>{appt.slotTime}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    {appt.consultationType === "HD Video Consultation" ? (
                      <span style={{ color: "#6366f1", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Video size={13} /> HD Video Consultation
                      </span>
                    ) : (
                      <span style={{ color: "#0ea5e9", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={13} /> In-Clinic ({appt.roomNumber || "Suite 402"})
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setSelectedPass(appt)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      background: "rgba(14, 165, 233, 0.1)",
                      color: "var(--primary)",
                      border: "1px solid rgba(14, 165, 233, 0.25)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <QrCode size={14} /> View Pass
                  </button>

                  <button
                    onClick={() => handleDownloadSlip(appt)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "var(--bg-secondary)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    title="Download Confirmation Slip"
                  >
                    <Download size={14} /> Slip
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to cancel this appointment?")) {
                        cancelAppointment(appt.id);
                        toast.success("Appointment cancelled");
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "rgba(239, 68, 68, 0.08)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past / Completed Visits */}
      {pastAppointments.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>
            Past Consultation History ({pastAppointments.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {pastAppointments.map((appt) => {
              const isCancelled = appt.status === "Cancelled";
              return (
                <div
                  key={appt.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                    opacity: isCancelled ? 0.75 : 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ position: "relative", width: 48, height: 48, borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                      <Image src={appt.doctorAvatar} alt={appt.doctorName} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text)" }}>
                        {appt.doctorName} ({appt.doctorSpecialty})
                      </h4>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        {appt.slotDate} • {appt.slotTime}
                      </p>
                      {appt.notes && (
                        <p style={{ fontSize: "0.76rem", color: "#10b981", marginTop: "2px", fontWeight: 600 }}>
                          📝 Doctor Note: &ldquo;{appt.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "50px",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        background: isCancelled ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                        color: isCancelled ? "#ef4444" : "#10b981",
                      }}
                    >
                      {appt.status}
                    </span>
                    <button
                      onClick={() => handleDownloadSlip(appt)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: 4,
                      }}
                      title="Download receipt"
                    >
                      <Download size={15} />
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
          onClick={() => setSelectedPass(null)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "24px",
              padding: "2rem",
              maxWidth: 480,
              width: "100%",
              color: "white",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 800, textTransform: "uppercase" }}>
                  DIGITAL CLINICAL APPOINTMENT PASS
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 900, marginTop: "2px" }}>
                  ID: {selectedPass.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPass(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: "center", background: "white", padding: "1.25rem", borderRadius: "18px", color: "#0f172a", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
                <Image
                  src={selectedPass.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedPass.bookingId}`}
                  alt="QR Pass"
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
              <p style={{ fontSize: "0.8rem", fontWeight: 800, marginTop: "8px" }}>Fast-Track Touchless Kiosk Check-In</p>
              <p style={{ fontSize: "0.7rem", color: "#64748b" }}>Present on arrival at clinic reception</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              <p><strong style={{ color: "#94a3b8" }}>Doctor:</strong> {selectedPass.doctorName} ({selectedPass.doctorSpecialty})</p>
              <p><strong style={{ color: "#94a3b8" }}>Schedule:</strong> {selectedPass.slotDate} at {selectedPass.slotTime}</p>
              <p><strong style={{ color: "#94a3b8" }}>Format:</strong> {selectedPass.consultationType}</p>
              <p><strong style={{ color: "#94a3b8" }}>Patient:</strong> {selectedPass.patientName} (Age: {selectedPass.patientAge})</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                onClick={() => handleDownloadSlip(selectedPass)}
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Download Slip
              </button>
              <button
                onClick={() => setSelectedPass(null)}
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
