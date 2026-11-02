"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";

type Mode = "login" | "register" | "forgot";

// Handles the Google OAuth2 implicit flow callback
// Google returns: #access_token=xxx&token_type=Bearer&expires_in=3599&scope=...
function GoogleOAuthCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (!accessToken) return;

    // Clear hash from URL immediately to prevent re-processing
    window.history.replaceState(null, "", window.location.pathname);

    // Exchange access token with backend
    const exchangeToken = async () => {
      try {
        const res = await api.post("/api/user/google-auth-token", { accessToken });
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          if (res.data.userData) {
            localStorage.setItem("userData", JSON.stringify(res.data.userData));
          }
          window.dispatchEvent(new Event("authChange"));
          toast.success("Welcome! Signed in with Google.");
          router.replace("/");
        } else {
          toast.error(res.data.message || "Google sign-in failed.");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Google sign-in failed. Please try again.");
      }
    };

    exchangeToken();
  }, [router]);

  return null;
}

function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Forgot password flow states
  const [forgotStep, setForgotStep] = useState<"request" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleGoogleOAuth = useCallback(async () => {
    setGoogleLoading(true);
    try {
      const res = await api.get("/api/user/google-oauth-url");
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Could not initiate Google sign-in.");
        setGoogleLoading(false);
      }
    } catch {
      // Fallback: direct Google OAuth URL if backend route is unavailable
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1089608603127-v3lig04qohrvth72o4gefodv559gh936.apps.googleusercontent.com";
      const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/login` : "https://newcare.vercel.app/login";
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;
      window.location.href = googleAuthUrl;
    }
  }, []);

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/user/forgot-password", { email: forgotEmail });
      if (res.data.success) {
        toast.success(res.data.message || "Reset code sent!");
        if (res.data.resetToken) {
          setResetCode(res.data.resetToken);
        }
        setForgotStep("reset");
      } else {
        toast.error(res.data.message || "Failed to process request");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      toast.error("Please fill in the reset code and new password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/user/reset-password", {
        email: forgotEmail,
        token: resetCode,
        newPassword: newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        setMode("login");
        setForm((prev) => ({ ...prev, email: forgotEmail, password: "" }));
        setForgotStep("request");
        setResetCode("");
        setNewPassword("");
      } else {
        toast.error(res.data.message || "Password reset failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (mode === "register" && !form.name) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/user/login" : "/api/user/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        if (res.data.userData) localStorage.setItem("userData", JSON.stringify(res.data.userData));
        window.dispatchEvent(new Event("authChange"));
        toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
        router.push("/");
      } else {
        toast.error(res.data.message || "Authentication failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "2rem",
      position: "relative",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-10%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />
      </div>

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "1rem" }}>
            <Image
              src="https://res.cloudinary.com/dg5gwims9/image/upload/v1783617203/newcare_assets/newCare.png"
              alt="NewCare Logo"
              width={150}
              height={38}
              style={{ objectFit: "contain", height: "38px", width: "auto" }}
              unoptimized
            />
          </Link>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.4rem" }}>
            {mode === "login" ? "Welcome back" : mode === "register" ? "Create account" : "Reset password"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {mode === "login" ? "Sign in to your account" : mode === "register" ? "Join thousands of patients today" : "Enter your email to receive a recovery code"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "2rem",
          boxShadow: "var(--shadow-lg)",
        }}>
          {mode !== "forgot" ? (
            <>
              {/* Mode toggle */}
              <div style={{
                display: "flex",
                background: "var(--bg-secondary)",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "1.75rem",
              }}>
                {(["login", "register"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "10px",
                      border: "none",
                      background: mode === m ? "var(--primary)" : "transparent",
                      color: mode === m ? "white" : "var(--text-secondary)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textTransform: "capitalize",
                    }}
                  >
                    {m === "login" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {mode === "register" && (
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                      Full Name
                    </label>
                    <div style={{ position: "relative" }}>
                      <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input"
                        style={{ paddingLeft: 40 }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                      style={{ paddingLeft: 40 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input"
                      style={{ paddingLeft: 40, paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)"
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {mode === "login" && (
                  <div style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(form.email);
                        setMode("forgot");
                        setForgotStep("request");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "0.8rem",
                        color: "var(--primary)",
                        cursor: "pointer",
                        padding: 0,
                        fontWeight: 500,
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="btn-primary"
                  style={{ justifyContent: "center", width: "100%", padding: "14px", fontSize: "0.95rem", marginTop: "0.5rem", opacity: (loading || googleLoading) ? 0.7 : 1 }}
                >
                  {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0", gap: "10px" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              {/* Google OAuth2 Button */}
              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleOAuth}
                disabled={loading || googleLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: (loading || googleLoading) ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: (loading || googleLoading) ? 0.7 : 1,
                  marginBottom: "1rem",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
              </button>

              <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </div>
            </>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "1.5rem",
                  padding: 0,
                }}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>

              {forgotStep === "request" ? (
                <form onSubmit={handleForgotRequest} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                      Registered Email Address
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 40 }}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ justifyContent: "center", width: "100%", padding: "14px", fontSize: "0.95rem", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Generating code..." : "Send Reset Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.85rem",
                    color: "var(--text)",
                    marginBottom: "0.5rem"
                  }}>
                    <CheckCircle2 size={18} style={{ color: "rgb(16, 185, 129)", flexShrink: 0 }} />
                    <span>Enter the verification code for <strong>{forgotEmail}</strong></span>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                      Reset Code (6 digits)
                    </label>
                    <div style={{ position: "relative" }}>
                      <KeyRound size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type="text"
                        placeholder="123456"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 40, letterSpacing: "2px", fontWeight: 600 }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                      New Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 40, paddingRight: 44 }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                          background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)"
                        }}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ justifyContent: "center", width: "100%", padding: "14px", fontSize: "0.95rem", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Updating password..." : "Confirm New Password"}
                  </button>

                  <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setForgotStep("request")}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      Didn&apos;t get a code? Request new code
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          By continuing, you agree to NewCare&apos;s{" "}
          <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>Terms of Service</a>{" "}
          and{" "}
          <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <GoogleOAuthCallbackHandler />
      </Suspense>
      <LoginForm />
    </>
  );
}
