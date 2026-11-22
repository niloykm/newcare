"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Search, Edit } from "lucide-react";
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
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const totalConfirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const totalCompleted = appointments.filter((a) => a.status === "Completed").length;
  const verifiedCount = doctors.filter((d) => d.verified).length;

  const filteredAppointments = appointments.filter((a) => {
    if (appointmentFilter !== "All" && a.status !== appointmentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.bookingId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveFee = (docId: string) => {
    const validFee = Math.max(15, Number(feeInput) || 50);
    updateDoctorFee(docId, validFee);
    toast.success(`Consultation fee updated to $${validFee}.`);
    setEditingFeeDocId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Clinic Administration · NY Credentialing &amp; Ledger
          </p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-0.5">
            Operations &amp; Practitioner Governance
          </h2>
        </div>
        <span className="badge-clinical badge-verified self-start sm:self-auto">
          {verifiedCount} / {doctors.length} NY Board Verified
        </span>
      </div>

      {/* Real Store KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Booked Revenue</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Active Appointments</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {totalConfirmed}
          </p>
        </div>
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Completed Visits</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {totalCompleted}
          </p>
        </div>
        <div className="card p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Active Specialists</span>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
            {doctors.length}
          </p>
        </div>
      </div>

      {/* Practitioner Registry */}
      <div className="card p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Practitioner Credentialing &amp; Fees
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage NY license verification status, consultation rates, and daily availability.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-2.5 px-3">Practitioner</th>
                <th className="py-2.5 px-3">Specialty &amp; Credentials</th>
                <th className="py-2.5 px-3">Fee</th>
                <th className="py-2.5 px-3">License Status</th>
                <th className="py-2.5 px-3 text-right">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                        <Image
                          src={doc.avatarUrl || doc.image}
                          alt={doc.name}
                          fill
                          sizes="36px"
                          className="object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {doc.hospitalName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {doc.specialty}
                    </p>
                    <p className="text-[11px] text-slate-500">{doc.degree}</p>
                  </td>
                  <td className="py-3 px-3">
                    {editingFeeDocId === doc.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={15}
                          aria-label={`Consultation fee for ${doc.name}`}
                          value={feeInput}
                          onChange={(e) => setFeeInput(Number(e.target.value))}
                          className="w-16 h-8 px-2 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveFee(doc.id)}
                          className="h-8 px-2.5 rounded bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          ${doc.consultationFee}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFeeDocId(doc.id);
                            setFeeInput(doc.consultationFee);
                          }}
                          aria-label={`Edit fee for ${doc.name}`}
                          className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 p-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => {
                        toggleDoctorVerification(doc.id);
                        toast.success(`Updated verification for ${doc.name}.`);
                      }}
                      className={`badge-clinical cursor-pointer ${
                        doc.verified ? "badge-verified" : "badge-neutral"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                      <span>{doc.verified ? "NY License Verified" : "Pending Review"}</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        toggleDoctorAvailability(doc.id);
                        toast.success(`Updated availability for ${doc.name}.`);
                      }}
                      className={`min-h-[32px] px-2.5 text-xs font-semibold rounded-md border cursor-pointer ${
                        doc.isAvailableToday
                          ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                      }`}
                    >
                      {doc.isAvailableToday ? "Accepting" : "Offline"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Appointments Ledger */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Appointments Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Search records or adjust appointment statuses across the network.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex items-center">
              <Search
                className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search patient, doctor, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search appointments ledger"
                className="h-9 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
              />
            </div>

            <select
              aria-label="Filter appointments by status"
              value={appointmentFilter}
              onChange={(e) => setAppointmentFilter(e.target.value)}
              className="h-9 px-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value="All">All ({appointments.length})</option>
              <option value="Confirmed">Confirmed ({totalConfirmed})</option>
              <option value="Completed">Completed ({totalCompleted})</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Physician</th>
                <th className="py-2.5 px-3">Schedule</th>
                <th className="py-2.5 px-3">Fee</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {appt.bookingId}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {appt.patientName}
                    </p>
                    <p className="text-[11px] text-slate-500">{appt.patientEmail}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {appt.doctorName}
                    </p>
                    <p className="text-[11px] text-slate-500">{appt.doctorSpecialty}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 tabular-nums">
                    {appt.slotDate}, {appt.slotTime}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    ${appt.amount}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      aria-label={`Status for ${appt.bookingId}`}
                      value={appt.status}
                      onChange={(e) => {
                        updateAppointmentStatus(
                          appt.id,
                          e.target.value as AppointmentStatus
                        );
                        toast.success(`Updated ${appt.bookingId} to ${e.target.value}.`);
                      }}
                      className="h-8 px-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer"
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
    </div>
  );
}
