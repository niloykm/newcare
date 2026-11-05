"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
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
      const found = FALLBACK_DOCTORS.find((d) => d.id === docId || d._id === docId || d.slug === docId);
      if (found) {
        setDoctor(found);
        setRelatedDoctors(FALLBACK_DOCTORS.filter((d) => d.id !== found.id && d.specialty === found.specialty).slice(0, 3));
      }

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
              availableSlots: found?.availableSlots || ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"],
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
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="card p-8 text-center max-w-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Doctor profile could not be located</p>
          <Link href="/doctors" className="btn-primary text-xs px-4 py-2">
            Back to Specialist Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-6 sm:py-8">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <button
            onClick={() => router.push("/doctors")}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>All Doctors</span>
          </button>
          <span>/</span>
          <span>{doctor.specialty}</span>
          <span>/</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{doctor.name}</span>
        </nav>

        {/* Multi-Step Booking Engine */}
        <MultiStepBooking doctor={doctor} />

        {/* Related Department Specialists */}
        {relatedDoctors.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Other {doctor.specialty} Practitioners
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Accredited physicians in the same department
                </p>
              </div>
              <Link
                href={`/doctors?specialty=${encodeURIComponent(doctor.specialty)}`}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View department</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
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
