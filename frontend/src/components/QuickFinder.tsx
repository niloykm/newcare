"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Video, MapPin, Stethoscope, ChevronDown } from "lucide-react";

const SPECIALTIES = [
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

const DATES = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Weekend", value: "weekend" },
];

export default function QuickFinder() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("All Specialties");
  const [consultationType, setConsultationType] = useState<"all" | "in-person" | "video">("all");
  const [dateChoice, setDateChoice] = useState("today");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty !== "All Specialties") {
      params.set("specialty", specialty);
    }
    if (consultationType !== "all") {
      params.set("type", consultationType);
    }
    if (dateChoice === "today") {
      params.set("available", "today");
    }
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "10px",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: 580,
        width: "100%",
      }}
    >
      {/* Upper Mode Pill Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px",
          background: "#f1f5f9",
          borderRadius: "12px",
          width: "fit-content",
        }}
      >
        <button
          type="button"
          onClick={() => setConsultationType("all")}
          style={{
            padding: "5px 12px",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
            background: consultationType === "all" ? "white" : "transparent",
            color: consultationType === "all" ? "#0f172a" : "#64748b",
            boxShadow: consultationType === "all" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          All Formats
        </button>
        <button
          type="button"
          onClick={() => setConsultationType("in-person")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
            background: consultationType === "in-person" ? "white" : "transparent",
            color: consultationType === "in-person" ? "#0ea5e9" : "#64748b",
            boxShadow: consultationType === "in-person" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <MapPin size={12} /> In-Clinic Visit
        </button>
        <button
          type="button"
          onClick={() => setConsultationType("video")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
            background: consultationType === "video" ? "white" : "transparent",
            color: consultationType === "video" ? "#6366f1" : "#64748b",
            boxShadow: consultationType === "video" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <Video size={12} /> HD Video Call
        </button>
      </div>

      {/* Main Search Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr auto",
          gap: "8px",
          alignItems: "center",
        }}
        className="quick-finder-grid"
      >
        {/* Specialty Selection */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "0 12px",
            height: "48px",
          }}
        >
          <Stethoscope size={18} style={{ color: "#0ea5e9", marginRight: "8px", flexShrink: 0 }} />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "0 12px",
            height: "48px",
          }}
        >
          <Calendar size={18} style={{ color: "#6366f1", marginRight: "8px", flexShrink: 0 }} />
          <select
            value={dateChoice}
            onChange={(e) => setDateChoice(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            {DATES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            height: "48px",
            padding: "0 22px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
            color: "white",
            fontWeight: 800,
            fontSize: "0.92rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
            whiteSpace: "nowrap",
            transition: "transform 0.15s ease",
          }}
        >
          <Search size={16} />
          Find Doctors
        </button>
      </div>
    </form>
  );
}
