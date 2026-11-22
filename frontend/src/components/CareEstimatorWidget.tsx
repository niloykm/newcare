"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, CheckCircle2, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  CARE_SERVICES,
  FREQUENCY_OPTIONS,
  SERVICE_REGIONS,
  SHIFT_OPTIONS,
} from "@/lib/careData";
import {
  FieldErrors,
  validateOptionalEmail,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";

export { CARE_SERVICES } from "@/lib/careData";

interface CareEstimatorWidgetProps {
  selectedServiceId?: string;
  onServiceChange?: (serviceId: string) => void;
}

interface AssessmentFormData {
  patientName: string;
  relationship: string;
  phone: string;
  email: string;
  startDate: string;
  notes: string;
}

type AssessmentField = "patientName" | "phone" | "email";

export default function CareEstimatorWidget({
  selectedServiceId: controlledServiceId,
  onServiceChange,
}: CareEstimatorWidgetProps) {
  const [internalServiceId, setInternalServiceId] = useState<string>("skilled-nursing");
  const selectedServiceId = controlledServiceId ?? internalServiceId;

  const [selectedShiftId, setSelectedShiftId] = useState<string>("8h");
  const [selectedFreqId, setSelectedFreqId] = useState<string>("5x");
  const [selectedZip, setSelectedZip] = useState<string>("10001");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors<AssessmentField>>({});

  const [formData, setFormData] = useState<AssessmentFormData>({
    patientName: "",
    relationship: "Parent",
    phone: "",
    email: "",
    startDate: "Within 24 Hours",
    notes: "",
  });

  const handleServiceSelect = (id: string) => {
    setInternalServiceId(id);
    onServiceChange?.(id);
  };

  const currentService =
    CARE_SERVICES.find((s) => s.id === selectedServiceId) || CARE_SERVICES[0];
  const currentShift =
    SHIFT_OPTIONS.find((s) => s.id === selectedShiftId) || SHIFT_OPTIONS[1];
  const currentFreq =
    FREQUENCY_OPTIONS.find((f) => f.id === selectedFreqId) || FREQUENCY_OPTIONS[2];
  const currentRegion =
    SERVICE_REGIONS.find((r) => r.zip === selectedZip) || SERVICE_REGIONS[0];

  const isLiveIn = Boolean(currentShift.isLiveIn);
  const shiftCost = isLiveIn
    ? currentService.dailyLiveInRate || 340
    : currentService.hourlyRate * currentShift.hours;
  const estimatedWeeklyTotal = shiftCost * currentFreq.multiplier;

  const handleOpenAssessment = () => {
    setErrors({});
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: FieldErrors<AssessmentField> = {
      patientName: validateRequiredText(formData.patientName, "Care recipient name"),
      phone: validatePhone(formData.phone),
      email: validateOptionalEmail(formData.email),
    };

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setErrors(nextErrors);
      toast.error("Please review the highlighted fields.");
      return;
    }

    setErrors({});
    const code = `NC-CARE-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationCode(code);
    setIsSubmitted(true);
    toast.success(`Assessment request logged (${code}).`);
  };

  return (
    <div className="card p-6 sm:p-7">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Care Cost Estimator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Configure service level, shift length, and weekly schedule for an immediate written rate.
          </p>
        </div>
        <span className="text-xs font-medium text-teal-700 dark:text-teal-400 tabular-nums shrink-0">
          {currentRegion.availableCount} clinicians in {currentRegion.zip}
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
        <div>
          <label
            htmlFor="care-service-select"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            1. Care Level
          </label>
          <select
            id="care-service-select"
            value={selectedServiceId}
            onChange={(e) => handleServiceSelect(e.target.value)}
            className="input cursor-pointer font-medium"
          >
            {CARE_SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (${s.hourlyRate}/hr)
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Staffed by {currentService.clinicians}
          </p>
        </div>

        <div>
          <label
            htmlFor="care-region-select"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            2. Service Area
          </label>
          <select
            id="care-region-select"
            value={selectedZip}
            onChange={(e) => setSelectedZip(e.target.value)}
            className="input cursor-pointer font-medium"
          >
            {SERVICE_REGIONS.map((r) => (
              <option key={r.zip} value={r.zip}>
                {r.name} — {r.dispatchWindow} dispatch
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            In-home RN intake included for this zone
          </p>
        </div>

        {/* Shift Length */}
        <fieldset>
          <legend className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            3. Shift Length
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {SHIFT_OPTIONS.map((opt) => {
              const active = selectedShiftId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedShiftId(opt.id)}
                  className={`min-h-[44px] px-3 py-2 rounded-md text-xs font-semibold border text-center transition-colors duration-200 cursor-pointer ${
                    active
                      ? "bg-teal-700 dark:bg-teal-500 text-white dark:text-slate-950 border-teal-700 dark:border-teal-500"
                      : "bg-white dark:bg-[#11161d] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Weekly Frequency */}
        <fieldset>
          <legend className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            4. Weekly Frequency
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCY_OPTIONS.map((freq) => {
              const active = selectedFreqId === freq.id;
              return (
                <button
                  key={freq.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedFreqId(freq.id)}
                  className={`min-h-[44px] px-3 py-2 rounded-md text-xs font-semibold border text-center transition-colors duration-200 cursor-pointer ${
                    active
                      ? "bg-teal-700 dark:bg-teal-500 text-white dark:text-slate-950 border-teal-700 dark:border-teal-500"
                      : "bg-white dark:bg-[#11161d] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                >
                  {freq.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Estimate Summary */}
      <div className="mt-6 p-4 sm:p-5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              Estimated Rate
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-1">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
                ${shiftCost}
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                per {isLiveIn ? "24h live-in day" : `${currentShift.hours}-hour shift`}
              </span>
            </div>
            {currentFreq.multiplier > 1 && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 tabular-nums">
                ${estimatedWeeklyTotal.toLocaleString()}/wk · {currentFreq.multiplier} shifts
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenAssessment}
              className="btn-primary text-sm px-4"
            >
              <span>Request RN Assessment</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <Link href="/contact" className="btn-secondary text-sm px-3.5">
              Contact Desk
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
            Written rate confirmed before shift start
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
            24h notice schedule changes
          </span>
        </div>
      </div>

      {/* Accessible Radix Dialog for Assessment Intake */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-[#11161d] border border-slate-200 dark:border-slate-800 shadow-lg focus:outline-none">
            <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <Dialog.Title className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {isSubmitted
                      ? "Assessment Request Logged"
                      : "Request Complimentary RN Assessment"}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {isSubmitted
                      ? "Your intake summary has been routed to our care coordination desk."
                      : "No obligation. A Registered Nurse will review your schedule and care plan."}
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close dialog"
                  className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            {isSubmitted ? (
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                  <span className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Reference: <span className="font-mono">{confirmationCode}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      An RN coordinator will contact {formData.phone} to confirm clinician matching.
                    </p>
                  </div>
                </div>

                <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-sm border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500 dark:text-slate-400">Care Recipient</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-100">{formData.patientName}</dd>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500 dark:text-slate-400">Service</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-100 text-right">
                      {currentService.name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500 dark:text-slate-400">Location</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-100">{currentRegion.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500 dark:text-slate-400">Estimated Shift Rate</dt>
                    <dd className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      ${shiftCost} / {isLiveIn ? "24h" : `${currentShift.hours}h`}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-primary w-full"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate className="p-5 space-y-4">
                <div>
                  <label
                    htmlFor="patient-name-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Care Recipient Full Name *
                  </label>
                  <input
                    id="patient-name-input"
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={formData.patientName}
                    onChange={(e) => {
                      setFormData({ ...formData, patientName: e.target.value });
                      if (errors.patientName) setErrors({ ...errors, patientName: undefined });
                    }}
                    aria-invalid={Boolean(errors.patientName)}
                    aria-describedby={errors.patientName ? "patient-name-error" : undefined}
                    className="input"
                  />
                  {errors.patientName && (
                    <p id="patient-name-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                      {errors.patientName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="relationship-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Relationship
                    </label>
                    <select
                      id="relationship-select"
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="input cursor-pointer"
                    >
                      <option value="Self">Self</option>
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Discharge Planner">Hospital Discharge Planner</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="phone-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Callback Phone *
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      placeholder="(212) 555-0192"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className="input"
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="email-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Email (Optional)
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      placeholder="family@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="input"
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-700 dark:text-red-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="start-date-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Target Start
                    </label>
                    <select
                      id="start-date-select"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="input cursor-pointer"
                    >
                      <option value="Urgent (Same Day)">Urgent (Same Day)</option>
                      <option value="Within 24 Hours">Within 24 Hours</option>
                      <option value="Within 3 Days">Within 3 Days</option>
                      <option value="Next Week">Next Week</option>
                      <option value="Post-Hospital Discharge">Post-Hospital Discharge</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="clinical-notes-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Clinical Notes (Optional)
                  </label>
                  <textarea
                    id="clinical-notes-input"
                    rows={2}
                    placeholder="Mobility aids, discharge date, medication schedule, or language preference..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input py-2 resize-y"
                  />
                </div>

                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {currentService.name} — {currentRegion.name}
                  </p>
                  <p className="mt-0.5 tabular-nums">
                    Estimated rate: ${shiftCost} per shift ({currentShift.label}, {currentFreq.label}).
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Dialog.Close asChild>
                    <button type="button" className="btn-secondary">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button type="submit" className="btn-primary">
                    Submit Care Request
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
