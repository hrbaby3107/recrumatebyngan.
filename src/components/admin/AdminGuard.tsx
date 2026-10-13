import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import ClayBackdrop from "../ui/ClayBackdrop";
import Logo from "../ui/Logo";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, login, logout } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(pin)) {
      setError(false);
      setPin("");
    } else {
      setError(true);
    }
  };

  if (isAdmin) {
    return (
      <>
        {children}
        <button
          onClick={logout}
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
          title="Lock admin"
        >
          <LogOut className="h-3.5 w-3.5" /> Lock
        </button>
      </>
    );
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-dreamy px-4">
      <ClayBackdrop variant="floating" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-clay-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12 text-lg" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-blush-700 dark:bg-blush-400/20 dark:text-blush-200">
              <Lock className="h-4 w-4" />
            </div>
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Welcome back to RecruMate
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Enter your PIN to view the talent pool and candidate pipeline.
          </p>
          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setError(false);
              }}
              autoFocus
              placeholder="••••••"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                error
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30"
                  : "border-slate-200 focus:border-brand-400 focus:ring-brand-100 dark:border-slate-700 dark:focus:ring-brand-900/40"
              }`}
            />
            {error && (
              <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                Incorrect PIN. Please try again.
              </p>
            )}
            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Unlock <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
        <Link
          to="/"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </Link>
      </motion.div>
    </div>
  );
}
