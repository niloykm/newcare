"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import {
  ApiDoctorRecord,
  DoctorProfile,
  FALLBACK_DOCTORS,
  normalizeApiDoctor,
} from "@/data/doctorsData";
import MultiStepBooking from "@/components/MultiStepBooking";
import DoctorCard from "@/components/DoctorCard";
import api from "@/lib/api";

export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const docId = unwrappedParams.id;

  const [doctor, setDoctor] = useState<DoctorProfile>(() => {
    return (
      FALLBACK_DOCTORS.find(
        (d) => d.id === docId || d._id === docId || d.slug === docId
      ) || FALLBACK_DOCTORS[0]
    );
  });

  const [relatedDoctors, setRelatedDoctors] = useState<DoctorProfile[]>(() => {
    const initial =
      FALLBACK_DOCTORS.find(
        (d) => d.id === docId || d._id === docId || d.slug === docId
      ) || FALLBACK_DOCTORS[0];
    return FALLBACK_DOCTORS.filter(
      (d) => d.id !== initial.id && d.specialty === initial.specialty
    ).slice(0, 2);
  });

  useEffect(() => {
    const found = FALLBACK_DOCTORS.find(
      (d) => d.id === docId || d._id === docId || d.slug === docId
    );
    if (found) {
      setDoctor(found);
      setRelatedDoctors(
        FALLBACK_DOCTORS.filter(
          (d) => d.id !== found.id && d.specialty === found.specialty
        ).slice(0, 2)
      );
    }

    const fetchDoc = async () => {
      try {
        const res = await api.get<{ success?: boolean; doctors?: ApiDoctorRecord[] }>(
          "/api/doctor/list"
        );
        if (res.data?.success && Array.isArray(res.data.doctors)) {
          const apiDoc = res.data.doctors.find(
            (d) => d._id === docId || d.id === docId
          );
          if (apiDoc) {
            setDoctor(normalizeApiDoctor(apiDoc, found));
          }
        }
      } catch {
        // Fallback doctor active
      }
    };
    if (docId) fetchDoc();
  }, [docId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 py-8 pb-20">
      <div className="container">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 mb-6 text-xs font-medium text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/doctors"
            className="hover:text-teal-700 dark:hover:text-teal-400 inline-flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Specialists</span>
          </Link>
          <span aria-hidden="true">/</span>
          <span>{doctor.specialty}</span>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {doctor.name}
          </span>
        </nav>

        <Suspense
          fallback={
            <div className="max-w-3xl mx-auto card p-8 text-sm text-slate-500">
              Loading schedule...
            </div>
          }
        >
          <MultiStepBooking doctor={doctor} />
        </Suspense>

        {relatedDoctors.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Other {doctor.specialty} Specialists
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Board-certified physicians in the same specialty
                </p>
              </div>
              <Link
                href={`/doctors?specialty=${encodeURIComponent(doctor.specialty)}`}
                className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View specialty</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {relatedDoctors.map((relDoc) => (
                <DoctorCard key={relDoc.id} doctor={relDoc} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
