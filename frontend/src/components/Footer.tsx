"use client";

import Link from "next/link";
import { Activity, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#11161d] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-200 dark:border-slate-800">
          {/* Column 1: Brand & Care Services */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-teal-700 dark:bg-teal-400 text-white dark:text-slate-950 flex items-center justify-center">
                <Activity className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
              </span>
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                NewCare
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-xs">
              RN-supervised in-home nursing, caregiving, and board-certified physician
              consultations across Greater New York and the Tri-State area.
            </p>
            <ul className="space-y-2 text-sm pt-1">
              <li>
                <Link
                  href="/#services"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Care Services &amp; Transparent Rates
                </Link>
              </li>
              <li>
                <Link
                  href="/#estimator"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Interactive Care Estimator
                </Link>
              </li>
              <li>
                <Link
                  href="/doctors"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Board-Certified Specialist Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Clinical Portals */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Clinical Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Operations Console
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/patient"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Patient &amp; Family Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/doctor"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Physician Clinical Desk
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Clinic Administration
                </Link>
              </li>
              <li>
                <Link
                  href="/my-appointments"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  My Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Practice & Intake */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Practice &amp; Intake
            </h3>
            <ul className="space-y-2.5 text-sm mb-5">
              <li>
                <Link
                  href="/about"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  About &amp; Clinical Governance
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Contact Care Coordination Desk
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                >
                  Patient Account Sign In
                </Link>
              </li>
            </ul>

            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
                <span>intake@newcare.health</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
                <span>Midtown East, Manhattan, New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()}{" "}NewCare Health Services. NYS LHCSA-aligned
            home care &amp; HIPAA-compliant clinical charting.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Vetting Standards
            </Link>
            <Link
              href="/contact"
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Intake &amp; Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
