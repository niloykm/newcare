"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, ShieldCheck, MapPin, Calendar, Clock, ArrowRight, Video, UserCheck } from "lucide-react";
import { DoctorProfile } from "@/data/doctorsData";

interface DoctorCardProps {
  doctor: DoctorProfile | any;
  onQuickBookSlot?: (doctor: DoctorProfile, slot: string) => void;
}

export default function DoctorCard({ doctor, onQuickBookSlot }: DoctorCardProps) {
  const [imgError, setImgError] = useState(false);
  const fallbackImg = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600";

  const id = doctor.id || doctor._id;
  const name = doctor.name;
  const specialty = doctor.specialty || doctor.speciality || "General Physician";
  const degree = doctor.degree || "MBBS, MD";
  const experienceYears = doctor.experienceYears || doctor.experience || 5;
  const rating = doctor.rating || 4.9;
  const reviewsCount = doctor.reviewsCount || doctor.reviewCount || 128;
  const consultationFee = doctor.consultationFee || doctor.fees || 50;
  const hospitalName = doctor.hospitalName || (doctor.address?.line1 ? `${doctor.address.line1}` : "NewCare Medical Center");
  const avatarUrl = imgError ? fallbackImg : (doctor.avatarUrl || doctor.image || fallbackImg);
  const isAvailableToday = doctor.isAvailableToday !== undefined ? doctor.isAvailableToday : doctor.available !== false;
  const nextAvailableSlot = doctor.nextAvailableSlot || (isAvailableToday ? "Today, 4:30 PM" : "Tomorrow, 10:00 AM");
  const slots: string[] = doctor.availableSlots || ["10:30 AM", "02:00 PM", "04:30 PM"];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      className="group hover:shadow-xl hover:-translate-y-1"
    >
      {/* Top Image & Status Pill */}
      <div style={{ position: "relative", height: "210px", width: "100%", background: "#f1f5f9", overflow: "hidden" }}>
        <Image
          src={avatarUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          style={{ objectFit: "cover" }}
          onError={() => setImgError(true)}
          unoptimized
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%)",
          }}
        />

        {/* Live Status Pill */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: isAvailableToday ? "rgba(16, 185, 129, 0.95)" : "rgba(30, 41, 59, 0.85)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "5px 12px",
            borderRadius: "50px",
            fontSize: "0.74rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: isAvailableToday ? "#ffffff" : "#fbbf24",
              display: "inline-block",
            }}
          />
          {isAvailableToday ? "🟢 Available Today" : `Next: ${nextAvailableSlot}`}
        </div>

        {/* Board Verified Pill */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(14, 165, 233, 0.92)",
            backdropFilter: "blur(6px)",
            color: "white",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          <ShieldCheck size={13} />
          ✓ BMDC / Board Verified
        </div>
      </div>

      {/* Body Details */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1, gap: "0.6rem" }}>
        {/* Specialty Tag & Fee */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              background: "rgba(14, 165, 233, 0.12)",
              color: "var(--primary)",
              fontWeight: 700,
              fontSize: "0.76rem",
              padding: "3px 10px",
              borderRadius: "6px",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {specialty}
          </span>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>${consultationFee}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "3px" }}>/ visit</span>
          </div>
        </div>

        {/* Doctor Name & Degree */}
        <div>
          <Link
            href={`/doctors/${id}`}
            style={{
              textDecoration: "none",
              color: "var(--text)",
              display: "block",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                lineHeight: 1.3,
                marginBottom: "3px",
              }}
            >
              {name}
            </h3>
          </Link>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {degree}
          </p>
        </div>

        {/* Hospital */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.78rem" }}>
          <MapPin size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hospitalName}</span>
        </div>

        {/* Rating & Experience */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.4rem",
            borderTop: "1px dashed var(--border)",
            fontSize: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={14} fill="#f59e0b" style={{ color: "#f59e0b" }} />
            <span style={{ fontWeight: 800, color: "var(--text)" }}>{rating.toFixed(1)}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>({reviewsCount} reviews)</span>
          </div>
          <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
            ⚡ {experienceYears}+ Yrs Exp
          </div>
        </div>

        {/* Next Available Slots Pills */}
        <div style={{ marginTop: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Next Available Slots:
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {slots.slice(0, 2).map((slot) => (
              <Link
                key={slot}
                href={`/doctors/${id}?slot=${encodeURIComponent(slot)}`}
                style={{
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "var(--bg-secondary)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.15s ease",
                }}
              >
                <Clock size={11} style={{ color: "var(--primary)" }} />
                {slot}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: "0.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <Link
            href={`/doctors/${id}`}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "9px 12px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.82rem",
              boxShadow: "0 4px 12px rgba(14, 165, 233, 0.25)",
              textAlign: "center",
            }}
          >
            Book Slot <ArrowRight size={14} />
          </Link>
          <Link
            href={`/appointment/${id}`}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "9px 12px",
              borderRadius: "10px",
              background: "var(--bg-secondary)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              fontWeight: 600,
              fontSize: "0.82rem",
              textAlign: "center",
            }}
          >
            <Video size={13} style={{ color: "var(--primary)" }} /> Video / Clinic
          </Link>
        </div>
      </div>
    </div>
  );
}
