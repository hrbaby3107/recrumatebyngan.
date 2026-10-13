import { BarChart3, TrendingUp, Users, Target, Award } from "lucide-react";
import { useApp } from "../../store/AppContext";

export default function AnalyticsPage() {
  const { candidates, jobs } = useApp();

  const stageCount = (stage: string) => candidates.filter((c) => c.stage === stage).length;
  const funnel = [
    { label: "Sourced", value: candidates.length, color: "bg-slate-400" },
    { label: "Contacted", value: stageCount("Contacted"), color: "bg-sky-500" },
    { label: "Interview", value: stageCount("Interview"), color: "bg-amber-500" },
    { label: "Offer", value: stageCount("Offer"), color: "bg-violet-500" },
    { label: "Hired", value: stageCount("Hired"), color: "bg-emerald-500" },
  ];

  const maxVal = Math.max(...funnel.map((f) => f.value), 1);

  const stats = [
    { label: "CV Received", value: candidates.length, icon: Users, color: "text-sky-500" },
    { label: "Contacted", value: stageCount("Contacted"), icon: Target, color: "text-amber-500" },
    { label: "Interviews", value: stageCount("Interview"), icon: TrendingUp, color: "text-violet-500" },
    { label: "Offers", value: stageCount("Offer"), icon: Award, color: "text-emerald-500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <BarChart3 className="h-6 w-6 text-brand-500" /> Recruitment Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your recruitment performance and conversion rates.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <s.icon className={`h-6 w-6 ${s.color}`} />
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recruitment Funnel</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Candidates at each pipeline stage</p>
        <div className="mt-6 space-y-3">
          {funnel.map((f) => (
            <div key={f.label} className="flex items-center gap-4">
              <span className="w-24 text-sm text-slate-600 dark:text-slate-300">{f.label}</span>
              <div className="flex-1">
                <div className="h-6 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-6 rounded-lg ${f.color} transition-all`}
                    style={{ width: `${(f.value / maxVal) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-sm font-semibold text-slate-900 dark:text-white">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Job Performance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-400 dark:border-slate-700">
                <th className="pb-2 font-medium">Job</th>
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 text-right font-medium">Candidates</th>
                <th className="pb-2 text-right font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const count = candidates.filter((c) => c.jobId === j.id).length;
                return (
                  <tr key={j.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2.5 text-slate-700 dark:text-slate-200">{j.title}</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{j.company}</td>
                    <td className="py-2.5 text-right text-slate-700 dark:text-slate-200">{count}</td>
                    <td className="py-2.5 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${j.status === "Open" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                        {j.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
