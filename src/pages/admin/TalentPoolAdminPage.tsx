import { Users, Search, Filter, Eye } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../store/AppContext";
import EmptyState from "../../components/ui/EmptyState";
import type { Candidate } from "../../types";
import CandidateProfileModal from "../../components/admin/CandidateProfileModal";

export default function TalentPoolAdminPage() {
  const { candidates } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{ c: Candidate; cvOpen: boolean } | null>(null);

  const filtered = candidates.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || c.fullName.toLowerCase().includes(q) || c.techStack.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Talent Pool</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {candidates.length} candidates in your pool
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or skill (e.g. React, Java)"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelected({ c, cvOpen: false })}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${c.avatarColor}`}>
                {c.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.fullName}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{c.currentPosition} · {c.yearsOfExp}y</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.techStack.slice(0, 4).map((t) => (
                <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <Filter className="h-3 w-3" /> {c.stage}
              </p>
              {c.cvFileName && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected({ c, cvOpen: true });
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 dark:bg-brand-600/20 dark:text-brand-300 dark:hover:bg-brand-600/25"
                >
                  <Eye className="h-3.5 w-3.5" /> View CV
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <CandidateProfileModal
          candidate={selected.c}
          initialCvOpen={selected.cvOpen}
          onClose={() => setSelected(null)}
        />
      )}
      {filtered.length === 0 && (
        <EmptyState
          art="profile"
          title="No candidates found"
          description="Try a different keyword or clear the filter to see everyone in your talent pool."
        />
      )}
    </div>
  );
}
