"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Calendar, Clock, X, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import api from "@/lib/api";
import { useStore, StoredAppointment } from "@/store/useStore";

interface Appointment {
  _id: string;
  docData: {
    name: string;
    image: string;
    speciality: string;
    fees: number;
    address: { line1: string; line2: string };
  };
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
  isCompleted: boolean;
  payment: boolean;
  date: number;
  appointmentType?: string;
  onlineInfo?: {
    time?: string;
    platform?: string;
    meetingLink?: string;
    otherInfo?: string;
  };
  offlineInfo?: {
    serialNumber?: string;
    place?: string;
    expectedTime?: string;
    location?: string;
    otherInfo?: string;
  };
}

function formatSlotDate(key: string) {
  if (!key) return "Upcoming";
  if (key.includes("Today") || key.includes("Tomorrow") || key.includes(",")) return key;
  const parts = key.split("_");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    }
  }
  return key;
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { appointments: storedAppointments, cancelAppointment: cancelStored } = useStore();

  const mapStoredToAppointments = (stored: StoredAppointment[]): Appointment[] => {
    return stored.map((s) => ({
      _id: s.id,
      docData: {
        name: s.doctorName,
        image: s.doctorAvatar,
        speciality: s.doctorSpecialty,
        fees: s.amount,
        address: { line1: s.doctorHospital, line2: s.roomNumber || "Health Plaza NY" },
      },
      slotDate: s.slotDate,
      slotTime: s.slotTime,
      amount: s.amount,
      cancelled: s.status === "Cancelled",
      isCompleted: s.status === "Completed",
      payment: s.paymentStatus === "Paid",
      date: Date.now(),
      appointmentType: s.consultationType === "HD Video Consultation" ? "online" : "offline",
      onlineInfo: s.consultationType === "HD Video Consultation" ? {
        platform: "Zoom",
        meetingLink: s.meetingLink || "https://meet.newcare.health",
        otherInfo: s.reason,
      } : undefined,
      offlineInfo: s.consultationType === "In-Clinic Visit" ? {
        serialNumber: s.roomNumber || "#01",
        place: s.doctorHospital,
        location: "Suite 402, New York, NY",
        otherInfo: s.reason,
      } : undefined,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/user/appointments");
      if (res.data?.success && Array.isArray(res.data.appointments) && res.data.appointments.length > 0) {
        setAppointments(res.data.appointments.reverse());
      } else {
        setAppointments(mapStoredToAppointments(storedAppointments));
      }
    } catch {
      setAppointments(mapStoredToAppointments(storedAppointments));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    cancelStored(id);
    try {
      const res = await api.post("/api/user/cancel-appointment", { appointmentId: id });
      if (res.data?.success) {
        toast.success("Appointment cancelled");
        fetchAppointments();
      } else {
        fetchAppointments();
      }
    } catch {
      toast.success("Appointment cancelled");
      fetchAppointments();
    }
  };

  const getStatus = (appt: Appointment) => {
    if (appt.cancelled) return { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: X };
    if (appt.isCompleted) return { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: CheckCircle };
    return { label: "Upcoming", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", icon: Clock };
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid var(--primary)", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-secondary)" }}>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "4rem" }}>
      <div style={{
        background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
        padding: "3rem 0",
        color: "white",
        textAlign: "center",
        marginBottom: "2rem"
      }}>
        <div className="container">
          <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem" }}>My Appointments</h1>
          <p style={{ opacity: 0.85 }}>Manage your upcoming and past appointments</p>
        </div>
      </div>

      <div className="container">
        {appointments.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "4rem 0",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
          }}>
            <Calendar size={56} style={{ color: "var(--text-muted)", marginBottom: "1rem", opacity: 0.4 }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>
              No appointments yet
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Book your first appointment with one of our expert doctors
            </p>
            <a href="/doctors" className="btn-primary" style={{ textDecoration: "none" }}>
              Find a Doctor
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {appointments.map((appt) => {
              const status = getStatus(appt);
              const StatusIcon = status.icon;
              return (
                <div key={appt._id} style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: "1.25rem",
                  alignItems: "center",
                }}>
                  <div style={{ width: 80, height: 80, borderRadius: "12px", overflow: "hidden", position: "relative" }}>
                    <Image
                      src={appt.docData?.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"}
                      alt={appt.docData?.name || "Doctor"}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>
                      {appt.docData?.name || "Doctor"}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, marginBottom: "6px" }}>
                      {appt.docData?.speciality}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Calendar size={13} style={{ color: "var(--text-muted)" }} />
                        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{formatSlotDate(appt.slotDate)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={13} style={{ color: "var(--text-muted)" }} />
                        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{appt.slotTime}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <DollarSign size={13} style={{ color: "var(--text-muted)" }} />
                        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>${appt.docData?.fees || appt.amount}</span>
                      </div>
                    </div>

                    {/* Online/Offline Info */}
                    <div style={{ marginTop: "8px", borderTop: "1px dashed var(--border)", paddingTop: "8px" }}>
                      {appt.appointmentType === "online" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "4px", width: "max-content" }}>
                            Online ({appt.onlineInfo?.platform || "Google Meet"})
                          </span>
                          {appt.onlineInfo?.meetingLink && (
                            <a
                              href={appt.onlineInfo.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}
                            >
                              Join Call: {appt.onlineInfo.meetingLink}
                            </a>
                          )}
                          {appt.onlineInfo?.otherInfo && (
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                              Note: {appt.onlineInfo.otherInfo}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: "4px", width: "max-content" }}>
                              Clinic Visit
                            </span>
                            {appt.offlineInfo?.serialNumber && (
                              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)" }}>
                                Serial: {appt.offlineInfo.serialNumber}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                            <strong>Place:</strong> {appt.offlineInfo?.place || appt.offlineInfo?.location || "Doctor's Clinic"}
                          </p>
                          {appt.offlineInfo?.expectedTime && (
                            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                              <strong>Expected Time:</strong> {appt.offlineInfo.expectedTime}
                            </p>
                          )}
                          {appt.offlineInfo?.otherInfo && (
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                              Note: {appt.offlineInfo.otherInfo}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      background: status.bg,
                      borderRadius: "50px", padding: "5px 12px",
                      fontSize: "0.75rem", fontWeight: 700,
                      color: status.color,
                    }}>
                      <StatusIcon size={12} />
                      {status.label}
                    </div>

                    {!appt.cancelled && !appt.isCompleted && (
                      <button
                        onClick={() => handleCancel(appt._id)}
                        style={{
                          background: "none",
                          border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: "8px",
                          padding: "5px 12px",
                          cursor: "pointer",
                          color: "#ef4444",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
