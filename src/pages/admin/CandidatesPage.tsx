import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../../store/AppContext";
import type { Candidate } from "../../types";
import CandidateProfileModal from "../../components/admin/CandidateProfileModal";

const stageColors: Record<string, string> = {
  New: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Contacted: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Interview: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Offer: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Hired: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function CandidatesPage() {
  const { candidates, getJob } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.techStack.some((t) => t.toLowerCase().includes(q)) ||
        c.email.toLowerCase().includes(q)
    );
  }, [candidates, query]);

  return (
    <div className="p-5 sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Candidates
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {candidates.length} total in your database
          </p>
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, tech, or email"
            className="form-input pl-10"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Table header (desktop) */}
        <div className="hidden grid-cols-12 gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:grid">
          <span className="col-span-3">Candidate</span>
          <span className="col-span-2">Role</span>
          <span className="col-span-2">Tech stack</span>
          <span className="col-span-2">Location</span>
          <span className="col-span-2">Stage</span>
          <span className="col-span-1" />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
              No candidates match "{query}".
            </div>
          ) : (
            filtered.map((c, i) => {
              const job = getJob(c.jobId);
              return (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => setSelected(c)}
                  className="grid w-full grid-cols-1 gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:grid-cols-12 sm:items-center sm:gap-4"
                >
                  {/* Candidate */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${c.avatarColor}`}
                    >
                      {c.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                        {c.fullName}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {c.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                      {job ? job.title : "General pool"}
                    </p>
                  </div>

                  {/* Tech */}
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {c.techStack.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                    {c.techStack.length > 2 && (
                      <span className="text-[11px] text-slate-400">
                        +{c.techStack.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="col-span-2">
                    <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                      {c.residence || "—"}
                    </p>
                    {c.salaryExpectation && (
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                        Exp: {c.salaryExpectation}
                      </p>
                    )}
                  </div>

                  {/* Stage */}
                  <div className="col-span-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColors[c.stage]}`}
                    >
                      {c.stage}
                    </span>
                  </div>

                  <div className="col-span-1 hidden justify-end sm:flex">
                    <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {selected && (
        <CandidateProfileModal
          candidate={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
