import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  Mail,
  FileText,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { Link } from "react-router-dom";
import { displayFirstName } from "../../lib/profile";

const stageColors: Record<string, string> = {
  New: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Contacted: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Interview: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Offer: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Hired: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function DashboardPage() {
  const { candidates, jobs, getJob, profile } = useApp();

  const openJobs = jobs.filter((j) => j.status === "Open").length;
  const interviewsThisWeek = candidates.filter(
    (c) => c.stage === "Interview"
  ).length;
  const newLeads = candidates.filter((c) => c.stage === "New").length;

  const metrics = [
    {
      label: "Total Candidates",
      value: candidates.length,
      icon: Users,
      delta: "+3 this week",
      color: "bg-brand-50 text-brand-600 dark:bg-brand-600/10 dark:text-brand-400",
    },
    {
      label: "Active Jobs",
      value: openJobs,
      icon: Briefcase,
      delta: `${jobs.length} total`,
      color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
    },
    {
      label: "Interviews this week",
      value: interviewsThisWeek,
      icon: CalendarDays,
      delta: "Scheduled",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    },
    {
      label: "New Leads",
      value: newLeads,
      icon: TrendingUp,
      delta: "Awaiting outreach",
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
  ];

  const recentCandidates = [...candidates]
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    )
    .slice(0, 5);

  const stageCounts = ["New", "Contacted", "Interview", "Offer", "Hired"].map(
    (stage) => ({
      stage,
      count: candidates.filter((c) => c.stage === stage).length,
    })
  );
  const maxCount = Math.max(...stageCounts.map((s) => s.count), 1);

  return (
    <div className="p-5 sm:p-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Welcome back, {displayFirstName(profile.name)}. Here's your pipeline at a glance.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${m.color}`}
              >
                <m.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {m.delta}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {m.value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {m.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Pipeline overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Pipeline overview
            </h2>
            <Link
              to="/admin/pipeline"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View board <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {stageCounts.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <span className="w-20 text-sm text-slate-500 dark:text-slate-400">
                  {s.stage}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(s.count / maxCount) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-brand-500"
                  />
                </div>
                <span className="w-6 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">
            Quick actions
          </h2>
          <div className="space-y-2">
            <Link
              to="/admin/pipeline"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:bg-brand-900/10"
            >
              <KanbanIcon /> Move candidates
            </Link>
            <Link
              to="/admin/candidates"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:bg-brand-900/10"
            >
              <UserPlus className="h-4 w-4 text-brand-500" /> Browse all
              candidates
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:bg-brand-900/10"
            >
              <Briefcase className="h-4 w-4 text-brand-500" /> Post a new job
            </Link>
          </div>
        </div>
      </div>

      {/* Recent candidates */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">
          Recent applicants
        </h2>
        <div className="space-y-2">
          {recentCandidates.map((c) => {
            const job = getJob(c.jobId);
            return (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${c.avatarColor}`}
                >
                  {c.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {c.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {job ? job.title : "General pool"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColors[c.stage]}`}
                >
                  {c.stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KanbanIcon() {
  return (
    <span className="flex h-4 w-4 flex-col justify-center gap-0.5 text-brand-500">
      <span className="h-1 w-full rounded bg-current" />
      <span className="h-1 w-2/3 rounded bg-current" />
    </span>
  );
}
