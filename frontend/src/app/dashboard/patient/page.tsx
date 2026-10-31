"use client";

import Link from "next/link";
import { ArrowLeft, Stethoscope, ShieldAlert } from "lucide-react";
import PatientDashboardView from "@/components/dashboard/PatientDashboardView";

export default function PatientDashboardPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "2rem 0 6rem" }}>
      <div className="container">
        {/* Quick breadcrumb & role jumping */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "10px" }}>
          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              color: "var(--text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={15} /> All Role Portals
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/dashboard/doctor"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              <Stethoscope size={13} /> Switch to Doctor Desk
            </Link>
            <Link
              href="/dashboard/admin"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              <ShieldAlert size={13} /> Switch to Admin Portal
            </Link>
          </div>
        </div>

        <PatientDashboardView />
      </div>
    </div>
  );
}
