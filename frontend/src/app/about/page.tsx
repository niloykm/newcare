"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Heart, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Founded", value: "2022" },
    { label: "Verified Doctors", value: "200+" },
    { label: "Happy Patients", value: "50,000+" },
    { label: "Consultations", value: "100,000+" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-First Care",
      desc: "We design every feature, interaction, and process with the patient's well-being and convenience at the absolute center.",
      color: "#0ea5e9",
      bg: "rgba(14,165,233,0.1)",
    },
    {
      icon: Shield,
      title: "Absolute Trust",
      desc: "All doctors on our platform undergo a rigorous verification process, ensuring you only receive advice from qualified professionals.",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      icon: Award,
      title: "Clinical Excellence",
      desc: "We partner with leading clinics and hospitals to deliver state-of-the-art diagnostic and healthcare consultation capabilities.",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
        padding: "5rem 0",
        textAlign: "center",
        color: "white"
      }}>
        <div className="container">
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1rem" }}>
            About <span style={{ opacity: 0.9 }}>NewCare</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", maxWidth: 600, margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
            We are on a mission to make quality healthcare accessible, transparent, and completely hassle-free for everyone, everywhere.
          </p>
        </div>
      </div>

      {/* Main Intro */}
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem" }}>
              Redefining Healthcare <span className="gradient-text">Accessibility</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1.2rem" }}>
              NewCare was founded with a simple yet powerful idea: finding and booking a doctor should not be a stressful chore. We bridge the gap between patients and elite healthcare providers, offering real-time scheduling, verified patient reviews, and digital health record tracking.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "2rem" }}>
              Whether you need a routine check-up, a specialist consultation, or emergency guidance, NewCare connects you to verified practitioners in under a minute.
            </p>
            <Link href="/doctors" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Find a Specialist Now <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ position: "relative", height: 380, borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow-xl)" }}>
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=800&fit=crop"
              alt="Healthcare professionals working"
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "4rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
            {stats.map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary)", marginBottom: "0.5rem" }}>{value}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem" }}>
            Our Core <span className="gradient-text">Values</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            These principles guide everything we do as we build the future of medical connectivity.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {values.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "2rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}>
              <div style={{
                width: 50, height: 50,
                background: bg,
                borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.5rem"
              }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>{title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Governance, Privacy & Standards */}
      <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", padding: "4.5rem 0" }}>
        <div className="container">
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>
            {/* Standards */}
            <div id="standards" style={{ scrollMarginTop: "100px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 700, fontSize: "0.82rem", marginBottom: "4px" }}>
                <Shield size={14} /> CLINICAL EXCELLENCE
              </div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem" }}>
                Board Verification &amp; Credentialing Standards
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                Every healthcare practitioner listed on the NewCare platform undergoes comprehensive primary-source credential verification. We validate medical board certifications (BMDC, USMLE, GMC equivalent), active clinical licensing, malpractice history, and hospital affiliations prior to onboarding.
              </p>
            </div>

            {/* Privacy */}
            <div id="privacy" style={{ scrollMarginTop: "100px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10b981", fontWeight: 700, fontSize: "0.82rem", marginBottom: "4px" }}>
                <Shield size={14} /> SECURITY &amp; CONFIDENTIALITY
              </div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem" }}>
                Patient Data &amp; Privacy Policy
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                NewCare employs 256-bit AES encryption in transit and at rest for all electronic health records, consultation notes, and virtual video sessions. Patient health data is strictly segregated using role-based access control (RBAC), ensuring that only treating clinicians and authenticated patients access personal medical slips.
              </p>
            </div>

            {/* Terms */}
            <div id="terms" style={{ scrollMarginTop: "100px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#8b5cf6", fontWeight: 700, fontSize: "0.82rem", marginBottom: "4px" }}>
                <Award size={14} /> TRANSPARENCY
              </div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem" }}>
                Terms of Service &amp; Fair Scheduling
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                Appointments booked through NewCare feature real-time slot synchronization, clear cancellation policies, and touchless digital QR pass verification. Fees are displayed upfront without hidden administrative markups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
