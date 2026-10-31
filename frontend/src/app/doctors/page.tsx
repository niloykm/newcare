"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, Filter, X, ChevronDown, Stethoscope, Video, MapPin,
  CheckCircle2, Sparkles, SlidersHorizontal, RefreshCw
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

export default function DoctorsPage() {
  // Instant fallback initialization — no empty skeleton screens!
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
          // Merge API doctors with rich fallback data so all cards have full properties
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
              availableSlots: fallbackMatch?.availableSlots || ["10:30 AM", "02:00 PM", "04:30 PM"],
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
        // Specialty match (case-insensitive & plural-tolerant)
        if (specialty !== "All Specialties" && !matchesSpecialty(doc.specialty, specialty)) {
          return false;
        }

        // Available Today filter
        if (availableTodayOnly && !doc.isAvailableToday && !doc.available) {
          return false;
        }

        // Consultation Type filter
        if (consultType === "video") {
          const types = doc.consultationTypes || ["HD Video Consultation", "In-Clinic Visit"];
          if (!types.some((t) => t.toLowerCase().includes("video"))) return false;
        } else if (consultType === "in-person") {
          const types = doc.consultationTypes || ["In-Clinic Visit"];
          if (!types.some((t) => t.toLowerCase().includes("clinic") || t.toLowerCase().includes("person"))) return false;
        }

        // Search query (doctor name, specialty, degree, hospital)
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
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "5rem" }}>
      <Suspense fallback={null}>
        <SearchParamsSync onParams={handleParamsSync} />
      </Suspense>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)",
          padding: "3.5rem 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              borderRadius: "50px",
              padding: "4px 14px",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            <Sparkles size={14} style={{ color: "#4ade80" }} /> Verified Clinical Network
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Specialist Directory
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem", maxWidth: "560px", margin: "0 auto 1.75rem" }}>
            Browse {doctors.length}+ verified medical specialists. Filter by consultation type, real-time availability, and verified patient ratings.
          </p>

          {/* Search bar inside header */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "8px",
              display: "flex",
              gap: "8px",
              maxWidth: 580,
              margin: "0 auto",
              boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={18} style={{ position: "absolute", left: 14, color: "#94a3b8" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name, hospital, or credential..."
                style={{
                  width: "100%",
                  height: 44,
                  border: "none",
                  outline: "none",
                  paddingLeft: 42,
                  paddingRight: 12,
                  fontSize: "0.92rem",
                  color: "#0f172a",
                  background: "transparent",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    padding: 4,
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 0",
          position: "sticky",
          top: 70,
          zIndex: 90,
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          {/* Left: Filter Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Specialty Dropdown */}
            <div style={{ position: "relative" }}>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {SPECIALTY_OPTIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Consultation Format Toggle */}
            <div
              style={{
                display: "inline-flex",
                background: "var(--bg-secondary)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                padding: "3px",
              }}
            >
              <button
                type="button"
                onClick={() => setConsultType("all")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: consultType === "all" ? "var(--bg-card)" : "transparent",
                  color: consultType === "all" ? "var(--primary)" : "var(--text-secondary)",
                  boxShadow: consultType === "all" ? "var(--shadow-sm)" : "none",
                }}
              >
                All Formats
              </button>
              <button
                type="button"
                onClick={() => setConsultType("video")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: consultType === "video" ? "var(--bg-card)" : "transparent",
                  color: consultType === "video" ? "#6366f1" : "var(--text-secondary)",
                  boxShadow: consultType === "video" ? "var(--shadow-sm)" : "none",
                }}
              >
                <Video size={13} /> Video
              </button>
              <button
                type="button"
                onClick={() => setConsultType("in-person")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: consultType === "in-person" ? "var(--bg-card)" : "transparent",
                  color: consultType === "in-person" ? "#0ea5e9" : "var(--text-secondary)",
                  boxShadow: consultType === "in-person" ? "var(--shadow-sm)" : "none",
                }}
              >
                <MapPin size={13} /> In-Person
              </button>
            </div>

            {/* Available Today Toggle */}
            <button
              type="button"
              onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "10px",
                border: availableTodayOnly ? "1.5px solid #10b981" : "1px solid var(--border)",
                background: availableTodayOnly ? "rgba(16, 185, 129, 0.12)" : "var(--bg-secondary)",
                color: availableTodayOnly ? "#10b981" : "var(--text)",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: availableTodayOnly ? "#10b981" : "#94a3b8",
                }}
              />
              Available only
            </button>
          </div>

          {/* Right: Sort Dropdown & Reset */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                color: "var(--text)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="rating-desc">Highest Rated (★ 5.0)</option>
              <option value="experience-desc">Most Experienced</option>
              <option value="fee-asc">Consultation Fee: Low to High</option>
              <option value="fee-desc">Consultation Fee: High to Low</option>
            </select>

            {(specialty !== "All Specialties" || consultType !== "all" || availableTodayOnly || search) && (
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <RefreshCw size={12} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content List */}
      <div className="container" style={{ paddingTop: "2.5rem" }}>
        {/* Results Counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", fontWeight: 600 }}>
            Showing <span style={{ color: "var(--text)", fontWeight: 800 }}>{filteredDoctors.length}</span> verified specialists
            {specialty !== "All Specialties" && ` in ${specialty}`}
          </p>
        </div>

        {filteredDoctors.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--bg-card)",
              borderRadius: "24px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(14, 165, 233, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <Stethoscope size={32} style={{ color: "var(--primary)" }} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
              No Doctors Match Current Filters
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
              Try broadening your specialty selection or clear the availability filter to view all board-certified doctors.
            </p>
            <button onClick={handleResetFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id || doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
