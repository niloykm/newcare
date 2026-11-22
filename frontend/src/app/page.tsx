"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import {
  ApiDoctorRecord,
  DoctorProfile,
  FALLBACK_DOCTORS,
  normalizeApiDoctor,
  selectFeaturedDoctors,
} from "@/data/doctorsData";
import {
  CARE_SERVICES,
  CARE_WORKFLOW_STEPS,
  CLINICAL_FAQS,
  VETTING_STANDARDS,
} from "@/lib/careData";
import DoctorCard from "@/components/DoctorCard";
import CareEstimatorWidget from "@/components/CareEstimatorWidget";
import {
  CLINICAL_EASE,
  RevealSection,
  RevealStagger,
} from "@/components/MotionPrimitives";

export default function Home() {
  const [featuredDoctors, setFeaturedDoctors] = useState<DoctorProfile[]>(
    FALLBACK_DOCTORS.slice(0, 4)
  );
  const [totalDoctorsCount, setTotalDoctorsCount] = useState<number>(FALLBACK_DOCTORS.length);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("skilled-nursing");
  const [openFaqId, setOpenFaqId] = useState<string | null>(CLINICAL_FAQS[0].id);
  const [estimatorHighlighted, setEstimatorHighlighted] = useState(false);

  useEffect(() => {
    let highlightTimer: number | undefined;

    const triggerEstimatorHighlight = () => {
      setEstimatorHighlighted(true);
      const selectEl = document.getElementById("care-service-select");
      if (selectEl instanceof HTMLElement) {
        selectEl.focus({ preventScroll: true });
      }
      window.clearTimeout(highlightTimer);
      highlightTimer = window.setTimeout(() => setEstimatorHighlighted(false), 1400);
    };

    const handleHashOnLoad = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const target = document.getElementById(hash);
      if (target) {
        window.requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (hash === "estimator") {
            triggerEstimatorHighlight();
          }
        });
      }
    };

    handleHashOnLoad();
    window.addEventListener("newcare:focus-estimator", triggerEstimatorHighlight);
    return () => {
      window.clearTimeout(highlightTimer);
      window.removeEventListener("newcare:focus-estimator", triggerEstimatorHighlight);
    };
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get<{ success?: boolean; doctors?: ApiDoctorRecord[] }>(
          "/api/doctor/list"
        );
        if (res.data?.success && Array.isArray(res.data.doctors) && res.data.doctors.length > 0) {
          const normalized = res.data.doctors.map((raw, idx) => {
            const match =
              FALLBACK_DOCTORS.find((f) => f.id === raw._id || f.id === raw.id) ||
              FALLBACK_DOCTORS[idx % FALLBACK_DOCTORS.length];
            return normalizeApiDoctor(raw, match);
          });
          setTotalDoctorsCount(normalized.length);
          setFeaturedDoctors(selectFeaturedDoctors(normalized, 4));
        }
      } catch {
        // Fallback verified doctors remain active
      }
    };
    fetchDoctors();
  }, []);

  const handleSelectServiceForEstimator = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    window.history.replaceState(null, "", "/#estimator");
    const el = document.getElementById("estimator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.dispatchEvent(new CustomEvent("newcare:focus-estimator"));
  };

  const handleViewCareRates = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.replaceState(null, "", "/#services");
    const el = document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100">
      {/* 1. Focused Hero + Streamlined Interactive Care Estimator */}
      <section className="bg-white dark:bg-[#11161d] border-b border-slate-200 dark:border-slate-800 py-14 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-6 lg:pt-2">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: CLINICAL_EASE }}
                className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400"
              >
                Greater New York &amp; Tri-State Home Care
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.04, ease: CLINICAL_EASE }}
                className="text-3xl sm:text-4xl lg:text-[2.65rem] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15]"
              >
                In-home nursing and specialist care, coordinated by RNs
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.08, ease: CLINICAL_EASE }}
                className="text-base text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                Licensed nurses, certified caregivers, and board-certified physicians
                working from one shared care plan. Transparent hourly rates, W-2 vetted
                staff, and RN oversight without lock-in contracts.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.12, ease: CLINICAL_EASE }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
              >
                <a
                  href="#services"
                  onClick={handleViewCareRates}
                  className="group btn-primary px-5"
                >
                  <span>View Care Rates</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
                <Link href="/doctors" className="btn-secondary px-5">
                  Browse Specialists
                </Link>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.16, ease: CLINICAL_EASE }}
                className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-sm text-slate-600 dark:text-slate-300"
              >
                <li className="flex items-start gap-2.5">
                  <Check
                    className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>Same-day urgent dispatch in 3–4 hours across Greater NY</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>NYS primary-source license &amp; federal background screening</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>Itemized CMS-1500 invoices for Long-Term Care Insurance</span>
                </li>
              </motion.ul>
            </div>

            <motion.div
              id="estimator"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: 0.1, ease: CLINICAL_EASE }}
              className={`lg:col-span-7 scroll-mt-24 rounded-lg transition-shadow duration-200 ${
                estimatorHighlighted
                  ? "ring-2 ring-teal-700/40 dark:ring-teal-400/50 ring-offset-2 ring-offset-white dark:ring-offset-[#11161d]"
                  : ""
              }`}
            >
              <CareEstimatorWidget
                selectedServiceId={selectedServiceId}
                onServiceChange={setSelectedServiceId}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Core Services & Transparent Pricing */}
      <section
        id="services"
        className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800 scroll-mt-24"
      >
        <div className="container">
          <RevealSection className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
              Services &amp; Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Transparent hourly care and physician visits
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Every in-home plan includes an RN clinical intake, written care schedule,
              and Family Portal shift charting with zero surprise fees.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARE_SERVICES.map((service, idx) => (
              <RevealStagger key={service.id} index={idx} className="flex">
                <div className="card card-interactive p-6 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-3">
                      <span className="font-semibold text-teal-700 dark:text-teal-400">
                        {service.category}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {service.clinicians}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-300">
                      {service.protocols.map((proto) => (
                        <li key={proto} className="flex items-start gap-2">
                          <Check
                            className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{proto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-baseline justify-between gap-2 mb-4">
                      <div>
                        <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
                          ${service.hourlyRate}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {" "}
                          / hour
                        </span>
                      </div>
                      {service.dailyLiveInRate && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          ${service.dailyLiveInRate}/24h live-in
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectServiceForEstimator(service.id)}
                      className="group btn-secondary w-full text-sm"
                    >
                      <span>Estimate This Care</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </RevealStagger>
            ))}

            {/* 6th Card: Board-Certified Physician Consultations */}
            <RevealStagger index={CARE_SERVICES.length} className="flex">
              <div className="card card-interactive p-6 flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span className="font-semibold text-teal-700 dark:text-teal-400">
                      Specialist Medicine
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ABMS Board-Certified MDs &amp; DOs
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
                    Physician Consults &amp; Telehealth
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                    Direct in-clinic or video appointments for diagnosis, discharge
                    follow-ups, prescriptions, and specialist care plans.
                  </p>

                  <ul className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check
                        className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>NY State Medical License &amp; ABMS verified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>Encrypted HD telehealth or Manhattan clinic visit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check
                        className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>Synchronized with your NewCare Patient Portal</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline justify-between gap-2 mb-4">
                    <div>
                      <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
                        $45–$85
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {" "}
                        / visit
                      </span>
                    </div>
                    <span className="text-xs font-medium text-teal-700 dark:text-teal-400">
                      Same-day slots
                    </span>
                  </div>

                  <Link href="/doctors" className="group btn-primary w-full text-sm">
                    <span>Browse Specialists</span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </RevealStagger>
          </div>
        </div>
      </section>

      {/* 3. Consolidated Care Process & Clinical Safety Standards */}
      <section
        id="standards"
        className="bg-white dark:bg-[#11161d] py-16 md:py-24 border-b border-slate-200 dark:border-slate-800 scroll-mt-24"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: 3-Step Workflow */}
            <RevealSection className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
                How Care Starts
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-8">
                A clear clinical process from intake to daily oversight
              </h2>

              <ol className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800">
                {CARE_WORKFLOW_STEPS.map((item) => (
                  <li
                    key={item.step}
                    className="py-6 px-3 -mx-3 rounded-lg flex items-start gap-4 transition-[transform,translate,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:translate-x-1"
                  >
                    <span className="font-mono text-sm font-semibold text-teal-700 dark:text-teal-400 tabular-nums pt-0.5 shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                          {item.title}
                        </h3>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.timeline}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </RevealSection>

            {/* Right: Clinical Vetting & Safety Ledger */}
            <RevealSection delay={0.1} className="lg:col-span-6">
              <div className="card card-interactive rounded-lg bg-slate-50 dark:bg-[#0b0f14] p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-2">
                  <ShieldCheck
                    className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0"
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Caregiver Vetting &amp; Clinical Governance
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Every clinician completes primary-source verification and hands-on skills
                  review prior to household placement.
                </p>

                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {VETTING_STANDARDS.map((item) => (
                    <li key={item.label} className="py-3.5 first:pt-0 last:pb-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {item.detail}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors duration-200"
                  >
                    <span>Read full clinical governance standards</span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 4. Featured Board-Certified Specialists */}
      <section className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="container">
          <RevealSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
                Physician Network
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Featured Board-Certified Specialists
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1.5">
                Book an in-clinic appointment or telehealth consultation directly with NY-licensed physicians.
              </p>
            </div>

            <Link
              href="/doctors"
              className="group btn-secondary text-sm self-start sm:self-auto shrink-0"
            >
              <span className="tabular-nums">View All {totalDoctorsCount} Specialists</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {featuredDoctors.map((doctor, idx) => (
              <RevealStagger key={doctor.id || doctor._id} index={idx}>
                <DoctorCard doctor={doctor} />
              </RevealStagger>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Clinical FAQ & Direct Intake Link */}
      <section className="bg-white dark:bg-[#11161d] py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <RevealSection className="lg:col-span-4 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Common Questions
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Clear answers before care begins
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Need help planning a hospital discharge or verifying Long-Term Care
                Insurance paperwork? Reach our RN coordination desk directly.
              </p>
              <div className="pt-1">
                <Link href="/contact" className="group btn-secondary text-sm">
                  <span>Contact Care Coordination</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </RevealSection>

            <RevealSection delay={0.08} className="lg:col-span-8 divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {CLINICAL_FAQS.map((item) => {
                const isOpen = openFaqId === item.id;
                const panelId = `faq-panel-${item.id}`;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full py-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-teal-700 dark:hover:text-teal-400 transition-colors duration-200 cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-slate-500 transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isOpen ? "rotate-180 text-teal-700 dark:text-teal-400" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key={panelId}
                          id={panelId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: CLINICAL_EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-8">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
}
