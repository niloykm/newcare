export interface DoctorAddress {
  line1: string;
  line2: string;
}

export interface DoctorProfile {
  id: string;
  _id: string;
  slug: string;
  name: string;
  degree: string;
  specialty: string;
  speciality: string;
  experienceYears: number;
  experience: number;
  hospitalName: string;
  rating: number;
  reviewsCount: number;
  reviewCount: number;
  consultationFee: number;
  fees: number;
  avatarUrl: string;
  image: string;
  isAvailableToday: boolean;
  available: boolean;
  nextAvailableSlot: string;
  about: string;
  license: string;
  verified: boolean;
  consultationTypes: ("In-Clinic Visit" | "HD Video Consultation")[];
  availableSlots: string[];
  weeklySlots: Record<string, string[]>;
  address: DoctorAddress;
  slots_booked?: Record<string, string[]>;
}

export interface ApiDoctorRecord {
  _id?: string;
  id?: string;
  slug?: string;
  name?: string;
  degree?: string;
  specialty?: string;
  speciality?: string;
  experienceYears?: number;
  experience?: number | string;
  hospitalName?: string;
  rating?: number;
  reviewsCount?: number;
  reviewCount?: number;
  consultationFee?: number;
  fees?: number;
  avatarUrl?: string;
  image?: string;
  isAvailableToday?: boolean;
  available?: boolean;
  nextAvailableSlot?: string;
  about?: string;
  license?: string;
  verified?: boolean;
  consultationTypes?: ("In-Clinic Visit" | "HD Video Consultation")[];
  availableSlots?: string[];
  weeklySlots?: Record<string, string[]>;
  address?: Partial<DoctorAddress>;
  slots_booked?: Record<string, string[]>;
}

const DEFAULT_FALLBACK_AVATAR = "/assets/doc6.png";

const NY_CLINICAL_LOCATIONS: Array<{
  hospitalName: string;
  address: DoctorAddress;
}> = [
  {
    hospitalName: "Midtown Clinical Associates, New York",
    address: { line1: "Midtown Clinical Suites, Suite 402", line2: "Lexington Ave, New York, NY 10017" },
  },
  {
    hospitalName: "NewCare Primary Care, Manhattan",
    address: { line1: "NewCare Primary Care Clinic", line2: "Broadway, Suite 105, New York, NY 10012" },
  },
  {
    hospitalName: "Madison Clinical Center, NY",
    address: { line1: "Madison Medical Building, 7th Floor", line2: "Madison Ave, New York, NY 10022" },
  },
  {
    hospitalName: "West Side Medical Associates, NY",
    address: { line1: "Columbus Clinical Building, Suite 210", line2: "Columbus Ave, New York, NY 10024" },
  },
  {
    hospitalName: "Park Avenue Specialty Group, NY",
    address: { line1: "Park Avenue Clinical Pavilion", line2: "Park Ave, New York, NY 10016" },
  },
  {
    hospitalName: "Brooklyn Heights Medical Pavilion, NY",
    address: { line1: "Montague Clinical Suite 210", line2: "Montague St, Brooklyn, NY 11201" },
  },
  {
    hospitalName: "Tri-State Clinical Center, Hoboken NJ",
    address: { line1: "Hudson River Medical Plaza, Suite 300", line2: "Washington St, Hoboken, NJ 07030" },
  },
  {
    hospitalName: "East Side Medical Associates, NY",
    address: { line1: "York Avenue Clinical Building", line2: "East 68th St, New York, NY 10065" },
  },
];

const SPECIALTY_BOARD_MAP: Record<string, string> = {
  cardiologist: "MD, FACC",
  "general physician": "MD, FACP",
  dermatologist: "MD, FAAD",
  pediatrician: "MD, FAAP",
  neurologist: "MD, FAAN",
  gynecologist: "MD, FACOG",
  orthopedic: "MD, FAAOS",
  "ent specialist": "MD, FACS",
  psychiatrist: "MD, FAPA",
  oncologist: "MD, FACP",
};

