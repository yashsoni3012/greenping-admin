import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Package,
  Settings,
  LogOut,
  Leaf,
  X,
  User,
  HelpCircle,
  Phone,

} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/faq", icon: HelpCircle, label: "FAQ" },
  { to: "/contact", icon: Phone, label: "Contact" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get display name: prefer name, fall back to email prefix
  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "Unknown");
  const displayEmail = user?.email || "";

  // Compute initials
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const userInitials = getInitials(displayName);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-primary-900 flex flex-col z-30
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-5+00 rounded-lg flex items-center justify-center shadow-lg">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Greenping
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-primary-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/50"
                    : "text-primary-300 hover:bg-primary-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-primary-800">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0">
              {/* <p className="text-white text-sm font-semibold truncate">{displayName}</p> */}
              <p className="text-white text-xs truncate">{displayEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-primary-300 hover:bg-primary-800 hover:text-red-400 transition-all duration-150 text-sm font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
