import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  Sparkles,
  Users,
  Target,
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Code,
  MapPin,
  Cake,
  DollarSign,
  FileText,
  RefreshCw,
  Clock,
  FileCheck2,
  Loader2,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import type { Candidate, CvFile } from "../../types";
import LocationSelect from "../../components/ui/LocationSelect";
import { CurrencySelect, MoneyInput } from "../../components/ui/CurrencySelect";
import FileUploader from "../../components/ui/FileUploader";
import { formatMoney } from "../../lib/currencies";

export default function TalentPoolPage() {
  const { jobs, applyToJob, updateCV, pushToast } = useApp();
  const [mode, setMode] = useState<"join" | "update">("join");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    facebookUrl: "",
    birthYear: "",
    residence: "",
    salaryExpectation: "",
    salaryMin: "",
    jobId: "",
    techStack: "",
  });
  const [cv, setCv] = useState<CvFile | null>(null);
  const [cvBusy, setCvBusy] = useState(false);
  const [currency, setCurrency] = useState("VND");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Update CV mode state
  const [lookupEmail, setLookupEmail] = useState("");
  const [foundCandidate, setFoundCandidate] = useState<Candidate | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [newCv, setNewCv] = useState<CvFile | null>(null);
  const [newCvBusy, setNewCvBusy] = useState(false);
  const [cvUpdated, setCvUpdated] = useState(false);
  const [updating, setUpdating] = useState(false);

  const openJobs = jobs.filter((j) => j.status === "Open");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      pushToast("Please fill in your name and email.", "error");
      return;
    }
    if (cvBusy) {
      pushToast("Your CV is still being processed — one moment.", "info");
      return;
    }
    setSubmitting(true);
    {
      const money = (raw: string) =>
        raw ? formatMoney(Number(raw), currency) : "";
      applyToJob({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        linkedinUrl: form.linkedinUrl,
        facebookUrl: form.facebookUrl,
        cvFileName: cv?.name ?? "",
        cvFile: cv,
        techStack: form.techStack,
        birthYear: form.birthYear,
        residence: form.residence,
        salaryExpectation: money(form.salaryExpectation),
        salaryMin: money(form.salaryMin),
        jobId: form.jobId || openJobs[0]?.id || "",
      });
      pushToast("You're in! Kylie will be in touch soon.", "success");
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const { candidates } = useApp();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail.trim()) {
      setLookupError("Please enter the email you used to join.");
      return;
    }
    const found = candidates.find(
      (c) => c.email.toLowerCase() === lookupEmail.trim().toLowerCase()
    );
    if (!found) {
      setLookupError("No candidate found with that email. If you haven't joined yet, switch to 'Join Talent Pool'.");
      setFoundCandidate(null);
      return;
    }
    setLookupError("");
    setFoundCandidate(found);
  };

  const handleUpdateCv = () => {
    if (!foundCandidate || !newCv) {
      pushToast("Please select a new CV file to upload.", "error");
      return;
    }
    setUpdating(true);
    updateCV(foundCandidate.email, newCv);
    setUpdating(false);
    setCvUpdated(true);
    pushToast("CV updated successfully! Your latest CV has been saved to your Talent Pool profile.", "success");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const perks = [
    {
      icon: Target,
      title: "Role-matched to you",
      desc: "I'll only reach out about roles that fit your stack and salary goals.",
    },
    {
      icon: Users,
      title: "Private & curated",
      desc: "Your info stays with me. No spam, no public listing.",
    },
    {
      icon: Sparkles,
      title: "First in line",
      desc: "Pool members hear about new roles before they go public.",
    },
  ];

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          You're in!
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Thanks {form.fullName.split(" ")[0]} — your CV is in my hands. You're
          now part of Kylie's talent pool. I'll reach out as soon as a matching
          role opens up.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              fullName: "",
              email: "",
              phone: "",
              linkedinUrl: "",
              facebookUrl: "",
              birthYear: "",
              residence: "",
              salaryExpectation: "",
              salaryMin: "",
              jobId: "",
              techStack: "",
            });
            setCv(null);
          }}
          className="mt-8 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Submit another
        </button>
      </div>
    );
  }

  if (cvUpdated && foundCandidate) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
        >
          <FileCheck2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          CV updated successfully!
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Your latest CV has been saved to your Talent Pool profile. Your
          existing information and recruitment history remain unchanged.
        </p>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <FileText className="h-4 w-4 text-brand-500" />
            <span className="font-medium">{newCv?.name}</span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3 w-3" /> Updated {formatDate(new Date().toISOString())}
          </p>
        </div>
        <button
          onClick={() => {
            setCvUpdated(false);
            setFoundCandidate(null);
            setLookupEmail("");
            setNewCv(null);
            setMode("join");
          }}
          className="mt-8 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Back to Talent Pool
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Mode toggle */}
      <div className="mb-8 flex justify-center">
        <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setMode("join")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === "join"
                ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Upload className="h-4 w-4" /> Join Talent Pool
          </button>
          <button
            onClick={() => setMode("update")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === "update"
                ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <RefreshCw className="h-4 w-4" /> Update CV
          </button>
        </div>
      </div>

      {mode === "update" ? (
        <UpdateCVFlow
          lookupEmail={lookupEmail}
          setLookupEmail={setLookupEmail}
          foundCandidate={foundCandidate}
          lookupError={lookupError}
          onLookup={handleLookup}
          newCv={newCv}
          setNewCv={setNewCv}
          setNewCvBusy={setNewCvBusy}
          newCvBusy={newCvBusy}
          onUpdate={handleUpdateCv}
          updating={updating}
          formatDate={formatDate}
          onSwitchToJoin={() => setMode("join")}
        />
      ) : (
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left — perks */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-600/20 dark:text-brand-300">
            <Users className="h-3.5 w-3.5" /> Talent Pool
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Upload your CV & join the talent pool
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Looking for your next opportunity? Send me your CV and join my
            private talent pool. I'll match you with roles that fit your skills,
            salary goals, and ambitions — and reach out before they go public.
          </p>

          <div className="mt-8 space-y-5">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-600/10 dark:text-brand-400">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Prefer to talk first?
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href="mailto:ngan.tran4@reco-vn.com"
                className="flex items-center gap-2 text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              >
                <Mail className="h-4 w-4 text-brand-500" />
                ngan.tran4@reco-vn.com
              </a>
              <a
                href="tel:0776931508"
                className="flex items-center gap-2 text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              >
                <Phone className="h-4 w-4 text-brand-500" />
                Zalo / Call: 0776 931 508 (Ngan)
              </a>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Your details
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Takes 2 minutes. Your info stays private.
          </p>

          <div className="mt-6 space-y-4">
            {/* CV upload */}
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Upload your CV *
              </span>
              <FileUploader
                value={cv}
                onChange={setCv}
                onBusyChange={setCvBusy}
                prompt="Click to upload your CV or drag & drop"
              />
            </div>

            <Field label="Full name *">
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="form-input pl-9"
                  placeholder="Jane Doe"
                />
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email *">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input pl-9"
                    placeholder="jane@email.com"
                  />
                </div>
              </Field>
              <Field label="Phone">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="form-input pl-9"
                    placeholder="+84 ..."
                  />
                </div>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Year of birth">
                <div className="relative">
                  <Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="1950"
                    max="2010"
                    value={form.birthYear}
                    onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                    className="form-input pl-9"
                    placeholder="1995"
                  />
                </div>
              </Field>
              <div>
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Place of residence
                </span>
                <LocationSelect
                  value={form.residence}
                  onChange={(v) => setForm({ ...form, residence: v })}
                  includeRemote={false}
                  icon={<MapPin className="h-4 w-4" />}
                  placeholder="Select or search"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[9.5rem_1fr_1fr]">
              <div>
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Currency
                </span>
                <CurrencySelect value={currency} onChange={setCurrency} />
              </div>
              <Field label="Expected salary (/mo)">
                <MoneyInput
                  value={form.salaryExpectation}
                  onChange={(v) => setForm({ ...form, salaryExpectation: v })}
                  placeholder="e.g. 30,000,000"
                />
              </Field>
              <Field label="Minimum salary (/mo)">
                <MoneyInput
                  value={form.salaryMin}
                  onChange={(v) => setForm({ ...form, salaryMin: v })}
                  placeholder="e.g. 25,000,000"
                />
              </Field>
            </div>

            <Field label="Tech stack / skills (comma-separated)">
              <div className="relative">
                <Code className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  className="form-input pl-9"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </Field>

            <Field label="Preferred role (optional)">
              <select
                value={form.jobId}
                onChange={(e) => setForm({ ...form, jobId: e.target.value })}
                className="form-input"
              >
                <option value="">Any matching role</option>
                {openJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.company}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="LinkedIn URL">
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.linkedinUrl}
                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                    className="form-input pl-9"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </Field>
              <Field label="Facebook URL">
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.facebookUrl}
                    onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                    className="form-input pl-9"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </Field>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || cvBusy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            {(submitting || cvBusy) && <Loader2 className="h-4 w-4 animate-spin" />}
            {cvBusy ? "Processing CV..." : submitting ? "Joining..." : "Join Talent Pool"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Mail className="h-3 w-3" /> You'll hear from Kylie within 48 hours.
          </p>
        </motion.form>
      </div>
      )}
    </div>
  );
}

