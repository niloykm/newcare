"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldAlert, DollarSign, Users, Calendar, TrendingUp,
  ShieldCheck, Activity, Search, Edit, Check, Lock, CheckCircle2,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore, AppointmentStatus } from "@/store/useStore";

export default function AdminDashboardView() {
  const {
    doctors,
    appointments,
    updateAppointmentStatus,
    toggleDoctorVerification,
    toggleDoctorAvailability,
    updateDoctorFee,
  } = useStore();

  const [editingFeeDocId, setEditingFeeDocId] = useState<string | null>(null);
  const [feeInput, setFeeInput] = useState<number>(50);
  const [appointmentFilter, setAppointmentFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const totalRevenue = appointments
    .filter((a) => a.status !== "Cancelled")
    .reduce((sum, a) => sum + (a.amount || 0), 0) + 12450;

  const totalConfirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const totalCompleted = appointments.filter((a) => a.status === "Completed").length;

  const filteredAppointments = appointments.filter((a) => {
    if (appointmentFilter !== "All" && a.status !== appointmentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPatient = a.patientName.toLowerCase().includes(q);
      const matchDoc = a.doctorName.toLowerCase().includes(q);
      const matchId = a.bookingId.toLowerCase().includes(q);
      if (!matchPatient && !matchDoc && !matchId) return false;
    }
    return true;
  });

  const handleSaveFee = (docId: string) => {
    updateDoctorFee(docId, Number(feeInput) || 50);
    toast.success(`Consultation fee updated to $${feeInput}`);
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
    <div className="flex flex-col gap-6 text-neutral-900 dark:text-neutral-100">
      {/* Admin Portal Header */}
      <div className="card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-1">
            <span>Clinic Operational Governance</span>
            <span className="text-neutral-400">•</span>
            <span className="font-mono text-[11px]">RBAC Console</span>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Clinic Operations &amp; Financial Ledger
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time settled revenue, practitioner credentialing, and RBAC boundary monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-clinical badge-verified text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block" />
            Core Services Healthy
          </span>
        </div>
      </div>

      {/* Financial & Volume Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span>Settled Revenue</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">+18.4%</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            ${totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Consolidated ledger
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span>Monthly Volume</span>
            <span className="text-sky-600 dark:text-sky-400 font-semibold tabular-nums">148 Total</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            {appointments.length + 142}
          </p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 tabular-nums">
            {totalConfirmed} active • {totalCompleted} completed
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span>Active Faculty</span>
            <span className="badge-clinical badge-verified text-[10px]">100% Board</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            {doctors.length}
          </p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Across 8 clinical departments
          </span>
        </div>

        <div className="card p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span>Queue Latency</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Sub-second</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums mt-0.5">
            &lt; 1.2s
          </p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Kiosk QR validation rate
          </span>
        </div>
      </div>

      {/* Manage Verified Doctors Table */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Practitioner Registry &amp; Consultation Fee Governance
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Verify clinical credentials, adjust consultation fees, and regulate daily availability.
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tabular-nums self-start sm:self-auto">
            {doctors.length} Registered Clinicians
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Practitioner</th>
                <th className="py-2.5 px-3">Specialty &amp; Credentials</th>
                <th className="py-2.5 px-3">Fee</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3 text-right">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0">
                        <Image src={doc.avatarUrl || doc.image} alt={doc.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{doc.name}</p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{doc.hospitalName}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="badge-clinical badge-neutral text-xs mb-0.5 inline-block">
                      {doc.specialty}
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{doc.degree}</p>
                  </td>

                  <td className="py-3 px-3">
                    {editingFeeDocId === doc.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-500">$</span>
                        <input
                          type="number"
                          value={feeInput}
                          onChange={(e) => setFeeInput(Number(e.target.value))}
                          className="w-16 h-8 px-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveFee(doc.id)}
                          className="btn-primary text-xs px-2 py-1"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          ${doc.consultationFee}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFeeDocId(doc.id);
                            setFeeInput(doc.consultationFee);
                          }}
                          className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5"
                          title="Edit fee"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => {
                        toggleDoctorVerification(doc.id);
                        toast.success(`${doc.name} verification status toggled`);
                      }}
                      className={`badge-clinical text-xs cursor-pointer border ${
                        doc.verified ? "badge-verified" : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{doc.verified ? "BMDC Verified" : "Unverified"}</span>
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        toggleDoctorAvailability(doc.id);
                        toast.success(`${doc.name} availability updated`);
                      }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                        doc.isAvailableToday
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                          : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500"
                      }`}
                    >
                      {doc.isAvailableToday ? "Queue Active" : "Offline"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Appointments Master Ledger */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Clinical Appointments Master Ledger
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Filter by status, search by patient/doctor name, or override appointment states.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <select
              value={appointmentFilter}
              onChange={(e) => setAppointmentFilter(e.target.value)}
              className="h-8 px-2.5 text-xs font-medium bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 cursor-pointer"
            >
              <option value="All">All Statuses ({appointments.length})</option>
              <option value="Confirmed">Confirmed ({totalConfirmed})</option>
              <option value="Completed">Completed ({totalCompleted})</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Clinician</th>
                <th className="py-2.5 px-3">Slot Date &amp; Time</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Fee</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">State Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {appt.bookingId}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{appt.patientName}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{appt.patientEmail}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{appt.doctorName}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{appt.doctorSpecialty}</p>
                  </td>
                  <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200 font-medium tabular-nums">
                    {appt.slotDate} at {appt.slotTime}
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                    {appt.consultationType}
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    ${appt.amount}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`badge-clinical text-xs ${
                        appt.status === "Confirmed"
                          ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                          : appt.status === "Completed"
                          ? "badge-verified"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={appt.status}
                      onChange={(e) => {
                        updateAppointmentStatus(appt.id, e.target.value as AppointmentStatus);
                        toast.success(`Booking ${appt.bookingId} set to ${e.target.value}`);
                      }}
                      className="h-7 px-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-800 dark:text-neutral-200 cursor-pointer"
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
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Role-Based Access Control (RBAC) Active Sessions
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Live audit of authenticated session roles across Patient, Doctor, and Administrative boundaries.
            </p>
          </div>
          <span className="badge-clinical badge-neutral text-xs font-mono self-start sm:self-auto">
            <Lock className="w-3 h-3 text-neutral-500 mr-1" />
            Tokens Validated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Principal</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Permission Scope</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Last Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {rbacUsers.map((user, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                    {user.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge-clinical badge-neutral text-xs">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                    {user.access}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-500 dark:text-neutral-400">
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
