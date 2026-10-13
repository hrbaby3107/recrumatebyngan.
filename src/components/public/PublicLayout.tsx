import { Outlet, NavLink, Link } from "react-router-dom";
import { Briefcase, Home, Users, FileText, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../store/AuthContext";
import Logo from "../ui/Logo";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true, adminOnly: false },
  { to: "/jobs", label: "Jobs", icon: Briefcase, end: false, adminOnly: false },
  { to: "/post-job", label: "Post a Job", icon: FileText, end: false, adminOnly: true },
  { to: "/talent-pool", label: "Upload CV / Join Pool", icon: Users, end: false, adminOnly: false },
];

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  // Guests never see the recruiter-only links.
  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-full bg-cream text-slate-800 dark:bg-slate-950 dark:text-slate-200 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-cream-200/70 bg-cream/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Logo />
            <span className="text-lg font-bold tracking-tight">
              Recru<span className="text-brand-600">Mate</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-600/10 dark:text-brand-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="ml-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  Admin ATS
                </Link>
                <button
                  onClick={logout}
                  title="Log out"
                  aria-label="Log out"
                  className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </nav>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800"
            >
              <nav className="flex flex-col gap-1 px-4 py-3">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-50 text-brand-700 dark:bg-brand-600/10 dark:text-brand-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="mt-1 rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Admin ATS
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-cream-200 bg-cream-100/70 py-8 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            RecruMate — Connecting Talent & Opportunities
          </p>
          <p className="mt-1">
            By Kylie (Ngan) — IT Headhunter & Talent Acquisition
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
            <a href="mailto:ngan.tran4@reco-vn.com" className="hover:text-brand-600 dark:hover:text-brand-400">
              ngan.tran4@reco-vn.com
            </a>
            <span>•</span>
            <span>Zalo / Call: 0776 931 508 (Ngan)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
