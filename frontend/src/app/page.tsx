"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search, ArrowRight, ShieldCheck, Clock, Award, Users,
  Stethoscope, Brain, Heart, Baby, Bone, Ear, Activity, Sparkles,
  CheckCircle2, Video, Calendar, UserCheck, ShieldAlert
} from "lucide-react";
import api from "@/lib/api";
import { FALLBACK_DOCTORS, DoctorProfile, normalizeSpecialty } from "@/data/doctorsData";
import DoctorCard from "@/components/DoctorCard";
import QuickFinder from "@/components/QuickFinder";
import LiveAppointmentPreview from "@/components/LiveAppointmentPreview";

const specialties = [
  { name: "General Physician", query: "General Physician", icon: Stethoscope, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", count: "40+ Doctors" },
  { name: "Cardiologist", query: "Cardiologist", icon: Heart, color: "#ef4444", bg: "rgba(239,68,68,0.1)", count: "28+ Doctors" },
  { name: "Dermatologist", query: "Dermatologist", icon: Activity, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", count: "35+ Doctors" },
  { name: "Pediatrician", query: "Pediatrician", icon: Baby, color: "#10b981", bg: "rgba(16,185,129,0.1)", count: "24+ Doctors" },
  { name: "Neurologist", query: "Neurologist", icon: Brain, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", count: "19+ Doctors" },
  { name: "Gynecologist", query: "Gynecologist", icon: Heart, color: "#ec4899", bg: "rgba(236,72,153,0.1)", count: "22+ Doctors" },
  { name: "Orthopedic", query: "Orthopedic", icon: Bone, color: "#f97316", bg: "rgba(249,115,22,0.1)", count: "18+ Doctors" },
  { name: "ENT Specialist", query: "ENT Specialist", icon: Ear, color: "#06b6d4", bg: "rgba(6,182,212,0.1)", count: "16+ Doctors" },
];

export default function Home() {
  // Start with rich fallback doctors immediately — 0 empty skeletons!
  const [featuredDoctors, setFeaturedDoctors] = useState<DoctorProfile[]>(FALLBACK_DOCTORS.slice(0, 6));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data?.success && Array.isArray(res.data.doctors) && res.data.doctors.length > 0) {
          const apiDoctors = res.data.doctors;
          setFeaturedDoctors(apiDoctors.slice(0, 6));
        }
      } catch {
        // Fallback data is already loaded instantaneously
      }
    };
    fetchDoctors();
  }, []);

  const stats = [
    { icon: Users, value: "200+", label: "Verified Specialists" },
    { icon: Award, value: "50,000+", label: "Consultations Completed" },
    { icon: Clock, value: "< 60 Sec", label: "Instant Slot Booking" },
    { icon: ShieldCheck, value: "100%", label: "Board Certified Clinicians" },
  ];

  return (
    <div>
      {/* ── Authentic Zocdoc / One Medical Clinical Hero Section ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)",
          padding: "4.5rem 0 5.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 25% 40%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(circle at 75% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.9fr",
              gap: "3rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left Column: Authentic Clinical Messaging & Interactive Quick-Finder */}
            <div style={{ color: "white" }}>
              {/* Trust Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.16)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "50px",
                  padding: "6px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  marginBottom: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <ShieldCheck size={16} style={{ color: "#4ade80" }} />
                <span>Verified Clinical Network • Instant Video & In-Clinic Booking</span>
              </div>

              {/* Bold Headline */}
              <h1
                style={{
                  fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  marginBottom: "1.2rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Quality Healthcare,<br />
                <span style={{ color: "#ffffff", opacity: 0.9 }}>Scheduled in Seconds.</span>
              </h1>

              <p
                style={{
                  fontSize: "1.08rem",
                  opacity: 0.92,
                  lineHeight: 1.65,
                  marginBottom: "2rem",
                  maxWidth: "540px",
                }}
              >
                Find top-rated, board-certified doctors who accept your needs. Book high-definition telehealth consultations or in-person clinic visits with zero waiting queues.
              </p>

              {/* Interactive Quick-Finder Bar */}
              <QuickFinder />

              {/* Clinical proof points */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  marginTop: "1.75rem",
                  flexWrap: "wrap",
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={15} style={{ color: "#4ade80" }} />
                  <span>BMDC & Board Certified</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={15} style={{ color: "#4ade80" }} />
                  <span>Real-time Calendar Sync</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={15} style={{ color: "#4ade80" }} />
                  <span>Digital Pass & QR Check-in</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Appointment Preview Card */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LiveAppointmentPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics Section ── */}
      <section style={{ marginTop: "-2.5rem", marginBottom: "4.5rem", position: "relative", zIndex: 10 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
              background: "var(--bg-card)",
              borderRadius: "24px",
              padding: "1.75rem 2rem",
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
              border: "1px solid var(--border)",
            }}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ textAlign: "center", padding: "0.5rem" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    background: "rgba(14,165,233,0.1)",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.6rem",
                  }}
                >
                  <Icon size={22} style={{ color: "var(--primary)" }} />
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>
                  {value}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Unified Specialty Explorer with Normalized Query Links ── */}
      <section style={{ paddingBottom: "4.5rem" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 700, fontSize: "0.82rem", marginBottom: "4px" }}>
                <Sparkles size={14} /> EXPLORE MEDICAL CARE
              </div>
              <h2 style={{ fontSize: "2.1rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>
                Find Doctors by <span className="gradient-text">Specialty</span>
              </h2>
            </div>
            <Link
              href="/doctors"
              style={{
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "var(--primary)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              Browse All Specialties <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {specialties.map(({ name, query, icon: Icon, color, bg, count }) => (
              <Link
                key={name}
                href={`/doctors?specialty=${encodeURIComponent(query)}`}
                style={{
                  textDecoration: "none",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                className="group hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    background: bg,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.85rem",
                    transition: "transform 0.2s ease",
                  }}
                  className="group-hover:scale-110"
                >
                  <Icon size={28} style={{ color }} />
                </div>
                <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.25, marginBottom: "3px" }}>
                  {name}
                </p>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Verified Doctors Grid (Instant 0-ms Cold-Start Display) ── */}
      <section
        style={{
          padding: "5rem 0",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10b981", fontWeight: 700, fontSize: "0.82rem", marginBottom: "4px" }}>
                <ShieldCheck size={14} /> 100% BOARD VERIFIED CLINICAL FACULTY
              </div>
              <h2 style={{ fontSize: "2.1rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>
                Top Rated <span className="gradient-text">Doctors</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Book instantly with leading specialists. Real availability updated live.
              </p>
            </div>
            <Link
              href="/doctors"
              className="btn-secondary"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              View All 12+ Specialists <ArrowRight size={16} />
            </Link>
          </div>

          {/* Fully Populated Doctor Cards — 0 Empty Skeletons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id || doctor._id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Role-Based SaaS Showcase Section (Resume Feature Highlight) ── */}
      <section style={{ padding: "5rem 0", background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1",
                padding: "4px 14px",
                borderRadius: "50px",
                fontSize: "0.78rem",
                fontWeight: 800,
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              <Award size={13} /> Engineered For Recruiter Demonstrations
            </div>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              Role-Based SaaS <span className="gradient-text">Dashboards</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}>
              Experience the three synchronized operational portals with stateful appointments, queue management, and RBAC analytics.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
            {/* Patient Portal Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "22px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
              className="hover:shadow-xl transition-all"
            >
              <div style={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(14, 165, 233, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Users size={24} style={{ color: "#0ea5e9" }} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
                👤 Patient Portal
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.5rem", flex: 1 }}>
                Browse verified specialists, complete 3-step Zustand bookings, view appointment slips, and manage upcoming virtual visits with instant QR passes.
              </p>
              <Link
                href="/dashboard/patient"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  background: "rgba(14, 165, 233, 0.1)",
                  color: "#0ea5e9",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                Launch Patient View <ArrowRight size={14} />
              </Link>
            </div>

            {/* Doctor Portal Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "22px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
              className="hover:shadow-xl transition-all"
            >
              <div style={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Stethoscope size={24} style={{ color: "#10b981" }} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
                🩺 Doctor Clinical Desk
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.5rem", flex: 1 }}>
                Live patient queue for today, slot status controls (check-in, complete, reschedule), clinical consultation notes, and active availability toggles.
              </p>
              <Link
                href="/dashboard/doctor"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                Launch Doctor Desk <ArrowRight size={14} />
              </Link>
            </div>

            {/* Admin Portal Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "22px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
              className="hover:shadow-xl transition-all"
            >
              <div style={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(139, 92, 246, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <ShieldAlert size={24} style={{ color: "#8b5cf6" }} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
                🛡️ Clinic Admin Portal
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.5rem", flex: 1 }}>
                Real-time clinic financial metrics, monthly appointment volume analytics, verified practitioner management, and RBAC user credential monitors.
              </p>
              <Link
                href="/dashboard/admin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  background: "rgba(139, 92, 246, 0.1)",
                  color: "#8b5cf6",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                Launch Admin Portal <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How NewCare Works (Fixed: Clean Single Step Badge, No Duplicates) ── */}
      <section style={{ padding: "5rem 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "2.1rem", fontWeight: 900, color: "var(--text)", marginBottom: "0.75rem" }}>
              How <span className="gradient-text">NewCare</span> Works
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", fontSize: "0.95rem" }}>
              Experience frictionless scheduling in three verified clinical steps
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            {[
              {
                step: "01",
                title: "1. Select Specialist & Time",
                desc: "Filter board-certified doctors by specialty, review verified patient ratings, and choose a live 30-minute slot.",
              },
              {
                step: "02",
                title: "2. Confirm Symptoms & Format",
                desc: "Choose between an in-person clinic visit or HD telehealth video link. Enter reason for visit and relevant symptom tags.",
              },
              {
                step: "03",
                title: "3. Digital Pass & Instant Care",
                desc: "Receive your unique Booking ID, calendar sync invite, and fast-track QR code for touchless clinic check-in.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "22px",
                  padding: "2.2rem 1.75rem",
                  position: "relative",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Single clean step badge — no duplicate node */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1rem",
                    boxShadow: "0 6px 16px rgba(14, 165, 233, 0.3)",
                  }}
                >
                  {step}
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text)" }}>
                  {title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clinical CTA ── */}
      <section
        style={{
          padding: "5rem 0",
          background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
          textAlign: "center",
          color: "white",
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: "2.3rem", fontWeight: 900, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Ready to schedule your appointment?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
            Join thousands of patients booking verified medical visits with NewCare every day.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/doctors"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "white",
                color: "#0284c7",
                padding: "14px 30px",
                borderRadius: "14px",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              Find Available Doctors <ArrowRight size={18} />
            </Link>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "14px 26px",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Explore Role Dashboards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
