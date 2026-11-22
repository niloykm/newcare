"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  FieldErrors,
  validateEmail,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";

type ContactField = "name" | "email" | "phone" | "message";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [errors, setErrors] = useState<FieldErrors<ContactField>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Skilled Nursing (RN / LPN)",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: FieldErrors<ContactField> = {
      name: validateRequiredText(form.name, "Full name"),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      message: validateRequiredText(form.message, "Care details", 10),
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      toast.error("Please review the highlighted fields.");
      return;
    }

    setErrors({});
    const code = `NC-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(code);
    setSent(true);
    toast.success(`Care inquiry logged (${code}).`);
  };

  const contactDetails = [
    {
      icon: Mail,
      label: "Care Coordination & Intake",
      value: "intake@newcare.health",
      sub: "RN intake review and Long-Term Care Insurance support",
    },
    {
      icon: MapPin,
      label: "Regional Coordination Office",
      value: "Midtown East, Manhattan, NY 10017",
      sub: "Serving NYC boroughs, Hudson County NJ, and Nassau County",
    },
    {
      icon: Clock,
      label: "Clinical Intake Coverage",
      value: "Daily RN Triage & Scheduling",
      sub: "Same-day coordination for urgent hospital discharges",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 pb-20">
      <section className="bg-white dark:bg-[#11161d] border-b border-slate-200 dark:border-slate-800 py-14 md:py-16">
        <div className="container max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
            Care Coordination Desk
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-3">
            Contact Clinical Intake
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Request an RN callback for in-home nursing, dementia care, post-surgical
            support, or Long-Term Care Insurance invoicing questions.
          </p>
        </div>
      </section>

      <section className="container max-w-4xl pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Coordinates */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Coordination Office
            </h2>
            <div className="space-y-3">
              {contactDetails.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="card p-4 flex items-start gap-3">
                  <span className="w-9 h-9 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                      {value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
              For life-threatening medical emergencies, please call 911 or go to the
              nearest emergency department immediately.
            </p>
          </div>

          {/* Intake Form */}
          <div className="md:col-span-7 card p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
              Request RN Callback or Care Plan Review
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Share your timeline and care requirements; an RN coordinator will follow up promptly.
            </p>

            {sent ? (
              <div className="p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center space-y-3">
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
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                    <p id="contact-name-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                      {errors.name}
                    </p>
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
                      <p id="contact-email-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                        {errors.email}
                      </p>
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
                      placeholder="(212) 555-0192"
                    />
                    {errors.phone && (
                      <p id="contact-phone-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                        {errors.phone}
                      </p>
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

                <div>
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
                    className="input py-2 resize-y"
                    placeholder="Share patient care needs, borough/ZIP code, and preferred start timeline..."
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Submit Care Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
