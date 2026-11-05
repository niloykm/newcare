"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 pt-12 pb-8 text-neutral-900 dark:text-neutral-100">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Accreditation */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="https://res.cloudinary.com/dg5gwims9/image/upload/v1783617203/newcare_assets/newCare.png"
                alt="NewCare Logo"
                width={120}
                height={30}
                style={{ objectFit: "contain", height: "30px", width: "auto" }}
                unoptimized
              />
            </Link>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              Synchronized clinical scheduling platform connecting patients with verified, board-certified medical specialists.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>BMDC Verified Faculty</span>
            </div>
          </div>

          {/* Clinical Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Home Triage
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Specialist Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Role-Based Dashboards
                </Link>
              </li>
              <li>
                <Link href="/my-appointments" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Patient Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-3">
              Specialties
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              {["General Physician", "Cardiologist", "Neurologist", "Dermatologist", "Pediatrician", "Gynecologist"].map((spec) => (
                <li key={spec}>
                  <Link
                    href={`/doctors?specialty=${encodeURIComponent(spec)}`}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {spec}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Care Coordination Coordinates */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-3">
              Care Coordination
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>support@newcare.health</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="tabular-nums">+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>42 Health Plaza, New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Ledger */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <p className="tabular-nums">
            © {new Date().getFullYear()} NewCare Clinical Systems. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Clinical Guidelines
            </Link>
            <Link href="/about" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Contact Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
