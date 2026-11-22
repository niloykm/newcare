"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  ApiDoctorRecord,
  DoctorProfile,
  FALLBACK_DOCTORS,
  normalizeApiDoctor,
} from "@/data/doctorsData";
import MultiStepBooking from "@/components/MultiStepBooking";
import api from "@/lib/api";

export default function LegacyAppointmentPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const unwrappedParams = use(params);
  const docId = unwrappedParams.docId;

  const [doctor, setDoctor] = useState<DoctorProfile>(() => {
    return (
      FALLBACK_DOCTORS.find(
        (d) => d.id === docId || d._id === docId || d.slug === docId
      ) || FALLBACK_DOCTORS[0]
    );
  });

  useEffect(() => {
    const found = FALLBACK_DOCTORS.find(
      (d) => d.id === docId || d._id === docId || d.slug === docId
    );
    if (found) {
      setDoctor(found);
    }

    const fetchDoc = async () => {
      try {
        const res = await api.get<{ success?: boolean; doctors?: ApiDoctorRecord[] }>(
          "/api/doctor/list"
        );
        if (res.data?.success && Array.isArray(res.data.doctors)) {
          const idx = res.data.doctors.findIndex(
            (d) => d._id === docId || d.id === docId
          );
          if (idx >= 0) {
            const raw = res.data.doctors[idx];
            const match =
              found || FALLBACK_DOCTORS[idx % FALLBACK_DOCTORS.length];
            setDoctor(normalizeApiDoctor(raw, match));
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
      </div>
    </div>
  );
}
