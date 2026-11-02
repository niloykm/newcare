"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Menu, X, Heart, User, LogOut, Calendar, ChevronDown, LayoutDashboard } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/doctors", label: "All Doctors" },
    { href: "/dashboard", label: "Role Dashboards" },
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
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: scrolled
          ? theme === "dark"
            ? "rgba(10, 15, 30, 0.95)"
            : "rgba(255, 255, 255, 0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid var(--border)` : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="https://res.cloudinary.com/dg5gwims9/image/upload/v1783617203/newcare_assets/newCare.png"
            alt="NewCare Logo"
            width={140}
            height={36}
            style={{ objectFit: "contain", height: "36px", width: "auto" }}
            unoptimized
          />
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: pathname === link.href ? 600 : 500,
                color: pathname === link.href ? "var(--primary)" : "var(--text-secondary)",
                transition: "color 0.2s ease",
                position: "relative",
              }}
            >
              {link.label}
              {pathname === link.href && (
                <span style={{
                  position: "absolute", bottom: -4, left: 0, right: 0,
                  height: 2, background: "var(--primary)", borderRadius: 2
                }} />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            style={{
              width: 38, height: 38,
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text)",
              transition: "all 0.2s ease",
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                aria-label="User menu"
                aria-expanded={dropOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 10px 4px 5px",
                  borderRadius: "9999px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Profile Pic / Avatar initial */}
                {user.image ? (
                  <div
                    style={{
                      position: "relative",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid var(--primary)",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={user.image}
                      alt={user.name || "User profile"}
                      fill
                      sizes="32px"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 6px rgba(14, 165, 233, 0.35)",
                      flexShrink: 0,
                    }}
                  >
                    {user.name?.trim().charAt(0).toUpperCase() || <User size={15} />}
                  </div>
                )}

                {/* User Name */}
                <span
                  style={{
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name?.trim() ? user.name.trim().split(" ")[0] : "Account"}
                </span>

                <ChevronDown
                  size={14}
                  style={{
                    color: "var(--text-muted)",
                    transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {dropOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    boxShadow: "var(--shadow-lg)",
                    minWidth: 220,
                    overflow: "hidden",
                    zIndex: 999,
                    animation: "fadeInUp 0.15s ease-out",
                  }}
                >
                  {/* User brief header */}
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "var(--bg-secondary)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.name || "Patient"}
                    </p>
                    {user.email && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: "2px",
                        }}
                      >
                        {user.email}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/dashboard/patient"
                    onClick={() => setDropOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    <LayoutDashboard size={15} style={{ color: "var(--primary)" }} /> Patient Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setDropOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    <User size={15} style={{ color: "var(--primary)" }} /> My Profile
                  </Link>
                  <Link
                    href="/my-appointments"
                    onClick={() => setDropOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    <Calendar size={15} style={{ color: "var(--primary)" }} /> My Appointments
                  </Link>

                  <div style={{ height: 1, background: "var(--border)" }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "11px 16px",
                      color: "#ef4444",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ textDecoration: "none" }}>
              Get Started
            </Link>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-only"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text)", display: "none"
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 1.5rem",
          display: "flex", flexDirection: "column", gap: "0.75rem"
        }}>
          {user && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)"
            }}>
              {user.image ? (
                <div style={{
                  position: "relative", width: 36, height: 36,
                  borderRadius: "50%", overflow: "hidden",
                  border: "2px solid var(--primary)", flexShrink: 0
                }}>
                  <Image src={user.image} alt={user.name || "User"} fill sizes="36px" style={{ objectFit: "cover" }} unoptimized />
                </div>
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                  color: "#ffffff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "0.95rem", fontWeight: 700,
                  flexShrink: 0
                }}>
                  {user.name?.trim().charAt(0).toUpperCase() || <User size={16} />}
                </div>
              )}
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>{user.name || "Patient"}</p>
                {user.email && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.email}</p>}
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: pathname === link.href ? "var(--primary)" : "var(--text)",
                padding: "0.5rem 0",
              }}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <>
              <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />
              <Link
                href="/dashboard/patient"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: "var(--text)", textDecoration: "none",
                  fontSize: "0.95rem", fontWeight: 500, padding: "0.4rem 0"
                }}
              >
                <LayoutDashboard size={16} style={{ color: "var(--primary)" }} /> Patient Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: "var(--text)", textDecoration: "none",
                  fontSize: "0.95rem", fontWeight: 500, padding: "0.4rem 0"
                }}
              >
                <User size={16} style={{ color: "var(--primary)" }} /> My Profile
              </Link>
              <Link
                href="/my-appointments"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: "var(--text)", textDecoration: "none",
                  fontSize: "0.95rem", fontWeight: 500, padding: "0.4rem 0"
                }}
              >
                <Calendar size={16} style={{ color: "var(--primary)" }} /> My Appointments
              </Link>
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: "#ef4444", background: "none", border: "none",
                  cursor: "pointer", fontSize: "0.95rem", fontWeight: 600,
                  padding: "0.5rem 0", textAlign: "left"
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
