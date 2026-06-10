import { useState, useEffect } from 'react'
import {
  User, Mail, Phone, Calendar, BadgeCheck,
  AlertCircle, Lock, Eye, EyeOff, CheckCircle, KeyRound
} from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Password reset states
  const [showReset, setShowReset] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')

  // ---------- Helpers ----------
  const getAccessToken = () => {
    try {
      const raw = localStorage.getItem('ga_user')
      if (!raw) return null
      const data = JSON.parse(raw)
      return data.token || data.access_token || data.key || null
    } catch {
      return null
    }
  }

  const getInitials = (name) => {
    if (!name) return '??'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // ---------- Fetch profile ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken()
        if (!token) {
          setError('No authentication token found. Please log in again.')
          setLoading(false)
          return
        }

        const response = await fetch('/api/admin_profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const result = await response.json()
        const userData = result.data || result
        setProfile(userData)
      } catch (err) {
        setError(err.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // ---------- Reset Password ----------
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetError('')
    setResetSuccess('')

    // Validate
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setResetError('All fields are required.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setResetError('New passwords do not match.')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setResetError('New password must be at least 6 characters.')
      return
    }

    setResetting(true)
    try {
      const token = getAccessToken()
      if (!token) {
        setResetError('Not authenticated.')
        setResetting(false)
        return
      }

      const response = await fetch('/api/admin-reset-password/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || data.status || 'Password reset failed.')
      }

      setResetSuccess('Password updated successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      // Optionally hide the form after a delay
      setTimeout(() => {
        setShowReset(false)
        setResetSuccess('')
      }, 2000)
    } catch (err) {
      setResetError(err.message || 'Something went wrong.')
    } finally {
      setResetting(false)
    }
  }

  // ---------- Loading / Error / Empty ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-slate-500 text-center py-16">No profile data available.</div>
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500 text-sm">Your personal information &amp; security settings</p>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(profile.name)}
          </div>
          <div>
            <p className="font-semibold text-lg text-slate-800">{profile.name || '—'}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
            {profile.status && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-700">
                <BadgeCheck size={12} />
                {profile.status}
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
              <p className="text-sm font-medium text-slate-800">{profile.name || '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Mail size={18} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-800">{profile.email || '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Phone size={18} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="text-sm font-medium text-slate-800">{profile.mobile || '—'}</p>
            </div>
          </div>

          {profile.created_at && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Member since</p>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
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
            <div className="card p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-3">Change Password</h4>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Current password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">New password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="input-field pl-10 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="input-field pl-10"
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
                      setShowReset(false)
                      setResetError('')
                      setResetSuccess('')
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
                    }}
                    className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetting}
                    className="btn-primary flex items-center gap-2 px-5 py-2.5"
                  >
                    {resetting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Updating…
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}