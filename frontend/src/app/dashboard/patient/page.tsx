"use client";

import Link from "next/link";
import { ArrowLeft, Stethoscope, ShieldCheck } from "lucide-react";
import PatientDashboardView from "@/components/dashboard/PatientDashboardView";

export default function PatientDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 py-8 pb-20">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
          <Link
            href="/dashboard"
            className="text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Portals</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/doctor" className="btn-secondary min-h-[36px] text-xs px-3 py-1.5">
              <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Physician Desk</span>
            </Link>
            <Link href="/dashboard/admin" className="btn-secondary min-h-[36px] text-xs px-3 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clinic Admin</span>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Clinical Operations
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
            Patient &amp; Family Portal
          </h1>
        </div>

        <PatientDashboardView />
      </div>
    </div>
  );
}
