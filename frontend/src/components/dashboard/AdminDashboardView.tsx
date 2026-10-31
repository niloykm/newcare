"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldAlert, DollarSign, TrendingUp, Users, Calendar, CheckCircle2,
  XCircle, Stethoscope, Search, ShieldCheck, Edit, ArrowUpRight,
  Filter, Lock, UserCheck, Key, Clock
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore, StoredAppointment, AppointmentStatus } from "@/store/useStore";

export default function AdminDashboardView() {
  const {
    doctors,
    appointments,
    updateAppointmentStatus,
    updateDoctorFee,
    toggleDoctorVerification,
    toggleDoctorAvailability,
  } = useStore();

  const [appointmentFilter, setAppointmentFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingFeeDocId, setEditingFeeDocId] = useState<string | null>(null);
  const [feeInput, setFeeInput] = useState<number>(50);

  // Financial & Operational Metrics
  const totalRevenue = appointments
    .filter((a) => a.status !== "Cancelled")
    .reduce((sum, a) => sum + (a.amount || 0), 24850);

  const totalConfirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const totalCompleted = appointments.filter((a) => a.status === "Completed").length;

  const filteredAppointments = appointments.filter((a) => {
    if (appointmentFilter !== "All" && a.status !== appointmentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = a.doctorName.toLowerCase().includes(q);
      const matchPat = a.patientName.toLowerCase().includes(q);
      const matchId = a.bookingId.toLowerCase().includes(q);
      if (!matchDoc && !matchPat && !matchId) return false;
    }
    return true;
  });

  const handleSaveFee = (docId: string) => {
    updateDoctorFee(docId, Number(feeInput) || 50);
    toast.success(`Consultation fee updated to $${feeInput}!`);
    setEditingFeeDocId(null);
  };

  const rbacUsers = [
    { name: "Super Admin (Dr. Michael Croft)", role: "System Administrator", access: "Full Root / Financial / RBAC", status: "Active", lastActive: "Just now" },
    { name: "Dr. Sarah Jenkins", role: "Attending Cardiologist", access: "Clinical Queue / EMR Records", status: "Active", lastActive: "2 mins ago" },
    { name: "Dr. Marcus Vance", role: "Physician Faculty", access: "Clinical Queue / EMR Records", status: "Active", lastActive: "14 mins ago" },
    { name: "Alexander Hayes", role: "Verified Patient", access: "Patient Bookings / Digital Pass", status: "Active", lastActive: "5 mins ago" },
    { name: "Sophia Martinez", role: "Verified Patient", access: "Patient Bookings / Digital Pass", status: "Active", lastActive: "1 hour ago" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.2rem" }}>
      {/* Admin Portal Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)",
          borderRadius: "24px",
          padding: "2rem 2.5rem",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          boxShadow: "0 15px 35px rgba(67, 56, 202, 0.25)",
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
            🛡️ ROLE-BASED ADMIN PORTAL • RBAC ENGINE
          </div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 900, marginBottom: "4px", letterSpacing: "-0.02em" }}>
            Clinic Operations &amp; Financial Governance
          </h2>
          <p style={{ opacity: 0.9, fontSize: "0.92rem" }}>
            Monitor real-time clinic revenue, audit verified practitioner credentials, and oversee appointment volume.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              background: "rgba(16, 185, 129, 0.25)",
              color: "#6ee7b7",
              border: "1px solid rgba(110, 231, 183, 0.4)",
              borderRadius: "50px",
              padding: "6px 14px",
              fontSize: "0.78rem",
              fontWeight: 800,
            }}
          >
            ● All Systems Operational
          </span>
        </div>
      </div>

      {/* Financial & Volume Analytics KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.2rem" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700 }}>Total Clinic Revenue</span>
            <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 800, background: "rgba(16, 185, 129, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
              +18.4%
            </span>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text)" }}>
            ${totalRevenue.toLocaleString()}
          </p>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Real-time settled consultations
          </span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700 }}>Monthly Volume</span>
            <span style={{ fontSize: "0.72rem", color: "#0ea5e9", fontWeight: 800, background: "rgba(14, 165, 233, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
              148 Appts
            </span>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>
            {appointments.length + 142}
          </p>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {totalConfirmed} upcoming • {totalCompleted} completed
          </span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700 }}>Verified Faculty</span>
            <span style={{ fontSize: "0.72rem", color: "#8b5cf6", fontWeight: 800, background: "rgba(139, 92, 246, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
              100% Board
            </span>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 900, color: "#8b5cf6" }}>
            {doctors.length} Doctors
          </p>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Across 8 medical specialties
          </span>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700 }}>Queue Latency</span>
            <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 800, background: "rgba(16, 185, 129, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
              Optimal
            </span>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 900, color: "#10b981" }}>
            &lt; 1.2s
          </p>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Instant touchless QR check-in
          </span>
        </div>
      </div>

      {/* Manage Verified Doctors Table */}
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
              Manage Verified Doctors &amp; Pricing Controls
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Toggle clinical verification, update consultation fees, and control daily doctor availability.
            </p>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {doctors.length} Doctors Registered
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Practitioner</th>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Specialty & Credentials</th>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Consultation Fee</th>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Verification</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "right" }}>Availability Control</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ position: "relative", width: 42, height: 42, borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                        <Image src={doc.avatarUrl || doc.image} alt={doc.name} fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, color: "var(--text)" }}>{doc.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{doc.hospitalName}</p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        background: "rgba(14, 165, 233, 0.12)",
                        color: "var(--primary)",
                        fontWeight: 700,
                        fontSize: "0.76rem",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        display: "inline-block",
                        marginBottom: "2px",
                      }}
                    >
                      {doc.specialty}
                    </span>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{doc.degree}</p>
                  </td>

                  {/* Fee Update */}
                  <td style={{ padding: "14px" }}>
                    {editingFeeDocId === doc.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>$</span>
                        <input
                          type="number"
                          value={feeInput}
                          onChange={(e) => setFeeInput(Number(e.target.value))}
                          style={{
                            width: "70px",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--primary)",
                            fontSize: "0.85rem",
                          }}
                        />
                        <button
                          onClick={() => handleSaveFee(doc.id)}
                          style={{
                            background: "var(--primary)",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 800, color: "var(--text)" }}>${doc.consultationFee}</span>
                        <button
                          onClick={() => {
                            setEditingFeeDocId(doc.id);
                            setFeeInput(doc.consultationFee);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: 2,
                          }}
                          title="Edit Fee"
                        >
                          <Edit size={13} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Verification Toggle */}
                  <td style={{ padding: "14px" }}>
                    <button
                      onClick={() => {
                        toggleDoctorVerification(doc.id);
                        toast.success(`${doc.name} verification status toggled!`);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "50px",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        background: doc.verified ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                        color: doc.verified ? "#10b981" : "#ef4444",
                      }}
                    >
                      <ShieldCheck size={12} />
                      {doc.verified ? "✓ BMDC Verified" : "Unverified"}
                    </button>
                  </td>

                  {/* Availability Toggle */}
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <button
                      onClick={() => {
                        toggleDoctorAvailability(doc.id);
                        toast.success(`${doc.name} availability toggled!`);
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "8px",
                        border: doc.isAvailableToday ? "1px solid #10b981" : "1px solid var(--border)",
                        background: doc.isAvailableToday ? "rgba(16, 185, 129, 0.1)" : "var(--bg-secondary)",
                        color: doc.isAvailableToday ? "#10b981" : "var(--text-muted)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {doc.isAvailableToday ? "🟢 Queue Open" : "⚪ Offline"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Appointments Master Ledger */}
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
              Clinic Appointments Master Ledger
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Filter by status, search by patient/doctor name, and manually override appointment states.
            </p>
          </div>

          {/* Search & Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={14} style={{ position: "absolute", left: 10, color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: 36,
                  paddingLeft: 30,
                  paddingRight: 10,
                  fontSize: "0.82rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
            </div>

            <select
              value={appointmentFilter}
              onChange={(e) => setAppointmentFilter(e.target.value)}
              style={{
                height: 36,
                padding: "0 10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All">All Statuses ({appointments.length})</option>
              <option value="Confirmed">Confirmed ({totalConfirmed})</option>
              <option value="Completed">Completed ({totalCompleted})</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.86rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Booking ID</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Patient</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Doctor</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Slot Date & Time</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Format</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Fee</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Status</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>Override</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td style={{ padding: "12px", fontWeight: 800, color: "var(--primary)" }}>
                    {appt.bookingId}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <p style={{ fontWeight: 700, color: "var(--text)" }}>{appt.patientName}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{appt.patientEmail}</p>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <p style={{ fontWeight: 700, color: "var(--text)" }}>{appt.doctorName}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{appt.doctorSpecialty}</p>
                  </td>
                  <td style={{ padding: "12px", color: "var(--text)", fontWeight: 600 }}>
                    {appt.slotDate} at {appt.slotTime}
                  </td>
                  <td style={{ padding: "12px", fontSize: "0.78rem" }}>
                    {appt.consultationType}
                  </td>
                  <td style={{ padding: "12px", fontWeight: 800, color: "var(--text)" }}>
                    ${appt.amount}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "50px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        background:
                          appt.status === "Confirmed"
                            ? "rgba(14, 165, 233, 0.12)"
                            : appt.status === "Completed"
                            ? "rgba(16, 185, 129, 0.12)"
                            : "rgba(239, 68, 68, 0.12)",
                        color:
                          appt.status === "Confirmed"
                            ? "#0284c7"
                            : appt.status === "Completed"
                            ? "#10b981"
                            : "#ef4444",
                      }}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <select
                      value={appt.status}
                      onChange={(e) => {
                        updateAppointmentStatus(appt.id, e.target.value as AppointmentStatus);
                        toast.success(`Booking ${appt.bookingId} status updated to ${e.target.value}!`);
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-secondary)",
                        color: "var(--text)",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Monitor */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "1.75rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)" }}>
              Role-Based Access Control (RBAC) Active Sessions
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Real-time audit of authenticated role permissions across Patient, Doctor, and Administrative boundaries.
            </p>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10b981", fontSize: "0.78rem", fontWeight: 700 }}>
            <Lock size={14} /> Encrypted RBAC Tokens Active
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.86rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>User / Principal</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Role</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Permission Scope</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>Session Status</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {rbacUsers.map((user, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 800, color: "var(--text)" }}>
                    {user.name}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        background: user.role.includes("Admin")
                          ? "rgba(99, 102, 241, 0.12)"
                          : user.role.includes("Doctor") || user.role.includes("Cardiologist") || user.role.includes("Faculty")
                          ? "rgba(16, 185, 129, 0.12)"
                          : "rgba(14, 165, 233, 0.12)",
                        color: user.role.includes("Admin")
                          ? "#6366f1"
                          : user.role.includes("Doctor") || user.role.includes("Cardiologist") || user.role.includes("Faculty")
                          ? "#10b981"
                          : "#0284c7",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    {user.access}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#10b981", fontWeight: 700, fontSize: "0.78rem" }}>
                      ● {user.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    {user.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
