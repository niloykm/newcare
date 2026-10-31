"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Stethoscope, ShieldAlert, Sparkles } from "lucide-react";
import { useStore, RoleType } from "@/store/useStore";
import PatientDashboardView from "@/components/dashboard/PatientDashboardView";
import DoctorDashboardView from "@/components/dashboard/DoctorDashboardView";
import AdminDashboardView from "@/components/dashboard/AdminDashboardView";

function TabParamSync({ onTab }: { onTab: (tab: RoleType) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const tabParam = searchParams.get("tab") as RoleType;
    if (tabParam && (tabParam === "patient" || tabParam === "doctor" || tabParam === "admin")) {
      onTab(tabParam);
    }
  }, [searchParams, onTab]);
  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { currentRole, setCurrentRole } = useStore();
  const [activeTab, setActiveTab] = useState<RoleType>("patient");

  const handleTabSync = useCallback((tab: RoleType) => {
    setActiveTab(tab);
    setCurrentRole(tab);
  }, [setCurrentRole]);

  const handleTabSwitch = (tab: RoleType) => {
    setActiveTab(tab);
    setCurrentRole(tab);
    router.replace(`/dashboard?tab=${tab}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "2.5rem 0 6rem" }}>
      <Suspense fallback={null}>
        <TabParamSync onTab={handleTabSync} />
      </Suspense>
      <div className="container">
        {/* Top Role-Tabs Navigation */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--primary)",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  marginBottom: "4px",
                }}
              >
                <Sparkles size={14} /> SYNCHRONIZED ROLE-BASED SAAS SUITE
              </div>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>
                Operations Dashboard
              </h1>
            </div>

            {/* Role Switcher Tabs */}
            <div
              style={{
                display: "inline-flex",
                background: "var(--bg-secondary)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "4px",
                gap: "4px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {[
                { id: "patient" as RoleType, label: "👤 Patient View", color: "#0ea5e9" },
                { id: "doctor" as RoleType, label: "🩺 Doctor Desk", color: "#10b981" },
                { id: "admin" as RoleType, label: "🛡️ Admin Portal", color: "#8b5cf6" },
              ].map(({ id, label, color }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleTabSwitch(id)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "0.88rem",
                      fontWeight: isActive ? 800 : 600,
                      cursor: "pointer",
                      background: isActive ? "var(--bg-card)" : "transparent",
                      color: isActive ? color : "var(--text-secondary)",
                      boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === "patient" && <PatientDashboardView />}
        {activeTab === "doctor" && <DoctorDashboardView />}
        {activeTab === "admin" && <AdminDashboardView />}
      </div>
    </div>
  );
}
