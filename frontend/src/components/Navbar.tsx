"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Heart, User, LogOut, Calendar } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import toast from "react-hot-toast";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dropOpen, setDropOpen] = useState(false);

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
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                <User size={16} />
                {user.name?.split(" ")[0]}
              </button>
              {dropOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: 180,
                  overflow: "hidden",
                  zIndex: 999,
                }}>
                  <Link href="/profile" onClick={() => setDropOpen(false)} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 16px",
                    color: "var(--text)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}>
                    <User size={15} /> My Profile
                  </Link>
                  <Link href="/my-appointments" onClick={() => setDropOpen(false)} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 16px",
                    color: "var(--text)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}>
                    <Calendar size={15} /> My Appointments
                  </Link>
                  <div style={{ height: 1, background: "var(--border)" }} />
                  <button onClick={handleLogout} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 16px",
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    width: "100%",
                    textAlign: "left",
                  }}>
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
        </div>
      )}
    </nav>
  );
}
