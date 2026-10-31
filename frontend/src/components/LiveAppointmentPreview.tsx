"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ShieldCheck, Clock, Calendar, CheckCircle2, Video, ArrowRight, Zap, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function LiveAppointmentPreview() {
  const router = useRouter();
  const { setSelectedDoctor, setConsultationType, setSelectedTime, setBookingStep } = useStore();
  const [selectedSlot, setSelectedSlot] = useState("04:30 PM");
  const [consultType, setConsultType] = useState<"In-Clinic Visit" | "HD Video Consultation">("In-Clinic Visit");

  const slots = ["10:30 AM", "02:00 PM", "04:30 PM"];

  const handleInstantDemo = () => {
    setConsultationType(consultType);
    setSelectedTime(selectedSlot);
    setBookingStep(1);
    router.push(`/doctors/doc-1?slot=${encodeURIComponent(selectedSlot)}&type=${encodeURIComponent(consultType)}`);
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        borderRadius: "28px",
        padding: "1.75rem",
        boxShadow: "0 25px 60px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6)",
        maxWidth: "430px",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Top Floating Badge */}
      <div
        style={{
          position: "absolute",
          top: "-14px",
          right: "24px",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          borderRadius: "50px",
          padding: "5px 14px",
          fontSize: "0.74rem",
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 6px 16px rgba(16, 185, 129, 0.35)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#ffffff",
          }}
        />
        Live Schedule Active
      </div>

      {/* Doctor Header */}
      <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "1.25rem" }}>
        <div
          style={{
            position: "relative",
            width: 68,
            height: 68,
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
            flexShrink: 0,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"
            alt="Dr. Sarah Jenkins"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
            <span
              style={{
                background: "rgba(14, 165, 233, 0.12)",
                color: "#0284c7",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              Cardiologist
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                color: "#10b981",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={13} /> Verified
            </div>
          </div>

          <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
            Dr. Sarah Jenkins
          </h4>
          <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
            Mount Sinai Heart Center, NY
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Star size={13} fill="#f59e0b" style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0f172a" }}>4.9</span>
              <span style={{ fontSize: "0.74rem", color: "#94a3b8" }}>(168)</span>
            </div>
            <span style={{ fontSize: "0.76rem", color: "#64748b", fontWeight: 600 }}>• 14+ Yrs Exp</span>
          </div>
        </div>
      </div>

      {/* Format Selector */}
      <div style={{ marginBottom: "1.2rem" }}>
        <p style={{ fontSize: "0.76rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
          1. Choose Format
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setConsultType("In-Clinic Visit")}
            style={{
              padding: "8px 10px",
              borderRadius: "12px",
              border: consultType === "In-Clinic Visit" ? "2px solid #0ea5e9" : "1px solid #e2e8f0",
              background: consultType === "In-Clinic Visit" ? "rgba(14, 165, 233, 0.08)" : "#f8fafc",
              color: consultType === "In-Clinic Visit" ? "#0284c7" : "#475569",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <CheckCircle2 size={13} style={{ color: consultType === "In-Clinic Visit" ? "#0ea5e9" : "#cbd5e1" }} />
            In-Clinic Visit
          </button>
          <button
            type="button"
            onClick={() => setConsultType("HD Video Consultation")}
            style={{
              padding: "8px 10px",
              borderRadius: "12px",
              border: consultType === "HD Video Consultation" ? "2px solid #6366f1" : "1px solid #e2e8f0",
              background: consultType === "HD Video Consultation" ? "rgba(99, 102, 241, 0.08)" : "#f8fafc",
              color: consultType === "HD Video Consultation" ? "#4f46e5" : "#475569",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <Video size={13} />
            HD Video Call
          </button>
        </div>
      </div>

      {/* Real-time Slots Selector */}
      <div style={{ marginBottom: "1.4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            2. Select Available Slot Today
          </span>
          <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#10b981" }}>
            ⚡ Instant Confirm
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                style={{
                  padding: "10px 4px",
                  borderRadius: "12px",
                  border: isSelected ? "2px solid #0ea5e9" : "1px solid #e2e8f0",
                  background: isSelected ? "#0ea5e9" : "#f8fafc",
                  color: isSelected ? "#ffffff" : "#1e293b",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 8px 16px rgba(14, 165, 233, 0.3)" : "none",
                }}
              >
                <span>{slot}</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    opacity: isSelected ? 0.9 : 0.6,
                    fontWeight: 600,
                  }}
                >
                  30 mins
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Book In 3 Clicks Trigger */}
      <button
        onClick={handleInstantDemo}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "none",
          background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
          color: "white",
          fontWeight: 800,
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(14, 165, 233, 0.4)",
          transition: "transform 0.15s ease",
        }}
      >
        <Zap size={18} fill="#facc15" style={{ color: "#facc15" }} />
        <span>⚡ Book in 3 Clicks</span>
        <ArrowRight size={16} />
      </button>

      {/* Trust micro-copy */}
      <p
        style={{
          fontSize: "0.72rem",
          color: "#94a3b8",
          textAlign: "center",
          marginTop: "10px",
          fontWeight: 500,
        }}
      >
        Free cancellation • No upfront credit card required
      </p>
    </div>
  );
}
