import { useState } from 'react'
import {
  User, Bell, Shield, Palette, Globe,
  Save, Camera, CheckCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'security',      label: 'Security',       icon: Shield },
  { id: 'appearance',    label: 'Appearance',     icon: Palette },
  { id: 'regional',      label: 'Regional',       icon: Globe },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        checked ? 'bg-primary-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name:     user?.name ?? '',
    email:    user?.email ?? '',
    phone:    '+1 555-0100',
    company:  'GreenCo Inc.',
    bio:      'Passionate about sustainable technology and green solutions.',
    website:  'https://greenco.com',
    location: 'San Francisco, CA',
  })

  const [notifs, setNotifs] = useState({
    email_orders:    true,
    email_marketing: false,
    email_security:  true,
    push_orders:     true,
    push_updates:    false,
    sms_security:    true,
  })

  const [security, setSecurity] = useState({
    two_factor:    true,
    login_alerts:  true,
    session_timeout: '30',
  })

  const [appearance, setAppearance] = useState({
    theme:    'light',
    density:  'comfortable',
    language: 'en',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const setProfile_ = (k, v) => setProfile(p => ({ ...p, [k]: v }))
  const setNotif_    = (k, v) => setNotifs(n => ({ ...n, [k]: v }))
  const setSecurity_ = (k, v) => setSecurity(s => ({ ...s, [k]: v }))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <nav className="card p-2 space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.initials}
                  </div>
                  <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors">
                    <Camera size={13} />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-sm text-slate-500">{user?.role}</p>
                  <p className="text-xs text-primary-600 mt-1 cursor-pointer hover:text-primary-700 transition-colors">
                    Change photo
                  </p>
                </div>
              </div>

              {/* Form grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',    key: 'name',     type: 'text' },
                  { label: 'Email',        key: 'email',    type: 'email' },
                  { label: 'Phone',        key: 'phone',    type: 'tel' },
                  { label: 'Company',      key: 'company',  type: 'text' },
                  { label: 'Website',      key: 'website',  type: 'url' },
                  { label: 'Location',     key: 'location', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">{label}</label>
                    <input
                      type={type}
                      value={profile[key]}
                      onChange={e => setProfile_(key, e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Bio</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={e => setProfile_('bio', e.target.value)}
                    className="input-field text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Notification Preferences</h3>
              {[
                { section: 'Email Notifications', items: [
                  { key: 'email_orders',    label: 'New Orders',        desc: 'Get notified when a new order arrives' },
                  { key: 'email_marketing', label: 'Marketing Emails',  desc: 'Product updates and announcements' },
                  { key: 'email_security',  label: 'Security Alerts',   desc: 'Sign-in from new devices' },
                ]},
                { section: 'Push Notifications', items: [
                  { key: 'push_orders',   label: 'Order Updates',   desc: 'Real-time order status changes' },
                  { key: 'push_updates',  label: 'App Updates',     desc: 'New features and improvements' },
                ]},
                { section: 'SMS', items: [
                  { key: 'sms_security', label: 'Two-Factor Auth', desc: 'OTP codes and login verification' },
                ]},
              ].map(({ section, items }) => (
                <div key={section}>
                  <p className="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">{section}</p>
                  <div className="space-y-4">
                    {items.map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">{label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                        </div>
                        <Toggle checked={notifs[key]} onChange={v => setNotif_(key, v)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Security Settings</h3>

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <div>
                    <p className="text-sm font-semibold text-primary-800">Two-Factor Authentication</p>
                    <p className="text-xs text-primary-600 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <Toggle checked={security.two_factor} onChange={v => setSecurity_('two_factor', v)} />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Login Alerts</p>
                    <p className="text-xs text-slate-400 mt-0.5">Receive email on new sign-ins</p>
                  </div>
                  <Toggle checked={security.login_alerts} onChange={v => setSecurity_('login_alerts', v)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Session Timeout (minutes)</label>
                <select
                  value={security.session_timeout}
                  onChange={e => setSecurity_('session_timeout', e.target.value)}
                  className="input-field text-sm"
                >
                  {['15','30','60','120','480'].map(v => (
                    <option key={v} value={v}>{v} minutes</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <p className="text-sm font-medium text-slate-700">Change Password</p>
                <input type="password" placeholder="Current password" className="input-field text-sm" />
                <input type="password" placeholder="New password" className="input-field text-sm" />
                <input type="password" placeholder="Confirm new password" className="input-field text-sm" />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Appearance</h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', preview: 'bg-white border-2' },
                    { value: 'dark',  label: 'Dark',  preview: 'bg-slate-800 border-2' },
                    { value: 'auto',  label: 'Auto',  preview: 'bg-gradient-to-r from-white to-slate-800 border-2' },
                  ].map(t => (
                    <button
                      key={t.value}
                      onClick={() => setAppearance(a => ({ ...a, theme: t.value }))}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        appearance.theme === t.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg mb-2 ${t.preview} ${appearance.theme === t.value ? 'border-primary-300' : 'border-slate-200'}`} />
                      <p className="text-xs font-medium text-slate-700">{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Display Density</label>
                <select
                  value={appearance.density}
                  onChange={e => setAppearance(a => ({ ...a, density: e.target.value }))}
                  className="input-field text-sm"
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'regional' && (
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-base">Regional Settings</h3>
              {[
                { label: 'Language',      opts: ['English (US)','Spanish','French','German','Japanese'] },
                { label: 'Timezone',      opts: ['UTC-8 Pacific Time','UTC-5 Eastern Time','UTC+0 London','UTC+1 Paris','UTC+5:30 Mumbai'] },
                { label: 'Date Format',   opts: ['MM/DD/YYYY','DD/MM/YYYY','YYYY-MM-DD'] },
                { label: 'Currency',      opts: ['USD ($)','EUR (€)','GBP (£)','JPY (¥)','INR (₹)'] },
              ].map(({ label, opts }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">{label}</label>
                  <select className="input-field text-sm">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Save button */}
          <div className="flex items-center justify-end gap-3 mt-4">
            {saved && (
              <div className="flex items-center gap-1.5 text-sm text-primary-600 font-medium">
                <CheckCircle size={15} />
                Saved successfully!
              </div>
            )}
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
