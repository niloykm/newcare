"use client";

import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { VETTING_STANDARDS } from "@/lib/careData";

export default function AboutPage() {
  const principles = [
    {
      title: "Primary-Source Credential Verification",
      description:
        "Every nurse, home health aide, and attending physician is verified directly against New York State licensing registries and ABMS board records prior to scheduling.",
    },
    {
      title: "Transparent Rates & Shared Charting",
      description:
        "Families receive written hourly or live-in pricing upfront with zero multi-month contracts, plus electronic shift notes and vitals inside the Patient Portal.",
    },
    {
      title: "Continuous RN Supervision",
      description:
        "In-home care plans are authored and periodically audited by supervisory Registered Nurses with clear escalation pathways to board-certified physicians.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 pb-20">
      {/* Header */}
      <section className="bg-white dark:bg-[#11161d] border-b border-slate-200 dark:border-slate-800 py-14 md:py-20">
        <div className="container max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-3">
            About NewCare
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight mb-4">
            Clinical governance for in-home care and specialist medicine
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            NewCare coordinates RN-supervised in-home nursing, dementia and post-surgical
            caregiving, and board-certified physician consultations across Greater New York
            and the Tri-State area.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container max-w-4xl pt-12 space-y-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-6 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Built for families managing real transitions of care
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Arranging safe home support after an orthopedic surgery, hospitalization, or
              memory-care diagnosis should not require navigating unvetted marketplaces or
              opaque agency contracts.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every NewCare clinician is W-2 employed, bonded, background-screened, and
              connected to our supervisory nursing desk so your household and your doctors
              always share an accurate care record.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/#services" className="btn-primary group text-sm">
                <span>View Care Services</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link href="/contact" className="btn-secondary text-sm">
                Contact Intake Desk
              </Link>
            </div>
          </div>

          <div className="md:col-span-6 card card-interactive p-6">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <ShieldCheck
                className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Clinical Vetting Checklist
              </h2>
            </div>

            <ul className="space-y-3">
              {VETTING_STANDARDS.map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm">
                  <Check
                    className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Core Principles */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
            Operating Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="card card-interactive p-5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