function UpdateCVFlow({
  lookupEmail,
  setLookupEmail,
  foundCandidate,
  lookupError,
  onLookup,
  newCv,
  setNewCv,
  newCvBusy,
  setNewCvBusy,
  onUpdate,
  updating,
  formatDate,
  onSwitchToJoin,
}: {
  lookupEmail: string;
  setLookupEmail: (v: string) => void;
  foundCandidate: Candidate | null;
  lookupError: string;
  onLookup: (e: React.FormEvent) => void;
  newCv: CvFile | null;
  setNewCv: (v: CvFile | null) => void;
  newCvBusy: boolean;
  setNewCvBusy: (v: boolean) => void;
  onUpdate: () => void;
  updating: boolean;
  formatDate: (iso: string) => string;
  onSwitchToJoin: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-brand-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Update Your CV
          </h2>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Keep your profile up to date by uploading your latest CV. Your
          existing profile information and recruitment history will not be
          affected.
        </p>

        {/* Step 1 — Email lookup */}
        {!foundCandidate && (
          <form onSubmit={onLookup} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Enter the email you used to join
              </span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  className="form-input pl-9"
                  placeholder="jane@email.com"
                />
              </div>
            </label>
            {lookupError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {lookupError}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Find My Profile
            </button>
            <p className="text-center text-xs text-slate-400">
              Haven't joined yet?{" "}
              <button type="button" onClick={onSwitchToJoin} className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                Join the Talent Pool
              </button>
            </p>
          </form>
        )}

        {/* Step 2 — Current CV + Upload new */}
        {foundCandidate && (
          <div className="mt-6 space-y-5">
            {/* Candidate info */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${foundCandidate.avatarColor}`}>
                  {foundCandidate.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{foundCandidate.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{foundCandidate.email}</p>
                </div>
              </div>
            </div>

            {/* Current CV */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Current CV</p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <FileText className="h-4 w-4 text-brand-500" />
                  <span className="font-medium">{foundCandidate.cvFileName || "No CV on file"}</span>
                </div>
                {foundCandidate.cvUpdatedAt ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    Last updated {formatDate(foundCandidate.cvUpdatedAt)}
                  </p>
                ) : (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    Uploaded {formatDate(foundCandidate.appliedAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Upload new CV */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Upload New CV
              </p>
              <FileUploader
                value={newCv}
                onChange={setNewCv}
                onBusyChange={setNewCvBusy}
                prompt="Click to upload your new CV or drag & drop"
              />
            </div>

            <button
              onClick={onUpdate}
              disabled={updating || !newCv || newCvBusy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
            >
              {(updating || newCvBusy) && <Loader2 className="h-4 w-4 animate-spin" />}
              {newCvBusy ? "Processing CV..." : updating ? "Updating..." : "Update CV"}
            </button>
            <p className="text-center text-xs text-slate-400">
              Your profile info and recruitment history will remain unchanged.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}
