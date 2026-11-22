"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  X,
  Stethoscope,
  Video,
  MapPin,
  RefreshCw,
} from "lucide-react";
import api from "@/lib/api";
import {
  ApiDoctorRecord,
  DoctorProfile,
  FALLBACK_DOCTORS,
  matchesSpecialty,
  normalizeApiDoctor,
} from "@/data/doctorsData";
import DoctorCard from "@/components/DoctorCard";
import { SHARED_PILL_SPRING } from "@/components/MotionPrimitives";

const SPECIALTY_OPTIONS = [
  "All Specialties",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Gynecologist",
  "Orthopedic",
  "ENT Specialist",
  "Psychiatrist",
  "Oncologist",
];

const PAGE_SIZE = 12;

function SearchParamsSync({
  onParams,
}: {
  onParams: (params: {
    specialty?: string;
    search?: string;
    type?: string;
    available?: string;
  }) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onParams({
      specialty: searchParams.get("specialty") || undefined,
      search: searchParams.get("search") || undefined,
      type: searchParams.get("type") || undefined,
      available: searchParams.get("available") || undefined,
    });
  }, [searchParams, onParams]);
  return null;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(FALLBACK_DOCTORS);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [consultType, setConsultType] = useState<"all" | "video" | "in-person">("all");
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleParamsSync = useCallback(
    (params: {
      specialty?: string;
      search?: string;
      type?: string;
      available?: string;
    }) => {
      if (params.specialty) setSpecialty(params.specialty);
      if (params.search) setSearch(params.search);
      if (params.type === "video" || params.type === "in-person") {
        setConsultType(params.type);
      }
      if (params.available === "today") setAvailableTodayOnly(true);
    },
    []
  );

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
          setDoctors(normalized);
        }
      } catch {
        // Fallback profiles already populated
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        if (specialty !== "All Specialties" && !matchesSpecialty(doc.specialty, specialty)) {
          return false;
        }
        if (availableTodayOnly && !doc.isAvailableToday && !doc.available) {
          return false;
        }
        if (consultType === "video") {
          const types = doc.consultationTypes || ["HD Video Consultation", "In-Clinic Visit"];
          if (!types.some((t) => t.toLowerCase().includes("video"))) return false;
        } else if (consultType === "in-person") {
          const types = doc.consultationTypes || ["In-Clinic Visit"];
          if (!types.some((t) => t.toLowerCase().includes("clinic"))) return false;
        }
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const haystack = `${doc.name} ${doc.specialty} ${doc.degree} ${doc.hospitalName}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating-desc") return b.rating - a.rating;
        if (sortBy === "experience-desc") return b.experienceYears - a.experienceYears;
        if (sortBy === "fee-asc") return a.consultationFee - b.consultationFee;
        if (sortBy === "fee-desc") return b.consultationFee - a.consultationFee;
        return 0;
      });
  }, [doctors, specialty, availableTodayOnly, consultType, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedDoctors = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredDoctors.slice(start, start + PAGE_SIZE);
  }, [filteredDoctors, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [specialty, consultType, availableTodayOnly, search, sortBy]);

  const hasActiveFilters =
    specialty !== "All Specialties" ||
    consultType !== "all" ||
    availableTodayOnly ||
    search.trim().length > 0;

  const handleResetFilters = () => {
    setSpecialty("All Specialties");
    setConsultType("all");
    setAvailableTodayOnly(false);
    setSearch("");
    setSortBy("rating-desc");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 pb-20">
      <Suspense fallback={null}>
        <SearchParamsSync onParams={handleParamsSync} />
      </Suspense>

      {/* Header */}
      <section className="bg-white dark:bg-[#11161d] border-b border-slate-200 dark:border-slate-800 py-10 md:py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
                Physician Network
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Board-Certified Specialist Directory
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                Showing{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {filteredDoctors.length}
                </span>{" "}
                NY-licensed physicians available for in-clinic and telehealth visits.
              </p>
            </div>

            <div className="w-full md:w-80">
              <label
                htmlFor="search-clinician"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Search Specialists
              </label>
              <div className="relative flex items-center">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="search-clinician"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name, specialty, or clinic..."
                  className="input pl-9 pr-9"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white/95 dark:bg-[#11161d]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 py-3.5 sticky top-16 z-30">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                aria-label="Filter by specialty"
                className="min-h-[40px] px-3 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {SPECIALTY_OPTIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>

              <div
                role="group"
                aria-label="Consultation format"
                className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-0.5"
              >
                {(
                  [
                    { id: "all", label: "All Formats" },
                    { id: "video", label: "Telehealth", icon: Video },
                    { id: "in-person", label: "In-Clinic", icon: MapPin },
                  ] as const
                ).map((item) => {
                  const active = consultType === item.id;
                  const Icon = "icon" in item ? item.icon : null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setConsultType(item.id)}
                      className={`relative min-h-[36px] inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                        active
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="consult-format-pill"
                          transition={SHARED_PILL_SPRING}
                          className="absolute inset-0 rounded bg-white dark:bg-slate-800 shadow-xs"
                          aria-hidden="true"
                        />
                      )}
                      {Icon && <Icon className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />}
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                aria-pressed={availableTodayOnly}
                onClick={() => setAvailableTodayOnly((prev) => !prev)}
                className={`min-h-[40px] inline-flex items-center gap-2 px-3 text-xs font-semibold rounded-md border transition-[transform,translate,scale,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer ${
                  availableTodayOnly
                    ? "bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    availableTodayOnly ? "bg-teal-700 dark:bg-teal-400" : "bg-slate-400"
                  }`}
                />
                <span>Available Today</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-doctors" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Sort:
              </label>
              <select
                id="sort-doctors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-h-[40px] px-3 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="experience-desc">Most Experienced</option>
                <option value="fee-asc">Fee: Low to High</option>
                <option value="fee-desc">Fee: High to Low</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="group min-h-[40px] inline-flex items-center gap-1.5 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-md bg-white dark:bg-slate-900 transition-[transform,translate,scale,border-color,color,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                >
                  <RefreshCw
                    className="w-3.5 h-3.5 transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90"
                    aria-hidden="true"
                  />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <section className="container pt-8">
        {filteredDoctors.length === 0 ? (
          <div className="card p-10 text-center max-w-lg mx-auto my-10">
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-4">
              <Stethoscope className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1.5">
              No specialists match your filters
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Try clearing one or more filters to see available board-certified physicians.
            </p>
            <button type="button" onClick={handleResetFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {paginatedDoctors.map((doctor) => (
                <DoctorCard key={doctor.id || doctor._id} doctor={doctor} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Specialist directory pagination"
                className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <p className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, filteredDoctors.length)} of{" "}
                  {filteredDoctors.length} specialists (Page {safePage} of {totalPages})
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="btn-secondary text-xs px-3.5"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="btn-secondary text-xs px-3.5"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
