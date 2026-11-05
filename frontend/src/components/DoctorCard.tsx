"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, ShieldCheck, MapPin, Clock, Calendar, ArrowRight, Video } from "lucide-react";
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
  const rating = Number(doctor.rating || 4.9);
  const reviewsCount = Number(doctor.reviewsCount || doctor.reviewCount || 128);
  const consultationFee = Number(doctor.consultationFee || doctor.fees || 50);
  const hospitalName = doctor.hospitalName || (doctor.address?.line1 ? `${doctor.address.line1}` : "NewCare Medical Center");
  const avatarUrl = imgError ? fallbackImg : (doctor.avatarUrl || doctor.image || fallbackImg);
  const isAvailableToday = doctor.isAvailableToday !== undefined ? doctor.isAvailableToday : doctor.available !== false;
  const slots: string[] = doctor.availableSlots || ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"];

  return (
    <article
      className="card group p-4 sm:p-5 transition-all duration-150 hover:border-neutral-400 dark:hover:border-neutral-600"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1.25rem",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Avatar + Identity + Hospital & Credentials */}
        <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
          {/* Avatar / Photo with Verified Status */}
          <div className="relative shrink-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover"
                onError={() => setImgError(true)}
                unoptimized
              />
            </div>
            {/* Clinical Verified Pip */}
            <span
              className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5 shadow-xs"
              title="BMDC / Board Verified Clinician"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </span>
          </div>

          {/* Name, Credentials, Specialty & Hospital */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <Link
                href={`/doctors/${id}`}
                className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors truncate"
              >
                {name}
              </Link>
              <span className="badge-clinical badge-neutral text-xs text-neutral-700 dark:text-neutral-300">
                {specialty}
              </span>
              {isAvailableToday && (
                <span className="badge-clinical badge-verified text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 pulse-live inline-block" />
                  Available Today
                </span>
              )}
            </div>

            {/* Credentials & Degree */}
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              {degree} • <span className="tabular-nums">{experienceYears}</span> yrs clinical practice
            </p>

            {/* Hospital Affiliation & Reviews */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 dark:text-neutral-300">
              <span className="inline-flex items-center gap-1 truncate max-w-[220px] sm:max-w-[320px]">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <span className="truncate">{hospitalName}</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {rating.toFixed(1)}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">
                  ({reviewsCount})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Fee & Primary Action */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800/80 shrink-0">
          <div className="text-left md:text-right">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block">Consultation Fee</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
                ${consultationFee}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">/ visit</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/doctors/${id}`}
              className="btn-primary text-xs sm:text-sm px-3.5 sm:px-4 py-2 font-semibold rounded-lg"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scannable Today's Available Slots (Interactive Mini-Chips) */}
      <div className="bg-neutral-50 dark:bg-neutral-900/60 rounded-lg p-2.5 sm:px-3 sm:py-2 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 shrink-0">
          <Clock className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>Available Slots:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {slots.slice(0, 4).map((slot) => (
            <Link
              key={slot}
              href={`/doctors/${id}?slot=${encodeURIComponent(slot)}`}
              onClick={(e) => {
                if (onQuickBookSlot) {
                  e.preventDefault();
                  onQuickBookSlot(doctor, slot);
                }
              }}
              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold tabular-nums rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-sky-500 hover:text-sky-600 dark:hover:border-sky-400 dark:hover:text-sky-300 transition-colors"
              title={`Book ${slot} slot`}
            >
              {slot}
            </Link>
          ))}
          <Link
            href={`/doctors/${id}`}
            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline px-1.5 py-1"
          >
            All slots →
          </Link>
        </div>
      </div>
    </article>
  );
}
