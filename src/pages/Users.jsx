import { useState } from 'react'
import { Search, Plus, Filter, MoreVertical, Mail, Phone } from 'lucide-react'

const ALL_USERS = [
  { id: 1, name: 'Sarah Connor',  email: 'sarah@eco.com',  phone: '+1 555-0101', role: 'Manager',   status: 'Active',   joined: 'Jan 12, 2024', avatar: 'SC' },
  { id: 2, name: 'James Watson',  email: 'james@eco.com',  phone: '+1 555-0102', role: 'Developer', status: 'Active',   joined: 'Feb 3, 2024',  avatar: 'JW' },
  { id: 3, name: 'Emily Clarke',  email: 'emily@eco.com',  phone: '+1 555-0103', role: 'Designer',  status: 'Inactive', joined: 'Feb 20, 2024', avatar: 'EC' },
  { id: 4, name: 'Mark Johnson',  email: 'mark@eco.com',   phone: '+1 555-0104', role: 'Analyst',   status: 'Active',   joined: 'Mar 7, 2024',  avatar: 'MJ' },
  { id: 5, name: 'Lisa Park',     email: 'lisa@eco.com',   phone: '+1 555-0105', role: 'Manager',   status: 'Active',   joined: 'Mar 15, 2024', avatar: 'LP' },
  { id: 6, name: 'David Kim',     email: 'david@eco.com',  phone: '+1 555-0106', role: 'Developer', status: 'Pending',  joined: 'Apr 2, 2024',  avatar: 'DK' },
  { id: 7, name: 'Mia Nguyen',    email: 'mia@eco.com',    phone: '+1 555-0107', role: 'Designer',  status: 'Active',   joined: 'Apr 18, 2024', avatar: 'MN' },
  { id: 8, name: 'Tom Hardy',     email: 'tom@eco.com',    phone: '+1 555-0108', role: 'Analyst',   status: 'Inactive', joined: 'May 5, 2024',  avatar: 'TH' },
  { id: 9, name: 'Priya Sharma',  email: 'priya@eco.com',  phone: '+1 555-0109', role: 'Developer', status: 'Active',   joined: 'May 22, 2024', avatar: 'PS' },
  { id: 10,name: 'Alex Turner',   email: 'alex@eco.com',   phone: '+1 555-0110', role: 'Manager',   status: 'Active',   joined: 'Jun 1, 2024',  avatar: 'AT' },
]

const AVATAR_COLORS = [
  'bg-primary-500','bg-teal-500','bg-cyan-500','bg-emerald-600',
  'bg-green-500','bg-lime-500','bg-primary-700','bg-teal-700',
  'bg-cyan-700','bg-emerald-700',
]

const statusClass = {
  Active:   'badge-green',
  Inactive: 'badge-red',
  Pending:  'badge-yellow',
}

export default function Users() {
  const [search, setSearch]     = useState('')
  const [roleFilter, setRole]   = useState('All')
  const [selected, setSelected] = useState([])

  const roles = ['All', ...new Set(ALL_USERS.map(u => u.role))]

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(u => u.id))

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">All Users</h2>
          <p className="text-slate-500 text-sm">{filtered.length} users found</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <div className="flex gap-1 flex-wrap">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  roleFilter === r
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {selected.length > 0 && (
          <div className="bg-primary-50 border-b border-primary-100 px-5 py-2.5 flex items-center justify-between">
            <span className="text-sm text-primary-700 font-medium">{selected.length} selected</span>
            <div className="flex gap-2">
              <button className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors">Delete</button>
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">Export</button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="pl-5 pr-3 py-3.5 text-left">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                {['User', 'Contact', 'Role', 'Status', 'Joined', ''].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user, i) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="pl-5 pr-3 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-slate-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Mail size={12} />{user.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Phone size={12} />{user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge-blue">{user.role}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={statusClass[user.status]}>{user.status}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs">{user.joined}</td>
                  <td className="px-4 py-4">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {ALL_USERS.length} users</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${p === 1 ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
