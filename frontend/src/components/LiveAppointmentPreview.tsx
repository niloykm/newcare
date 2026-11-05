"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Clock, MapPin, Video, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function LiveAppointmentPreview() {
  const router = useRouter();
  const { setConsultationType, setSelectedTime, setBookingStep } = useStore();
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
    <div className="card p-5 max-w-sm w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      {/* Clinician Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600"
            alt="Dr. Sarah Jenkins"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="badge-clinical badge-neutral text-xs">Cardiologist</span>
            <span className="badge-clinical badge-verified text-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Verified
            </span>
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            Dr. Sarah Jenkins
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            MD, FACC • Manhattan Health
          </p>
        </div>
      </div>

      {/* Format Selector */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          type="button"
          onClick={() => setConsultType("In-Clinic Visit")}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            consultType === "In-Clinic Visit"
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
              : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>In-Clinic</span>
        </button>
        <button
          type="button"
          onClick={() => setConsultType("HD Video Consultation")}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            consultType === "HD Video Consultation"
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
              : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Telehealth</span>
        </button>
      </div>

      {/* Slots */}
      <div className="mb-4">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
          Today&apos;s Open Windows
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-1.5 px-2 rounded-md border text-xs font-semibold tabular-nums text-center transition-colors ${
                  isSelected
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 border-neutral-900 dark:border-neutral-100"
                    : "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleInstantDemo}
        className="btn-primary w-full py-2.5 text-xs font-semibold rounded-lg"
      >
        <span>Lock In Consultation</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </div>
  );
}
