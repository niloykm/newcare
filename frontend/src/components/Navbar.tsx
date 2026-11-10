"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Sun, Moon, Menu, X, ShieldCheck, Phone, ChevronDown,
  LayoutDashboard, User, LogOut, Calendar, Activity
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import toast from "react-hot-toast";

interface UserProfile {
  name?: string;
  email?: string;
  image?: string;
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("userData");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener("authChange", checkUser);
    return () => {
      window.removeEventListener("authChange", checkUser);
    };
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    if (dropOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/#services", label: "Care Services & Rates" },
    { href: "/#process", label: "Care Process" },
    { href: "/#safety", label: "Safety & Vetting" },
    { href: "/doctors", label: "Specialist Directory" },
    { href: "/dashboard", label: "Portals" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("authChange"));
    setDropOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden transition-colors duration-200">
      {/* ── Top Clinical Emergency Triage & Dispatch Bar ── */}
      <div className="bg-slate-900 text-slate-100 dark:bg-black dark:text-zinc-200 border-b border-slate-800 text-xs py-1.5 px-3 sm:px-4">
        <div className="container flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 shrink-0 text-[11px] sm:text-xs">
              24/7 Nurse Triage & Dispatch:
            </span>
            <span className="text-slate-300 hidden md:inline text-[11px] truncate">
              Rapid on-demand caregiver dispatch across Greater NY & Tri-State.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-medium">
            <a
              href="tel:18001234567"
              className="inline-flex items-center gap-1 text-slate-100 hover:text-emerald-400 font-semibold transition-colors text-[11px] sm:text-xs"
              title="Immediate Nurse Hotline"
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
              <span className="tabular-nums">(800) 123-4567</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>100% Vetted</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <nav
        className={`w-full border-b transition-all duration-200 ${
          scrolled
            ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-slate-200 dark:border-zinc-800 shadow-xs"
            : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-zinc-800"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo & Clinical Brand */}
          <Link href="/" className="flex items-center gap-2 text-decoration-none group shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-teal-700 transition-colors shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                  NewCare
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold px-1 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                  Clinical
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-medium text-slate-500 dark:text-zinc-400 -mt-0.5">
                In-Home Care & Nursing
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-tight transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                  pathname === link.href
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-slate-600 dark:text-zinc-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-label="Toggle color theme"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/80 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer shrink-0"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* User Dropdown / Login button */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  aria-label="User account menu"
                  aria-expanded={dropOpen}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/80 text-xs font-semibold text-slate-900 dark:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name?.trim().charAt(0).toUpperCase() || <User className="w-3 h-3" />}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline text-xs">
                    {user.name?.trim() ? user.name.trim().split(" ")[0] : "Account"}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropOpen ? "rotate-180" : ""}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-lg py-1 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                      Signed in as <strong className="text-slate-900 dark:text-zinc-100 block truncate">{user.email || user.name}</strong>
                    </div>
                    <Link
                      href="/my-appointments"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>My Care Bookings</span>
                    </Link>
                    <Link
                      href="/dashboard/patient"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Family Care Portal</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Profile & Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left border-t border-slate-100 dark:border-zinc-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex btn-secondary text-xs font-semibold px-2.5 py-1.5"
              >
                Sign In
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              href="/#services"
              className="btn-primary text-xs font-semibold px-3 py-1.5 hidden sm:inline-flex shrink-0"
            >
              Book Care
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-md border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            >
              {mobileOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-150">
            {/* Quick Emergency Dial */}
            <div className="p-3 mb-4 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">
                  24/7 Urgent Care Dispatch
                </span>
                <span className="text-xs text-slate-600 dark:text-zinc-400">
                  On-call Registered Nurse intake
                </span>
              </div>
              <a
                href="tel:18001234567"
                className="btn-primary text-xs px-3 py-1.5 shrink-0"
              >
                <Phone className="w-3.5 h-3.5 mr-1" />
                Call Now
              </a>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-md text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
              <Link
                href="/#services"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center text-sm font-semibold py-2.5"
              >
                Book Care Today
              </Link>
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary w-full text-center text-sm font-semibold py-2.5"
                >
                  Sign In to Patient Portal
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
