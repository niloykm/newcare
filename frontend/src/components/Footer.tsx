"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Activity, FileCheck, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 dark:text-zinc-400 border-t border-slate-800 pt-12 pb-8 text-xs">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Accreditation */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group text-white">
              <div className="w-7 h-7 rounded-md bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                <Activity className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                NewCare
              </span>
            </Link>
            <p className="text-xs text-slate-400 dark:text-zinc-400 leading-relaxed max-w-xs">
              Clinic-grade in-home caregiving, skilled clinical nursing, and synchronized physician consultations. 100% FBI background screened and supervisory RN directed.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>LHCSA Compliant • Licensed & Bonded</span>
            </div>
          </div>

          {/* Core Care Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-200 mb-3">
              Care Services & Rates
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 dark:text-zinc-400">
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Skilled Nursing (RN / LPN) — from $48/hr
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Elderly & Dementia Care — from $32/hr
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Post-Surgical Orthopedic Care — from $42/hr
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Pediatric Complex Care — from $45/hr
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  24/7 Dedicated Live-In — from $340/day
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical Portals & Directory */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-200 mb-3">
              Platform & Dashboards
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 dark:text-zinc-400">
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  Specialist Doctor Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/patient" className="hover:text-white transition-colors">
                  Family Care Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/doctor" className="hover:text-white transition-colors">
                  Physician Clinical Desk
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-white transition-colors">
                  Clinic Administration & Vetting
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Clinical Standards & Protocols
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Triage & Coordinates */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-zinc-200 mb-3">
              24/7 Clinical Dispatch
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="tel:18001234567" className="text-white hover:text-teal-400 font-semibold tabular-nums">
                  +1 (800) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>dispatch@newcare.health</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>42 Health Plaza, Manhattan, NY 10001</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                <span>Emergency Nurse Triage Response &lt; 2 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Legal / Compliance Notice */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} NewCare Health Technologies, Inc. All rights reserved. LHCSA Licensed Home Care Services Agency protocols compliant.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Clinical Vetting Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Support & Intake
            </Link>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">HIPAA Compliant & Bonded</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
