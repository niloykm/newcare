"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "https://newcarebackend.vercel.app";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/admin/login`, {
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        localStorage.setItem("aToken", res.data.token);
        toast.success("Welcome back, Admin!");
        router.push("/");
      } else {
        toast.error(res.data.message || "Invalid admin credentials");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4 text-neutral-100">
      <div className="w-full max-w-sm">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="mb-3">
            <Image
              src="https://res.cloudinary.com/dg5gwims9/image/upload/v1783617203/newcare_assets/newCare.png"
              alt="NewCare Logo"
              width={140}
              height={36}
              style={{ objectFit: "contain", height: "36px", width: "auto", margin: "0 auto", filter: "brightness(0) invert(1)" }}
              unoptimized
            />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Clinic Administration Console
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Restricted administrative and financial access
          </p>
        </div>

        {/* Card */}
        <div className="card bg-neutral-900 border border-neutral-800 p-6 sm:p-7 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700/80 mb-5 text-xs text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authorized credentials required</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@newcare.health"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-neutral-100 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 pointer-events-none" />
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-neutral-100 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-white p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-10 text-xs sm:text-sm font-semibold rounded-lg mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-[11px] text-neutral-500 tabular-nums">
          © {new Date().getFullYear()} NewCare Clinical Operations — Access Audited
        </p>
      </div>
    </div>
  );
}
