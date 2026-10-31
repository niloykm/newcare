"use client";

import { useStore, RoleType } from "@/store/useStore";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Stethoscope, ShieldAlert, Sparkles, RefreshCw, ChevronUp, ChevronDown, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function DemoRoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { currentRole, setCurrentRole } = useStore();
  const [minimized, setMinimized] = useState(false);

  const handleRoleChange = (role: RoleType, targetPath: string) => {
    setCurrentRole(role);
    toast.success(`Switched to ${role.toUpperCase()} mode`, {
      icon: role === "patient" ? "👤" : role === "doctor" ? "🩺" : "🛡️",
      duration: 2500,
    });
    router.push(targetPath);
  };

  const handleResetData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("newcare-storage-v2");
      toast.success("Demo appointments & clinic data reset to defaults!");
      window.location.reload();
    }
  };

  const roles = [
    {
      id: "patient" as RoleType,
      label: "Patient View",
      shortLabel: "Patient",
      icon: User,
      path: "/dashboard/patient",
      desc: "Multi-step booking & digital pass",
      color: "#0ea5e9",
    },
    {
      id: "doctor" as RoleType,
      label: "Doctor Dashboard",
      shortLabel: "Doctor",
      icon: Stethoscope,
      path: "/dashboard/doctor",
      desc: "Live queue & consultation notes",
      color: "#10b981",
    },
    {
      id: "admin" as RoleType,
      label: "Admin Portal",
      shortLabel: "Admin",
      icon: ShieldAlert,
      path: "/dashboard/admin",
      desc: "Clinic revenue & RBAC analytics",
      color: "#8b5cf6",
    },
  ];

  return (
    <aside
      aria-label="Interactive Demo Switcher"
      style={{
        position: "fixed",
        bottom: minimized ? 12 : 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        maxWidth: "94vw",
      }}
    >
      <div
        style={{
          background: "rgba(15, 23, 42, 0.94)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: minimized ? "50px" : "24px",
          padding: minimized ? "8px 16px" : "10px 14px",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(14, 165, 233, 0.2)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Header Tag / Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              padding: "4px 10px",
              borderRadius: "50px",
              fontSize: "0.74rem",
              fontWeight: 800,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              boxShadow: "0 0 12px rgba(14, 165, 233, 0.6)",
            }}
          >
            <Sparkles size={12} className="animate-spin" />
            <span>Interactive Demo</span>
          </div>

          <button
            onClick={() => setMinimized(!minimized)}
            title={minimized ? "Expand Demo Switcher" : "Minimize Switcher"}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {minimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {!minimized && (
          <>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)" }} />

            {/* Role Options */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {roles.map(({ id, label, shortLabel, icon: Icon, path, color }) => {
                const isActive = currentRole === id && pathname.startsWith(path);
                return (
                  <button
                    key={id}
                    onClick={() => handleRoleChange(id, path)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "12px",
                      fontSize: "0.82rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      border: isActive
                        ? `1.5px solid ${color}`
                        : "1px solid rgba(255,255,255,0.1)",
                      background: isActive
                        ? `${color}28`
                        : "rgba(255, 255, 255, 0.05)",
                      color: isActive ? "#ffffff" : "#cbd5e1",
                      transition: "all 0.2s ease",
                      boxShadow: isActive ? `0 0 16px ${color}40` : "none",
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? color : "#94a3b8" }} />
                    <span className="hidden-mobile">{label}</span>
                    <span className="mobile-only">{shortLabel}</span>
                    {isActive && <Check size={12} style={{ color }} />}
                  </button>
                );
              })}
            </div>

            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)" }} />

            {/* Quick Reset Button */}
            <button
              onClick={handleResetData}
              title="Reset sample appointments & doctor stats"
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                borderRadius: "10px",
                padding: "6px 10px",
                fontSize: "0.74rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <RefreshCw size={11} />
              <span className="hidden-mobile">Reset</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
