"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Users, Calendar, Stethoscope, Settings,
  LogOut, Heart, Menu, X, Sun, Moon, TrendingUp, Activity,
  Clock, CheckCircle, XCircle, ChevronRight, Star
} from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "https://newcarebackend.vercel.app";

function api() {
  return axios.create({
    baseURL: API,
    headers: {
      "Content-Type": "application/json",
      aToken: typeof window !== "undefined" ? (localStorage.getItem("aToken") || "") : "",
    },
  });
}

interface DashData {
  doctors: number;
  appointments: number;
  patients: number;
  latestAppointments: any[];
}

function Sidebar({ activeTab, onTab, collapsed }: { activeTab: string; onTab: (t: string) => void; collapsed: boolean }) {
  const router = useRouter();
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "patients", label: "Patients", icon: Users },
    { id: "specialties", label: "Specialties", icon: Heart },
  ];

  const handleLogout = () => {
    localStorage.removeItem("aToken");
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <aside style={{
      width: collapsed ? 60 : 240,
      background: "#0f172a",
      height: "100vh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.3s ease",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {collapsed ? (
            <div style={{
              width: 32, height: 32, borderRadius: "8px",
              background: "#0284c7",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, color: "white", fontWeight: "bold", fontSize: "0.8rem"
            }}>
              NC
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Image
                src="https://res.cloudinary.com/dg5gwims9/image/upload/v1783617203/newcare_assets/newCare.png"
                alt="NewCare Logo"
                width={120}
                height={30}
                style={{ objectFit: "contain", height: "30px", width: "auto" }}
                unoptimized
              />
              <span style={{
                background: "rgba(99,102,241,0.15)",
                color: "#818cf8",
                padding: "2px 8px",
                borderRadius: "20px",
                fontSize: "0.7rem",
                fontWeight: 700
              }}>
                Admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "4px" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTab(id)}
            title={collapsed ? label : undefined}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: activeTab === id ? "rgba(99,102,241,0.15)" : "transparent",
              color: activeTab === id ? "#6366f1" : "#94a3b8",
              fontWeight: 600,
              fontSize: "0.875rem",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", width: "100%",
            border: "none", background: "none", cursor: "pointer",
            color: "#ef4444", fontWeight: 600, fontSize: "0.875rem",
            borderRadius: "10px", transition: "background 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

function StatCard({ icon: Icon, label, value, color, change }: any) {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "12px",
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontSize: "0.78rem", fontWeight: 600, color: "#10b981"
        }}>
          <TrendingUp size={12} /> {change}
        </div>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text)" }}>{value}</div>
      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

function DashboardTab({ data }: { data: DashData | null }) {
  if (!data) return <div style={{ color: "var(--text-secondary)", padding: "2rem" }}>Loading dashboard...</div>;

  const stats = [
    { icon: Stethoscope, label: "Total Doctors", value: data.doctors, color: "#6366f1", change: "+12%" },
    { icon: Calendar, label: "Total Appointments", value: data.appointments, color: "#0ea5e9", change: "+8%" },
    { icon: Users, label: "Total Patients", value: data.patients, color: "#10b981", change: "+15%" },
    { icon: Activity, label: "Completion Rate", value: "94%", color: "#f59e0b", change: "+2%" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.75rem" }}>Dashboard Overview</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={18} style={{ color: "var(--primary)" }} /> Recent Appointments
        </h2>
        {data.latestAppointments.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No recent appointments</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.latestAppointments.slice(0, 5).map((a: any) => (
              <div key={a._id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "var(--bg-secondary)",
                borderRadius: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                    <Image
                      src={a.docData?.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop"}
                      alt="" fill style={{ objectFit: "cover" }} unoptimized
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{a.docData?.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.slotDate} • {a.slotTime}</p>
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 600,
                  background: a.cancelled ? "rgba(239,68,68,0.1)" : a.isCompleted ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)",
                  color: a.cancelled ? "#ef4444" : a.isCompleted ? "#10b981" : "#0ea5e9",
                }}>
                  {a.cancelled ? "Cancelled" : a.isCompleted ? "Completed" : "Upcoming"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorsTab() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    email: "",
    password: "",
    speciality: "",
    degree: "",
    experience: "1",
    about: "",
    fees: "",
    line1: "",
    line2: "",
    image: null as File | null,
    available: true,
  };

  const [form, setForm] = useState(initialForm);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api().get("/api/admin/all-doctors");
      if (res.data.success) setDoctors(res.data.doctors);
    } catch { }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
    const fetchSpecialties = async () => {
      try {
        const res = await api().get("/api/admin/all-specialties");
        if (res.data.success) setSpecialties(res.data.specialties);
      } catch { }
    };
    fetchSpecialties();
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.speciality.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAvailable = async (docId: string, current: boolean) => {
    try {
      const res = await api().post("/api/admin/change-availability", { docId });
      if (res.data.success) {
        setDoctors(prev => prev.map(d => d._id === docId ? { ...d, available: !current } : d));
        toast.success("Availability updated");
      }
    } catch { toast.error("Failed to update"); }
  };

  const deleteDoctor = async (docId: string) => {
    if (!confirm("Delete this doctor?")) return;
    try {
      const res = await api().post("/api/admin/delete-doctor", { docId });
      if (res.data.success) {
        setDoctors(prev => prev.filter(d => d._id !== docId));
        toast.success("Doctor deleted");
      }
    } catch { toast.error("Failed to delete"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("speciality", form.speciality);
      fd.append("degree", form.degree);
      fd.append("experience", form.experience);
      fd.append("about", form.about);
      fd.append("fees", form.fees);
      fd.append("address", JSON.stringify({ line1: form.line1, line2: form.line2 }));
      fd.append("available", String(form.available));
      if (form.image) {
        fd.append("image", form.image);
      }

      if (editingDoc) {
        fd.append("docId", editingDoc._id);
        const res = await api().post("/api/admin/update-doctor", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
          toast.success("Doctor updated successfully");
          setEditingDoc(null);
          fetchDoctors();
        } else {
          toast.error(res.data.message || "Failed to update");
        }
      } else {
        fd.append("password", form.password);
        if (!form.image) {
          toast.error("Please upload doctor image");
          setSubmitting(false);
          return;
        }
        const res = await api().post("/api/admin/add-doctor", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
          toast.success("Doctor added successfully");
          setShowAddModal(false);
          setForm(initialForm);
          fetchDoctors();
        } else {
          toast.error(res.data.message || "Failed to add");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (doc: any) => {
    setEditingDoc(doc);
    setForm({
      name: doc.name,
      email: doc.email,
      password: "",
      speciality: doc.speciality,
      degree: doc.degree,
      experience: String(doc.experience),
      about: doc.about,
      fees: String(doc.fees),
      line1: doc.address?.line1 || "",
      line2: doc.address?.line2 || "",
      image: null,
      available: doc.available,
    });
  };

  const openAdd = () => {
    setForm(initialForm);
    setEditingDoc(null);
    setShowAddModal(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Doctors ({filtered.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ width: 240 }}
          />
          <button onClick={openAdd} className="btn-primary">Add Doctor</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Doctor", "Specialty", "Experience", "Fees", "Available", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "10px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                        <Image src={doc.image} alt={doc.name} fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{doc.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{doc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{doc.speciality}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{doc.experience} yrs</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>${doc.fees}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => toggleAvailable(doc._id, doc.available)}
                      style={{
                        width: 36, height: 20,
                        borderRadius: "10px",
                        border: "none",
                        background: doc.available ? "#10b981" : "var(--border)",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div style={{
                        width: 14, height: 14,
                        borderRadius: "50%",
                        background: "white",
                        position: "absolute",
                        top: 3,
                        left: doc.available ? 19 : 3,
                        transition: "left 0.2s ease",
                      }} />
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <button onClick={() => openEdit(doc)} className="btn-primary" style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>Edit</button>
                    <button onClick={() => deleteDoctor(doc._id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No doctors found</p>
          )}
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      {(showAddModal || editingDoc) && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div className="card" style={{
            width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto",
            padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{editingDoc ? "Edit Doctor Profile" : "Register New Doctor"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Email Address *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" required />
                </div>
              </div>

              {!editingDoc && (
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Password *</label>
                  <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input" required minLength={8} />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Specialty *</label>
                  <select value={form.speciality} onChange={e => setForm({ ...form, speciality: e.target.value })} className="input" style={{ appearance: "auto" }} required>
                    <option value="">Select Specialty</option>
                    {specialties.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                    {/* fallback options in case no specialties in DB */}
                    <option value="General physician">General physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Degree *</label>
                  <input type="text" placeholder="e.g. MBBS, MD" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} className="input" required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Experience *</label>
                  <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input" style={{ appearance: "auto" }} required>
                    {Array.from({ length: 15 }, (_, idx) => (
                      <option key={idx + 1} value={String(idx + 1)}>{idx + 1} Years</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Consultation Fees ($) *</label>
                  <input type="number" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} className="input" required />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>About Doctor *</label>
                <textarea rows={3} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} className="input" required style={{ resize: "none" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Address Line 1 *</label>
                  <input type="text" value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Address Line 2</label>
                  <input type="text" value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} className="input" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Doctor Image {!editingDoc && "*"}</label>
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files ? e.target.files[0] : null })} className="input" required={!editingDoc} />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => { setShowAddModal(false); setEditingDoc(null); }} className="btn-danger" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Saving..." : (editingDoc ? "Save Changes" : "Register Doctor")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentsTab() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingApp, setReschedulingApp] = useState<any | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // New states for booking new appointment
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [bookForm, setBookForm] = useState({
    userId: "",
    docId: "",
    slotDate: "",
    slotTime: "",
    appointmentType: "offline",
    platform: "Google Meet",
    meetingLink: "",
    otherInfoOnline: "",
    serialNumber: "",
    place: "",
    expectedTime: "",
    location: "",
    otherInfoOffline: ""
  });

  const [editingApp, setEditingApp] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    appointmentId: "",
    slotDate: "",
    slotTime: "",
    appointmentType: "offline",
    amount: 0,
    cancelled: false,
    isCompleted: false,
    payment: false,
    platform: "",
    meetingLink: "",
    otherInfoOnline: "",
    serialNumber: "",
    place: "",
    expectedTime: "",
    location: "",
    otherInfoOffline: ""
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api().get("/api/admin/appointments");
      if (res.data.success) setAppointments(res.data.appointments.reverse());
    } catch { }
    setLoading(false);
  };

  const fetchDoctorsAndPatients = async () => {
    try {
      const docsRes = await api().get("/api/admin/all-doctors");
      if (docsRes.data.success) setDoctorsList(docsRes.data.doctors);
      
      const patientsRes = await api().get("/api/admin/all-patients");
      if (patientsRes.data.success) setPatientsList(patientsRes.data.patients);
    } catch { }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctorsAndPatients();
  }, []);

  const cancel = async (id: string) => {
    try {
      const res = await api().post("/api/admin/cancel-appointment", { appointmentId: id });
      if (res.data.success) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, cancelled: true } : a));
        toast.success("Cancelled");
      }
    } catch { toast.error("Failed"); }
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Delete this appointment permanently?")) return;
    try {
      const res = await api().post("/api/admin/delete-appointment", { appointmentId: id });
      if (res.data.success) {
        setAppointments(prev => prev.filter(a => a._id !== id));
        toast.success("Deleted");
      }
    } catch { toast.error("Failed to delete"); }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTime) return;
    setSubmitting(true);
    try {
      const res = await api().post("/api/admin/reschedule-appointment", {
        appointmentId: reschedulingApp._id,
        newSlotDate: newDate,
        newSlotTime: newTime,
      });
      if (res.data.success) {
        toast.success("Appointment rescheduled successfully");
        setReschedulingApp(null);
        setNewDate("");
        setNewTime("");
        fetchAppointments();
      } else {
        toast.error(res.data.message || "Failed to reschedule");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reschedule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.userId || !bookForm.docId || !bookForm.slotDate || !bookForm.slotTime) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        userId: bookForm.userId,
        docId: bookForm.docId,
        slotDate: bookForm.slotDate,
        slotTime: bookForm.slotTime,
        appointmentType: bookForm.appointmentType,
        onlineInfo: bookForm.appointmentType === "online" ? {
          time: bookForm.slotTime,
          platform: bookForm.platform,
          meetingLink: bookForm.meetingLink,
          otherInfo: bookForm.otherInfoOnline
        } : null,
        offlineInfo: bookForm.appointmentType === "offline" ? {
          serialNumber: bookForm.serialNumber,
          place: bookForm.place,
          expectedTime: bookForm.expectedTime || bookForm.slotTime,
          location: bookForm.location,
          otherInfo: bookForm.otherInfoOffline
        } : null
      };

      const res = await api().post("/api/admin/add-appointment", payload);
      if (res.data.success) {
        toast.success("Appointment booked successfully");
        setShowAddModal(false);
        setBookForm({
          userId: "", docId: "", slotDate: "", slotTime: "",
          appointmentType: "offline", platform: "Google Meet", meetingLink: "", otherInfoOnline: "",
          serialNumber: "", place: "", expectedTime: "", location: "", otherInfoOffline: ""
        });
        fetchAppointments();
      } else {
        toast.error(res.data.message || "Failed to book");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        appointmentId: editForm.appointmentId,
        slotDate: editForm.slotDate,
        slotTime: editForm.slotTime,
        appointmentType: editForm.appointmentType,
        amount: editForm.amount,
        cancelled: editForm.cancelled,
        isCompleted: editForm.isCompleted,
        payment: editForm.payment,
        onlineInfo: editForm.appointmentType === "online" ? {
          time: editForm.slotTime,
          platform: editForm.platform,
          meetingLink: editForm.meetingLink,
          otherInfo: editForm.otherInfoOnline
        } : null,
        offlineInfo: editForm.appointmentType === "offline" ? {
          serialNumber: editForm.serialNumber,
          place: editForm.place,
          expectedTime: editForm.expectedTime || editForm.slotTime,
          location: editForm.location,
          otherInfo: editForm.otherInfoOffline
        } : null
      };

      const res = await api().post("/api/admin/update-appointment", payload);
      if (res.data.success) {
        toast.success("Appointment updated successfully");
        setEditingApp(null);
        fetchAppointments();
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (appt: any) => {
    setEditingApp(appt);
    setEditForm({
      appointmentId: appt._id,
      slotDate: appt.slotDate,
      slotTime: appt.slotTime,
      appointmentType: appt.appointmentType || "offline",
      amount: appt.amount || 0,
      cancelled: appt.cancelled || false,
      isCompleted: appt.isCompleted || false,
      payment: appt.payment || false,
      platform: appt.onlineInfo?.platform || "Google Meet",
      meetingLink: appt.onlineInfo?.meetingLink || "",
      otherInfoOnline: appt.onlineInfo?.otherInfo || "",
      serialNumber: appt.offlineInfo?.serialNumber || "",
      place: appt.offlineInfo?.place || "",
      expectedTime: appt.offlineInfo?.expectedTime || appt.slotTime || "",
      location: appt.offlineInfo?.location || "",
      otherInfoOffline: appt.offlineInfo?.otherInfo || ""
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
          All Appointments ({appointments.length})
        </h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">Book Appointment</button>
      </div>
      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      ) : (
        <div className="card" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Patient", "Doctor", "Specialty", "Date & Time", "Type", "Fee", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {a.userData?.image && (
                        <div style={{ width: 32, height: 32, borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                          <Image src={a.userData.image} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                        </div>
                      )}
                      <span style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 600 }}>{a.userData?.name || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text)" }}>{a.docData?.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{a.docData?.speciality}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{a.slotDate} • {a.slotTime}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem" }}>
                    {a.appointmentType === "online" ? (
                      <div>
                        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, background: "rgba(16,185,129,0.1)", color: "#10b981", marginBottom: 4 }}>Online</span>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                          {a.onlineInfo?.platform || "Google Meet"}<br />
                          {a.onlineInfo?.meetingLink && <a href={a.onlineInfo.meetingLink} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "underline" }}>Link</a>}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#f59e0b", marginBottom: 4 }}>Offline</span>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                          Serial: {a.offlineInfo?.serialNumber || "—"}<br />
                          Place: {a.offlineInfo?.place || "Clinic"}
                        </div>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>${a.amount}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700,
                      background: a.cancelled ? "rgba(239,68,68,0.1)" : a.isCompleted ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)",
                      color: a.cancelled ? "#ef4444" : a.isCompleted ? "#10b981" : "#0ea5e9",
                    }}>
                      {a.cancelled ? "Cancelled" : a.isCompleted ? "Completed" : "Upcoming"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <button onClick={() => startEdit(a)} className="btn-primary" style={{ padding: "6px 12px", background: "rgba(14,165,233,0.1)", color: "#0ea5e9" }}>Edit</button>
                    {!a.cancelled && !a.isCompleted && (
                      <>
                        <button onClick={() => { setReschedulingApp(a); setNewDate(a.slotDate); setNewTime(a.slotTime); }} className="btn-primary" style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>Reschedule</button>
                        <button onClick={() => cancel(a._id)} className="btn-danger">Cancel</button>
                      </>
                    )}
                    <button onClick={() => deleteApp(a._id)} className="btn-danger" style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApp && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "400px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Reschedule Appointment</h2>
            <form onSubmit={handleReschedule} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Date (e.g. 2026-07-15) *</label>
                <input type="text" value={newDate} onChange={e => setNewDate(e.target.value)} className="input" placeholder="YYYY-MM-DD" required />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Time Slot (e.g. 10:00 AM) *</label>
                <input type="text" value={newTime} onChange={e => setNewTime(e.target.value)} className="input" placeholder="HH:MM AM/PM" required />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setReschedulingApp(null)} className="btn-danger" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Rescheduling..." : "Reschedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Book New Appointment</h2>
            <form onSubmit={handleBookAppointment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Select Patient *</label>
                <select value={bookForm.userId} onChange={e => setBookForm({ ...bookForm, userId: e.target.value })} className="input" required>
                  <option value="">-- Choose Patient --</option>
                  {patientsList.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Select Doctor *</label>
                <select value={bookForm.docId} onChange={e => setBookForm({ ...bookForm, docId: e.target.value })} className="input" required>
                  <option value="">-- Choose Doctor --</option>
                  {doctorsList.map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.speciality})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Date (e.g. 2026-07-15) *</label>
                <input type="text" value={bookForm.slotDate} onChange={e => setBookForm({ ...bookForm, slotDate: e.target.value })} className="input" placeholder="YYYY-MM-DD" required />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Time Slot (e.g. 10:00 AM) *</label>
                <input type="text" value={bookForm.slotTime} onChange={e => setBookForm({ ...bookForm, slotTime: e.target.value })} className="input" placeholder="HH:MM AM/PM" required />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Appointment Type *</label>
                <select value={bookForm.appointmentType} onChange={e => setBookForm({ ...bookForm, appointmentType: e.target.value })} className="input" required>
                  <option value="offline">Offline (Clinic Visit)</option>
                  <option value="online">Online (Video Consult)</option>
                </select>
              </div>

              {bookForm.appointmentType === "online" ? (
                <div style={{ padding: "10px", background: "var(--bg-secondary)", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>Online Consultation Details</h4>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Meeting Platform</label>
                    <input type="text" value={bookForm.platform} onChange={e => setBookForm({ ...bookForm, platform: e.target.value })} className="input" placeholder="e.g. Google Meet, Zoom" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Meeting Link (Optional)</label>
                    <input type="text" value={bookForm.meetingLink} onChange={e => setBookForm({ ...bookForm, meetingLink: e.target.value })} className="input" placeholder="https://..." />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Other Online Notes</label>
                    <input type="text" value={bookForm.otherInfoOnline} onChange={e => setBookForm({ ...bookForm, otherInfoOnline: e.target.value })} className="input" placeholder="Notes for call..." />
                  </div>
                </div>
              ) : (
                <div style={{ padding: "10px", background: "var(--bg-secondary)", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>Offline Clinic Visit Details</h4>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Serial Number (Optional, auto-generated if blank)</label>
                    <input type="text" value={bookForm.serialNumber} onChange={e => setBookForm({ ...bookForm, serialNumber: e.target.value })} className="input" placeholder="e.g. #01" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Place (Clinic Name)</label>
                    <input type="text" value={bookForm.place} onChange={e => setBookForm({ ...bookForm, place: e.target.value })} className="input" placeholder="e.g. Health Plaza, Floor 2" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Expected Time (Optional)</label>
                    <input type="text" value={bookForm.expectedTime} onChange={e => setBookForm({ ...bookForm, expectedTime: e.target.value })} className="input" placeholder="e.g. 10:15 AM" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Location (Address)</label>
                    <input type="text" value={bookForm.location} onChange={e => setBookForm({ ...bookForm, location: e.target.value })} className="input" placeholder="Google Maps link or text address" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Other Notes</label>
                    <input type="text" value={bookForm.otherInfoOffline} onChange={e => setBookForm({ ...bookForm, otherInfoOffline: e.target.value })} className="input" placeholder="Additional details..." />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-danger" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {editingApp && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Edit Appointment ({editingApp.userData?.name || "Patient"})</h2>
            <form onSubmit={handleUpdateAppointment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Date (e.g. 2026-07-15) *</label>
                <input type="text" value={editForm.slotDate} onChange={e => setEditForm({ ...editForm, slotDate: e.target.value })} className="input" placeholder="YYYY-MM-DD" required />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Time Slot (e.g. 10:00 AM) *</label>
                <input type="text" value={editForm.slotTime} onChange={e => setEditForm({ ...editForm, slotTime: e.target.value })} className="input" placeholder="HH:MM AM/PM" required />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Fee Amount ($) *</label>
                <input type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: Number(e.target.value) })} className="input" required />
              </div>

              {/* Status Toggles */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: "10px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.cancelled} onChange={e => setEditForm({ ...editForm, cancelled: e.target.checked })} />
                  Cancelled
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.isCompleted} onChange={e => setEditForm({ ...editForm, isCompleted: e.target.checked })} />
                  Completed
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                  <input type="checkbox" checked={editForm.payment} onChange={e => setEditForm({ ...editForm, payment: e.target.checked })} />
                  Paid
                </label>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Appointment Type *</label>
                <select value={editForm.appointmentType} onChange={e => setEditForm({ ...editForm, appointmentType: e.target.value })} className="input" required>
                  <option value="offline">Offline (Clinic Visit)</option>
                  <option value="online">Online (Video Consult)</option>
                </select>
              </div>

              {editForm.appointmentType === "online" ? (
                <div style={{ padding: "10px", background: "var(--bg-secondary)", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>Online Consultation Details</h4>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Meeting Platform</label>
                    <input type="text" value={editForm.platform} onChange={e => setEditForm({ ...editForm, platform: e.target.value })} className="input" placeholder="e.g. Google Meet, Zoom" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Meeting Link</label>
                    <input type="text" value={editForm.meetingLink} onChange={e => setEditForm({ ...editForm, meetingLink: e.target.value })} className="input" placeholder="https://..." />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Other Online Notes</label>
                    <input type="text" value={editForm.otherInfoOnline} onChange={e => setEditForm({ ...editForm, otherInfoOnline: e.target.value })} className="input" placeholder="Notes for call..." />
                  </div>
                </div>
              ) : (
                <div style={{ padding: "10px", background: "var(--bg-secondary)", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>Offline Clinic Visit Details</h4>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Serial Number</label>
                    <input type="text" value={editForm.serialNumber} onChange={e => setEditForm({ ...editForm, serialNumber: e.target.value })} className="input" placeholder="e.g. #01" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Place (Clinic Name)</label>
                    <input type="text" value={editForm.place} onChange={e => setEditForm({ ...editForm, place: e.target.value })} className="input" placeholder="e.g. Health Plaza" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Expected Time</label>
                    <input type="text" value={editForm.expectedTime} onChange={e => setEditForm({ ...editForm, expectedTime: e.target.value })} className="input" placeholder="e.g. 10:15 AM" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Location (Address)</label>
                    <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="input" placeholder="Address or Google Maps link" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>Other Notes</label>
                    <input type="text" value={editForm.otherInfoOffline} onChange={e => setEditForm({ ...editForm, otherInfoOffline: e.target.value })} className="input" placeholder="Additional details..." />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setEditingApp(null)} className="btn-danger" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PatientsTab() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    email: "",
    password: "",
    gender: "Not Selected",
    dob: "",
    phone: "",
  };

  const [form, setForm] = useState(initialForm);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api().get("/api/admin/all-patients");
      if (res.data.success) setPatients(res.data.patients);
    } catch { }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const deletePatient = async (userId: string) => {
    if (!confirm("Delete this patient account and all their appointments?")) return;
    try {
      const res = await api().post("/api/admin/delete-patient", { userId });
      if (res.data.success) {
        setPatients(prev => prev.filter(p => p._id !== userId));
        toast.success("Patient deleted");
      }
    } catch { toast.error("Failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPatient) {
        const res = await api().post("/api/admin/update-patient", {
          userId: editingPatient._id,
          name: form.name,
          email: form.email,
          password: form.password,
          gender: form.gender,
          dob: form.dob,
          phone: form.phone,
        });
        if (res.data.success) {
          toast.success("Patient updated successfully");
          setEditingPatient(null);
          fetchPatients();
        } else {
          toast.error(res.data.message || "Failed to update");
        }
      } else {
        const res = await api().post("/api/admin/add-patient", form);
        if (res.data.success) {
          toast.success("Patient added successfully");
          setShowAddModal(false);
          setForm(initialForm);
          fetchPatients();
        } else {
          toast.error(res.data.message || "Failed to add");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (p: any) => {
    setEditingPatient(p);
    setForm({
      name: p.name || "",
      email: p.email || "",
      password: "",
      gender: p.gender || "Not Selected",
      dob: p.dob || "",
      phone: p.phone || "",
    });
  };

  const openAdd = () => {
    setForm(initialForm);
    setEditingPatient(null);
    setShowAddModal(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Patients ({filtered.length})</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} className="input" style={{ width: 240 }} />
          <button onClick={openAdd} className="btn-primary">Add Patient</button>
        </div>
      </div>
      {loading ? <p style={{ color: "var(--text-secondary)" }}>Loading...</p> : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Patient", "Gender", "DOB", "Phone", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                        <Image src={p.image || "https://i.pravatar.cc/80"} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{p.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{p.gender || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{p.dob || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{p.phone || "—"}</td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <button onClick={() => openEdit(p)} className="btn-primary" style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>Edit</button>
                    <button onClick={() => deletePatient(p._id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No patients found</p>}
        </div>
      )}

      {/* Add / Edit Patient Modal */}
      {(showAddModal || editingPatient) && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div className="card" style={{
            width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto",
            padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{editingPatient ? "Edit Patient Details" : "Register New Patient"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Email Address *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" required />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>
                  Password {editingPatient ? "(Leave blank to keep current)" : "*"}
                </label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input" required={!editingPatient} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Gender</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="input">
                    <option value="Not Selected">Not Selected</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>DOB (e.g. YYYY-MM-DD)</label>
                  <input type="text" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="input" placeholder="YYYY-MM-DD" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Phone Number</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="Phone" />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => { setShowAddModal(false); setEditingPatient(null); }} className="btn-danger" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Saving..." : (editingPatient ? "Update" : "Add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


function SpecialtiesTab() {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", image: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<any | null>(null);

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const res = await api().get("/api/admin/all-specialties");
      if (res.data.success) setSpecialties(res.data.specialties);
    } catch { }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingSpecialty) {
        const res = await api().post("/api/admin/update-specialty", {
          id: editingSpecialty._id,
          ...form,
        });
        if (res.data.success) {
          toast.success("Specialty updated!");
          setEditingSpecialty(null);
          setForm({ name: "", image: "", description: "" });
          fetchSpecialties();
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await api().post("/api/admin/add-specialty", form);
        if (res.data.success) {
          toast.success("Specialty added!");
          setForm({ name: "", image: "", description: "" });
          fetchSpecialties();
        } else {
          toast.error(res.data.message);
        }
      }
    } catch { toast.error("Failed to save"); }
    setSubmitting(false);
  };

  const startEdit = (spec: any) => {
    setEditingSpecialty(spec);
    setForm({
      name: spec.name,
      image: spec.image || "",
      description: spec.description,
    });
  };

  const cancelEdit = () => {
    setEditingSpecialty(null);
    setForm({ name: "", image: "", description: "" });
  };

  const deleteSpecialty = async (id: string) => {
    if (!confirm("Delete this specialty?")) return;
    try {
      const res = await api().post("/api/admin/delete-specialty", { id });
      if (res.data.success) {
        setSpecialties(prev => prev.filter(s => s._id !== id));
        toast.success("Deleted");
      }
    } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem" }}>Doctor Specialties</h1>

      {/* Form */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem" }}>
          {editingSpecialty ? "Edit Specialty" : "Add New Specialty"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="e.g. Cardiologist" required />
          </div>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Icon URL</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Description *</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" placeholder="Short description" required />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {editingSpecialty && (
              <button type="button" onClick={cancelEdit} className="btn-danger" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
            )}
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : (editingSpecialty ? "Update" : "Add")}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {specialties.map((s) => (
            <div key={s._id} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>{s.name}</h3>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => startEdit(s)} className="btn-primary" style={{ padding: "4px 8px", fontSize: "0.75rem", background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>Edit</button>
                  <button onClick={() => deleteSpecialty(s._id)} className="btn-danger" style={{ padding: "4px 10px" }}>×</button>
                </div>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{s.description}</p>
            </div>
          ))}
          {specialties.length === 0 && <p style={{ color: "var(--text-muted)" }}>No specialties yet. Add or edit above.</p>}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashData, setDashData] = useState<DashData | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const token = localStorage.getItem("aToken");
    if (!token) { router.push("/login"); return; }
    loadDash(token);
    const saved = localStorage.getItem("adminTheme") as "light" | "dark" | null;
    if (saved) { setTheme(saved); document.documentElement.setAttribute("data-theme", saved); }
  }, []);

  const loadDash = async (token: string) => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard`, {
        headers: { aToken: token }
      });
      if (res.data.success) setDashData(res.data.dashData);
    } catch { }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("adminTheme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  const tabContent: Record<string, React.ReactNode> = {
    dashboard: <DashboardTab data={dashData} />,
    doctors: <DoctorsTab />,
    appointments: <AppointmentsTab />,
    patients: <PatientsTab />,
    specialties: <SpecialtiesTab />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} onTab={setActiveTab} collapsed={sidebarCollapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.5rem",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>
              {activeTab}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={toggleTheme}
              style={{
                width: 36, height: 36, borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text)",
              }}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <div style={{
              width: 32, height: 32, borderRadius: "8px",
              background: "#0284c7",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "0.85rem"
            }}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", background: "var(--bg)" }}>
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
}
