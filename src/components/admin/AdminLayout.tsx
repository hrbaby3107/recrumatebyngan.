import { Outlet, NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Briefcase,
  Moon,
  Sun,
  Home,
  ArrowLeft,
  Menu,
  X,
  Database,
  Bell,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Logo from "../ui/Logo";
import { useState } from "react";
import { useApp } from "../../store/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase, end: false },
  { to: "/admin/candidates", label: "Candidates", icon: Users, end: false },
  { to: "/admin/pipeline", label: "Pipeline", icon: KanbanSquare, end: false },
  { to: "/admin/talent-pool", label: "Talent Pool", icon: Database, end: false },
  { to: "/admin/follow-ups", label: "Follow-ups", icon: Bell, end: false },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, end: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, end: false },
];

export default function AdminLayout() {
  const { darkMode, toggleDarkMode, profile } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("recrumate-sidebar") === "1";
    } catch {
      return false;
    }
  });
  const toggleCollapsed = () =>
    setCollapsed((v) => {
      try {
        localStorage.setItem("recrumate-sidebar", v ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !v;
    });

  const SidebarContent = ({ compact, showToggle }: { compact: boolean; showToggle: boolean }) => (
    <div className="flex h-full flex-col">
      <Link
        to="/admin"
        className={`flex items-center gap-2.5 py-5 ${compact ? "justify-center px-2" : "px-5"}`}
        onClick={() => setMobileOpen(false)}
        title={compact ? "RecruMate ATS" : undefined}
      >
        <Logo className="h-9 w-9" />
        {!compact && (
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              RecruMate ATS
            </p>
            <p className="truncate text-xs text-slate-400 dark:text-slate-500">
              by {profile.name}
            </p>
          </div>
        )}
      </Link>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            title={compact ? item.label : undefined}
            aria-label={item.label}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors ${
                compact ? "justify-center px-0" : "px-3"
              } ${
                isActive
                  ? "bg-brand-600 text-white shadow-clay"
                  : "text-slate-600 hover:bg-brand-50 hover:text-brand-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!compact && item.label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-cream-200 p-3 dark:border-slate-800">
        <button
          onClick={toggleDarkMode}
          title={compact ? (darkMode ? "Light mode" : "Dark mode") : undefined}
          className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-600 hover:bg-brand-50 dark:text-slate-400 dark:hover:bg-slate-800 ${
            compact ? "justify-center" : "gap-2.5 px-3"
          }`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {!compact && (darkMode ? "Light mode" : "Dark mode")}
        </button>
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          title={compact ? "Back to Home" : undefined}
          className={`flex w-full items-center rounded-xl border border-brand-200 bg-brand-50 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 dark:border-brand-900/40 dark:bg-brand-600/10 dark:text-brand-300 dark:hover:bg-brand-600/20 ${
            compact ? "justify-center" : "gap-2.5 px-3"
          }`}
        >
          <Home className="h-5 w-5" />
          {!compact && "Back to Home"}
        </Link>
        {showToggle && (
          <button
            onClick={toggleCollapsed}
            aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
            title={compact ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex w-full items-center rounded-xl py-2 text-xs font-medium text-slate-400 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-slate-800 ${
              compact ? "justify-center" : "gap-2 px-3"
            }`}
          >
            {compact ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!compact && "Collapse"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-cream text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-cream-200 bg-white transition-[width] duration-200 lg:block dark:border-slate-800 dark:bg-slate-900 ${
          collapsed ? "w-[4.5rem]" : "w-60"
        }`}
      >
        <SidebarContent compact={collapsed} showToggle />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 z-50 h-full w-60 border-r border-cream-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent compact={false} showToggle={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="hidden h-14 shrink-0 items-center justify-end border-b border-cream-200 bg-white px-6 lg:flex dark:border-slate-800 dark:bg-slate-900">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </header>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-cream-200 bg-white px-4 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold">RecruMate ATS</span>
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-2.5 text-xs font-semibold text-white hover:bg-brand-700"
              title="Back to Home"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <button
              onClick={toggleDarkMode}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
