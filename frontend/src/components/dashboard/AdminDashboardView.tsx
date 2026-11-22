"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Search, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { useStore, AppointmentStatus } from "@/store/useStore";
import {
  RevealSection,
  RevealStagger,
  SHARED_PILL_SPRING,
  TAB_PANEL_TRANSITION,
} from "@/components/MotionPrimitives";

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
        {[
          { label: "Booked Revenue", value: `$${totalRevenue.toLocaleString()}` },
          { label: "Active Appointments", value: totalConfirmed },
          { label: "Completed Visits", value: totalCompleted },
          { label: "Active Specialists", value: doctors.length },
        ].map((kpi, idx) => (
          <RevealStagger key={kpi.label} index={idx}>
            <div className="card card-interactive p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</span>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
                {kpi.value}
              </p>
            </div>
          </RevealStagger>
        ))}
      </div>

      {/* Practitioner Registry */}
      <RevealSection className="card p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Practitioner Credentialing &amp; Fees
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage NY license verification status, consultation rates, and daily availability.
          </p>
        </div>

        {/* Mobile Practitioner Cards */}
        <div className="md:hidden space-y-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                    <Image
                      src={doc.avatarUrl || doc.image}
                      alt={doc.name}
                      fill
                      sizes="40px"
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {doc.specialty} · {doc.degree}
                    </p>
                  </div>
                </div>

                {editingFeeDocId === doc.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min={15}
                      aria-label={`Consultation fee for ${doc.name}`}
                      value={feeInput}
                      onChange={(e) => setFeeInput(Number(e.target.value))}
                      className="w-16 h-9 px-2 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveFee(doc.id)}
                      className="min-h-[36px] px-2.5 rounded bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFeeDocId(doc.id);
                      setFeeInput(doc.consultationFee);
                    }}
                    aria-label={`Edit fee for ${doc.name}`}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11161d] text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums shrink-0 cursor-pointer"
                  >
                    <span>${doc.consultationFee}</span>
                    <Edit className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    toggleDoctorVerification(doc.id);
                    toast.success(`Updated verification for ${doc.name}.`);
                  }}
                  className={`min-h-[36px] px-3 badge-clinical cursor-pointer ${
                    doc.verified ? "badge-verified" : "badge-neutral"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{doc.verified ? "NY License Verified" : "Pending Review"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleDoctorAvailability(doc.id);
                    toast.success(`Updated availability for ${doc.name}.`);
                  }}
                  className={`min-h-[36px] px-3 text-xs font-semibold rounded-md border cursor-pointer ${
                    doc.isAvailableToday
                      ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  {doc.isAvailableToday ? "Accepting" : "Offline"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Practitioner Table */}
        <div className="hidden md:block overflow-x-auto">
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
                          className="w-16 h-9 px-2 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveFee(doc.id)}
                          className="min-h-[36px] px-2.5 rounded bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
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
                          className="w-9 h-9 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
                      className={`min-h-[34px] px-3 badge-clinical cursor-pointer ${
                        doc.verified ? "badge-verified" : "badge-neutral"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
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
                      className={`min-h-[34px] px-3 text-xs font-semibold rounded-md border cursor-pointer ${
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
      </RevealSection>

      {/* Master Appointments Ledger */}
      <RevealSection delay={0.08} className="card p-5 sm:p-6">
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

            <div
              role="tablist"
              aria-label="Filter appointments by status"
              className="inline-flex flex-wrap rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-0.5"
            >
              {(["All", "Confirmed", "Completed", "Cancelled"] as const).map((status) => {
                const active = appointmentFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setAppointmentFilter(status)}
                    className={`relative min-h-[34px] px-2.5 text-xs font-semibold rounded transition-colors duration-200 cursor-pointer ${
                      active
                        ? "text-slate-900 dark:text-slate-50"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-appt-filter-pill"
                        transition={SHARED_PILL_SPRING}
                        className="absolute inset-0 rounded bg-white dark:bg-slate-800 shadow-xs"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{status}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${appointmentFilter}-${searchQuery.trim()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={TAB_PANEL_TRANSITION}
          >

        {/* Mobile Appointments Ledger Cards */}
        <div className="md:hidden space-y-3">
          {filteredAppointments.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">
              No appointments match your search or status filter.
            </p>
          ) : (
            filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">
                    {appt.bookingId}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    ${appt.amount}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {appt.patientName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {appt.doctorName} ({appt.doctorSpecialty})
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                    {appt.slotDate}, {appt.slotTime}
                  </span>
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
                    className="min-h-[36px] px-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Appointments Ledger Table */}
        <div className="hidden md:block overflow-x-auto">
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
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No appointments match your search or status filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
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
                        className="min-h-[36px] px-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          </motion.div>
        </AnimatePresence>
      </RevealSection>
    </div>
  );
}
