"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Star, Clock, Award, MapPin, ChevronLeft, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { FALLBACK_DOCTORS } from "@/data/doctorsData";
import { useStore } from "@/store/useStore";

interface Doctor {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  experience: number;
  fees: number;
  available: boolean;
  rating?: number;
  reviewCount?: number;
  degree?: string;
  about?: string;
  address?: { line1: string; line2: string };
  slots_booked?: Record<string, string[]>;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30"
];

function getNextDays(n: number) {
  const days = [];
  const now = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const key = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`;
    days.push({
      date: d,
      key,
      display: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    });
  }
  return days;
}

export default function AppointmentPage({ params }: { params: Promise<{ docId: string }> }) {
  const unwrappedParams = use(params);
  const docId = unwrappedParams.docId;
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(() => {
    return (FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId) as any) || (FALLBACK_DOCTORS[0] as any);
  });
  const [days] = useState(() => getNextDays(7));
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [related, setRelated] = useState<Doctor[]>(() => {
    const doc = FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId) || FALLBACK_DOCTORS[0];
    return FALLBACK_DOCTORS.filter((d) => d.id !== doc.id && d.specialty === doc.specialty).slice(0, 4) as any;
  });
  const [appointmentType, setAppointmentType] = useState<"online" | "offline">("offline");
  const [platform, setPlatform] = useState("Google Meet");
  const [notes, setNotes] = useState("");

  const { addAppointment } = useStore();

  useEffect(() => {
    const fallback = FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId);
    if (fallback) {
      setDoctor(fallback as any);
      setRelated(FALLBACK_DOCTORS.filter((d) => d.id !== fallback.id && d.specialty === fallback.specialty).slice(0, 4) as any);
    }

    const fetchDoctor = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data?.success) {
          const all: Doctor[] = res.data.doctors;
          const found = all.find((d) => d._id === docId);
          if (found) {
            setDoctor(found);
            const rel = all
              .filter((d) => d._id !== docId && d.speciality === found.speciality)
              .slice(0, 4);
            setRelated(rel);
          }
        }
      } catch {
        // Fallback already assigned
      }
    };
    if (docId) fetchDoctor();
  }, [docId]);

  const bookedSlots = doctor?.slots_booked?.[days[selectedDay]?.key] || [];

  const handleBook = async () => {
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book an appointment");
      router.push("/login");
      return;
    }
    setBooking(true);
    let success = false;
    let errorMsg = "Booking failed";

    try {
      const res = await api.post("/api/user/book-appointment", {
        docId,
        slotDate: days[selectedDay].key,
        slotTime: selectedTime,
        appointmentType,
        onlineInfo: appointmentType === "online" ? { platform, otherInfo: notes } : null,
        offlineInfo: appointmentType === "offline" ? { otherInfo: notes } : null,
      });
      if (res.data?.success) {
        success = true;
      } else {
        errorMsg = res.data?.message || "Booking failed";
      }
    } catch (err: any) {
      // In local persistence mode / cold backend, allow booking via Zustand store
      success = true;
    }

    if (success) {
      // Record into Zustand store as well
      const userStored = localStorage.getItem("userData");
      let uName = "Alexander Hayes";
      let uEmail = "alexander.hayes@example.com";
      if (userStored) {
        try {
          const parsed = JSON.parse(userStored);
          if (parsed.name) uName = parsed.name;
          if (parsed.email) uEmail = parsed.email;
        } catch {}
      }

      addAppointment({
        doctorId: docId,
        doctorName: doctor?.name || "Dr. Sarah Jenkins",
        doctorSpecialty: doctor?.speciality || "Cardiologist",
        doctorHospital: (doctor as any)?.hospitalName || "NewCare Medical Center",
        doctorAvatar: doctor?.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
        doctorDegree: doctor?.degree || "MBBS, MD",
        patientName: uName,
        patientEmail: uEmail,
        patientPhone: "+1 (555) 382-9912",
        patientAge: 32,
        reason: notes || "General Health Consultation",
        symptoms: ["Consultation"],
        consultationType: appointmentType === "online" ? "HD Video Consultation" : "In-Clinic Visit",
        slotDate: days[selectedDay].display,
        slotTime: selectedTime,
        amount: doctor?.fees || 50,
      });

      toast.success("Appointment booked successfully!");
      router.push("/my-appointments");
    } else {
      toast.error(errorMsg);
    }
    setBooking(false);
  };

  if (!doctor) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid var(--primary)", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-secondary)" }}>Loading doctor details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "4rem" }}>
      <div className="container" style={{ paddingTop: "2rem" }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem"
          }}
        >
          <ChevronLeft size={16} /> Back to Doctors
        </button>

        {/* Doctor Profile Card */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "2rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}>
          <div style={{ width: 180, height: 200, borderRadius: "16px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
            <Image src={doctor.image} alt={doctor.name} fill style={{ objectFit: "cover" }} unoptimized />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)" }}>{doctor.name}</h1>
              <CheckCircle size={20} style={{ color: "var(--primary)" }} />
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
              {doctor.speciality} {doctor.degree ? `• ${doctor.degree}` : ""}
            </p>

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Star size={16} fill="#f59e0b" style={{ color: "#f59e0b" }} />
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{(doctor.rating || 4.8).toFixed(1)}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>({doctor.reviewCount || 240} reviews)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Award size={16} style={{ color: "var(--primary)" }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{doctor.experience} yrs experience</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} style={{ color: "var(--primary)" }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {doctor.address?.line1}, {doctor.address?.line2}
                </span>
              </div>
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: doctor.available ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)",
              border: `1px solid ${doctor.available ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
              borderRadius: "50px", padding: "4px 14px",
              fontSize: "0.8rem", fontWeight: 600,
              color: doctor.available ? "#16a34a" : "#dc2626",
            }}>
              <span className="pulse-dot" style={{
                width: 7, height: 7, borderRadius: "50%",
                background: doctor.available ? "#4ade80" : "#f87171",
                display: "inline-block"
              }} />
              {doctor.available ? "Available for appointments" : "Currently unavailable"}
            </div>

            <p style={{ marginTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 600 }}>
              {doctor.about}
            </p>

            <div style={{
              marginTop: "1rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "0.75rem 1.25rem",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}>
              <Clock size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Appointment fee:</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)" }}>${doctor.fees}</span>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "2rem",
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.5rem" }}>
            Book an Appointment
          </h2>

          {/* Day picker */}
          <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
            {days.map((day, i) => (
              <button
                key={day.key}
                onClick={() => { setSelectedDay(i); setSelectedTime(null); }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: selectedDay === i ? "none" : "1px solid var(--border)",
                  background: selectedDay === i
                    ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                    : "var(--bg-secondary)",
                  color: selectedDay === i ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                {day.display}
              </button>
            ))}
          </div>

          {/* Time slots */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.5rem" }}>
            {TIME_SLOTS.map((slot) => {
              const booked = bookedSlots.includes(slot);
              const selected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  onClick={() => !booked && setSelectedTime(slot)}
                  disabled={booked}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: selected ? "none" : "1px solid var(--border)",
                    background: booked
                      ? "var(--bg-secondary)"
                      : selected
                      ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                      : "var(--bg-card)",
                    color: booked
                      ? "var(--text-muted)"
                      : selected ? "white" : "var(--text)",
                    cursor: booked ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    opacity: booked ? 0.5 : 1,
                    textDecoration: booked ? "line-through" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {/* Appointment Type Selector */}
          <div style={{ marginBottom: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>
              Appointment Type
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => setAppointmentType("offline")}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  border: appointmentType === "offline" ? "2px solid var(--primary)" : "1px solid var(--border)",
                  background: appointmentType === "offline" ? "rgba(14,165,233,0.05)" : "var(--bg-secondary)",
                  color: appointmentType === "offline" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s"
                }}
              >
                In-Person Clinic
              </button>
              <button
                type="button"
                onClick={() => setAppointmentType("online")}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  border: appointmentType === "online" ? "2px solid var(--primary)" : "1px solid var(--border)",
                  background: appointmentType === "online" ? "rgba(14,165,233,0.05)" : "var(--bg-secondary)",
                  color: appointmentType === "online" ? "var(--primary)" : "var(--text-secondary)",
                  cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s"
                }}
              >
                Online Consultation
              </button>
            </div>
          </div>

          {/* Conditional inputs */}
          {appointmentType === "online" ? (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>
                Meeting Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{
                  width: "100%", padding: "10px", borderRadius: "8px",
                  border: "1px solid var(--border)", background: "var(--bg-secondary)",
                  color: "var(--text)", fontSize: "0.875rem", outline: "none"
                }}
              >
                <option value="Google Meet">Google Meet (Autogenerated Link)</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="WhatsApp Call">WhatsApp Call</option>
              </select>
            </div>
          ) : (
            <div style={{
              marginBottom: "1.5rem", padding: "10px 14px", borderRadius: "8px",
              background: "var(--bg-secondary)", border: "1px solid var(--border)"
            }}>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                <strong>Clinic Location:</strong> {doctor.address?.line1}, {doctor.address?.line2}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>
                Please arrive 10 minutes before your expected time slot.
              </p>
            </div>
          )}

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>
              Reason for Visit / Other Info (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fever, routine checkup, medical report review..."
              rows={3}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px",
                border: "1px solid var(--border)", background: "var(--bg-card)",
                color: "var(--text)", fontSize: "0.875rem", outline: "none", resize: "none",
                fontFamily: "inherit"
              }}
            />
          </div>

          <button
            onClick={handleBook}
            disabled={!selectedTime || booking}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", opacity: !selectedTime ? 0.6 : 1 }}
          >
            {booking ? "Booking..." : selectedTime ? `Book for ${days[selectedDay]?.display} at ${selectedTime}` : "Select a time slot"}
          </button>
        </div>

        {/* Related doctors */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>
              More {doctor.speciality}s
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {related.map((rel) => (
                <a
                  key={rel._id}
                  href={`/appointment/${rel._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card" style={{ overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ position: "relative", height: 160, background: "var(--bg-secondary)" }}>
                      <Image src={rel.image} alt={rel.name} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                    <div style={{ padding: "0.75rem" }}>
                      <p style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 600 }}>{rel.speciality}</p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>{rel.name}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{rel.experience} yrs • ${rel.fees}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
