import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Eye, Edit, Trash2, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://greenping.pythonanywhere.com';

// Helper to get auth token
const getAccessToken = () => {
  try {
    const raw = localStorage.getItem('ga_user');
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.access_token || data.token || data.key || null;
  } catch {
    return null;
  }
};

export default function Faq() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewModal, setViewModal] = useState(null); // stores FAQ object to view
  const [deleteConfirm, setDeleteConfirm] = useState(null); // stores id to delete

  // Fetch FAQs
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}/faqs/`, { headers });
      // Assuming API returns { data: [...] }
      const faqData = response.data.data || response.data;
      setFaqs(faqData);
      setFilteredFaqs(faqData);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = faqs.filter(faq =>
      faq.question.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFaqs(filtered);
  }, [search, faqs]);

  // Delete FAQ
const handleDelete = async () => {
  if (!deleteConfirm) return;

  try {
    const token = getAccessToken();

    console.log("Deleting FAQ ID:", deleteConfirm);

    const response = await axios.delete(
      `${API_BASE_URL}/faqs/${deleteConfirm}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Delete Response:", response.data);

    setFaqs((prev) => prev.filter((faq) => faq.id !== deleteConfirm));
    setFilteredFaqs((prev) =>
      prev.filter((faq) => faq.id !== deleteConfirm)
    );

    setDeleteConfirm(null);
  } catch (err) {
    console.log("DELETE ERROR");
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Full Error:", err);

    alert(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      `Delete failed (${err.response?.status})`
    );
  }
};

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchFaqs} className="btn-primary mt-3">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">FAQs</h2>
          <p className="text-slate-500 text-sm">{filteredFaqs.length} questions found</p>
        </div>
        <button
          onClick={() => navigate('/add-faq')}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Question
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Answer
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Created
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-slate-400">
                    No FAQs found.
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {faq.question}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-md truncate">
                      {faq.answer.length > 80 ? faq.answer.substring(0, 80) + '…' : faq.answer}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {formatDate(faq.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewModal(faq)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/edit-faq/${faq.id}`)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(faq.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Simple pagination (optional, you can improve) */}
        {filteredFaqs.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing {filteredFaqs.length} of {faqs.length} FAQs
            </p>
            {/* Pagination controls can be added here if needed */}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">FAQ Details</h3>
              <button
                onClick={() => setViewModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Question
                </h4>
                <p className="text-slate-800 mt-1">{viewModal.question}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Answer
                </h4>
                <p className="text-slate-800 mt-1 whitespace-pre-wrap">{viewModal.answer}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Created
                </h4>
                <p className="text-slate-600 text-sm mt-1">
                  {formatDate(viewModal.created_at)}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewModal(null)}
                className="btn-secondary px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800">Confirm Delete</h3>
              <p className="text-slate-500 mt-2">
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </p>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}