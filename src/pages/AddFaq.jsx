import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AddFaq = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get auth token from localStorage
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

    setLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        setError("You are not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/faqs/`,
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

      console.log("FAQ created:", response.data);
      setSuccess("FAQ added successfully! Redirecting...");
      setTimeout(() => {
        navigate("/faq");
      }, 1500);
    } catch (err) {
      console.error("Error adding FAQ:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to add FAQ. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-800">Add New FAQ</h1>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add FAQ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFaq;
