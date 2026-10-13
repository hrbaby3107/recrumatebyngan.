import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  Linkedin,
  Facebook,
  Briefcase,
  Clock,
  FileText,
  MessageSquarePlus,
  UserCircle2,
  Building2,
  Cake,
  MapPin,
  DollarSign,
  Download,
  Code,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Candidate } from "../../types";
import { useApp } from "../../store/AppContext";
import CvPreviewPanel from "./CvPreviewPanel";
import { formatBytes, triggerDownload } from "../../lib/files";

interface Props {
  candidate: Candidate;
  onClose: () => void;
  /** Open the CV preview panel as soon as the modal opens. */
  initialCvOpen?: boolean;
}

const stageColors: Record<string, string> = {
  New: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Contacted: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Interview: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Offer: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Hired: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const activityIcons: Record<string, typeof Mail> = {
  applied: FileText,
  stage_changed: UserCircle2,
  note_added: MessageSquarePlus,
  contacted: Mail,
};

export default function CandidateProfileModal({
  candidate: initialCandidate,
  onClose,
  initialCvOpen = false,
}: Props) {
  const { candidates, getJob, addNote, pushToast } = useApp();
  // Always read the live record so new notes / CV updates show up immediately.
  const candidate =
    candidates.find((c) => c.id === initialCandidate.id) ?? initialCandidate;
  const [noteText, setNoteText] = useState("");
  const [cvOpen, setCvOpen] = useState(initialCvOpen && !!candidate.cvFileName);
  const job = getJob(candidate.jobId);

  // Esc closes the CV panel first, then the modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (cvOpen) setCvOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cvOpen, onClose]);

  const handleDownload = () => {
    if (candidate.cvFile) {
      triggerDownload(candidate.cvFile.url, candidate.cvFile.name);
    } else {
      pushToast("This is a demo candidate — no CV file was uploaded.", "info");
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(candidate.id, noteText.trim());
    setNoteText("");
    pushToast("Note added.", "success");
  };

  const sortedActivity = [...candidate.activity].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-6"
        onClick={onClose}
      >
        <div className="flex w-full justify-center gap-4">
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl transition-[max-width] duration-300 sm:rounded-2xl dark:bg-slate-900 ${
            cvOpen ? "lg:h-[92vh] lg:max-w-[40%] lg:shrink-0" : "max-w-4xl"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white ${candidate.avatarColor}`}
              >
                {candidate.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                  {candidate.fullName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {candidate.currentPosition} · {candidate.yearsOfExp} yrs exp
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColors[candidate.stage]}`}
                  >
                    {candidate.stage}
                  </span>
                  {job && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-600/20 dark:text-brand-300">
                      <Building2 className="h-3 w-3" /> {job.title}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    {formatFullDate(candidate.appliedAt)}
                  </span>
                  {candidate.cvFileName && (
                    <button
                      onClick={() => setCvOpen((v) => !v)}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                    >
                      {cvOpen ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                      {cvOpen ? "Hide CV" : "View CV"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body — two columns */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <div
              className={`grid gap-6 ${cvOpen ? "" : "lg:grid-cols-[1fr_1fr]"}`}
            >
              {/* LEFT — Candidate info */}
              <div className="space-y-6">
                {/* Upload timestamp */}
                <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-900/20 dark:bg-brand-900/10">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                    <Calendar className="h-4 w-4" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide">
                      CV Uploaded
                    </h3>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatFullDateTime(candidate.appliedAt)}
                  </p>
                </div>

                {/* Contact info */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Contact
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <a
                      href={`mailto:${candidate.email}`}
                      className="flex items-center gap-2.5 text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      <Mail className="h-4 w-4 text-slate-400" />
                      {candidate.email}
                    </a>
                    {candidate.phone && (
                      <p className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {candidate.phone}
                      </p>
                    )}
                    {candidate.linkedinUrl && (
                      <a
                        href={candidate.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                      >
                        <Linkedin className="h-4 w-4 text-slate-400" />
                        LinkedIn profile
                      </a>
                    )}
                    {candidate.facebookUrl && (
                      <a
                        href={candidate.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                      >
                        <Facebook className="h-4 w-4 text-slate-400" />
                        Facebook profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Personal */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Personal
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    {candidate.birthYear && (
                      <p className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <Cake className="h-4 w-4 text-slate-400" />
                        Born {candidate.birthYear}
                      </p>
                    )}
                    {candidate.residence && (
                      <p className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {candidate.residence}
                      </p>
                    )}
                    {candidate.salaryExpectation && (
                      <p className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        Expected: {candidate.salaryExpectation}/mo
                      </p>
                    )}
                    {candidate.salaryMin && (
                      <p className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        Minimum: {candidate.salaryMin}/mo
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <Code className="h-3.5 w-3.5" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.techStack.length > 0 ? (
                      candidate.techStack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-600/20 dark:text-brand-300"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No skills listed.</p>
                    )}
                  </div>
                </div>

                {/* Activity timeline */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Activity timeline
                  </h3>
                  <div className="relative space-y-4 pl-6">
                    <div className="absolute left-2 top-1.5 bottom-1.5 w-px bg-slate-200 dark:bg-slate-800" />
                    {sortedActivity.map((a) => {
                      const Icon = activityIcons[a.type] ?? Clock;
                      return (
                        <div key={a.id} className="relative">
                          <span className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                            <Icon className="h-3.5 w-3.5 text-brand-500" />
                          </span>
                          <p className="text-sm text-slate-700 dark:text-slate-200">
                            {a.message}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {formatFullDateTime(a.createdAt)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT — CV preview + Notes */}
              <div className="space-y-6">
                {/* CV preview */}
                <div>
                  <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <FileText className="h-3.5 w-3.5" /> CV / Resume
                  </h3>
                  {candidate.cvFileName ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                          <FileText className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {candidate.cvFileName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {candidate.cvFile
                              ? `${candidate.cvFile.type === "application/pdf" ? "PDF document" : "Document"} · ${formatBytes(candidate.cvFile.size)}`
                              : "PDF document"}
                          </p>
                        </div>
                        <button
                          onClick={handleDownload}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Download CV"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => setCvOpen((v) => !v)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                      >
                        {cvOpen ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {cvOpen ? "Hide CV preview" : "View CV"}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center dark:border-slate-700">
                      <FileText className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="mt-2 text-sm text-slate-400">
                        No CV uploaded
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Notes
                  </h3>
                  <div className="space-y-2">
                    {candidate.notes.length === 0 && (
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        No notes yet.
                      </p>
                    )}
                    {candidate.notes.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                      >
                        {n.text}
                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                          {formatFullDate(n.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                      placeholder="Add a note..."
                      className="form-input flex-1 py-2"
                    />
                    <button
                      onClick={handleAddNote}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700"
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {cvOpen && (
          <CvPreviewPanel
            candidate={candidate}
            onClose={() => setCvOpen(false)}
            onDownload={handleDownload}
          />
        )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFullDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
