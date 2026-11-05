"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please complete all required fields");
      return;
    }
    setSent(true);
    toast.success("Support inquiry submitted. Ticket #NC-9421 created.");
  };

  const contactInfo = [
    { icon: Mail, label: "Clinical Inquiries & Support", value: "support@newcare.health" },
    { icon: Phone, label: "Patient Helpline", value: "+1 (800) 123-4567" },
    { icon: MapPin, label: "Central Administrative Campus", value: "42 Health Plaza, New York, NY 10001" },
    { icon: Clock, label: "Care Coordination Desk", value: "Mon–Fri: 8:00 AM – 7:00 PM EST" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-16">
      {/* Header Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-10 sm:py-12">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-2">
            <span>Patient & Physician Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
            Contact Clinical Support
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Have questions regarding appointment synchronization, clinical onboarding, or digital passes? Our support coordination team is available daily.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details Column */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Department Coordinates
            </h2>

            <div className="flex flex-col gap-3">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="card p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
              Send Support Message
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
              Standard response turnaround is within 2 clinical hours.
            </p>

            {sent ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Message Dispatched
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Ticket reference #NC-9421 logged. A care coordinator will reach out shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="btn-secondary text-xs px-3 py-1.5 mt-2"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                    placeholder="e.g. Dr. Jane Miller / Patient Name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Subject / Concern
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input"
                    placeholder="e.g. Appointment rescheduling or physician verification"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="input resize-y"
                    placeholder="Please include relevant booking IDs or doctor names..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 text-xs sm:text-sm font-semibold rounded-lg"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
