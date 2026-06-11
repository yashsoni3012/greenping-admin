import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  HelpCircle,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Save,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://greenping.pythonanywhere.com";

// Helper to get auth token
const getAccessToken = () => {
  try {
    const raw = localStorage.getItem("ga_user");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.access_token || data.token || data.key || null;
  } catch {
    return null;
  }
};

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing FAQ
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const token = getAccessToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_BASE_URL}/faqs/${id}/`, {
          headers,
        });
        const faqData = response.data.data || response.data;
        setFormData({
          question: faqData.question || "",
          answer: faqData.answer || "",
        });
      } catch (err) {
        console.error("Error fetching FAQ:", err);
        const status = err.response?.status;
        const detail =
          err.response?.data?.detail || err.response?.data?.message;
        setError(detail || `Failed to load FAQ (${status || "unknown error"})`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFaq();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }

    setSubmitting(true);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");

      // Try PUT first; fallback to PATCH
      let response;
      try {
        response = await axios.put(
          `${API_BASE_URL}/faqs/${id}/`,
          {
            question: formData.question,
            answer: formData.answer,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (putErr) {
        // If PUT fails (405 Method Not Allowed, etc.), try PATCH
        response = await axios.patch(
          `${API_BASE_URL}/faqs/${id}/`,
          {
            question: formData.question,
            answer: formData.answer,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      setSuccess("FAQ updated successfully! Redirecting...");
      setTimeout(() => navigate("/faq"), 1500);
    } catch (err) {
      console.error("Error updating FAQ:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to update FAQ. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show error if we couldn't load data (and no form data)
  if (error && !formData.question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="text-red-600 mx-auto mb-3" />
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate("/faq")} className="btn-primary">
            Back to FAQs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/faq")}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit FAQ</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="question"
              className="block text-sm font-semibold text-slate-700"
            >
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="e.g., How do I reset my password?"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-slate-50/30 hover:bg-white"
              disabled={submitting}
            />
          </div>

          {/* Answer Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="answer"
              className="block text-sm font-semibold text-slate-700"
            >
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              id="answer"
              name="answer"
              rows="6"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Provide a detailed, helpful answer..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-slate-50/30 hover:bg-white resize-y"
              disabled={submitting}
            />
          </div>

          {/* Success / Error Messages */}
          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
              <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{success}</span>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/faq")}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update FAQ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFaq;
