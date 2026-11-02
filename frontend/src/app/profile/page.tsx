"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { User, Phone, MapPin, Mail, Calendar, Sparkles, UploadCloud, Edit3, Save } from "lucide-react";
import api from "@/lib/api";

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
  };
  gender: string;
  dob: string;
  image: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/user/get-profile");
      if (res.data.success) {
        const u = res.data.userData;
        if (!u.address) {
          u.address = { line1: "", line2: "" };
        } else if (typeof u.address === "string") {
          try {
            u.address = JSON.parse(u.address);
          } catch {
            u.address = { line1: u.address, line2: "" };
          }
        }
        setUserData(u);
        localStorage.setItem("userData", JSON.stringify({
          name: u.name,
          email: u.email,
          image: u.image || "",
        }));
        window.dispatchEvent(new Event("authChange"));
      } else {
        toast.error(res.data.message || "Failed to load profile data");
      }
    } catch (err: any) {
      toast.error("Failed to connect to server");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name || "");
      formData.append("phone", userData.phone || "");
      formData.append("address", JSON.stringify(userData.address || { line1: "", line2: "" }));
      formData.append("gender", userData.gender || "Male");
      formData.append("dob", userData.dob || "");
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await api.post("/api/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setIsEdit(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        // Update localStorage userData cache with updated info
        const updatedUser = {
          name: userData.name,
          email: userData.email,
          image: res.data.image || userData.image || "",
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("authChange"));
        fetchProfile();
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save profile. Please check size/format.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="pulse-dot" style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--primary)" }} />
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <p style={{ color: "var(--text-secondary)" }}>Please log in to view your profile</p>
        <button onClick={() => router.push("/login")} className="btn-primary">Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "4rem 0" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Header card */}
        <div style={{
          background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
          borderRadius: "24px 24px 0 0",
          padding: "3rem 2rem",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%)",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            {/* Profile image picker */}
            <div style={{ position: "relative" }}>
              <div style={{
                width: 120, height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid rgba(255,255,255,0.3)",
                position: "relative",
                background: "#f1f5f9"
              }}>
                <Image
                  src={previewUrl || userData.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"}
                  alt="User photo"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              {isEdit && (
                <label htmlFor="fileInput" style={{
                  position: "absolute", bottom: 0, right: 0,
                  background: "#0ea5e9", color: "white",
                  width: 36, height: 36, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  border: "2px solid white"
                }}>
                  <UploadCloud size={16} />
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", padding: "4px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                <Sparkles size={12} /> Patient Profile
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.25rem" }}>{userData.name}</h1>
              <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>Manage your personal records & appointments</p>
            </div>
          </div>
        </div>

        {/* Content card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 24px 24px",
          padding: "2.5rem",
          boxShadow: "var(--shadow-lg)"
        }}>
          {isEdit ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Edit Mode */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>Phone Number</label>
                  <input
                    type="text"
                    value={userData.phone || ""}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="input"
                    placeholder="e.g. +1 (555) 019-2834"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>Gender</label>
                  <select
                    value={userData.gender || "Male"}
                    onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                    className="input"
                    style={{ background: "var(--bg-secondary)", cursor: "pointer" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>Date of Birth</label>
                  <input
                    type="date"
                    value={userData.dob || ""}
                    onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>Address Line 1</label>
                <input
                  type="text"
                  value={userData.address.line1 || ""}
                  onChange={(e) => setUserData({
                    ...userData,
                    address: { ...userData.address, line1: e.target.value }
                  })}
                  className="input"
                  placeholder="Street address, P.O. box"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>Address Line 2</label>
                <input
                  type="text"
                  value={userData.address.line2 || ""}
                  onChange={(e) => setUserData({
                    ...userData,
                    address: { ...userData.address, line2: e.target.value }
                  })}
                  className="input"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "1rem" }}>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={saving}
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
                  <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* View Mode */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "1rem" }}>Contact Details</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Mail size={16} style={{ color: "var(--primary)" }} />
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Email Address</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 500 }}>{userData.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Phone size={16} style={{ color: "var(--primary)" }} />
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Phone Number</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 500 }}>{userData.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <MapPin size={16} style={{ color: "var(--primary)", marginTop: "4px" }} />
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Address</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 500, lineHeight: 1.4 }}>
                          {userData.address.line1 ? (
                            <>
                              {userData.address.line1}
                              {userData.address.line2 && <><br />{userData.address.line2}</>}
                            </>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "1rem" }}>Personal Information</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <User size={16} style={{ color: "var(--primary)" }} />
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Gender</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 500 }}>{userData.gender || "Not specified"}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Calendar size={16} style={{ color: "var(--primary)" }} />
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Date of Birth</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 500 }}>{userData.dob || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                <button onClick={() => setIsEdit(true)} className="btn-primary">
                  <Edit3 size={16} /> Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
