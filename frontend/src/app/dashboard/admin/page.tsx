"use client";

import Link from "next/link";
import { ArrowLeft, User, Stethoscope } from "lucide-react";
import AdminDashboardView from "@/components/dashboard/AdminDashboardView";

export default function AdminDashboardPage() {
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
            <Link href="/dashboard/patient" className="btn-secondary min-h-[36px] text-xs px-3 py-1.5">
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Patient Portal</span>
            </Link>
            <Link href="/dashboard/doctor" className="btn-secondary min-h-[36px] text-xs px-3 py-1.5">
              <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Physician Desk</span>
            </Link>
          </div>
        </div>

        <AdminDashboardView />
      </div>
    </div>
  );
}
