import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Leaf,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://greenping.pythonanywhere.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default function Login() {
  const { user, loginApi } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: OTP + new password

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password specific
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const validateLogin = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const formatErrors = (errorsObj) => {
    if (!errorsObj) return "Something went wrong.";
    const messages = Object.entries(errorsObj).map(([field, msgs]) => {
      const cleanField = field.charAt(0).toUpperCase() + field.slice(1);
      return `${cleanField}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`;
    });
    return messages.join("\n");
  };

  // ---------- Forgot Password: Step 1 - Send OTP ----------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/admin_forgot-password/", {
        email: forgotEmail,
      });
      console.log("Send OTP response:", response.data);
      setSuccess(response.data.message || "OTP sent successfully! Check your email.");
      setForgotStep(2);
    } catch (err) {
      console.error("Send OTP error:", err);
      const msg = err.response?.data?.message || err.response?.data?.detail || "Failed to send OTP. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Forgot Password: Step 2 - Reset with OTP ----------
  const handleResetWithOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    if (!newPassword || !confirmNewPassword) {
      setError("Please enter new password and confirmation.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.patch("/admin_forgot-password/", {
        email: forgotEmail,
        otp: otp,
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      });
      console.log("Reset password response:", response.data);
      setSuccess(response.data.message || "Password reset successfully! You can now log in.");
      setTimeout(() => {
        setForgotPassword(false);
        setForgotStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const msg = err.response?.data?.message || err.response?.data?.detail || "Password reset failed. Check OTP or try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Registration ----------
  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("mobile", form.mobile);
      formData.append("password", form.password);

      const response = await api.post("/admin_data/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Registration success:", response.data);
      setSuccess("Account created! You can now sign in.");
      setTimeout(() => {
        setIsRegister(false);
        setSuccess("");
        setForm({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.errors) {
        setError(formatErrors(err.response.data.errors));
      } else {
        setError(err.response?.data?.message || err.response?.data?.detail || "Registration failed.");
      }
    }
  };

  // ---------- Login ----------
  const handleLogin = async () => {
    try {
      const params = new URLSearchParams();
      params.append("email", form.email);
      params.append("password", form.password);

      const response = await api.post("/admin_login/", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = response.data;
      const token = data.access_token || data.token || null;
      const userData = data.user || data.data || data;
      if (token) userData.token = token;
      loginApi(userData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.response?.data?.detail || "Invalid email or password.");
    }
  };

  // ---------- Main Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isRegister) {
      if (!validateRegister()) {
        setLoading(false);
        return;
      }
      await handleRegister();
    } else {
      if (!validateLogin()) {
        setLoading(false);
        return;
      }
      await handleLogin();
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
    setSuccess("");
    if (!isRegister) {
      setForm((prev) => ({
        ...prev,
        name: "",
        mobile: "",
        confirmPassword: "",
      }));
    }
  };

  const backToLogin = () => {
    setForgotPassword(false);
    setForgotStep(1);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setSuccess("");
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen flex">
      

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-slate-800 text-xl font-bold">GreenAdmin</span>
          </div>

          <div className="card p-8 sm:p-10">
            {/* ---------- FORGOT PASSWORD VIEW (two‑step) ---------- */}
            {forgotPassword ? (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-extrabold text-slate-800">
                    {forgotStep === 1 ? "Forgot password?" : "Reset password"}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {forgotStep === 1
                      ? "Enter your email and we'll send you an OTP."
                      : "Enter the OTP and your new password."}
                  </p>
                </div>

                {forgotStep === 1 ? (
                  // Step 1: Request OTP
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="input-field pl-10"
                          autoComplete="email"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {success && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                        <CheckCircle size={15} />
                        {success}
                      </div>
                    )}
                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 whitespace-pre-line">
                        <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending OTP…
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>

                    <div className="text-center text-sm text-slate-500">
                      <button
                        type="button"
                        onClick={backToLogin}
                        className="flex items-center justify-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                      >
                        <ArrowLeft size={14} />
                        Back to sign in
                      </button>
                    </div>
                  </form>
                ) : (
                  // Step 2: Reset with OTP
                  <form onSubmit={handleResetWithOtp} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={forgotEmail}
                          disabled
                          className="input-field pl-10 bg-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">New password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-field pl-10 pr-11"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Confirm new password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-field pl-10"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {success && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                        <CheckCircle size={15} />
                        {success}
                      </div>
                    )}
                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Resetting password…
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>

                    <div className="text-center text-sm text-slate-500">
                      <button
                        type="button"
                        onClick={backToLogin}
                        className="flex items-center justify-center gap-1 text-primary-600 font-semibold hover:text-primary-700"
                      >
                        <ArrowLeft size={14} />
                        Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              // ---------- LOGIN / REGISTER VIEW ----------
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-extrabold text-slate-800">
                    {isRegister ? "Create account" : "Welcome back"}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {isRegister
                      ? "Fill in the details to get started"
                      : "Sign in to your admin account"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {isRegister && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Full name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Jalpa Patel"
                            className="input-field pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Mobile</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            placeholder="9876543210"
                            className="input-field pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="input-field pl-10"
                        autoComplete="email"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="input-field pl-10 pr-11"
                        autoComplete={isRegister ? "new-password" : "current-password"}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {isRegister && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Confirm password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="input-field pl-10"
                          autoComplete="new-password"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                      <CheckCircle size={15} />
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 whitespace-pre-line">
                      <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {isRegister ? "Creating account…" : "Signing in…"}
                      </>
                    ) : isRegister ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {!isRegister && (
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPassword(true);
                        setError("");
                        setSuccess("");
                        setForgotStep(1);
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-sm text-slate-500">
                  {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary-600 font-semibold hover:text-primary-700"
                    disabled={loading}
                  >
                    {isRegister ? "Sign in" : "Create one"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}