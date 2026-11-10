"use client";

import Link from "next/link";
import { ShieldCheck, Award, Heart, Users, CheckCircle2, ArrowRight, FileCheck, Phone, Check } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "FBI Fingerprint Cleared", value: "100%" },
    { label: "Caregiver Applicant Acceptance", value: "4.8%" },
    { label: "Supervisory RN Coverage", value: "24/7" },
    { label: "Liability & Bond Coverage", value: "$2M" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Primary-Source Credential Verification",
      desc: "Every nurse, caregiver, and physician in our registry is verified directly against official State Boards of Nursing and State Medical Licensing Registries prior to assignment.",
    },
    {
      icon: Heart,
      title: "Patient & Family Focused Transparency",
      desc: "Transparent hourly rates with zero surprise medical bills or binding multi-month contracts. Transparent electronic daily care logs accessible on the Family Portal.",
    },
    {
      icon: Award,
      title: "Supervised Clinical Care Standards",
      desc: "Caregivers operate under active supervisory Registered Nurse protocols with regular in-home audits, structured medication checklists, and infection control compliance.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-16">
      {/* Clinical Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-zinc-800 py-10 sm:py-14">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Governance & Care Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50 mb-3">
            Verified In-Home Care & Clinical Nursing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            NewCare is a clinical home health and caregiving platform providing vetted in-home nurses, certified companions, and board-certified medical specialists across Greater New York and the Tri-State area.
          </p>
        </div>
      </div>

      {/* Main Narrative & Real Clinical Verification UI Artifact */}
      <div className="container max-w-4xl pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
              Transforming Home Care with Clinical Oversight
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Finding trustworthy care for an aging parent, recovering family member, or medically complex child shouldn't depend on unvetted online registries or opaque agencies.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              NewCare bridges the gap with W-2 bonded care professionals, strict primary-source state licensing validation, FBI fingerprinting, and real-time electronic shift charting directed by supervisory Registered Nurses.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <Link href="/#services" className="btn-primary text-xs sm:text-sm px-4 py-2 font-semibold">
                <span>View Care Services & Rates</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <a href="tel:18001234567" className="btn-secondary text-xs sm:text-sm px-4 py-2 font-semibold">
                <Phone className="w-3.5 h-3.5 mr-1" />
                <span>Call 24/7 Dispatch</span>
              </a>
            </div>
          </div>

          {/* Real Functional UI Artifact: Clinical Vetting Protocol Ledger */}
          <div className="card p-5 bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-zinc-50">
                  NewCare Vetting Protocol #NC-892
                </span>
              </div>
              <span className="badge-clinical badge-verified text-[10px]">
                Active Standard
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: "FBI Fingerprint Background", status: "100% Cleared", pass: true },
                { label: "Primary-Source License Validation", status: "State Board Confirmed", pass: true },
                { label: "OIG / HHS Exclusion Screening", status: "Zero Sanctions", pass: true },
                { label: "Practical Skills Simulation", status: "In-Person Pass", pass: true },
                { label: "Communicable Disease (TB/HepB)", status: "Screened & Verified", pass: true },
                { label: "Professional Malpractice Coverage", status: "$2M Policy Active", pass: true },
              ].map(({ label, status }) => (
                <div key={label} className="p-2 rounded bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-slate-700 dark:text-zinc-300 font-medium">{label}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3 h-3 stroke-[2]" />
                    {status}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 italic">
              Caregiver credential ledger updated automatically across all active shifts.
            </p>
          </div>
        </div>

        {/* Clinical Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {stats.map(({ label, value }) => (
            <div key={label} className="card p-4 text-center bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800">
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50 tabular-nums">
                {value}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Clinical Values */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-50 mb-4">
            Our Core Clinical Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-4 bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-md bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-400 mb-3 border border-teal-200 dark:border-teal-800">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
