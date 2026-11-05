"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search, ArrowRight, ShieldCheck, Clock, Award, Users,
  Stethoscope, Brain, Heart, Baby, Bone, Ear, Activity,
  CheckCircle2, Video, Calendar, UserCheck, ShieldAlert
} from "lucide-react";
import api from "@/lib/api";
import { FALLBACK_DOCTORS, DoctorProfile } from "@/data/doctorsData";
import DoctorCard from "@/components/DoctorCard";
import QuickFinder from "@/components/QuickFinder";

const specialties = [
  { name: "General Physician", query: "General Physician", icon: Stethoscope, count: "40 Clinicians" },
  { name: "Cardiologist", query: "Cardiologist", icon: Heart, count: "28 Clinicians" },
  { name: "Dermatologist", query: "Dermatologist", icon: Activity, count: "35 Clinicians" },
  { name: "Pediatrician", query: "Pediatrician", icon: Baby, count: "24 Clinicians" },
  { name: "Neurologist", query: "Neurologist", icon: Brain, count: "19 Clinicians" },
  { name: "Gynecologist", query: "Gynecologist", icon: Heart, count: "22 Clinicians" },
  { name: "Orthopedic", query: "Orthopedic", icon: Bone, count: "18 Clinicians" },
  { name: "ENT Specialist", query: "ENT Specialist", icon: Ear, count: "16 Clinicians" },
];

export default function Home() {
  const [featuredDoctors, setFeaturedDoctors] = useState<DoctorProfile[]>(FALLBACK_DOCTORS.slice(0, 6));

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data?.success && Array.isArray(res.data.doctors) && res.data.doctors.length > 0) {
          setFeaturedDoctors(res.data.doctors.slice(0, 6));
        }
      } catch {
        // Fallback data is pre-populated
      }
    };
    fetchDoctors();
  }, []);

  const stats = [
    { value: "240+", label: "Board-Certified Specialists" },
    { value: "50,000+", label: "Appointments Completed" },
    { value: "100%", label: "BMDC Verified Credentials" },
    { value: "< 2 min", label: "Average Booking Latency" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* ── Section 1: Anchored Clinical Triage & Search Header ── */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 pt-8 pb-10">
        <div className="container">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Clinical Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
              Clinical Scheduling & Care Coordination
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
              Direct access to board-certified medical specialists. Book synchronized in-clinic consultations or encrypted telehealth sessions with real-time schedule verification.
            </p>
          </div>

          {/* Anchored Functional Triage Bar */}
          <div className="mt-4">
            <QuickFinder />
          </div>

          {/* Clinical Verification Checklist */}
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>BMDC & Board Certified Medical Faculty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Real-Time Calendar Synchronization</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Digital Health Pass & Kiosk Check-In</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Clinical Metrics ── */}
      <section className="py-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800"
              >
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {value}
                </div>
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: High-Density Specialty Navigation ── */}
      <section className="py-10 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Browse by Clinical Specialty
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Filter accredited physicians by diagnostic discipline
              </p>
            </div>
            <Link
              href="/doctors"
              className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View all specialties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {specialties.map(({ name, query, icon: Icon, count }) => (
              <Link
                key={name}
                href={`/doctors?specialty=${encodeURIComponent(query)}`}
                className="card p-3 sm:p-3.5 flex items-center gap-3 text-left transition-colors hover:border-neutral-400 dark:hover:border-neutral-600 group"
              >
                <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-700 dark:text-neutral-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {name}
                  </p>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Available Doctors — High-Density Horizontal Rows ── */}
      <section className="py-10 bg-white dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Featured Board-Certified Practitioners
                </h2>
                <span className="badge-clinical badge-verified text-xs">
                  Active Schedules
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Real-time consult slots available for direct booking
              </p>
            </div>
            <Link
              href="/doctors"
              className="btn-secondary text-xs sm:text-sm font-semibold self-start sm:self-auto"
            >
              <span>View All Clinicians</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* High-Density Structured Rows */}
          <div className="flex flex-col gap-3">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id || doctor._id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Role-Based Clinical Workflow System ── */}
      <section className="py-10 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container">
          <div className="max-w-2xl mb-8">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Synchronized Healthcare Operational Portals
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              NewCare provides synchronized role-based interfaces with real-time appointment state management, queue coordination, and audit tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Portal */}
            <div className="card p-5 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Patient Care Portal
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  Explore verified specialists, execute structured multi-step bookings, export calendar .ics files, and access digital check-in passes.
                </p>
              </div>
              <Link
                href="/dashboard/patient"
                className="btn-secondary text-xs font-semibold w-full justify-between"
              >
                <span>Launch Patient Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Doctor Desk */}
            <div className="card p-5 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Physician Clinical Desk
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  Manage live daily patient queue, update slot statuses (checked-in, completed), record consultation notes, and adjust schedule availability.
                </p>
              </div>
              <Link
                href="/dashboard/doctor"
                className="btn-secondary text-xs font-semibold w-full justify-between"
              >
                <span>Launch Clinical Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Admin Desk */}
            <div className="card p-5 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Clinic Administration
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  Real-time operational metrics, practitioner credential tracking, appointment load monitoring, and RBAC security overview.
                </p>
              </div>
              <Link
                href="/dashboard/admin"
                className="btn-secondary text-xs font-semibold w-full justify-between"
              >
                <span>Launch Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Standard Clinical Workflow ── */}
      <section className="py-10 bg-white dark:bg-neutral-900">
        <div className="container">
          <div className="max-w-2xl mb-8">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Standard Clinical Appointment Protocol
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Transparent 3-stage protocol designed for patient privacy, zero clinical wait times, and verified medical documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Specialty & Time Selection",
                desc: "Filter accredited physicians by discipline, review credentialed clinical ratings, and lock in an open 30-minute consultation window.",
              },
              {
                step: "02",
                title: "Intake & Clinical Format",
                desc: "Specify visit modality (In-Clinic or Encrypted Telehealth), input symptoms, and confirm primary clinical concern.",
              },
              {
                step: "03",
                title: "Digital Pass & Synchronization",
                desc: "Receive encrypted booking ID, calendar sync (.ics), and verified digital QR token for touchless kiosk check-in.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card p-5">
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 tabular-nums mb-2">
                  STAGE {step}
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
