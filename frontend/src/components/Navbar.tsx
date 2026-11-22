"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Calendar,
  Activity,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import toast from "react-hot-toast";

interface UserProfile {
  name?: string;
  email?: string;
  image?: string;
}

const NAV_LINKS = [
  { href: "/#services", label: "Services", match: "/#services" },
  { href: "/doctors", label: "Specialists", match: "/doctors" },
  { href: "/dashboard", label: "Portals", match: "/dashboard" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/contact", label: "Contact", match: "/contact" },
];

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
          setUser(JSON.parse(stored) as UserProfile);
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

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("authChange"));
    setDropOpen(false);
    toast.success("Signed out");
    router.push("/");
  };

  const isLinkActive = (match: string) => {
    if (match.startsWith("/#")) return false;
    return pathname === match || pathname.startsWith(`${match}/`);
  };

  const handleHomeAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: "estimator" | "services"
  ) => {
    e.preventDefault();
    const wasDrawerOpen = mobileOpen;
    setMobileOpen(false);
    setDropOpen(false);

    if (pathname === "/") {
      window.history.replaceState(null, "", `/#${sectionId}`);
      const scrollTarget = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (sectionId === "estimator") {
          window.dispatchEvent(new CustomEvent("newcare:focus-estimator"));
        }
      };
      if (wasDrawerOpen) {
        window.setTimeout(scrollTarget, 60);
      } else {
        scrollTarget();
      }
      return;
    }

    router.push(`/#${sectionId}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#11161d]/95 backdrop-blur-sm transition-shadow duration-200 ${
        scrolled ? "shadow-xs" : ""
      }`}
    >
      <nav aria-label="Primary navigation" className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 rounded-md"
          >
            <span className="w-8 h-8 rounded-md bg-teal-700 dark:bg-teal-400 text-white dark:text-slate-950 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              NewCare
            </span>
          </Link>

          {/* Desktop Navigation (5 concise links) */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={
                    link.href === "/#services"
                      ? (e) => handleHomeAnchorClick(e, "services")
                      : undefined
                  }
                  className={`text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-teal-700 dark:text-teal-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              className="w-11 h-11 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropOpen((prev) => !prev)}
                  aria-label="Account menu"
                  aria-expanded={dropOpen}
                  className="min-h-[44px] flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded bg-teal-700 text-white flex items-center justify-center text-xs font-semibold">
                    {user.name?.trim().charAt(0).toUpperCase() || (
                      <User className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="max-w-[90px] truncate hidden sm:inline">
                    {user.name?.trim() ? user.name.trim().split(" ")[0] : "Account"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      dropOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#11161d] border border-slate-200 dark:border-slate-800 rounded-lg shadow-md py-1.5 z-50 text-sm">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">
                        Signed in as
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
                        {user.email || user.name}
                      </span>
                    </div>
                    <Link
                      href="/my-appointments"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    >
                      <Calendar className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      <span>My Appointments</span>
                    </Link>
                    <Link
                      href="/dashboard/patient"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      <span>Patient Portal</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    >
                      <User className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left border-t border-slate-100 dark:border-slate-800 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/#estimator"
              onClick={(e) => handleHomeAnchorClick(e, "estimator")}
              className="btn-primary min-h-[44px] px-4 py-2 text-sm hidden sm:inline-flex"
            >
              Book Care
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden w-11 h-11 rounded-md border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-3">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/#services") {
                      handleHomeAnchorClick(e, "services");
                    } else {
                      setMobileOpen(false);
                    }
                  }}
                  className="min-h-[44px] px-3 flex items-center rounded-md text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/#estimator"
                onClick={(e) => handleHomeAnchorClick(e, "estimator")}
                className="btn-primary w-full"
              >
                Book Care
              </Link>
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary w-full"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
