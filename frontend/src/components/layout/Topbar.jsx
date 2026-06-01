import { Menu, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ onMenuClick, pageTitle }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="h-16 glass border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost p-2"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          {pageTitle}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2 rounded-xl"
          aria-label="Toggle theme">
          {isDark ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* Notifications */}
        <button
          className="btn-ghost p-2 rounded-xl relative"
          aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-semibold ml-1">
          U
        </div>
      </div>
    </header>
  );
}
