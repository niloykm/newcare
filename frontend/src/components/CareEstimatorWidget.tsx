"use client";

import { useState } from "react";
import {
  ShieldCheck, Clock, CheckCircle2, Phone, Calendar,
  Activity, ArrowRight, UserCheck, AlertCircle, X, Check
} from "lucide-react";
import toast from "react-hot-toast";

export interface CareServiceOption {
  id: string;
  name: string;
  category: string;
  hourlyRate: number;
  dailyLiveInRate?: number;
  description: string;
  clinicians: string;
  protocols: string[];
}

export const CARE_SERVICES: CareServiceOption[] = [
  {
    id: "skilled-nursing",
    name: "Skilled Nursing (RN / LPN)",
    category: "Clinical Care",
    hourlyRate: 48,
    dailyLiveInRate: 490,
    description: "Post-op wound management, IV therapy, vitals monitoring, medication administration, catheter care.",
    clinicians: "Licensed RNs & LPNs",
    protocols: ["Sterile Aseptic Dressing", "Physician Medication Protocol", "Real-Time Vitals Charting"],
  },
  {
    id: "elderly-dementia",
    name: "Elderly & Dementia Companion Care",
    category: "Daily Living Assistance",
    hourlyRate: 32,
    dailyLiveInRate: 340,
    description: "Personal care & ADLs, dementia safety routines, fall prevention, meal prep, mobility transfer.",
    clinicians: "Certified Aides (CNA / HHA)",
    protocols: ["Dementia Redirection Training", "Fall-Risk Mobility Protocol", "ADL Daily Shift Ledger"],
  },
  {
    id: "post-surgical",
    name: "Post-Surgical & Orthopedic Recovery",
    category: "Rehabilitation Support",
    hourlyRate: 42,
    dailyLiveInRate: 420,
    description: "Discharge rehabilitation assistance, safe transfer, surgical site monitoring, physical therapy exercises.",
    clinicians: "Post-Op Trained CNAs & RNs",
    protocols: ["Incision Infection Checks", "Mobilization Regimen", "Orthopedic Transfer Safety"],
  },
  {
    id: "pediatric-special",
    name: "Pediatric Specialized Care",
    category: "Pediatric Clinical Care",
    hourlyRate: 45,
    dailyLiveInRate: 460,
    description: "Specialized pediatric monitoring, feeding tube & respiratory treatment support, neonatal observation.",
    clinicians: "Pediatric RNs & Specialist Aides",
    protocols: ["Pediatric BLS Certified", "Strict Medication Double-Check", "Parental Communication Log"],
  },
  {
    id: "livein-respite",
    name: "24/7 Dedicated Live-In Care",
    category: "Round-the-Clock Supervision",
    hourlyRate: 36,
    dailyLiveInRate: 340,
    description: "Continuous peaceful 24-hour presence, dual-caregiver rotation, family respite, emergency response.",
    clinicians: "Vetted Senior Care Team",
    protocols: ["Overnight Sleep Protocol", "Emergency Nurse Escalation", "Dedicated Care Manager"],
  },
];

export const SERVICE_REGIONS = [
  { zip: "10001", name: "Manhattan (New York)", availableCount: 18, dispatchHours: "< 3 hours" },
  { zip: "11201", name: "Brooklyn (Kings County)", availableCount: 14, dispatchHours: "< 3.5 hours" },
  { zip: "11101", name: "Queens (Long Island City / Astoria)", availableCount: 11, dispatchHours: "< 4 hours" },
  { zip: "10451", name: "Bronx (Metro Area)", availableCount: 8, dispatchHours: "< 4 hours" },
  { zip: "10301", name: "Staten Island", availableCount: 6, dispatchHours: "< 4.5 hours" },
  { zip: "07030", name: "Hudson County (NJ Metro)", availableCount: 9, dispatchHours: "< 4 hours" },
  { zip: "11501", name: "Nassau County (Long Island)", availableCount: 7, dispatchHours: "< 4.5 hours" },
];

export const SHIFT_OPTIONS = [
  { id: "4h", label: "4-Hour Shift", hours: 4 },
  { id: "8h", label: "8-Hour Day", hours: 8 },
  { id: "12h", label: "12-Hour Night/Day", hours: 12 },
  { id: "24h", label: "24h Live-In", hours: 24, isLiveIn: true },
];

