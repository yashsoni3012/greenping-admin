import { Menu, Bell, Search, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/users':     'Users',
  '/analytics': 'Analytics',
  '/products':  'Products',
  '/settings':  'Settings',
}

export default function Header({ onMenuClick }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'Admin Panel'

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
      </div>

      {/* Search — hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-64 xl:w-80">
        <Search size={15} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white" />
        </button>
        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <Sun size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs ml-1 cursor-pointer hover:bg-primary-700 transition-colors">
          {user?.initials}
        </div>
      </div>
    </header>
  )
}