const SPECIALTY_DISPLAY_MAP: Record<string, string> = {
  "general physician": "General Physician",
  cardiologist: "Cardiologist",
  dermatologist: "Dermatologist",
  pediatrician: "Pediatrician",
  pediatricians: "Pediatrician",
  neurologist: "Neurologist",
  gynecologist: "Gynecologist",
  orthopedic: "Orthopedic",
  "ent specialist": "ENT Specialist",
  psychiatrist: "Psychiatrist",
  oncologist: "Oncologist",
};

const NON_NY_LOCATION_REGEX =
  /(London|Harley|Newgate|Bangalore|Karnataka|MG Road|Dubai|UAE|Singapore|Sydney|Melbourne|Paris|Rivoli|Berlin|Friedrich|Toronto|Vancouver|Hong Kong|Kuala Lumpur|Bukit|São Paulo|Paulista|Edinburgh|Los Angeles|Chicago|Houston|Boston|Oak Street|Medical Plaza|Riverside Drive|Circular Road|George Street|Bay Street|Wentworth|Collins Street|King Street|Main Street)/i;

function formatSpecialtyDisplay(rawSpecialty?: string): string {
  if (!rawSpecialty) return "General Physician";
  const key = rawSpecialty.trim().toLowerCase();
  if (SPECIALTY_DISPLAY_MAP[key]) return SPECIALTY_DISPLAY_MAP[key];
  return rawSpecialty
    .trim()
    .split(/\s+/)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function sanitizeUSDegree(rawDegree?: string, specialty?: string): string {
  const specKey = (specialty || "").trim().toLowerCase();
  const boardDefault = SPECIALTY_BOARD_MAP[specKey] || "MD, FACP";
  if (!rawDegree) return boardDefault;

  // Replace non-US credentials (MBBS, DNB, FRCS, FRCP, MRCP, DM, MCh, MS, FCPS, MRCGP)
  const hasNonUS = /\b(MBBS|DNB|FRCS|FRCP|MRCP|DM|MCh|FCPS|MRCGP|MS)\b/i.test(rawDegree);
  if (hasNonUS) {
    if (/\bPhD\b/i.test(rawDegree)) return `${boardDefault}, PhD`;
    if (/\bDO\b/i.test(rawDegree)) return boardDefault.replace(/^MD/, "DO");
    return boardDefault;
  }

  const cleaned = rawDegree.replace(/^,\s*|\s*,\s*$/g, "").trim();
  return cleaned || boardDefault;
}

function sanitizeUSLicense(rawLicense?: string, fallback?: string): string {
  if (!rawLicense || /BMDC/i.test(rawLicense)) {
    return fallback || "NY License Verified • ABMS Board Certified";
  }
  return rawLicense;
}

function resolveAvatarUrl(rawUrl?: string, fallbackUrl?: string): string {
  const candidate = rawUrl || fallbackUrl || DEFAULT_FALLBACK_AVATAR;
  const cloudinaryDocMatch = candidate.match(/newcare_assets\/(doc\d+\.png)$/i);
  if (cloudinaryDocMatch) {
    return `/assets/${cloudinaryDocMatch[1]}`;
  }
  return candidate;
}

function pickStableNYLocation(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return NY_CLINICAL_LOCATIONS[hash % NY_CLINICAL_LOCATIONS.length];
}

export function selectFeaturedDoctors(
  doctors: DoctorProfile[],
  count = 4
): DoctorProfile[] {
  const sorted = [...doctors].sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  const picked: DoctorProfile[] = [];
  const seenSpecialties = new Set<string>();

  for (const doc of sorted) {
    const key = doc.specialty.toLowerCase();
    if (!seenSpecialties.has(key)) {
      seenSpecialties.add(key);
      picked.push(doc);
      if (picked.length === count) return picked;
    }
  }
  for (const doc of sorted) {
    if (!picked.some((p) => p.id === doc.id)) {
      picked.push(doc);
      if (picked.length === count) break;
    }
  }
  return picked;
}

export function normalizeApiDoctor(
  raw: ApiDoctorRecord,
  fallback?: DoctorProfile
): DoctorProfile {
  const id = raw._id || raw.id || fallback?.id || "doc-1";
  const specialty = formatSpecialtyDisplay(
    raw.specialty || raw.speciality || fallback?.specialty
  );
  const parsedExperience =
    typeof raw.experienceYears === "number"
      ? raw.experienceYears
      : typeof raw.experience === "number"
        ? raw.experience
        : Number.parseInt(String(raw.experience ?? ""), 10) ||
          fallback?.experienceYears ||
          8;
  const consultationFee = Number(
    raw.consultationFee ?? raw.fees ?? fallback?.consultationFee ?? 60
  );
  const avatarUrl = resolveAvatarUrl(
    raw.avatarUrl || raw.image,
    fallback?.avatarUrl || fallback?.image
  );
  const isAvailableToday =
    raw.isAvailableToday !== undefined
      ? raw.isAvailableToday
      : raw.available !== undefined
        ? raw.available
        : fallback?.isAvailableToday ?? true;

  const rawAddressText = `${raw.hospitalName || ""} ${raw.address?.line1 || ""} ${raw.address?.line2 || ""}`;
  const isNonNY = !rawAddressText.trim() || NON_NY_LOCATION_REGEX.test(rawAddressText);
  const nyLoc = pickStableNYLocation(id + (raw.name || ""));
  const hospitalName = isNonNY
    ? nyLoc.hospitalName
    : raw.hospitalName || raw.address?.line1 || nyLoc.hospitalName;
  const address: DoctorAddress = isNonNY
    ? nyLoc.address
    : {
        line1: raw.address?.line1 || nyLoc.address.line1,
        line2: raw.address?.line2 || nyLoc.address.line2,
      };

  return {
    id,
    _id: id,
    slug: raw.slug || fallback?.slug || id,
    name: raw.name || fallback?.name || "Dr. Attending Physician",
    degree: sanitizeUSDegree(raw.degree || fallback?.degree, specialty),
    specialty,
    speciality: specialty,
    experienceYears: parsedExperience,
    experience: parsedExperience,
    hospitalName,
    rating: Number(raw.rating ?? fallback?.rating ?? 4.9),
    reviewsCount: Number(
      raw.reviewsCount ?? raw.reviewCount ?? fallback?.reviewsCount ?? 112
    ),
    reviewCount: Number(
      raw.reviewsCount ?? raw.reviewCount ?? fallback?.reviewsCount ?? 112
    ),
    consultationFee,
    fees: consultationFee,
    avatarUrl,
    image: avatarUrl,
    isAvailableToday,
    available: isAvailableToday,
    nextAvailableSlot:
      raw.nextAvailableSlot || fallback?.nextAvailableSlot || "Today, 2:30 PM",
    about:
      raw.about ||
      fallback?.about ||
      "Board-certified physician providing in-clinic and telehealth consultations across Greater New York.",
    license: sanitizeUSLicense(raw.license, fallback?.license),
    verified: raw.verified ?? fallback?.verified ?? true,
    consultationTypes: raw.consultationTypes ||
      fallback?.consultationTypes || ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: raw.availableSlots ||
      fallback?.availableSlots || ["10:00 AM", "01:30 PM", "04:00 PM"],
    weeklySlots: raw.weeklySlots ||
      fallback?.weeklySlots || {
        Monday: ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"],
        Tuesday: ["10:00 AM", "01:30 PM", "03:30 PM"],
        Wednesday: ["09:30 AM", "11:30 AM", "02:00 PM"],
        Thursday: ["10:30 AM", "01:00 PM", "03:30 PM"],
        Friday: ["09:30 AM", "12:00 PM", "02:30 PM"],
        Saturday: ["10:00 AM", "01:00 PM"],
        Sunday: [],
      },
    address,
    slots_booked: raw.slots_booked,
  };
}

export const FALLBACK_DOCTORS: DoctorProfile[] = [
  {
    id: "doc-1",
    _id: "doc-1",
    slug: "dr-sarah-jenkins-cardiology",
    name: "Dr. Sarah Jenkins",
    degree: "MD, FACC (Cardiology)",
    specialty: "Cardiologist",
    speciality: "Cardiologist",
    experienceYears: 14,
    experience: 14,
    hospitalName: "Midtown Cardiac Associates, New York",
    rating: 4.9,
    reviewsCount: 168,
    reviewCount: 168,
    consultationFee: 75,
    fees: 75,
    avatarUrl: "/assets/doc2.png",
    image: "/assets/doc2.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 4:30 PM",
    about:
      "Dr. Sarah Jenkins is an ABMS board-certified cardiologist specializing in preventive cardiology, non-invasive cardiac imaging, and hypertension management with 14 years of clinical practice in New York.",
    license: "NY License #284910 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["10:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"],
    weeklySlots: {
      Monday: ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"],
      Tuesday: ["10:00 AM", "01:30 PM", "03:30 PM", "05:00 PM"],
      Wednesday: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
      Thursday: ["10:30 AM", "01:00 PM", "03:00 PM", "05:30 PM"],
      Friday: ["09:30 AM", "12:00 PM", "02:30 PM", "04:00 PM"],
      Saturday: ["10:00 AM", "01:00 PM"],
      Sunday: [],
    },
    address: {
      line1: "Midtown Clinical Suites, Suite 402",
      line2: "Lexington Avenue, New York, NY 10017",
    },
  },
  {
    id: "doc-2",
    _id: "doc-2",
    slug: "dr-marcus-vance-general-physician",
    name: "Dr. Marcus Vance",
    degree: "MD, FACP (Internal Medicine)",
    specialty: "General Physician",
    speciality: "General Physician",
    experienceYears: 11,
    experience: 11,
    hospitalName: "NewCare Primary Care, Manhattan",
    rating: 4.8,
    reviewsCount: 142,
    reviewCount: 142,
    consultationFee: 45,
    fees: 45,
    avatarUrl: "/assets/doc6.png",
    image: "/assets/doc6.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 2:00 PM",
    about:
      "Dr. Marcus Vance practices adult internal medicine with a focus on chronic disease management (diabetes, hypertension), post-hospital discharge coordination, and preventive annual evaluations.",
    license: "NY License #263920 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["09:00 AM", "11:30 AM", "02:00 PM", "05:00 PM"],
    weeklySlots: {
      Monday: ["09:00 AM", "10:30 AM", "02:00 PM", "04:00 PM"],
      Tuesday: ["09:00 AM", "11:00 AM", "01:30 PM", "03:30 PM"],
      Wednesday: ["10:00 AM", "12:00 PM", "02:30 PM", "05:00 PM"],
      Thursday: ["09:30 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
      Friday: ["09:00 AM", "12:00 PM", "03:00 PM"],
      Saturday: ["10:00 AM", "12:30 PM"],
      Sunday: [],
    },
    address: {
      line1: "NewCare Primary Care Clinic",
      line2: "Broadway, Suite 105, New York, NY 10012",
    },
  },
  {
    id: "doc-3",
    _id: "doc-3",
    slug: "dr-elena-rostova-dermatologist",
    name: "Dr. Elena Rostova",
    degree: "MD, FAAD (Dermatology)",
    specialty: "Dermatologist",
    speciality: "Dermatologist",
    experienceYears: 9,
    experience: 9,
    hospitalName: "Madison Clinical Dermatology, NY",
    rating: 4.9,
    reviewsCount: 195,
    reviewCount: 195,
    consultationFee: 60,
    fees: 60,
    avatarUrl: "/assets/doc11.png",
    image: "/assets/doc11.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 5:15 PM",
    about:
      "Dr. Elena Rostova is a board-certified dermatologist treating complex medical skin conditions including eczema, contact dermatitis, psoriasis, and skin cancer screenings.",
    license: "NY License #291024 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["11:00 AM", "01:30 PM", "03:45 PM", "05:15 PM"],
    weeklySlots: {
      Monday: ["10:00 AM", "01:00 PM", "03:30 PM", "05:15 PM"],
      Tuesday: ["09:30 AM", "12:00 PM", "02:30 PM", "04:30 PM"],
      Wednesday: ["11:00 AM", "01:30 PM", "04:00 PM", "06:00 PM"],
      Thursday: ["10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
      Friday: ["09:30 AM", "12:30 PM", "03:00 PM"],
      Saturday: ["11:00 AM", "02:00 PM"],
      Sunday: [],
    },
    address: {
      line1: "Madison Medical Building, 7th Floor",
      line2: "Madison Ave, New York, NY 10022",
    },
  },
  {
    id: "doc-4",
    _id: "doc-4",
    slug: "dr-david-chen-pediatrician",
    name: "Dr. David Chen",
    degree: "MD, FAAP (Pediatrics)",
    specialty: "Pediatrician",
    speciality: "Pediatrician",
    experienceYears: 13,
    experience: 13,
    hospitalName: "West Side Pediatric Associates, NY",
    rating: 4.9,
    reviewsCount: 220,
    reviewCount: 220,
    consultationFee: 50,
    fees: 50,
    avatarUrl: "/assets/doc1.png",
    image: "/assets/doc1.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 3:30 PM",
    about:
      "Dr. David Chen provides pediatric care from newborn wellness checks through adolescence, coordinating home-nursing plans for medically complex children and routine immunizations.",
    license: "NY License #254219 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["10:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"],
    weeklySlots: {
      Monday: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
      Tuesday: ["10:00 AM", "01:00 PM", "03:30 PM"],
      Wednesday: ["09:30 AM", "12:00 PM", "02:30 PM", "05:00 PM"],
      Thursday: ["10:00 AM", "01:30 PM", "04:00 PM"],
      Friday: ["09:00 AM", "11:30 AM", "02:30 PM"],
      Saturday: ["09:30 AM", "12:30 PM"],
      Sunday: [],
    },
    address: {
      line1: "Pediatric Care Pavilion, Wing B",
      line2: "Central Park West, New York, NY 10025",
    },
  },
  {
    id: "doc-5",
    _id: "doc-5",
    slug: "dr-robert-sterling-neurologist",
    name: "Dr. Robert Sterling",
    degree: "MD, PhD, FAAN (Neurology)",
    specialty: "Neurologist",
    speciality: "Neurologist",
    experienceYears: 18,
    experience: 18,
    hospitalName: "Metropolitan Neurology Group, NY",
    rating: 4.9,
    reviewsCount: 134,
    reviewCount: 134,
    consultationFee: 85,
    fees: 85,
    avatarUrl: "/assets/doc7.png",
    image: "/assets/doc7.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 6:00 PM",
    about:
      "Dr. Robert Sterling is a clinical neurologist focusing on memory disorders, dementia care coordination, migraine management, and peripheral neuropathy.",
    license: "NY License #233812 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["11:30 AM", "02:30 PM", "04:00 PM", "06:00 PM"],
    weeklySlots: {
      Monday: ["11:00 AM", "02:00 PM", "04:30 PM"],
      Tuesday: ["10:00 AM", "01:30 PM", "04:00 PM", "06:00 PM"],
      Wednesday: ["11:30 AM", "02:30 PM", "05:00 PM"],
      Thursday: ["10:30 AM", "02:00 PM", "04:30 PM"],
      Friday: ["10:00 AM", "01:00 PM", "03:30 PM"],
      Saturday: [],
      Sunday: [],
    },
    address: {
      line1: "Neuroscience Medical Suites",
      line2: "Fifth Avenue, New York, NY 10028",
    },
  },
  {
    id: "doc-6",
    _id: "doc-6",
    slug: "dr-priya-patel-gynecologist",
    name: "Dr. Priya Patel",
    degree: "MD, FACOG (OB/GYN)",
    specialty: "Gynecologist",
    speciality: "Gynecologist",
    experienceYears: 12,
    experience: 12,
    hospitalName: "Park Avenue Women's Health, NY",
    rating: 4.9,
    reviewsCount: 188,
    reviewCount: 188,
    consultationFee: 70,
    fees: 70,
    avatarUrl: "/assets/doc13.png",
    image: "/assets/doc13.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 1:45 PM",
    about:
      "Dr. Priya Patel provides comprehensive obstetric and gynecologic care, postpartum recovery planning, and minimally invasive surgical follow-up.",
    license: "NY License #277291 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["09:30 AM", "11:45 AM", "01:45 PM", "04:15 PM"],
    weeklySlots: {
      Monday: ["09:30 AM", "11:45 AM", "02:00 PM", "04:30 PM"],
      Tuesday: ["10:00 AM", "01:00 PM", "03:30 PM"],
      Wednesday: ["09:00 AM", "11:30 AM", "01:45 PM", "04:15 PM"],
      Thursday: ["10:30 AM", "01:30 PM", "04:00 PM"],
      Friday: ["09:30 AM", "12:00 PM", "02:30 PM"],
      Saturday: ["10:00 AM", "01:00 PM"],
      Sunday: [],
    },
    address: {
      line1: "Women's Health Suites, Suite 500",
      line2: "Park Avenue, New York, NY 10016",
    },
  },
  {
    id: "doc-7",
    _id: "doc-7",
    slug: "dr-james-thornton-orthopedic",
    name: "Dr. James Thornton",
    degree: "MD, FAAOS (Orthopedic Surgery)",
    specialty: "Orthopedic",
    speciality: "Orthopedic",
    experienceYears: 16,
    experience: 16,
    hospitalName: "Tri-State Orthopedic & Spine Center",
    rating: 4.8,
    reviewsCount: 176,
    reviewCount: 176,
    consultationFee: 80,
    fees: 80,
    avatarUrl: "/assets/doc8.png",
    image: "/assets/doc8.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 3:00 PM",
    about:
      "Dr. James Thornton specializes in joint reconstruction, sports medicine, and post-operative orthopedic rehabilitation plans coordinated with in-home nursing teams.",
    license: "NY License #245610 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["10:00 AM", "12:30 PM", "03:00 PM", "05:30 PM"],
    weeklySlots: {
      Monday: ["10:00 AM", "12:30 PM", "03:00 PM"],
      Tuesday: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
      Wednesday: ["10:00 AM", "01:00 PM", "03:30 PM"],
      Thursday: ["09:30 AM", "12:00 PM", "02:30 PM", "05:00 PM"],
      Friday: ["09:00 AM", "11:30 AM"],
      Saturday: ["10:00 AM", "01:00 PM"],
      Sunday: [],
    },
    address: {
      line1: "Orthopedic & Mobility Center, 3rd Floor",
      line2: "Columbus Circle, New York, NY 10019",
    },
  },
  {
    id: "doc-8",
    _id: "doc-8",
    slug: "dr-aisha-khan-ent-specialist",
    name: "Dr. Aisha Khan",
    degree: "MD, FACS (Otolaryngology)",
    specialty: "ENT Specialist",
    speciality: "ENT Specialist",
    experienceYears: 10,
    experience: 10,
    hospitalName: "East Side ENT Associates, NY",
    rating: 4.9,
    reviewsCount: 153,
    reviewCount: 153,
    consultationFee: 55,
    fees: 55,
    avatarUrl: "/assets/doc5.png",
    image: "/assets/doc5.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 4:00 PM",
    about:
      "Dr. Aisha Khan specializes in chronic sinus disorders, pediatric ENT conditions, hearing diagnostics, and post-operative airway and voice recovery.",
    license: "NY License #266419 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["10:15 AM", "01:15 PM", "04:00 PM", "05:45 PM"],
    weeklySlots: {
      Monday: ["10:15 AM", "01:15 PM", "04:00 PM"],
      Tuesday: ["09:00 AM", "11:30 AM", "02:30 PM", "04:45 PM"],
      Wednesday: ["10:00 AM", "01:00 PM", "03:30 PM"],
      Thursday: ["09:30 AM", "12:00 PM", "02:30 PM", "05:00 PM"],
      Friday: ["10:00 AM", "01:00 PM", "03:00 PM"],
      Saturday: ["10:00 AM", "12:30 PM"],
      Sunday: [],
    },
    address: {
      line1: "ENT Surgical Suites",
      line2: "East 72nd Street, New York, NY 10021",
    },
  },
  {
    id: "doc-9",
    _id: "doc-9",
    slug: "dr-michael-brooks-general-physician",
    name: "Dr. Michael Brooks",
    degree: "DO, FAAFP (Family Medicine)",
    specialty: "General Physician",
    speciality: "General Physician",
    experienceYears: 15,
    experience: 15,
    hospitalName: "Downtown Primary Care Partners, NY",
    rating: 4.8,
    reviewsCount: 139,
    reviewCount: 139,
    consultationFee: 45,
    fees: 45,
    avatarUrl: "/assets/doc10.png",
    image: "/assets/doc10.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 11:00 AM",
    about:
      "Dr. Michael Brooks is a family medicine physician dedicated to geriatric wellness, preventive checkups, medication reconciliation, and home-care medical clearance.",
    license: "NY License #238194 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM"],
    weeklySlots: {
      Monday: ["09:00 AM", "11:00 AM", "02:00 PM"],
      Tuesday: ["09:30 AM", "12:00 PM", "03:00 PM"],
      Wednesday: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
      Thursday: ["10:00 AM", "01:00 PM", "03:30 PM"],
      Friday: ["09:00 AM", "12:00 PM"],
      Saturday: ["10:00 AM", "01:00 PM"],
      Sunday: [],
    },
    address: {
      line1: "Tribeca Health Center, 2nd Floor",
      line2: "Hudson Street, New York, NY 10013",
    },
  },
  {
    id: "doc-10",
    _id: "doc-10",
    slug: "dr-amara-okonjo-cardiologist",
    name: "Dr. Amara Okonjo",
    degree: "MD, FACC (Interventional Cardiology)",
    specialty: "Cardiologist",
    speciality: "Cardiologist",
    experienceYears: 16,
    experience: 16,
    hospitalName: "York Avenue Cardiac Specialists, NY",
    rating: 4.9,
    reviewsCount: 164,
    reviewCount: 164,
    consultationFee: 80,
    fees: 80,
    avatarUrl: "/assets/doc9.png",
    image: "/assets/doc9.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 5:30 PM",
    about:
      "Dr. Amara Okonjo focuses on lipid management, hypertensive heart disease, post-catheterization recovery, and long-term cardiac wellness plans.",
    license: "NY License #259832 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["10:30 AM", "01:00 PM", "03:30 PM", "05:30 PM"],
    weeklySlots: {
      Monday: ["10:30 AM", "01:00 PM", "03:30 PM", "05:30 PM"],
      Tuesday: ["09:30 AM", "12:00 PM", "02:30 PM"],
      Wednesday: ["10:00 AM", "01:30 PM", "04:00 PM"],
      Thursday: ["09:00 AM", "11:30 AM", "02:00 PM"],
      Friday: ["10:00 AM", "01:00 PM"],
      Saturday: ["09:30 AM", "12:00 PM"],
      Sunday: [],
    },
    address: {
      line1: "Cardiovascular Pavilion, Suite 901",
      line2: "York Avenue, New York, NY 10065",
    },
  },
  {
    id: "doc-11",
    _id: "doc-11",
    slug: "dr-lucas-meyer-dermatologist",
    name: "Dr. Lucas Meyer",
    degree: "MD, FAAD (Clinical Dermatology)",
    specialty: "Dermatologist",
    speciality: "Dermatologist",
    experienceYears: 8,
    experience: 8,
    hospitalName: "Brooklyn Heights Dermatology, NY",
    rating: 4.8,
    reviewsCount: 112,
    reviewCount: 112,
    consultationFee: 55,
    fees: 55,
    avatarUrl: "/assets/doc14.png",
    image: "/assets/doc14.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 2:00 PM",
    about:
      "Dr. Lucas Meyer provides diagnostic skin screenings, wound-healing dermatology consults, and evidence-based treatment for chronic inflammatory skin conditions.",
    license: "NY License #284012 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"],
    weeklySlots: {
      Monday: ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"],
      Tuesday: ["10:00 AM", "01:00 PM", "03:30 PM"],
      Wednesday: ["09:30 AM", "12:00 PM", "02:30 PM"],
      Thursday: ["10:00 AM", "01:30 PM", "04:00 PM"],
      Friday: ["09:00 AM", "11:30 AM"],
      Saturday: ["10:00 AM", "01:00 PM"],
      Sunday: [],
    },
    address: {
      line1: "Clinical Skin Suite 210",
      line2: "Montague Street, Brooklyn, NY 11201",
    },
  },
  {
    id: "doc-12",
    _id: "doc-12",
    slug: "dr-maya-lin-pediatrician",
    name: "Dr. Maya Lin",
    degree: "MD, MPH, FAAP (Pediatrics)",
    specialty: "Pediatrician",
    speciality: "Pediatrician",
    experienceYears: 11,
    experience: 11,
    hospitalName: "Greenwich Village Pediatrics, NY",
    rating: 4.9,
    reviewsCount: 184,
    reviewCount: 184,
    consultationFee: 50,
    fees: 50,
    avatarUrl: "/assets/doc15.png",
    image: "/assets/doc15.png",
    isAvailableToday: true,
    available: true,
    nextAvailableSlot: "Today, 10:30 AM",
    about:
      "Dr. Maya Lin provides family-centered pediatric care, childhood asthma management, developmental milestone tracking, and preventive immunizations.",
    license: "NY License #262198 • ABMS Board Certified",
    verified: true,
    consultationTypes: ["In-Clinic Visit", "HD Video Consultation"],
    availableSlots: ["10:30 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
    weeklySlots: {
      Monday: ["10:30 AM", "01:00 PM", "03:00 PM"],
      Tuesday: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
      Wednesday: ["10:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"],
      Thursday: ["09:30 AM", "12:00 PM", "02:30 PM"],
      Friday: ["09:00 AM", "11:30 AM", "02:00 PM"],
      Saturday: ["09:30 AM", "12:30 PM"],
      Sunday: [],
    },
    address: {
      line1: "Pediatric Center of New York, 4th Floor",
      line2: "West 12th Street, New York, NY 10014",
    },
  },
];

export function normalizeSpecialty(str: string): string {
  if (!str) return "";
  let clean = str.trim().toLowerCase().replace(/[-_]/g, " ");
  if (clean.endsWith("s") && !clean.endsWith("is") && !clean.endsWith("physicians")) {
    clean = clean.slice(0, -1);
  }
  if (clean === "pediatricians") clean = "pediatrician";
  return clean;
}

export function matchesSpecialty(docSpecialty: string, querySpecialty: string): boolean {
  if (!querySpecialty || querySpecialty.toLowerCase() === "all") return true;
  const n1 = normalizeSpecialty(docSpecialty);
  const n2 = normalizeSpecialty(querySpecialty);
  return n1.includes(n2) || n2.includes(n1);
}
