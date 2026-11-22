"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Stethoscope, ShieldCheck } from "lucide-react";
import { useStore, RoleType } from "@/store/useStore";
import PatientDashboardView from "@/components/dashboard/PatientDashboardView";
import DoctorDashboardView from "@/components/dashboard/DoctorDashboardView";
import AdminDashboardView from "@/components/dashboard/AdminDashboardView";

function TabParamSync({ onTab }: { onTab: (tab: RoleType) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const tabParam = searchParams.get("tab") as RoleType | null;
    if (tabParam === "patient" || tabParam === "doctor" || tabParam === "admin") {
      onTab(tabParam);
    }
  }, [searchParams, onTab]);
  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { setCurrentRole } = useStore();
  const [activeTab, setActiveTab] = useState<RoleType>("patient");

  const handleTabSync = useCallback(
    (tab: RoleType) => {
      setActiveTab(tab);
      setCurrentRole(tab);
    },
    [setCurrentRole]
  );

  const handleTabSwitch = (tab: RoleType) => {
    setActiveTab(tab);
    setCurrentRole(tab);
    router.replace(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 py-8 pb-20">
      <Suspense fallback={null}>
        <TabParamSync onTab={handleTabSync} />
      </Suspense>

      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1.5">
              Clinical Operations
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              NewCare Portals
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Switch between Patient Portal, Physician Desk, and Clinic Administration views.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Portal views"
            className="inline-flex flex-wrap rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11161d] p-1 self-start md:self-auto"
          >
            {[
              { id: "patient" as RoleType, label: "Patient Portal", icon: User },
              { id: "doctor" as RoleType, label: "Physician Desk", icon: Stethoscope },
              { id: "admin" as RoleType, label: "Clinic Admin", icon: ShieldCheck },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleTabSwitch(id)}
                  className={`min-h-[38px] inline-flex items-center gap-2 px-3.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    isActive
                      ? "bg-teal-700 dark:bg-teal-400 text-white dark:text-slate-950"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "patient" && <PatientDashboardView />}
        {activeTab === "doctor" && <DoctorDashboardView />}
        {activeTab === "admin" && <AdminDashboardView />}
      </div>
    </div>
  );
}
