"use client";

import { useStore, RoleType } from "@/store/useStore";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, Stethoscope, ShieldAlert, RefreshCw, ChevronUp, ChevronDown, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function DemoRoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { currentRole, setCurrentRole } = useStore();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  const handleRoleChange = (role: RoleType, targetPath: string) => {
    setCurrentRole(role);
    toast.success(`Active View: ${role.toUpperCase()}`, {
      duration: 2000,
    });
    router.push(targetPath);
    setExpanded(false);
  };

  const handleResetData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("newcare-storage-v2");
      toast.success("Demo appointments & records reset to default state");
      window.location.reload();
    }
  };

  const roles = [
    {
      id: "patient" as RoleType,
      label: "Patient Portal",
      shortLabel: "Patient",
      icon: User,
      path: "/dashboard/patient",
    },
    {
      id: "doctor" as RoleType,
      label: "Doctor Desk",
      shortLabel: "Doctor",
      icon: Stethoscope,
      path: "/dashboard/doctor",
    },
    {
      id: "admin" as RoleType,
      label: "Clinic Admin",
      shortLabel: "Admin",
      icon: ShieldAlert,
      path: "/dashboard/admin",
    },
  ];

  return (
    <aside
      ref={containerRef}
      aria-label="Role Switcher"
      className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-32px)]"
    >
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-1.5 shadow-md text-white flex items-center gap-2 flex-wrap">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>Role View</span>
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Expanded Options */}
        {expanded && (
          <>
            <div className="w-px h-5 bg-neutral-700" />

            <div className="flex items-center gap-1">
              {roles.map(({ id, label, shortLabel, icon: Icon, path }) => {
                const isActive = currentRole === id && pathname.startsWith(path);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleRoleChange(id, path)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                      isActive
                        ? "bg-white text-neutral-950 border-white"
                        : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{shortLabel}</span>
                    {isActive && <Check className="w-3 h-3 text-neutral-950" />}
                  </button>
                );
              })}
            </div>

            <div className="w-px h-5 bg-neutral-700" />

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetData}
              title="Reset sample appointments"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
