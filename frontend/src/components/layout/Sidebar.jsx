import { useAuth } from '../../context/Authcontext';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, CheckSquare, User, LogOut, GraduationCap, Sparkles, MessageSquare, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/notes', icon: FileText, label: 'My Notes' },
  { to: '/resources', icon: BookOpen, label: 'Resources' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const futureItems = [
  { icon: Sparkles, label: 'AI Summary', badge: 'Soon' },
  { icon: MessageSquare, label: 'Chat', badge: 'Soon' },
  { icon: Calendar, label: 'Attendance', badge: 'Soon' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        sidebar flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200/60 dark:border-red-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-red-50">
              EduFlow
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>

        {/* User */}
        <div className="px-4 py-3 border-b border-slate-200/60 dark:border-red-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shrink-0 overflow-hidden">
              {user?.profilePhoto?.url ? (
                <img src={user.profilePhoto.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-red-50 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-red-200/50 truncate">{user?.college || 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scroll">
          <p className="px-3 text-xs font-semibold text-slate-400 dark:text-red-200/30 uppercase tracking-wider mb-2">
            Main
          </p>

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <p className="px-3 text-xs font-semibold text-slate-400 dark:text-red-200/30 uppercase tracking-wider mt-5 mb-2">
            Coming Soon
          </p>

          {futureItems.map(({ icon: Icon, label, badge }) => (
            <div key={label} className="nav-item opacity-50 cursor-not-allowed">
              <Icon size={18} />
              <span>{label}</span>
              <span className="ml-auto text-xs bg-slate-100 dark:bg-red-950 text-slate-500 dark:text-red-400/60 px-2 py-0.5 rounded-full">
                {badge}
              </span>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-slate-200/60 dark:border-red-950 pt-4">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

      </aside>
    </>
  );
}