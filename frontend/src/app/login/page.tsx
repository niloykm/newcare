"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Activity,
} from "lucide-react";
import api from "@/lib/api";

type Mode = "login" | "register" | "forgot";

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message || fallback;
  }
  return fallback;
}

function GoogleOAuthCallbackHandler() {
  const router = useRouter();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasProcessedRef.current) return;

    const hash = window.location.hash;
    const hashParams = hash ? new URLSearchParams(hash.substring(1)) : null;
    const queryParams = new URLSearchParams(window.location.search);

    const oauthError = hashParams?.get("error") || queryParams.get("error");
    if (oauthError) {
      hasProcessedRef.current = true;
      window.history.replaceState(null, "", window.location.pathname);
      toast.error(
        oauthError === "access_denied"
          ? "Google sign-in was cancelled."
          : `Google sign-in error: ${oauthError}`
      );
      return;
    }

    const accessToken = hashParams?.get("access_token");
    if (!accessToken) return;

    hasProcessedRef.current = true;
    window.history.replaceState(null, "", window.location.pathname);

    const exchangeToken = async () => {
      const toastId = toast.loading("Completing Google sign-in...");
      try {
        const res = await api.post(
          "/api/user/google-auth-token",
          { accessToken },
          { timeout: 20000 }
        );
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          if (res.data.userData) {
            localStorage.setItem("userData", JSON.stringify(res.data.userData));
          }
          window.dispatchEvent(new Event("authChange"));
          toast.success("Signed in with Google.", { id: toastId });
          router.replace("/");
        } else {
          toast.error(res.data.message || "Google sign-in failed.", { id: toastId });
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && (err.code === "ECONNABORTED" || !err.response || err.response.status >= 500)) {
          toast.error("Authentication service is currently unavailable. Please try again shortly.", {
            id: toastId,
          });
        } else {
          toast.error(getErrorMessage(err, "Google sign-in failed. Please try again."), {
            id: toastId,
          });
        }
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

  const [forgotStep, setForgotStep] = useState<"request" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleGoogleOAuth = useCallback(() => {
    setGoogleLoading(true);
    const clientId = (
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "1089608603127-v3lig04qohrvth72o4gefodv559gh936.apps.googleusercontent.com"
    ).trim();
    const redirectUri =
      typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : "https://newcare.vercel.app/login";
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "token");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("prompt", "select_account");
    window.location.href = googleAuthUrl.toString();
  }, []);

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/user/forgot-password", { email: forgotEmail });
      if (res.data.success) {
        toast.success(res.data.message || "Recovery code sent.");
        if (res.data.resetToken) {
          setResetCode(res.data.resetToken);
        }
        setForgotStep("reset");
      } else {
        toast.error(res.data.message || "Failed to process request.");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Unable to process password reset request."));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword) {
      toast.error("Please enter both the reset code and new password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/user/reset-password", {
        email: forgotEmail,
        token: resetCode,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Password updated.");
        setMode("login");
        setForm((prev) => ({ ...prev, email: forgotEmail, password: "" }));
        setForgotStep("request");
        setResetCode("");
        setNewPassword("");
      } else {
        toast.error(res.data.message || "Password reset failed.");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to reset password. Check your code."));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (mode === "register" && !form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/user/login" : "/api/user/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        if (res.data.userData) {
          localStorage.setItem("userData", JSON.stringify(res.data.userData));
        }
        window.dispatchEvent(new Event("authChange"));
        toast.success(mode === "login" ? "Signed in." : "Account created.");
        router.push("/");
      } else {
        toast.error(res.data.message || "Authentication failed.");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Authentication failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f14] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-md bg-teal-700 dark:bg-teal-400 text-white dark:text-slate-950 flex items-center justify-center">
              <Activity className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              NewCare
            </span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {mode === "login"
              ? "Sign in to NewCare"
              : mode === "register"
                ? "Create Patient Account"
                : "Reset Password"}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {mode === "login"
              ? "Access your care schedule, appointments, and digital check-in passes."
              : mode === "register"
                ? "Set up your patient and family coordination account."
                : "Enter your account email to receive a password recovery code."}
          </p>
        </div>

        <div className="card p-6 sm:p-7">
          <AnimatePresence mode="wait" initial={false}>
            {mode !== "forgot" ? (
              <motion.div
                key="auth-main"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-md mb-6 border border-slate-200 dark:border-slate-800">
                  {(["login", "register"] as const).map((m) => {
                    const active = mode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`relative min-h-[38px] text-xs font-semibold rounded transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                          active
                            ? "text-slate-900 dark:text-slate-50"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="auth-mode-pill"
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 rounded bg-white dark:bg-slate-800 shadow-xs"
                            aria-hidden="true"
                          />
                        )}
                        <span className="relative z-10">
                          {m === "login" ? "Sign In" : "Register"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label
                        htmlFor="auth-name"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User
                          className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="auth-name"
                          type="text"
                          placeholder="e.g. Claire Bennett"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input pl-9"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label
                      htmlFor="auth-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail
                        className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-email"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="auth-password"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock
                        className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          mode === "register" ? "Minimum 8 characters" : "Enter your password"
                        }
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="input pl-9 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-1 w-10 h-10 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(form.email);
                          setMode("forgot");
                          setForgotStep("request");
                        }}
                        className="inline-flex items-center min-h-[36px] px-1 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="btn-primary w-full"
                  >
                    {loading
                      ? "Processing..."
                      : mode === "login"
                        ? "Sign In"
                        : "Create Account"}
                  </button>
                </form>

                <div className="flex items-center my-5 gap-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">or</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                <button
                  type="button"
                  id="google-signin-btn"
                  onClick={handleGoogleOAuth}
                  disabled={loading || googleLoading}
                  className="btn-secondary w-full"
                >
                  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{googleLoading ? "Redirecting..." : "Continue with Google"}</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="auth-forgot"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline mb-5 cursor-pointer"
                >
                  <ArrowLeft
                    className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  <span>Back to Sign In</span>
                </button>

                {forgotStep === "request" ? (
                  <form onSubmit={handleForgotRequest} className="space-y-4">
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Registered Email Address
                      </label>
                      <div className="relative flex items-center">
                        <Mail
                          className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="forgot-email"
                          type="email"
                          placeholder="name@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="input pl-9"
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                      {loading ? "Sending code..." : "Send Recovery Code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        Enter the verification code sent to <strong>{forgotEmail}</strong>
                      </span>
                    </div>

                    <div>
                      <label
                        htmlFor="reset-code"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Verification Code
                      </label>
                      <div className="relative flex items-center">
                        <KeyRound
                          className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="reset-code"
                          type="text"
                          placeholder="6-digit code"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          className="input pl-9 font-mono tracking-wider"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative flex items-center">
                        <Lock
                          className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Minimum 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input pl-9 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                          className="absolute right-1 w-10 h-10 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-5 text-xs text-slate-500 dark:text-slate-400">
          Questions about clinical privacy or account access? Review our{" "}
          <Link href="/about" className="text-teal-700 dark:text-teal-400 hover:underline font-medium">
            Clinical Standards
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-teal-700 dark:text-teal-400 hover:underline font-medium">
            Contact Support
          </Link>
          .
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
