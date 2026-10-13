import { Bell, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const mockFollowUps = [
  { name: "Minh Nguyen", task: "Interview feedback", date: "2026-10-06", status: "Due today" },
  { name: "Linh Tran", task: "Offer follow-up", date: "2026-10-05", status: "Overdue" },
  { name: "David Park", task: "Check availability", date: "2026-10-08", status: "Upcoming" },
  { name: "Hana Kim", task: "Onboarding check-in", date: "2026-10-10", status: "Upcoming" },
];

const statusColors: Record<string, string> = {
  "Due today": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Upcoming: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function FollowUpsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <Bell className="h-6 w-6 text-brand-500" /> Follow-up Reminders
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Stay on top of your candidate communications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">1</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">Due today</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">1</p>
          <p className="text-sm text-red-600 dark:text-red-400">Overdue</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/30 dark:bg-sky-900/10">
          <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">2</p>
          <p className="text-sm text-sky-600 dark:text-sky-400">Upcoming</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {mockFollowUps.map((f, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                f.status === "Overdue" ? "bg-red-50 text-red-500 dark:bg-red-900/20" :
                f.status === "Due today" ? "bg-amber-50 text-amber-500 dark:bg-amber-900/20" :
                "bg-sky-50 text-sky-500 dark:bg-sky-900/20"
              }`}>
                {f.status === "Overdue" ? <AlertCircle className="h-4.5 w-4.5" /> : <Clock className="h-4.5 w-4.5" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{f.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{f.task}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{f.date}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[f.status]}`}>{f.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
