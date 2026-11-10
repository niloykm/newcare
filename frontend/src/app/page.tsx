"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheck, Clock, Award, Users, Stethoscope, Heart,
  Baby, Activity, CheckCircle2, Video, Calendar, ArrowRight,
  Phone, FileCheck, ChevronDown, Check, Star, AlertCircle,
  Building, MapPin, Sparkles
} from "lucide-react";
import api from "@/lib/api";
import { FALLBACK_DOCTORS, DoctorProfile } from "@/data/doctorsData";
import DoctorCard from "@/components/DoctorCard";
import CareEstimatorWidget, { CARE_SERVICES } from "@/components/CareEstimatorWidget";

const FAQ_ITEMS = [
  {
    question: "How quickly can verified caregiver or nursing support arrive at our home?",
    answer: "For urgent situations (such as unplanned hospital discharge, family caregiver emergencies, or acute post-op needs), our RN Care Coordinators can dispatch a background-checked caregiver within 3 to 4 hours across Greater New York and the Tri-State area. Scheduled care plans can be reserved for any future date."
  },
  {
    question: "Can our family meet or interview the caregiver before care begins?",
    answer: "Yes. Once an optimal clinical match is identified based on your loved one’s mobility, language, and clinical requirements, we arrange a phone or video consultation with the caregiver and their supervisory Registered Nurse prior to shift commencement."
  },
  {
    question: "What happens if our assigned caregiver is sick or unavailable?",
    answer: "We guarantee 100% care continuity. We maintain a verified, on-call roster of credentialed nurses and aides briefed on your loved one's specific care plan to ensure zero missed shifts or service disruptions."
  },
  {
    question: "Are NewCare services covered by Long-Term Care Insurance (LTCI) or Medicare?",
    answer: "We supply itemized, CMS-1500 compliant clinical invoices designed for prompt Long-Term Care Insurance reimbursement. Our care coordination desk assists your family directly in submitting documentation and claims."
  },
  {
    question: "What is your cancellation and schedule adjustment policy?",
    answer: "We believe in high-trust relationships without hostage contracts. You may adjust hours or cancel services with 24 hours notice with zero penalties or hidden termination fees."
  },
  {
    question: "How do family members monitor daily shift activities, vitals, and medication?",
    answer: "Through the secure NewCare Family Portal on your phone or browser. Caregivers record electronic shift clock-ins, vitals logs (blood pressure, glucose, temperature), ADL completions, and clinical notes in real time."
  }
];

