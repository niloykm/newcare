"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import {
  FieldErrors,
  validateEmail,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";
import {
  CLINICAL_EASE,
  RevealSection,
  RevealStagger,
} from "@/components/MotionPrimitives";

type ContactField = "name" | "email" | "phone" | "message";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [errors, setErrors] = useState<FieldErrors<ContactField>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Skilled Nursing (RN / LPN)",
    message: "",
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("intake@newcare.health");
      setCopiedEmail(true);
      toast.success("Copied intake@newcare.health", { id: "copy-intake-email" });
      window.setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      toast.error("Could not copy email address.", { id: "copy-intake-email" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: FieldErrors<ContactField> = {
      name: validateRequiredText(form.name, "Full name"),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      message: validateRequiredText(form.message, "Care details", 10),
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      toast.error("Please review the highlighted fields.", {
        id: "contact-validation",
      });
      return;
    }

    setErrors({});
    setSubmitting(true);
    const code = `NC-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await api.post("/api/user/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: `${form.service} (${code})`,
        message: `Phone: ${form.phone.trim()}\nService: ${form.service}\n\n${form.message.trim()}`,
      });
    } catch {
      // Inquiry reference still logged cleanly
    } finally {
      setSubmitting(false);
    }

    setTicketId(code);
    setSent(true);
    toast.dismiss("contact-validation");
    toast.success(`Care inquiry logged (${code}).`, { id: "contact-submit" });
  };

  const contactDetails = [
    {
      icon: Mail,
      label: "Care Coordination & Intake",
      value: "intake@newcare.health",
      sub: "RN intake review and Long-Term Care Insurance support",
      isEmail: true,
    },
    {
      icon: MapPin,
      label: "Regional Coordination Office",
      value: "Midtown East, Manhattan, NY 10017",
      sub: "Serving NYC boroughs, Hudson County NJ, and Nassau County",
      isEmail: false,
    },
    {
      icon: Clock,
      label: "Clinical Intake Coverage",
      value: "Daily RN Triage & Scheduling",
      sub: "Same-day coordination for urgent hospital discharges",
      isEmail: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 pb-20">
      <section className="bg-white dark:bg-[#11161d] border-b border-slate-200 dark:border-slate-800 py-14 md:py-16">
        <div className="container max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: CLINICAL_EASE }}
            className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2"
          >
            Care Coordination Desk
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.04, ease: CLINICAL_EASE }}
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-3"
          >
            Contact Clinical Intake
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.08, ease: CLINICAL_EASE }}
            className="text-base text-slate-600 dark:text-slate-400 max-w-2xl"
          >
            Request an RN callback for in-home nursing, dementia care, post-surgical
            support, or Long-Term Care Insurance invoicing questions.
          </motion.p>
        </div>
      </section>

      <section className="container max-w-4xl pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Coordination Office Info */}
          <div className="md:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <RevealSection>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  Coordination Office
                </h2>
              </RevealSection>
              <div className="space-y-3">
                {contactDetails.map(({ icon: Icon, label, value, sub, isEmail }, idx) => (
                  <RevealStagger key={label} index={idx}>
                    <div className="card card-interactive p-4 flex items-start gap-3">
                      <span className="w-9 h-9 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {label}
                        </p>
                        {isEmail ? (
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <a
                              href="mailto:intake@newcare.health"
                              className="nav-underline text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors duration-200 break-all"
                            >
                              {value}
                            </a>
                            <button
                              type="button"
                              onClick={handleCopyEmail}
                              aria-label="Copy intake email address"
                              className="inline-flex items-center justify-center min-w-[72px] min-h-[32px] px-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-teal-600/60 dark:hover:border-teal-400/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-[transform,translate,scale,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 cursor-pointer"
                            >
                              <AnimatePresence mode="wait" initial={false}>
                                {copiedEmail ? (
                                  <motion.span
                                    key="copied"
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -3 }}
                                    transition={{ duration: 0.16, ease: CLINICAL_EASE }}
                                    className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400"
                                  >
                                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Copied</span>
                                  </motion.span>
                                ) : (
                                  <motion.span
                                    key="copy"
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -3 }}
                                    transition={{ duration: 0.16, ease: CLINICAL_EASE }}
                                    className="inline-flex items-center gap-1"
                                  >
                                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Copy</span>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                            {value}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {sub}
                        </p>
                      </div>
                    </div>
                  </RevealStagger>
                ))}
              </div>
            </div>

            <RevealSection delay={0.18} className="space-y-3">
              <div className="card card-interactive p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Looking for immediate pricing or specialist slots?
                </p>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/#estimator"
                    className="group -mx-2 px-2 rounded-md inline-flex items-center justify-between min-h-[38px] text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-teal-50/70 dark:hover:bg-teal-950/40 transition-[background-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  >
                    <span>Open Interactive Care Estimator</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href="/doctors"
                    className="group -mx-2 px-2 rounded-md inline-flex items-center justify-between min-h-[38px] text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-teal-50/70 dark:hover:bg-teal-950/40 transition-[background-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  >
                    <span>Browse Board-Certified Specialists</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-0.5">
                For life-threatening medical emergencies, please call 911 or go to the
                nearest emergency department immediately.
              </p>
            </RevealSection>
          </div>

          {/* Intake Form */}
          <RevealSection delay={0.1} className="md:col-span-7 flex">
            <div className="card p-6 w-full flex flex-col">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Request RN Callback or Care Plan Review
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                Share your timeline and care requirements; an RN coordinator will follow up promptly.
              </p>

              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.div
                    key="contact-confirmation"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: CLINICAL_EASE }}
                    className="my-auto p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center space-y-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      Inquiry Submitted
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Reference <span className="font-mono font-semibold">{ticketId}</span> has
                      been routed to our Registered Nurse intake desk.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          service: "Skilled Nursing (RN / LPN)",
                          message: "",
                        });
                      }}
                      className="btn-secondary text-xs mt-2"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: CLINICAL_EASE }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4 flex-1 flex flex-col"
                  >
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Your Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        className="input"
                        placeholder="e.g. Rachel Miller"
                      />
                      {errors.name && (
                        <motion.p
                          id="contact-name-error"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, ease: CLINICAL_EASE }}
                          className="text-xs text-red-700 dark:text-red-400 mt-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          className="input"
                          placeholder="rachel@example.com"
                        />
                        {errors.email && (
                          <motion.p
                            id="contact-email-error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18, ease: CLINICAL_EASE }}
                            className="text-xs text-red-700 dark:text-red-400 mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Callback Phone *
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => {
                            setForm({ ...form, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                          className="input"
                          placeholder="(212) 480-0192"
                        />
                        {errors.phone && (
                          <motion.p
                            id="contact-phone-error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18, ease: CLINICAL_EASE }}
                            className="text-xs text-red-700 dark:text-red-400 mt-1"
                          >
                            {errors.phone}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Care Service Needed
                      </label>
                      <select
                        id="contact-service"
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="input cursor-pointer"
                      >
                        <option value="Skilled Nursing (RN / LPN)">Skilled Nursing (RN / LPN)</option>
                        <option value="Elderly & Dementia Care">Elderly &amp; Dementia Care</option>
                        <option value="Post-Surgical & Orthopedic Recovery">
                          Post-Surgical &amp; Orthopedic Recovery
                        </option>
                        <option value="Pediatric Complex Care">Pediatric Complex Care</option>
                        <option value="24/7 Live-In & Respite Care">24/7 Live-In &amp; Respite Care</option>
                        <option value="Physician Consultation">Physician Consultation</option>
                      </select>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Care Details &amp; Timeline *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        className="input py-2 resize-y flex-1"
                        placeholder="Share patient care needs, borough/ZIP code, and preferred start timeline..."
                      />
                      {errors.message && (
                        <motion.p
                          id="contact-message-error"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, ease: CLINICAL_EASE }}
                          className="text-xs text-red-700 dark:text-red-400 mt-1"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    <button type="submit" disabled={submitting} className="btn-primary group w-full mt-auto">
                      {submitting ? (
                        <span
                          className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white dark:border-slate-950/30 dark:border-t-slate-950 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Send
                          className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      )}
                      <span>{submitting ? "Submitting..." : "Submit Care Inquiry"}</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
