"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Stethoscope } from "lucide-react";
import { FALLBACK_DOCTORS, DoctorProfile } from "@/data/doctorsData";
import MultiStepBooking from "@/components/MultiStepBooking";
import DoctorCard from "@/components/DoctorCard";
import api from "@/lib/api";

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const docId = unwrappedParams.id;

  const [doctor, setDoctor] = useState<DoctorProfile | null>(() => {
    return FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId) || FALLBACK_DOCTORS[0];
  });
  const [relatedDoctors, setRelatedDoctors] = useState<DoctorProfile[]>([]);

  useEffect(() => {
    const fetchDoc = async () => {
      // Find in fallback first
      const found = FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId);
      if (found) {
        setDoctor(found);
        setRelatedDoctors(FALLBACK_DOCTORS.filter((d) => d.id !== found.id && d.specialty === found.specialty).slice(0, 3));
      }

      // Also try API
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data?.success && Array.isArray(res.data.doctors)) {
          const apiDoc = res.data.doctors.find((d: any) => d._id === docId || d.id === docId);
          if (apiDoc) {
            const merged: DoctorProfile = {
              ...found,
              ...apiDoc,
              id: apiDoc._id || apiDoc.id,
              specialty: apiDoc.speciality || apiDoc.specialty || found?.specialty || "General Physician",
              degree: apiDoc.degree || found?.degree || "MBBS",
              experienceYears: apiDoc.experience || found?.experienceYears || 5,
              consultationFee: apiDoc.fees || found?.consultationFee || 50,
              avatarUrl: apiDoc.image || found?.avatarUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
              hospitalName: found?.hospitalName || "NewCare Medical Center",
              rating: found?.rating || 4.9,
              reviewsCount: found?.reviewsCount || 120,
              isAvailableToday: apiDoc.available !== false,
              availableSlots: found?.availableSlots || ["10:30 AM", "02:00 PM", "04:30 PM"],
            };
            setDoctor(merged);
          }
        }
      } catch {
        // Fallback already assigned
      }
    };
    if (docId) fetchDoc();
  }, [docId]);

  if (!doctor) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Doctor profile not found</p>
          <Link href="/doctors" className="btn-primary">
            Back to All Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "2.5rem 0 5rem" }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
          <button
            onClick={() => router.push("/doctors")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <ChevronLeft size={16} /> All Doctors
          </button>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--text-muted)" }}>{doctor.specialty}</span>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--text)", fontWeight: 700 }}>{doctor.name}</span>
        </div>

        {/* Multi-Step Booking Engine */}
        <MultiStepBooking doctor={doctor} />

        {/* Related Specialists */}
        {relatedDoctors.length > 0 && (
          <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>
                  Other Top {doctor.specialty} Specialists
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                  Explore verified faculty members in the same department
                </p>
              </div>
              <Link
                href={`/doctors?specialty=${encodeURIComponent(doctor.specialty)}`}
                style={{
                  color: "var(--primary)",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                View Department <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {relatedDoctors.map((relDoc) => (
                <DoctorCard key={relDoc.id} doctor={relDoc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
