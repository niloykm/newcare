"use client";

import Link from "next/link";
import { ArrowLeft, User, ShieldAlert } from "lucide-react";
import DoctorDashboardView from "@/components/dashboard/DoctorDashboardView";

export default function DoctorDashboardPage() {
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
              href="/dashboard/patient"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(14, 165, 233, 0.1)",
                color: "#0ea5e9",
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              <User size={13} /> Switch to Patient View
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

        <DoctorDashboardView />
      </div>
    </div>
  );
}
