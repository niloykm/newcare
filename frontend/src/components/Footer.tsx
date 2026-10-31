"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-secondary)",
      borderTop: "1px solid var(--border)",
      paddingTop: "4rem",
      paddingBottom: "2rem",
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem",
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", marginBottom: "1rem" }}>
              <Image
                src="https://res.cloudinary.com/dg5gwims9/image/upload/v1783617203/newcare_assets/newCare.png"
                alt="NewCare Logo"
                width={120}
                height={30}
                style={{ objectFit: "contain", height: "30px", width: "auto" }}
                unoptimized
              />
            </Link>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 260 }}>
              Your trusted partner in healthcare. Find and book appointments with the best doctors near you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text)" }}>Quick Links</h4>
            {[
              { label: "Home", href: "/" },
              { label: "All Doctors", href: "/doctors" },
              { label: "Role Dashboards", href: "/dashboard" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  display: "block",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  marginBottom: "0.6rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Specialties */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text)" }}>Specialties</h4>
            {["General Physician", "Cardiologist", "Neurologist", "Dermatologist", "Pediatrician", "Gynecologist"].map((spec) => (
              <Link
                key={spec}
                href={`/doctors?specialty=${encodeURIComponent(spec)}`}
                style={{
                  display: "block",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  marginBottom: "0.6rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {spec}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text)" }}>Contact Us</h4>
            {[
              { Icon: Mail, text: "support@newcare.health" },
              { Icon: Phone, text: "+1 (800) 123-4567" },
              { Icon: MapPin, text: "New York, NY 10001, USA" },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <Icon size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} NewCare. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Privacy Policy", href: "/about#privacy" },
              { label: "Terms of Service", href: "/about#terms" },
              { label: "Clinical Standards", href: "/about#standards" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
