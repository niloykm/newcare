"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, Stethoscope, Video } from "lucide-react";

const SPECIALTIES = [
  "All Specialties",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Gynecologist",
  "Orthopedic",
  "ENT Specialist",
];

const LOCATIONS = [
  { label: "All Clinics & Hospitals", value: "all" },
  { label: "NewCare Health Plaza (Manhattan)", value: "Manhattan" },
  { label: "Brooklyn Ambulatory Center", value: "Brooklyn" },
  { label: "Queens Specialty Pavilion", value: "Queens" },
  { label: "HD Telehealth (Video Consult)", value: "telehealth" },
];

const DATES = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Week", value: "week" },
  { label: "Any Available Date", value: "any" },
];

export default function QuickFinder() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("All Specialties");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [dateChoice, setDateChoice] = useState("today");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty !== "All Specialties") {
      params.set("specialty", specialty);
    }
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (location === "telehealth") {
      params.set("type", "video");
    } else if (location !== "all") {
      params.set("search", location);
    }
    if (dateChoice === "today") {
      params.set("available", "today");
    }
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* Doctor Name / Specialty */}
        <div>
          <label
            htmlFor="triage-specialty"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Specialty or Clinician
          </label>
          <div className="relative flex items-center">
            <Stethoscope className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              id="triage-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-sm font-medium bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none transition-all cursor-pointer"
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec} className="bg-white dark:bg-neutral-900">
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hospital / Clinic / Telehealth Location */}
        <div>
          <label
            htmlFor="triage-location"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Hospital or Location
          </label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              id="triage-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-sm font-medium bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none transition-all cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value} className="bg-white dark:bg-neutral-900">
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label
            htmlFor="triage-date"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Appointment Date
          </label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              id="triage-date"
              value={dateChoice}
              onChange={(e) => setDateChoice(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-sm font-medium bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none transition-all cursor-pointer"
            >
              {DATES.map((d) => (
                <option key={d.value} value={d.value} className="bg-white dark:bg-neutral-900">
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Action */}
        <div>
          <button
            type="submit"
            className="w-full h-10 inline-flex items-center justify-center gap-2 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-neutral-950 rounded-lg transition-colors focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:outline-none"
          >
            <Search className="w-4 h-4" />
            <span>Search Doctors</span>
          </button>
        </div>
      </div>
    </form>
  );
}
