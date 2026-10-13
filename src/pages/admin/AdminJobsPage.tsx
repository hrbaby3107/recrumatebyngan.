import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Flame,
  Zap,
  StickyNote,
  Plus,
  X,
  MapPin,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../store/AppContext";
import EmptyState from "../../components/ui/EmptyState";
import type { Job, JobTag } from "../../types";

export default function AdminJobsPage() {
  const { jobs, candidates, deleteJob, toggleJobTag, addJobNote, pushToast } =
    useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const handleDelete = (jobId: string, title: string) => {
    deleteJob(jobId);
    pushToast(`"${title}" has been deleted.`, "info");
    setConfirmDelete(null);
  };

  const handleAddNote = (jobId: string) => {
    const text = noteText.trim();
    if (!text) return;
    addJobNote(jobId, text);
    setNoteText("");
    pushToast("Note added to job.", "success");
  };

  const candidateCount = (jobId: string) =>
    candidates.filter((c) => c.jobId === jobId).length;

  return (
    <div className="p-5 sm:p-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Manage Jobs
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {jobs.length} jobs total. Delete duplicates, tag urgent roles, and add
          internal notes.
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          art="folder"
          title="No jobs yet"
          description="Jobs you post will appear here so you can tag them, add notes and keep your list tidy."
          action={
            <Link to="/post-job" className="btn-primary">
              <Plus className="h-4 w-4" /> Post a job
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Job header row */}
              <div className="flex items-start gap-3 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {job.title}
                    </h3>
                    {job.tags.includes("Urgent") && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <Zap className="h-3 w-3" /> Urgent
                      </span>
                    )}
                    {job.tags.includes("Hot") && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                        <Flame className="h-3 w-3" /> Hot
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        job.status === "Open"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {job.company}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> {job.salaryRange}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> {candidateCount(job.id)}{" "}
                      candidates
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {job.postedDaysAgo}d ago
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === job.id ? null : job.id)
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    title="Expand"
                  >
                    {expandedId === job.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(job.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    title="Delete job"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded section */}
              <AnimatePresence>
                {expandedId === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="p-4 sm:p-5">
                      {/* Tags */}
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Tags
                        </p>
                        <div className="flex gap-2">
                          {(["Urgent", "Hot"] as JobTag[]).map((tag) => {
                            const active = job.tags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => {
                                  toggleJobTag(job.id, tag);
                                  pushToast(
                                    `${active ? "Removed" : "Added"} "${tag}" tag.`,
                                    "info"
                                  );
                                }}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                                  active
                                    ? tag === "Urgent"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                    : "border border-slate-200 text-slate-400 hover:border-slate-300 dark:border-slate-700 dark:text-slate-500"
                                }`}
                              >
                                {tag === "Urgent" ? (
                                  <Zap className="h-3 w-3" />
                                ) : (
                                  <Flame className="h-3 w-3" />
                                )}
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Description
                        </p>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {job.description}
                        </p>
                      </div>

                      {/* Tech stack */}
                      {job.techStack.length > 0 && (
                        <div className="mb-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Tech Stack
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.techStack.map((t) => (
                              <span
                                key={t}
                                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          <StickyNote className="h-3.5 w-3.5" /> Internal Notes
                        </p>

                        <div className="mb-3 flex gap-2">
                          <input
                            value={expandedId === job.id ? noteText : ""}
                            onChange={(e) => setNoteText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddNote(job.id);
                              }
                            }}
                            placeholder="Add a note about this job..."
                            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-brand-900/40"
                          />
                          <button
                            onClick={() => handleAddNote(job.id)}
                            disabled={!noteText.trim()}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" /> Add
                          </button>
                        </div>

                        {job.notes.length > 0 ? (
                          <div className="space-y-2">
                            {job.notes.map((note) => (
                              <div
                                key={note.id}
                                className="rounded-lg bg-amber-50/60 px-3 py-2 text-sm text-slate-700 dark:bg-amber-900/10 dark:text-slate-300"
                              >
                                <p>{note.text}</p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {new Date(note.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-slate-600">
                            No notes yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <DeleteConfirm
            job={jobs.find((j) => j.id === confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
            onConfirm={(jobId, title) => handleDelete(jobId, title)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DeleteConfirm({
  job,
  onCancel,
  onConfirm,
}: {
  job: Job | undefined;
  onCancel: () => void;
  onConfirm: (jobId: string, title: string) => void;
}) {
  if (!job) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Delete this job?
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          "{job.title}" at {job.company} will be permanently removed. This
          action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(job.id, job.title)}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
