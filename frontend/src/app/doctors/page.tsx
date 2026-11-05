"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, Filter, X, Stethoscope, Video, MapPin,
  CheckCircle2, SlidersHorizontal, RefreshCw, Calendar, Clock
} from "lucide-react";
import api from "@/lib/api";
import { FALLBACK_DOCTORS, DoctorProfile, matchesSpecialty } from "@/data/doctorsData";
import DoctorCard from "@/components/DoctorCard";

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
];

function SearchParamsSync({
  onParams,
}: {
  onParams: (params: { specialty?: string; search?: string; type?: string; available?: string }) => void;
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

/* Layout-accurate skeleton loader matching exact dimensions of DoctorCard row */
function DoctorRowSkeleton() {
  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
            <div className="h-3.5 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
            <div className="h-3 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          <div className="h-9 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
        </div>
      </div>
      <div className="h-8 w-full bg-neutral-100 dark:bg-neutral-800/60 rounded-lg" />
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(FALLBACK_DOCTORS);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [consultType, setConsultType] = useState<string>("all");
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating-desc");

  const handleParamsSync = useCallback((params: { specialty?: string; search?: string; type?: string; available?: string }) => {
    if (params.specialty) setSpecialty(params.specialty);
    if (params.search) setSearch(params.search);
    if (params.type) setConsultType(params.type);
    if (params.available === "today") setAvailableTodayOnly(true);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data?.success && Array.isArray(res.data.doctors) && res.data.doctors.length > 0) {
          const apiList = res.data.doctors.map((d: any) => {
            const fallbackMatch = FALLBACK_DOCTORS.find((f) => f.id === d._id || f._id === d._id);
            return {
              ...fallbackMatch,
              ...d,
              id: d._id || d.id || fallbackMatch?.id,
              specialty: d.speciality || d.specialty || fallbackMatch?.specialty || "General Physician",
              degree: d.degree || fallbackMatch?.degree || "MBBS, MD",
              experienceYears: d.experience || fallbackMatch?.experienceYears || 6,
              consultationFee: d.fees || fallbackMatch?.consultationFee || 50,
              avatarUrl: d.image || fallbackMatch?.avatarUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
              isAvailableToday: d.available !== false,
              hospitalName: fallbackMatch?.hospitalName || "NewCare Medical Center",
              rating: fallbackMatch?.rating || 4.9,
              reviewsCount: fallbackMatch?.reviewsCount || 120,
              availableSlots: fallbackMatch?.availableSlots || ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"],
            };
          });
          setDoctors(apiList);
        }
      } catch {
        // Fallback data already active
      }
    };
    fetchDoctors();
  }, []);

  // Client-side filtering & sorting
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
          if (!types.some((t) => t.toLowerCase().includes("clinic") || t.toLowerCase().includes("person"))) return false;
        }

        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const nameMatch = doc.name.toLowerCase().includes(q);
          const specMatch = doc.specialty.toLowerCase().includes(q);
          const degreeMatch = (doc.degree || "").toLowerCase().includes(q);
          const hospMatch = (doc.hospitalName || "").toLowerCase().includes(q);
          if (!nameMatch && !specMatch && !degreeMatch && !hospMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating-desc") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "experience-desc") return (b.experienceYears || 0) - (a.experienceYears || 0);
        if (sortBy === "fee-asc") return (a.consultationFee || 0) - (b.consultationFee || 0);
        if (sortBy === "fee-desc") return (b.consultationFee || 0) - (a.consultationFee || 0);
        return 0;
      });
  }, [doctors, specialty, availableTodayOnly, consultType, search, sortBy]);

  const handleResetFilters = () => {
    setSpecialty("All Specialties");
    setConsultType("all");
    setAvailableTodayOnly(false);
    setSearch("");
    setSortBy("rating-desc");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-16">
      <Suspense fallback={null}>
        <SearchParamsSync onParams={handleParamsSync} />
      </Suspense>

      {/* Directory Header Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-6 sm:py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-2">
                <span>Clinical Practitioner Directory</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Accredited Medical Specialists
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">{filteredDoctors.length}</span> verified physicians ready for consultation
              </p>
            </div>

            {/* Keyword Search Input */}
            <div className="w-full md:w-80">
              <label htmlFor="search-clinician" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                Filter by Keyword
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  id="search-clinician"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Doctor name, hospital, credential..."
                  className="w-full h-10 pl-9 pr-8 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Filter Toolbar */}
      <div className="bg-white dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 py-3 sticky top-0 z-30 shadow-xs">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Specialty selector */}
              <div>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  aria-label="Filter by specialty"
                  className="h-9 px-3 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none cursor-pointer"
                >
                  {SPECIALTY_OPTIONS.map((spec) => (
                    <option key={spec} value={spec} className="bg-white dark:bg-neutral-900">
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Format Chips */}
              <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setConsultType("all")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    consultType === "all"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  All Formats
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType("video")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    consultType === "video"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Telehealth</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType("in-person")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    consultType === "in-person"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>In-Clinic</span>
                </button>
              </div>

              {/* Available Today Toggle */}
              <button
                type="button"
                onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
                className={`inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                  availableTodayOnly
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                    : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    availableTodayOnly ? "bg-emerald-600 dark:bg-emerald-400" : "bg-neutral-400"
                  }`}
                />
                <span>Available Today</span>
              </button>
            </div>

            {/* Sort & Reset Actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort doctors"
                className="h-9 px-3 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none cursor-pointer"
              >
                <option value="rating-desc" className="bg-white dark:bg-neutral-900">Highest Rated (★ 5.0)</option>
                <option value="experience-desc" className="bg-white dark:bg-neutral-900">Most Experienced</option>
                <option value="fee-asc" className="bg-white dark:bg-neutral-900">Fee: Low to High</option>
                <option value="fee-desc" className="bg-white dark:bg-neutral-900">Fee: High to Low</option>
              </select>

              {(specialty !== "All Specialties" || consultType !== "all" || availableTodayOnly || search) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 h-9 px-2.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 transition-colors"
                  title="Reset all active filters"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <main className="container pt-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            <DoctorRowSkeleton />
            <DoctorRowSkeleton />
            <DoctorRowSkeleton />
          </div>
        ) : filteredDoctors.length === 0 ? (
          /* Purposeful Zero-State with Recovery Actions */
          <div className="card p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1.5">
              No Doctors Match Current Filter Criteria
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              We couldn&apos;t find any doctors matching your selected criteria
              {specialty !== "All Specialties" && <span> for <strong>{specialty}</strong></span>}
              {availableTodayOnly && <span> with immediate same-day availability</span>}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-primary text-xs px-4 py-2"
              >
                Clear All Filters
              </button>
              <button
                type="button"
                onClick={() => setAvailableTodayOnly(false)}
                className="btn-secondary text-xs px-4 py-2"
              >
                View Next Available Dates
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id || doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
