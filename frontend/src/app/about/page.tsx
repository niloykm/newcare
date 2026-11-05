"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Heart, Users, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Verified Specialists", value: "240+" },
    { label: "Patient Consultations", value: "50,000+" },
    { label: "Clinical Departments", value: "14+" },
    { label: "Patient Satisfaction", value: "99.2%" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Board-Verified Credentials",
      desc: "Every physician in our registry is verified directly against official BMDC and state medical licensing boards prior to accepting patients.",
    },
    {
      icon: Heart,
      title: "Patient-Centered Access",
      desc: "Zero deceptive tiers or wait queues. Clear, transparent fees displayed upfront with instant digital pass issuance.",
    },
    {
      icon: Award,
      title: "Clinical Rigor & Quality",
      desc: "Specialists adhere to evidence-based practice guidelines, continuous peer review, and synchronized clinical consultation notes.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-16">
      {/* Clinical Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-10 sm:py-14">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-3">
            <span>About NewCare Healthcare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
            Clinical Precision & Seamless Healthcare Access
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            NewCare is an infrastructure platform connecting patients with credentialed specialists for in-clinic consultations and encrypted telehealth sessions.
          </p>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="container max-w-4xl pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Modernizing Clinical Scheduling
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Medical appointments should be straightforward, transparent, and accurate. NewCare bridges the divide between patients and elite clinicians through synchronized real-time availability, fast-track check-in tokens, and digital clinical records.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Whether you need routine preventative care, acute urgent consultation, or specialized surgical second opinions, NewCare confirms your slot in seconds.
            </p>
            <div className="pt-2">
              <Link href="/doctors" className="btn-primary text-xs sm:text-sm px-4 py-2 font-semibold">
                <span>Browse Accredited Specialists</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=800&fit=crop"
              alt="Medical professionals discussing care"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Clinical Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {stats.map(({ label, value }) => (
            <div key={label} className="card p-4 text-center">
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
                {value}
              </div>
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Clinical Values */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
            Our Core Operational Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5 space-y-2">
                <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
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
