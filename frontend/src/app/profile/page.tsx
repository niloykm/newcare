"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  UploadCloud,
  Edit3,
  Save,
} from "lucide-react";
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/user/get-profile");
      if (res.data.success) {
        const u = res.data.userData as UserData;
        if (!u.address) {
          u.address = { line1: "", line2: "" };
        } else if (typeof u.address === "string") {
          try {
            u.address = JSON.parse(u.address) as { line1: string; line2: string };
          } catch {
            u.address = { line1: String(u.address), line2: "" };
          }
        }
        setUserData(u);
        localStorage.setItem(
          "userData",
          JSON.stringify({ name: u.name, email: u.email, image: u.image || "" })
        );
        window.dispatchEvent(new Event("authChange"));
      } else {
        setUserData(null);
      }
    } catch {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      formData.append(
        "address",
        JSON.stringify(userData.address || { line1: "", line2: "" })
      );
      formData.append("gender", userData.gender || "Female");
      formData.append("dob", userData.dob || "");
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await api.post("/api/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Profile updated.");
        setIsEdit(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        const updatedUser = {
          name: userData.name,
          email: userData.email,
          image: res.data.image || userData.image || "",
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("authChange"));
        fetchProfile();
      } else {
        toast.error(res.data.message || "Failed to update profile.");
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message || "Failed to save profile."
        : "Failed to save profile.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-500">
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f14] px-4 py-12">
        <div className="card p-8 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-400 mx-auto">
            <User className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Patient Profile
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              Sign in to view and update your contact details, address, and care coordination preferences.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2">
            <Link href="/login" className="btn-primary">
              Sign In to Your Account
            </Link>
            <Link href="/dashboard/patient" className="btn-secondary">
              Patient Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f14] text-slate-900 dark:text-slate-100 py-10 pb-20">
      <div className="container max-w-3xl space-y-6">
        <div className="card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-900">
              <Image
                src={previewUrl || userData.image || "/assets/profile_pic.png"}
                alt={userData.name}
                fill
                sizes="80px"
                className="object-cover object-top"
                unoptimized
              />
            </div>
            {isEdit && (
              <label
                htmlFor="profile-avatar-upload"
                className="absolute -bottom-1.5 -right-1.5 bg-teal-700 hover:bg-teal-800 text-white w-8 h-8 rounded-md flex items-center justify-center cursor-pointer border-2 border-white dark:border-[#11161d] transition-colors"
                title="Upload profile photo"
              >
                <UploadCloud className="w-4 h-4" aria-hidden="true" />
                <input
                  type="file"
                  id="profile-avatar-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Patient Profile
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 truncate mt-0.5">
              {userData.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Personal contact details used for appointments and in-home care coordination.
            </p>
          </div>
        </div>

        <div className="card p-6 sm:p-7">
          {isEdit ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-phone"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={userData.phone || ""}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="input"
                    placeholder="(212) 480-0192"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-gender"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Gender
                  </label>
                  <select
                    id="profile-gender"
                    value={userData.gender || "Female"}
                    onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                    className="input cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="profile-dob"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="profile-dob"
                    type="date"
                    value={userData.dob || ""}
                    onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-line1"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    id="profile-line1"
                    type="text"
                    value={userData.address.line1 || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        address: { ...userData.address, line1: e.target.value },
                      })
                    }
                    className="input"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-line2"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Apartment / City / ZIP
                  </label>
                  <input
                    id="profile-line2"
                    type="text"
                    value={userData.address.line2 || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        address: { ...userData.address, line2: e.target.value },
                      })
                    }
                    className="input"
                    placeholder="Apt, City, NY ZIP"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
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
                  type="button"
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={saving}
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pb-2 mb-4 border-b border-slate-200 dark:border-slate-800">
                    Contact Details
                  </h2>
                  <dl className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-slate-500 dark:text-slate-400">Email</dt>
                        <dd className="font-medium text-slate-900 dark:text-slate-100">{userData.email}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-slate-500 dark:text-slate-400">Phone</dt>
                        <dd className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                          {userData.phone || "Not provided"}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-slate-500 dark:text-slate-400">Address</dt>
                        <dd className="font-medium text-slate-900 dark:text-slate-100">
                          {userData.address.line1 ? (
                            <>
                              {userData.address.line1}
                              {userData.address.line2 && (
                                <span className="block">{userData.address.line2}</span>
                              )}
                            </>
                          ) : (
                            "Not provided"
                          )}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pb-2 mb-4 border-b border-slate-200 dark:border-slate-800">
                    Personal Information
                  </h2>
                  <dl className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-slate-500 dark:text-slate-400">Gender</dt>
                        <dd className="font-medium text-slate-900 dark:text-slate-100">
                          {userData.gender || "Not specified"}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-slate-500 dark:text-slate-400">Date of Birth</dt>
                        <dd className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                          {userData.dob || "Not provided"}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsEdit(true)} className="btn-primary">
                  <Edit3 className="w-4 h-4" aria-hidden="true" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
