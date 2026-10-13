import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useApp } from "../store/AppContext";
import { AnimatePresence, motion } from "framer-motion";

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon =
            t.type === "success"
              ? CheckCircle2
              : t.type === "error"
              ? XCircle
              : Info;
          const accent =
            t.type === "success"
              ? "text-emerald-500"
              : t.type === "error"
              ? "text-rose-500"
              : "text-sky-500";
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/5 min-w-[280px] max-w-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${accent}`} />
              <p className="text-sm text-slate-700 flex-1 dark:text-slate-200">
                {t.message}
              </p>
              <button
                onClick={() => dismissToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
