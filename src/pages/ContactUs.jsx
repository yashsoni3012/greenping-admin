import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Eye, Trash2, X } from 'lucide-react';

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

// Status badge styles (same pattern as Users component)
const statusClass = {
  new: 'badge-green',      // you can adjust these class names based on your global CSS
  read: 'badge-blue',
  resolved: 'badge-purple',
  spam: 'badge-red',
};

export default function Contact() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch all contact messages
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}/contact_us/`, { headers });
      // Extract data array from response.data.data (as per your format)
      const contactsData = response.data.data || response.data;
      setContacts(contactsData);
      setFilteredContacts(contactsData);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Search & filter
  useEffect(() => {
    let filtered = contacts;
    // Search by name or email
    if (search) {
      filtered = filtered.filter(c =>
        c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    setFilteredContacts(filtered);
  }, [search, statusFilter, contacts]);

  // Delete contact
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const token = getAccessToken();
      if (!token) throw new Error('Not authenticated');
      await axios.delete(`${API_BASE_URL}/contact_us/${deleteConfirm}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh list
      fetchContacts();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete contact message. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get unique statuses for filter
  const uniqueStatuses = ['All', ...new Set(contacts.map(c => c.status).filter(Boolean))];

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
        <button onClick={fetchContacts} className="btn-primary mt-3">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Contact Messages</h2>
          <p className="text-slate-500 text-sm">{filteredContacts.length} messages found</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <div className="flex gap-1 flex-wrap">
            {uniqueStatuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name / Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone / Company</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Message</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Received</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-slate-400">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-4 text-slate-500">{contact.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{contact.full_name}</p>
                      <p className="text-slate-400 text-xs">{contact.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-600 text-xs">{contact.phone_number || '—'}</p>
                      <p className="text-slate-400 text-xs">{contact.company_name || '—'}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-md truncate">
                      {contact.message?.length > 60 ? contact.message.substring(0, 60) + '…' : contact.message}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge-${contact.status === 'new' ? 'green' : contact.status === 'read' ? 'blue' : 'gray'}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {formatDate(contact.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewModal(contact)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(contact.id)}
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

        {/* Footer summary */}
        {filteredContacts.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing {filteredContacts.length} of {contacts.length} messages
            </p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Contact Details</h3>
              <button
                onClick={() => setViewModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</h4>
                  <p className="text-slate-800 mt-1">{viewModal.full_name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</h4>
                  <p className="text-slate-800 mt-1">{viewModal.email}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</h4>
                  <p className="text-slate-800 mt-1">{viewModal.phone_number || '—'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</h4>
                  <p className="text-slate-800 mt-1">{viewModal.company_name || '—'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</h4>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full badge-${viewModal.status === 'new' ? 'green' : 'gray'}`}>
                    {viewModal.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Received</h4>
                  <p className="text-slate-800 mt-1">{formatDate(viewModal.created_at)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Message</h4>
                <p className="text-slate-800 mt-1 whitespace-pre-wrap border-t pt-3">{viewModal.message}</p>
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
                Are you sure you want to delete this contact message? This action cannot be undone.
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