import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../store/AppContext";
import type { Stage, Candidate } from "../../types";
import CandidateProfileModal from "../../components/admin/CandidateProfileModal";

const columns: { stage: Stage; label: string; color: string; dot: string }[] = [
  {
    stage: "New",
    label: "New Lead",
    color: "border-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  {
    stage: "Contacted",
    label: "Contacted",
    color: "border-sky-300 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  {
    stage: "Interview",
    label: "Interview",
    color: "border-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  {
    stage: "Offer",
    label: "Offer",
    color: "border-violet-300 dark:border-violet-800",
    dot: "bg-violet-500",
  },
  {
    stage: "Hired",
    label: "Onboarded",
    color: "border-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
];

export default function PipelinePage() {
  const { candidates, moveCandidateStage, getJob } = useApp();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [selected, setSelected] = useState<Candidate | null>(null);

  const handleDrop = (stage: Stage) => {
    if (draggedId) {
      const cand = candidates.find((c) => c.id === draggedId);
      if (cand && cand.stage !== stage) {
        moveCandidateStage(draggedId, stage);
      }
    }
    setDraggedId(null);
    setDragOverStage(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-slate-200 px-5 py-4 sm:px-7 dark:border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pipeline
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Drag candidate cards between columns to update their stage.
        </p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-max gap-4 p-4 sm:p-6">
          {columns.map((col) => {
            const colCandidates = candidates.filter(
              (c) => c.stage === col.stage
            );
            return (
              <div
                key={col.stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStage(col.stage);
                }}
                onDragLeave={() =>
                  setDragOverStage((s) => (s === col.stage ? null : s))
                }
                onDrop={() => handleDrop(col.stage)}
                className={`flex w-72 shrink-0 flex-col rounded-2xl border-t-4 ${col.color} ${
                  dragOverStage === col.stage ? "drop-target" : ""
                } bg-slate-100/60 dark:bg-slate-900/40`}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {col.label}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {colCandidates.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto px-3 pb-4">
                  {colCandidates.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-600">
                      Drop here
                    </div>
                  )}
                  {colCandidates.map((c) => {
                    const job = getJob(c.jobId);
                    return (
                      <motion.div
                        key={c.id}
                        layout
                        draggable
                        onDragStart={() => setDraggedId(c.id)}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDragOverStage(null);
                        }}
                        onClick={() => setSelected(c)}
                        className={`cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-slate-800 dark:bg-slate-800 ${
                          draggedId === c.id ? "dragging" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${c.avatarColor}`}
                          >
                            {c.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                            {c.fullName}
                          </p>
                        </div>
                        {job && (
                          <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
                            {job.title}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.techStack.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                          {c.techStack.length > 2 && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-slate-700 dark:text-slate-500">
                              +{c.techStack.length - 2}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