export default function Home() {
  const [featuredDoctors, setFeaturedDoctors] = useState<DoctorProfile[]>(FALLBACK_DOCTORS.slice(0, 4));
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data?.success && Array.isArray(res.data.doctors) && res.data.doctors.length > 0) {
          setFeaturedDoctors(res.data.doctors.slice(0, 4));
        }
      } catch {
        // Fallback data pre-populated
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 antialiased">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO & CLINICAL VALUE PROPOSITION
          Anchored Direct Value Proposition + Interactive Care Estimator
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-zinc-800 pt-8 pb-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Utility Value Proposition & Trust Anchors */}
            <div className="lg:col-span-6 space-y-5">
              {/* Clinical Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>100% Background-Checked Caregivers • Licensed Clinical RNs</span>
              </div>

              {/* Direct Utility-Driven Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.15]">
                Verified In-Home Care & Professional Nursing Support
              </h1>

              {/* Specific Subheadline: Exact Service Model, Availability & Rigor */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                Licensed nurses, certified dementia companions, and clinical recovery aides dispatched directly to your residence. Serving Greater New York & Tri-State with 24/7 on-call Registered Nurse supervision, strict Level-2 FBI vetting, and transparent hourly rates.
              </p>

              {/* Direct Dual Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <a
                  href="#services"
                  className="btn-primary text-sm font-semibold px-5 py-2.5 text-center"
                >
                  <span>Book Care Today</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
                <a
                  href="#safety"
                  className="btn-secondary text-sm font-semibold px-5 py-2.5 text-center"
                >
                  <span>How We Vet Caregivers</span>
                </a>
              </div>

              {/* Clinical Microcopy Guarantees */}
              <div className="pt-2 text-xs text-slate-500 dark:text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>On-demand dispatch available in under 4 hours for urgent discharge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Zero multi-month lock-in contracts • Cancel anytime with 24h notice</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Itemized clinical invoices for Long-Term Care Insurance reimbursement</span>
                </div>
              </div>
            </div>

            {/* Right Column: Real Concrete Interactive Care Estimator & Booking Preview */}
            <div className="lg:col-span-6">
              <CareEstimatorWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: TRUST BAR (Certifications, Vetting Stats, Metrics)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-neutral-900/40">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                metric: "100%",
                label: "FBI Background Cleared",
                subtext: "Fingerprint & OIG screening",
              },
              {
                metric: "< 4 Hours",
                label: "Urgent Dispatch Window",
                subtext: "Active across Greater NY",
              },
              {
                metric: "24/7",
                label: "Supervisory RN Coverage",
                subtext: "On-call clinical escalation",
              },
              {
                metric: "$2,000,000",
                label: "Liability & Bond Coverage",
                subtext: "W-2 bonded caregivers",
              },
            ].map(({ metric, label, subtext }) => (
              <div
                key={label}
                className="card p-3.5 sm:p-4 bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800"
              >
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50 tabular-nums">
                  {metric}
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                  {label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {subtext}
                </div>
              </div>
            ))}
          </div>

          {/* Compliance & Accreditations Pill Strip */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600 dark:text-zinc-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500 dark:text-zinc-400">
              Clinical Compliance Standards:
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-xs">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                State Licensed Home Care Services Agency (LHCSA) Compliant
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                HIPAA-Compliant Electronic Charting
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Joint Commission Aligned Clinical Guidelines
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CORE CARE SERVICES (Structured Cards & Rates)
      ───────────────────────────────────────────────────────────── */}
      <section id="services" className="py-12 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-neutral-900">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 mb-2">
                <span>Standardized Healthcare Solutions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                Core In-Home Care Services & Transparent Rates
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                Transparent itemized hourly pricing. Every care plan includes an in-home clinical intake, safety evaluation, and ongoing supervisory Registered Nurse oversight.
              </p>
            </div>
            <div className="shrink-0 text-xs font-medium text-slate-500 dark:text-zinc-400">
              <span>All rates guaranteed in writing • Zero surprise surcharges</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CARE_SERVICES.map((service) => (
              <div
                key={service.id}
                className="card p-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-zinc-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      {service.category}
                    </span>
                    <span className="badge-clinical badge-neutral text-xs tabular-nums">
                      {service.clinicians}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    <span className="block text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                      Clinical Protocols Included:
                    </span>
                    {service.protocols.map((proto) => (
                      <div key={proto} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{proto}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 tabular-nums">
                        ${service.hourlyRate}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400"> / hour</span>
                    </div>
                    {service.dailyLiveInRate && (
                      <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 tabular-nums">
                        or ${service.dailyLiveInRate}/24h shift
                      </span>
                    )}
                  </div>

                  <a
                    href="#hero"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="btn-secondary w-full text-xs font-semibold justify-center py-2"
                  >
                    <span>Configure in Estimator</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            ))}

            {/* Service 6: Board-Certified Physician Consultations Card */}
            <div className="card p-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-zinc-700 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                    Clinical Medicine
                  </span>
                  <span className="badge-clinical badge-neutral text-xs">
                    Attending MDs & DOs
                  </span>
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100 mb-2">
                  Physician Consults & Telehealth
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Direct appointments with board-certified physicians for clinical diagnosis, e-prescriptions, diagnostic lab orders, and specialist second opinions.
                </p>

                <div className="space-y-1.5 mb-5">
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                    Clinical Protocols Included:
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>BMDC & State Medical Board Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Encrypted HD Video or In-Clinic Visit</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instant Digital Health Pass Issued</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 tabular-nums">
                      $45 – $75
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400"> / consult</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Slots Open Today
                  </span>
                </div>

                <Link
                  href="/doctors"
                  className="btn-primary w-full text-xs font-semibold justify-center py-2"
                >
                  <span>Browse Specialist Registry</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: 3-STEP CARE COORDINATION PROCESS
      ───────────────────────────────────────────────────────────── */}
      <section id="process" className="py-12 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-neutral-900/60">
        <div className="container">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 mb-2">
              <span>Operational Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
              3-Step Care Coordination Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Structured protocol designed for zero clinical delay, maximum family alignment, and continuous oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Clinical Intake & Assessment",
                description: "Submit care parameters online or speak directly with an RN Care Coordinator. We review medical history, mobility restrictions, medication routines, and home safety needs to build an individualized Care Plan.",
                badge: "Within 15 Minutes",
              },
              {
                step: "02",
                title: "Specialized Caregiver Matching",
                description: "We match your family with a certified, background-screened caregiver whose clinical competencies, language fluency, and bedside manner precisely fit your loved one. Meet virtually before care begins.",
                badge: "Exact Competency Match",
              },
              {
                step: "03",
                title: "Supervised Care & Daily Logging",
                description: "Caregiver arrives on schedule. Shifts, vitals, nutrition, and care tasks are logged in real-time in the secure Family Portal. An on-call supervisory RN conducts regular check-ins and audits.",
                badge: "24/7 Portal Telemetry",
              },
            ].map(({ step, title, description, badge }) => (
              <div
                key={step}
                className="card p-5 bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800 relative"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                    STEP {step}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                    {badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mb-2">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: CAREGIVER QUALIFICATIONS & SAFETY STANDARDS
          Real Protocol Breakdowns, Not Generic Icons
      ───────────────────────────────────────────────────────────── */}
      <section id="safety" className="py-12 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-neutral-900">
        <div className="container">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Rigorous Clinical Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
              Caregiver Qualifications & Safety Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Only 4.8% of caregiver applicants meet NewCare’s clinical requirements. Here is how we verify, screen, and continually supervise every professional entering your home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Primary-Source License Validation",
                detail: "Every RN, LPN, and CNA license is validated directly against official state licensing boards. Continuous automated monitoring alerts our clinical director of any license disciplinary action.",
                check: "State Board Electronic Verification",
              },
              {
                title: "Level-2 Criminal & FBI Fingerprinting",
                detail: "Comprehensive background screening through FBI fingerprint databases, statewide criminal repositories, sex offender registries, and federal HHS/OIG exclusion lists.",
                check: "100% Negative Background Screened",
              },
              {
                title: "In-Person Clinical Competency Testing",
                detail: "Caregivers undergo hands-on practical skills examinations: aseptic sterile technique, patient transfer mechanics, CPR/BLS certification, and communicable disease screening (TB/vaccinations).",
                check: "Hands-on Clinical Skill Audits",
              },
              {
                title: "$2,000,000 Professional Liability & Bonding",
                detail: "Complete peace of mind. All caregivers are W-2 employed staff (not 1099 independent contractors), backed by comprehensive medical malpractice, general liability, and property theft bonding.",
                check: "Comprehensive Malpractice Coverage",
              },
              {
                title: "24/7 Supervisory RN Clinical Oversight",
                detail: "Field caregivers have immediate direct radio and phone access to an on-call supervisory Registered Nurse for acute condition changes, medication inquiries, and emergency escalation.",
                check: "Dedicated Nurse On-Call Roster",
              },
              {
                title: "Unannounced In-Home Quality Audits",
                detail: "Supervisory nurses conduct scheduled and random surprise visits to inspect patient charts, verify medication compliance, assess caregiver hygiene, and consult with the family.",
                check: "Continuous Field Accountability",
              },
            ].map(({ title, detail, check }) => (
              <div
                key={title}
                className="card p-4 sm:p-5 bg-slate-50/60 dark:bg-neutral-900/40 border-slate-200 dark:border-zinc-800"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{check}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: REVIEWS & CLINICAL FAQ
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-neutral-900/50">
        <div className="container">
          {/* Family Reviews Grid */}
          <div className="mb-12">
            <div className="max-w-2xl mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                Verified Patient & Family Experiences
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-0.5">
                Real feedback from families managing acute recovery, elder care, and chronic support across our service territory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  quote: "Following my mother’s total hip replacement, NewCare dispatched an orthopedic recovery CNA within 3 hours of her discharge. The caregiver's assistance with transfer techniques and daily incision notes gave our family complete confidence.",
                  name: "David M.",
                  relation: "Son & Family Caregiver",
                  location: "Upper East Side, Manhattan",
                  careType: "Post-Surgical Orthopedic Care",
                },
                {
                  quote: "Finding patient, dignified memory care for my father with moderate Alzheimer's was overwhelming. The assigned aide had specific dementia redirection training and handled sundowning routines with remarkable calm.",
                  name: "Sarah K.",
                  relation: "Daughter",
                  location: "Park Slope, Brooklyn",
                  careType: "Dementia Companion Care",
                },
                {
                  quote: "Having a pediatric Registered Nurse manage our daughter’s IV antibiotics and respiratory therapy at home prevented two additional weeks of hospital admission. The clinical coordination was flawless.",
                  name: "Michael & Lisa T.",
                  relation: "Parents",
                  location: "Astoria, Queens",
                  careType: "Skilled Pediatric Nursing",
                },
              ].map(({ quote, name, relation, location, careType }) => (
                <div
                  key={name}
                  className="card p-5 bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 ml-1.5">
                        Verified Family Client
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed mb-4 italic">
                      “{quote}”
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                      {name} — <span className="font-normal text-slate-500 dark:text-zinc-400">{relation}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      {location} • <span className="text-teal-700 dark:text-teal-400 font-medium">{careType}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                Frequently Asked Clinical Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                Clear answers regarding dispatch times, caregiver vetting, insurance reimbursement, and care coordination.
              </p>
            </div>

            <div className="space-y-2.5">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={item.question}
                    className="card bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-teal-600 dark:text-teal-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed border-t border-slate-100 dark:border-zinc-800 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: STICKY / HIGH-CONTRAST BOOKING CTA BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white dark:bg-black dark:text-zinc-100 border-y border-slate-800 py-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-950 text-teal-300 border border-teal-800 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span>24/7 Clinical Intake Desk Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
                Need Verified In-Home Care for a Loved One Today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Speak directly with an on-call Registered Nurse care coordinator right now. We review clinical requirements, verify local clinician availability, and can dispatch care within 4 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn-primary text-xs sm:text-sm font-semibold px-5 py-2.5 text-center bg-teal-500 hover:bg-teal-600 text-slate-950"
              >
                <span>Schedule Free Assessment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
              <a
                href="tel:18001234567"
                className="btn-secondary text-xs sm:text-sm font-semibold px-4 py-2.5 text-center bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                <Phone className="w-4 h-4 mr-1.5 text-teal-400" />
                <span>Call (800) 123-4567</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: INTEGRATED CLINICAL SPECIALIST DOCTORS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-zinc-800">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                  Featured Board-Certified Specialists
                </h2>
                <span className="badge-clinical badge-verified text-xs">
                  Active Schedules
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                Book in-clinic consultations or encrypted telehealth appointments with verified physicians
              </p>
            </div>
            <Link
              href="/doctors"
              className="btn-secondary text-xs sm:text-sm font-semibold self-start sm:self-auto"
            >
              <span>View Full Specialist Registry</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id || doctor._id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