export const FREQUENCY_OPTIONS = [
  { id: "urgent", label: "Immediate (<4h)", daysPerWeek: 1, multiplier: 1 },
  { id: "3x", label: "3 Days / Week", daysPerWeek: 3, multiplier: 3 },
  { id: "5x", label: "5 Days (Weekdays)", daysPerWeek: 5, multiplier: 5 },
  { id: "7x", label: "7 Days (Continuous)", daysPerWeek: 7, multiplier: 7 },
];

interface BookingModalData {
  patientName: string;
  relationship: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  startDate: string;
  notes: string;
}

export default function CareEstimatorWidget() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("skilled-nursing");
  const [selectedShiftId, setSelectedShiftId] = useState<string>("8h");
  const [selectedFreqId, setSelectedFreqId] = useState<string>("5x");
  const [selectedZip, setSelectedZip] = useState<string>("10001");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");

  const [formData, setFormData] = useState<BookingModalData>({
    patientName: "",
    relationship: "Parent",
    phone: "",
    email: "",
    serviceNeeded: "",
    startDate: "Immediate (Today)",
    notes: "",
  });

  const currentService = CARE_SERVICES.find((s) => s.id === selectedServiceId) || CARE_SERVICES[0];
  const currentShift = SHIFT_OPTIONS.find((s) => s.id === selectedShiftId) || SHIFT_OPTIONS[1];
  const currentFreq = FREQUENCY_OPTIONS.find((f) => f.id === selectedFreqId) || FREQUENCY_OPTIONS[2];
  const currentRegion = SERVICE_REGIONS.find((r) => r.zip === selectedZip) || SERVICE_REGIONS[0];

  // Calculation
  const isLiveIn = currentShift.isLiveIn;
  const shiftCost = isLiveIn
    ? (currentService.dailyLiveInRate || 340)
    : currentService.hourlyRate * currentShift.hours;
  const estimatedWeeklyTotal = shiftCost * currentFreq.multiplier;

  const handleOpenAssessment = () => {
    setFormData((prev) => ({
      ...prev,
      serviceNeeded: `${currentService.name} (${currentShift.label}, ${currentFreq.label}) in ${currentRegion.name}`,
    }));
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.phone.trim()) {
      toast.error("Please provide recipient name and callback phone number.");
      return;
    }

    const code = `NC-CARE-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationCode(code);
    setIsSubmitted(true);
    toast.success(`Care assessment submitted. Reference: ${code}`);
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 shadow-sm">
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-50 uppercase">
              Interactive Care Estimation & Booking
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
            Transparent pricing • 100% FBI background verified • No lock-in contracts
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{currentRegion.availableCount} Vetted Caregivers in {currentRegion.zip}</span>
        </div>
      </div>

      {/* Estimator Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Step 1: Care Need Selection */}
        <div>
          <label
            htmlFor="care-service-select"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1.5"
          >
            1. Primary Care Requirement
          </label>
          <select
            id="care-service-select"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="input w-full cursor-pointer font-medium"
            aria-label="Select primary care requirement"
          >
            {CARE_SERVICES.map((s) => (
              <option key={s.id} value={s.id} className="bg-white dark:bg-neutral-900">
                {s.name} (from ${s.hourlyRate}/hr)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1">
            {currentService.description}
          </p>
        </div>

        {/* Step 2: Geographic Service Region */}
        <div>
          <label
            htmlFor="care-region-select"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1.5"
          >
            2. Care Location / Region
          </label>
          <select
            id="care-region-select"
            value={selectedZip}
            onChange={(e) => setSelectedZip(e.target.value)}
            className="input w-full cursor-pointer font-medium"
            aria-label="Select care location"
          >
            {SERVICE_REGIONS.map((r) => (
              <option key={r.zip} value={r.zip} className="bg-white dark:bg-neutral-900">
                {r.name} — Dispatch {r.dispatchHours}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
            Guaranteed RN triage & in-home assessment available in this zone.
          </p>
        </div>

        {/* Step 3: Shift Length */}
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1.5">
            3. Daily Shift Length
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SHIFT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedShiftId(opt.id)}
                className={`min-h-[44px] px-2.5 py-1.5 rounded-md text-xs font-medium border text-center transition-all cursor-pointer ${
                  selectedShiftId === opt.id
                    ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-slate-900 dark:border-zinc-100 font-semibold"
                    : "bg-white dark:bg-neutral-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Schedule Frequency */}
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1.5">
            4. Scheduling Frequency
          </span>
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCY_OPTIONS.map((freq) => (
              <button
                key={freq.id}
                type="button"
                onClick={() => setSelectedFreqId(freq.id)}
                className={`min-h-[44px] px-2.5 py-1.5 rounded-md text-xs font-medium border text-center transition-all cursor-pointer ${
                  selectedFreqId === freq.id
                    ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-slate-900 dark:border-zinc-100 font-semibold"
                    : "bg-white dark:bg-neutral-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500"
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Calculation Panel */}
      <div className="mt-5 p-4 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold text-slate-500 dark:text-zinc-400 tracking-wider">
                Transparent Rate Estimate
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300">
                Guaranteed No-Surprise Billing
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 tabular-nums">
                ${shiftCost}
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                per {isLiveIn ? "24h day" : `${currentShift.hours}-hour shift`}
              </span>
              {currentFreq.multiplier > 1 && (
                <span className="text-xs text-slate-500 dark:text-zinc-400 tabular-nums">
                  (~${estimatedWeeklyTotal.toLocaleString()}/wk for {currentFreq.multiplier} shifts)
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenAssessment}
              className="btn-primary text-xs sm:text-sm font-semibold px-4 py-2"
            >
              <span>Schedule Free Assessment</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <a
              href="tel:18001234567"
              className="btn-secondary text-xs sm:text-sm font-semibold px-3 py-2 text-center"
              title="Call clinical nurse dispatch"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-zinc-400" />
              <span>(800) 123-4567</span>
            </a>
          </div>
        </div>

        {/* Clinical Guardrails / Microcopy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-zinc-700/80 text-[11px] text-slate-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Staffed by {currentService.clinicians}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>24/7 RN On-Call Clinical Oversight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Zero Cancellation Penalty (24h Notice)</span>
          </div>
        </div>
      </div>

      {/* Accessible Assessment Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <h4 id="modal-title" className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                    {isSubmitted ? "Care Assessment Confirmed" : "Request In-Home Clinical Assessment"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {isSubmitted ? "Reference logged in triage queue" : "Complimentary nurse evaluation • No obligation"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {isSubmitted ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h5 className="text-base font-semibold text-slate-900 dark:text-zinc-50">
                    Care Inquiry Dispatched
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                    An RN Care Coordinator will contact <strong className="text-slate-900 dark:text-zinc-200">{formData.phone}</strong> within 15 minutes to review clinical needs and verify caregiver availability.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-zinc-800/70 rounded-md border border-slate-200 dark:border-zinc-700 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Assessment Code:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">{confirmationCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Patient:</span>
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">{formData.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Selected Care:</span>
                    <span className="text-slate-800 dark:text-zinc-200 truncate max-w-[200px]">{currentService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zinc-400">Location:</span>
                    <span className="text-slate-800 dark:text-zinc-200">{currentRegion.name}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-primary w-full text-xs font-semibold py-2"
                >
                  Return to Overview
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5">
                <div>
                  <label
                    htmlFor="patient-name-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
                  >
                    Care Recipient Full Name *
                  </label>
                  <input
                    id="patient-name-input"
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="relationship-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
                    >
                      Relationship to Patient
                    </label>
                    <select
                      id="relationship-select"
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="input text-xs cursor-pointer"
                    >
                      <option value="Self">Self</option>
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Physician / Social Worker">Physician / Social Worker</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="phone-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
                    >
                      Contact Phone Number *
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="email-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
                    >
                      Email Address (for Care Plan)
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input text-xs"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="start-date-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
                    >
                      Target Start Timeline
                    </label>
                    <select
                      id="start-date-select"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="input text-xs cursor-pointer"
                    >
                      <option value="Immediate (Today < 4h)">Immediate (Today &lt; 4h)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Within 3 Days">Within 3 Days</option>
                      <option value="Next Week">Next Week</option>
                      <option value="Post-Hospital Discharge">Post-Hospital Discharge</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="clinical-notes-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1"
                  >
                    Clinical Notes or Mobility Restrictions (Optional)
                  </label>
                  <textarea
                    id="clinical-notes-input"
                    rows={2}
                    placeholder="e.g. recovering from hip replacement, walker assistance required, daily blood pressure checks..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input text-xs py-2"
                  />
                </div>

                <div className="p-2.5 rounded bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-[11px] text-slate-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-zinc-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Selected: {currentService.name} in {currentRegion.name}</span>
                  </div>
                  <span className="block mt-0.5 text-slate-500 dark:text-zinc-400">
                    Estimated rate: ${shiftCost} / shift ({currentShift.label}, {currentFreq.label}). Zero obligation.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs px-4 py-1.5 font-semibold"
                  >
                    Submit Care Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
