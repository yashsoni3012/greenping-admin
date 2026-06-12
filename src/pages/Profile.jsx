import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Calendar,
  BadgeCheck,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  KeyRound,
} from "lucide-react";

// Create axios instance with your base URL
const API_BASE_URL = "https://greenping.pythonanywhere.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Password reset states
  const [showReset, setShowReset] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // Helper: Get auth token from localStorage
  const getAccessToken = () => {
    try {
      const raw = localStorage.getItem("ga_user");
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data.token || data.access_token || data.key || null;
    } catch {
      return null;
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ---------- Fetch profile from /admin_profile/ ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Fetching profile from /admin_profile/");
        const response = await api.get("/admin_profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Profile data:", response.data);
        // Adjust based on your API response structure
        const userData =
          response.data.data || response.data.user || response.data;
        setProfile(userData);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response) {
          setError(
            err.response.data?.detail ||
              err.response.data?.message ||
              `Failed to load profile (Status: ${err.response.status})`,
          );
        } else if (err.request) {
          setError(
            "Network error: Could not reach server. Please check your connection.",
          );
        } else {
          setError(err.message || "Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ---------- Reset Password using /admin_reset-password/ ----------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    // Validate
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmNewPassword
    ) {
      setResetError("All fields are required.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setResetError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setResetError("New password must be at least 6 characters.");
      return;
    }

    setResetting(true);
    try {
      const token = getAccessToken();
      if (!token) {
        setResetError("Not authenticated.");
        setResetting(false);
        return;
      }

      console.log("Attempting password reset via /admin_reset-password/");

      // Try both common field name patterns
      let response;
      try {
        // Try with old_password / new_password
        response = await api.patch(
          "/admin_reset-password/",
          {
            old_password: passwordForm.currentPassword,
            new_password: passwordForm.newPassword,
            confirm_password : passwordForm.confirmNewPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.log("FULL ERROR RESPONSE:", err.response?.data);

        if (err.response) {
          setResetError(JSON.stringify(err.response.data, null, 2));
        } else {
          setResetError(err.message);
        }
      }

      console.log("Password reset success:", response.data);
      setResetSuccess("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      // Optionally hide the form after a delay
      setTimeout(() => {
        setShowReset(false);
        setResetSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response) {
        const { data, status } = err.response;
        setResetError(
          data.detail ||
            data.message ||
            data.status ||
            `Failed with status ${status}`,
        );
      } else if (err.request) {
        setResetError("Network error: Could not reach server.");
      } else {
        setResetError(err.message || "Something went wrong.");
      }
    } finally {
      setResetting(false);
    }
  };

  // ---------- Loading / Error / Empty ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-slate-500 text-center py-16">
          No profile data available.
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("ga_user");
            window.location.href = "/login";
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Your personal information
        </h2>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getInitials(
              profile.name ||
                profile.full_name ||
                profile.username ||
                profile.email,
            )}
          </div>
          <div>
            <p className="font-semibold text-lg text-slate-800">
              {profile.name || profile.full_name || profile.username || "User"}
            </p>
            <p className="text-sm text-slate-500">{profile.email}</p>
            {profile.is_active !== undefined && (
              <span
                className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${profile.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
              >
                <BadgeCheck size={12} />
                {profile.is_active ? "Active" : "Inactive"}
              </span>
            )}
          </div>
        </div>

        {/* Detail rows */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <User size={18} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Full name</p>
              <p className="text-sm font-medium text-slate-800">
                {profile.name || profile.full_name || profile.username || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Mail size={18} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-800">
                {profile.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Phone size={18} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="text-sm font-medium text-slate-800">
                {profile.mobile || profile.phone || "Not provided"}
              </p>
            </div>
          </div>

          {(profile.created_at || profile.date_joined || profile.created) && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Member since</p>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(
                    profile.created_at ||
                      profile.date_joined ||
                      profile.created,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reset Password button */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <KeyRound size={16} />
              Reset Password
            </button>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-3">
                Change Password
              </h4>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Current password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      disabled={resetting}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    New password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      disabled={resetting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      disabled={resetting}
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmNewPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      disabled={resetting}
                    />
                  </div>
                </div>

                {/* Messages */}
                {resetError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    <AlertCircle size={15} />
                    {resetError}
                  </div>
                )}
                {resetSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                    <CheckCircle size={15} />
                    {resetSuccess}
                  </div>
                )}

                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReset(false);
                      setResetError("");
                      setResetSuccess("");
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                      });
                    }}
                    className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    disabled={resetting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetting}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Updating…
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

