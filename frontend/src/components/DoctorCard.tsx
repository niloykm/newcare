"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { DoctorProfile } from "@/data/doctorsData";

interface DoctorCardProps {
  doctor: DoctorProfile;
  onQuickBookSlot?: (doctor: DoctorProfile, slot: string) => void;
}

const FALLBACK_AVATAR = "/assets/doc6.png";

export default function DoctorCard({ doctor, onQuickBookSlot }: DoctorCardProps) {
  const [imgError, setImgError] = useState(false);

  const id = doctor.id || doctor._id;
  const avatarUrl = imgError
    ? FALLBACK_AVATAR
    : doctor.avatarUrl || doctor.image || FALLBACK_AVATAR;
  const slots = doctor.availableSlots?.length
    ? doctor.availableSlots.slice(0, 3)
    : ["10:00 AM", "02:00 PM", "04:30 PM"];

  return (
    <article className="card card-interactive p-5 flex flex-col justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Clinician Portrait (object-top to never crop head) */}
        <div className="relative shrink-0">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <Image
              src={avatarUrl}
              alt={doctor.name}
              fill
              sizes="72px"
              loading="eager"
              className="object-cover object-top"
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
          {doctor.verified && (
            <span
              className="absolute -bottom-1 -right-1 bg-white dark:bg-[#11161d] rounded-full p-0.5 border border-slate-200 dark:border-slate-800"
              title="NY State Licensed & ABMS Board Certified"
            >
              <ShieldCheck
                className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400"
                aria-hidden="true"
              />
            </span>
          )}
        </div>

        {/* Clinician Identity */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                {doctor.specialty}
              </p>
              <Link
                href={`/doctors/${id}`}
                className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 hover:text-teal-700 dark:hover:text-teal-400 transition-colors block truncate mt-0.5"
              >
                {doctor.name}
              </Link>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                ${doctor.consultationFee}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                per visit
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {doctor.degree} ·{" "}
            <span className="tabular-nums">{doctor.experienceYears}</span> yrs experience
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{doctor.hospitalName}</span>
            </span>
            <span className="inline-flex items-center gap-1 shrink-0">
              <Star
                className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                aria-hidden="true"
              />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {doctor.rating.toFixed(1)}
              </span>
              <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                ({doctor.reviewsCount})
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Key Slots & Single Clear Booking Action */}
      <div className="pt-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {slots.map((slot) => (
            <Link
              key={slot}
              href={`/doctors/${id}?slot=${encodeURIComponent(slot)}`}
              onClick={(e) => {
                if (onQuickBookSlot) {
                  e.preventDefault();
                  onQuickBookSlot(doctor, slot);
                }
              }}
              className="inline-flex items-center min-h-[36px] px-2.5 py-1.5 text-xs font-medium tabular-nums rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-700 hover:text-teal-700 dark:hover:border-teal-400 dark:hover:text-teal-300 transition-colors duration-200"
            >
              {slot}
            </Link>
          ))}
        </div>

        <Link
          href={`/doctors/${id}`}
          className="inline-flex items-center min-h-[36px] gap-1.5 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
        >
          <span>Book Visit</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
