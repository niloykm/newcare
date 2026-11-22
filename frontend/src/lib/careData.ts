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

export interface ServiceRegion {
  zip: string;
  name: string;
  availableCount: number;
  dispatchWindow: string;
}

export interface ShiftOption {
  id: string;
  label: string;
  hours: number;
  isLiveIn?: boolean;
}

export interface FrequencyOption {
  id: string;
  label: string;
  daysPerWeek: number;
  multiplier: number;
}

export interface ClinicalFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const CARE_SERVICES: CareServiceOption[] = [
  {
    id: "skilled-nursing",
    name: "Skilled Nursing (RN / LPN)",
    category: "Clinical Nursing",
    hourlyRate: 48,
    dailyLiveInRate: 490,
    description:
      "Post-operative wound care, IV infusion management, vitals tracking, medication administration, and catheter support.",
    clinicians: "NY-Licensed RNs & LPNs",
    protocols: [
      "Aseptic wound & dressing care",
      "Physician-ordered medication regimen",
      "Real-time vitals & clinical charting",
    ],
  },
  {
    id: "elderly-dementia",
    name: "Elderly & Dementia Care",
    category: "Daily Living Support",
    hourlyRate: 32,
    dailyLiveInRate: 340,
    description:
      "Personal care and ADLs, structured memory-care routines, fall prevention, meal preparation, and safe mobility transfers.",
    clinicians: "Certified CNAs & HHAs",
    protocols: [
      "Dementia redirection & calm routines",
      "Fall-risk & transfer safety protocol",
      "Daily ADL & meal log in Family Portal",
    ],
  },
  {
    id: "post-surgical",
    name: "Post-Surgical & Orthopedic Recovery",
    category: "Rehabilitation",
    hourlyRate: 42,
    dailyLiveInRate: 420,
    description:
      "Hospital-to-home discharge transition, safe orthopedic transfers, surgical-site observation, and mobility exercises.",
    clinicians: "Post-Op Trained CNAs & RNs",
    protocols: [
      "Incision observation & escalation",
      "Guided ambulation & PT follow-through",
      "Discharge medication reconciliation",
    ],
  },
  {
    id: "pediatric-special",
    name: "Pediatric Complex Care",
    category: "Pediatric Nursing",
    hourlyRate: 45,
    dailyLiveInRate: 460,
    description:
      "Pediatric nursing observation, feeding-tube and respiratory support, and coordinated family shift handoffs.",
    clinicians: "Pediatric RNs & Aides",
    protocols: [
      "Pediatric BLS & PALS certified staff",
      "Dual-check pediatric dosing protocol",
      "Parent shift handoff summaries",
    ],
  },
  {
    id: "livein-respite",
    name: "24/7 Live-In & Respite Care",
    category: "Continuous Coverage",
    hourlyRate: 36,
    dailyLiveInRate: 340,
    description:
      "Continuous 24-hour residential presence with rotating caregivers, overnight safety supervision, and family respite.",
    clinicians: "W-2 Senior Care Teams",
    protocols: [
      "Coordinated multi-caregiver rotation",
      "On-call RN escalation line",
      "Dedicated care coordinator check-ins",
    ],
  },
];

export const SERVICE_REGIONS: ServiceRegion[] = [
  { zip: "10001", name: "Manhattan, NY", availableCount: 18, dispatchWindow: "3–4 hours" },
  { zip: "11201", name: "Brooklyn, NY", availableCount: 14, dispatchWindow: "3–4 hours" },
  { zip: "11101", name: "Queens, NY", availableCount: 11, dispatchWindow: "4 hours" },
  { zip: "10451", name: "Bronx, NY", availableCount: 8, dispatchWindow: "4 hours" },
  { zip: "10301", name: "Staten Island, NY", availableCount: 6, dispatchWindow: "4–5 hours" },
  { zip: "07030", name: "Hudson County, NJ", availableCount: 9, dispatchWindow: "4 hours" },
  { zip: "11501", name: "Nassau County, NY", availableCount: 7, dispatchWindow: "4–5 hours" },
];

export const SHIFT_OPTIONS: ShiftOption[] = [
  { id: "4h", label: "4-Hour Shift", hours: 4 },
  { id: "8h", label: "8-Hour Day", hours: 8 },
  { id: "12h", label: "12-Hour Shift", hours: 12 },
  { id: "24h", label: "24h Live-In", hours: 24, isLiveIn: true },
];

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { id: "urgent", label: "Single / Urgent", daysPerWeek: 1, multiplier: 1 },
  { id: "3x", label: "3 Days / Week", daysPerWeek: 3, multiplier: 3 },
  { id: "5x", label: "5 Days / Week", daysPerWeek: 5, multiplier: 5 },
  { id: "7x", label: "7 Days / Week", daysPerWeek: 7, multiplier: 7 },
];

export const CARE_WORKFLOW_STEPS = [
  {
    step: "01",
    title: "RN Clinical Intake",
    timeline: "Same-day review",
    description:
      "Share clinical needs online or through our intake desk. A Registered Nurse reviews medications, mobility needs, and home safety to build a written Care Plan.",
  },
  {
    step: "02",
    title: "Credentialed Clinician Match",
    timeline: "Interview before start",
    description:
      "We pair your household with a W-2 vetted nurse or aide whose clinical training and language match your needs. Meet by phone or video before the first shift.",
  },
  {
    step: "03",
    title: "Supervised Care & Charting",
    timeline: "Ongoing RN oversight",
    description:
      "Caregivers log shift arrivals, vitals, and daily care tasks in the Family Portal while a supervisory RN performs periodic clinical reviews.",
  },
];

export const VETTING_STANDARDS = [
  {
    label: "NYS Primary-Source License Check",
    detail: "RN, LPN, CNA, and HHA credentials verified directly with New York State registries.",
  },
  {
    label: "Federal & State Background Screening",
    detail: "Fingerprint-based criminal checks, state repositories, and HHS/OIG exclusion screening.",
  },
  {
    label: "In-Person Clinical Skills Audit",
    detail: "Hands-on testing for sterile technique, safe patient transfers, and active BLS/CPR.",
  },
  {
    label: "W-2 Bonded & Insured Staff",
    detail: "Every clinician is a W-2 employee covered by professional liability and bonding.",
  },
  {
    label: "24/7 Supervisory RN Escalation",
    detail: "Direct RN clinical support for symptom changes, discharge questions, and care updates.",
  },
];

export const CLINICAL_FAQS: ClinicalFaqItem[] = [
  {
    id: "dispatch-timing",
    question: "How quickly can in-home nursing or caregiving begin?",
    answer:
      "For urgent hospital discharges or sudden caregiver gaps in Greater New York, our RN coordinators can typically arrange coverage within 3 to 4 hours. Planned schedules can be booked days or weeks in advance.",
  },
  {
    id: "meet-caregiver",
    question: "Can our family meet the assigned caregiver before the first shift?",
    answer:
      "Yes. Once we identify a match for your care plan, we arrange a brief phone or video introduction with the caregiver and supervisory RN before care starts.",
  },
  {
    id: "insurance-billing",
    question: "Do you provide documentation for Long-Term Care Insurance (LTCI)?",
    answer:
      "Yes. We provide itemized, CMS-1500 formatted invoices and signed shift care logs required for Long-Term Care Insurance reimbursement claims.",
  },
  {
    id: "cancellation-policy",
    question: "What is your schedule adjustment and cancellation policy?",
    answer:
      "There are no multi-month lock-in contracts. Families can modify shift hours or cancel scheduled care with 24 hours notice at no penalty.",
  },
];
