"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "Skilled Nursing", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please complete all required fields");
      return;
    }
    setSent(true);
    toast.success("Care inquiry submitted. Intake Ticket #NC-9421 created.");
  };

  const contactInfo = [
    { icon: Phone, label: "24/7 Urgent Care & Nurse Dispatch", value: "+1 (800) 123-4567", sub: "Immediate on-call triage < 2 min" },
    { icon: Mail, label: "Care Coordination & Clinical Intake", value: "intake@newcare.health", sub: "Same-day response guaranteed" },
    { icon: MapPin, label: "Metropolitan Care Coordination Desk", value: "42 Health Plaza, Manhattan, NY 10001", sub: "Covering Greater NY & Tri-State" },
    { icon: Clock, label: "Administration & Assessment Hours", value: "Available 24/7 / 365 Days", sub: "Round-the-clock clinical supervisor on duty" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-16">
      {/* Header Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-zinc-800 py-10 sm:py-12">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>24/7 Clinical Care Coordination Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50 mb-2">
            Contact In-Home Care Intake
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
            Need urgent caregiver dispatch, an in-home clinical evaluation, or assistance with Long-Term Care Insurance reimbursement? Our clinical coordinators are on duty 24/7.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details Column */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
              Direct Clinical Coordinates
            </h2>

            <div className="flex flex-col gap-3">
              {contactInfo.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="card p-3.5 bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
                    <Icon className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
                      {value}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="card p-5 sm:p-6 bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800">
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-50 mb-1">
              Submit Care Inquiry
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5">
              Standard clinical response turnaround is within 15 minutes.
            </p>

            {sent ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Care Inquiry Dispatched
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Intake ticket #NC-9421 logged. A registered nurse care coordinator will call you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", phone: "", service: "Skilled Nursing", message: "" });
                  }}
                  className="btn-secondary text-xs px-3 py-1.5 mt-2"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input text-xs"
                    placeholder="e.g. Rachel Miller"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input text-xs"
                      placeholder="rachel@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input text-xs"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Care Service Needed
                  </label>
                  <select
                    id="service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="input text-xs cursor-pointer"
                  >
                    <option value="Skilled Nursing">Skilled Clinical Nursing (RN/LPN)</option>
                    <option value="Elderly Companion">Elderly & Dementia Care</option>
                    <option value="Post-Surgical">Post-Surgical & Orthopedic Recovery</option>
                    <option value="Pediatric">Pediatric Complex Care</option>
                    <option value="24/7 Live-In">24/7 Live-In Care</option>
                    <option value="Physician Consult">Physician Consultation</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Care Details or Inquiries *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input text-xs py-2"
                    placeholder="Describe patient condition, preferred start timeline, or any mobility considerations..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-xs font-semibold py-2"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Submit to Care Coordination</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
