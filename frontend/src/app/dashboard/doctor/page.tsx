"use client";

import Link from "next/link";
import { ArrowLeft, User, ShieldAlert } from "lucide-react";
import DoctorDashboardView from "@/components/dashboard/DoctorDashboardView";

export default function DoctorDashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-6 sm:py-8 pb-16">
      <div className="container">
        {/* Quick breadcrumb & role jumping */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          <Link
            href="/dashboard"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Operations Portals</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/patient"
              className="btn-secondary text-xs px-2.5 py-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Portal</span>
            </Link>
            <Link
              href="/dashboard/admin"
              className="btn-secondary text-xs px-2.5 py-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>

        <DoctorDashboardView />
      </div>
    </div>
  );
}
