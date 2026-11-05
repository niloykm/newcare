"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Stethoscope, ShieldAlert } from "lucide-react";
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-6 sm:py-8 pb-16">
      <Suspense fallback={null}>
        <TabParamSync onTab={handleTabSync} />
      </Suspense>

      <div className="container">
        {/* Top Role-Tabs Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-1.5">
              <span>Synchronized Healthcare Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Operations Portals
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Switch role context to review synchronized state across patient booking, clinical queues, and administrative audit.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-1 self-start sm:self-auto">
            {[
              { id: "patient" as RoleType, label: "Patient View", icon: User },
              { id: "doctor" as RoleType, label: "Physician Desk", icon: Stethoscope },
              { id: "admin" as RoleType, label: "Clinic Admin", icon: ShieldAlert },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTabSwitch(id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isActive
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
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
