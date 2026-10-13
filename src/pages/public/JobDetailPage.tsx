import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Upload,
  Zap,
  Flame,
  Globe,
  Languages,
  ListChecks,
  Sparkles,
  Gift,
  Heart,
  Share2,
  Copy,
  Linkedin,
  Facebook,
  Mail,
  ArrowRight,
  FileText,
  Users,
  X,
  Loader2,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import type { Job, CvFile } from "../../types";
import LocationSelect from "../../components/ui/LocationSelect";
import { CurrencySelect, MoneyInput } from "../../components/ui/CurrencySelect";
import FileUploader from "../../components/ui/FileUploader";
import { formatMoney } from "../../lib/currencies";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, applyToJob, pushToast, toggleSaveJob, isJobSaved } = useApp();
  const job = jobs.find((j) => j.id === id);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    yearsExp: "",
    location: "",
    expectedSalary: "",
    noticePeriod: "",
    message: "",
  });
  const [cv, setCv] = useState<CvFile | null>(null);
  const [cvBusy, setCvBusy] = useState(false);
  const [currency, setCurrency] = useState("VND");
  const [agreed, setAgreed] = useState(false);

  if (!job) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Job not found</h1>
        <p className="mt-2 text-slate-500">This position may have been removed or is no longer available.</p>
        <Link to="/jobs" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Back to all jobs
        </Link>
      </div>
    );
  }

  const isClosed = job.status !== "Open";

  const relatedJobs = jobs
    .filter((j) => j.id !== job.id && j.status === "Open")
    .filter((j) =>
      j.techStack.some((t) => job.techStack.includes(t)) ||
      j.domain === job.domain ||
      j.experience === job.experience ||
      j.location === job.location
    )
    .slice(0, 3);

  const infoCards = [
    { label: "Experience", value: job.experience, icon: Briefcase },
    { label: "Work Mode", value: job.workMode, icon: MapPin },
    { label: "Location", value: job.location, icon: Globe },
    { label: "Employment Type", value: job.contractType, icon: Calendar },
    { label: "English", value: job.englishLevel, icon: Languages },
    { label: "Salary", value: job.salaryRange, icon: DollarSign },
    { label: "Domain", value: job.domain, icon: Building2 },
    { label: "Posted", value: `${job.postedDaysAgo}d ago`, icon: Calendar },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      pushToast("Please fill in your name and email.", "error");
      return;
    }
    if (!agreed) {
      pushToast("Please agree to let RecruMate process your information.", "error");
      return;
    }
    if (cvBusy) {
      pushToast("Your CV is still being processed — one moment.", "info");
      return;
    }
    setSubmitting(true);
    {
      applyToJob({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        linkedinUrl: form.linkedinUrl,
        facebookUrl: "",
        cvFileName: cv?.name ?? "",
        cvFile: cv,
        techStack: "",
        birthYear: "",
        residence: form.location,
        salaryExpectation: form.expectedSalary
          ? formatMoney(Number(form.expectedSalary), currency)
          : "",
        salaryMin: "",
        jobId: job.id,
      });
      pushToast("Application submitted! Kylie will review your profile and contact you if your experience matches the opportunity.", "success");
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    pushToast("Job link copied!", "success");
    setShowShare(false);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this job: ${job.title} at ${job.company}`;

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          Application submitted successfully!
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Kylie will review your profile and contact you if your experience
          matches the opportunity.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/jobs" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Back to Jobs
          </Link>
          <Link to="/talent-pool" className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            Join Talent Pool
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Back link */}
      <button
        onClick={() => navigate("/jobs")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all jobs
      </button>

      {/* Job header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{job.title}</h1>
              {job.tags.includes("Urgent") && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <Zap className="h-3 w-3" /> Urgent
                </span>
              )}
              {job.tags.includes("Hot") && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <Flame className="h-3 w-3" /> Hot
                </span>
              )}
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Building2 className="h-4 w-4" /> {job.company}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                isJobSaved(job.id)
                  ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Heart className={`h-4 w-4 ${isJobSaved(job.id) ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isJobSaved(job.id) ? "Saved" : "Save Job"}</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShare(!showShare)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              {showShare && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <button onClick={handleCopyLink} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                    <Copy className="h-4 w-4" /> Copy Link
                  </button>
                  <a href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                  <a href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                    <Facebook className="h-4 w-4" /> Facebook
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick info row */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-500" /> {job.location}</span>
          <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-brand-500" /> {job.workMode}</span>
          <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-brand-500" /> {job.salaryRange}</span>
          <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-brand-500" /> {job.domain}</span>
        </div>

        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.techStack.map((t) => (
            <span key={t} className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-600/20 dark:text-brand-300">{t}</span>
          ))}
        </div>

        {/* Status badge */}
        {isClosed && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
            This position is no longer accepting applications.
          </div>
        )}
      </motion.div>

      {/* Info cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {infoCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <card.icon className="h-5 w-5 text-brand-500" />
            <p className="mt-2 text-xs text-slate-400">{card.label}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Job description */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Job Description</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{job.description}</p>

        {job.responsibilities.length > 0 && <DetailSection icon={ListChecks} title="Responsibilities" items={job.responsibilities} />}
        {job.requirements.length > 0 && <DetailSection icon={CheckCircle2} title="Requirements" items={job.requirements} />}
        {job.niceToHave.length > 0 && <DetailSection icon={Sparkles} title="Nice to Have" items={job.niceToHave} />}
        {job.benefits.length > 0 && <DetailSection icon={Gift} title="Benefits" items={job.benefits} />}

        {/* Recruitment process */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recruitment Process</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {["CV Review", "Phone Screen", "Technical Interview", "Client Interview", "Offer", "Onboard"].map((step, idx) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-300">{idx + 1}</span>
                <span className="text-slate-600 dark:text-slate-400">{step}</span>
                {idx < 5 && <span className="text-slate-300 dark:text-slate-600">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Apply section */}
      {!isClosed && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          {!showApplyForm ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Interested in this opportunity?</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Apply now and Kylie will get back to you.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button onClick={() => setShowApplyForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </button>
                <Link to="/talent-pool" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  <Users className="h-4 w-4" /> Join Talent Pool
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Apply for {job.title}</h2>
                <button type="button" onClick={() => setShowApplyForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full Name *">
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="form-input" placeholder="Jane Doe" />
                </FormField>
                <FormField label="Email *">
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="jane@email.com" />
                </FormField>
                <FormField label="Phone">
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" placeholder="+84 ..." />
                </FormField>
                <FormField label="Years of Experience">
                  <input type="number" min="0" max="50" value={form.yearsExp} onChange={(e) => setForm({ ...form, yearsExp: e.target.value })} className="form-input" placeholder="5" />
                </FormField>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Current Location
                  </span>
                  <LocationSelect
                    value={form.location}
                    onChange={(v) => setForm({ ...form, location: v })}
                    includeRemote={false}
                    placeholder="Select or search"
                  />
                </div>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Expected Salary (/mo)
                  </span>
                  <div className="grid grid-cols-[7.5rem_1fr] gap-2">
                    <CurrencySelect value={currency} onChange={setCurrency} />
                    <MoneyInput
                      value={form.expectedSalary}
                      onChange={(v) => setForm({ ...form, expectedSalary: v })}
                      placeholder="e.g. 30,000,000"
                    />
                  </div>
                </div>
                <FormField label="Notice Period">
                  <input value={form.noticePeriod} onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })} className="form-input" placeholder="30 days" />
                </FormField>
                <FormField label="LinkedIn URL">
                  <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} className="form-input" placeholder="https://linkedin.com/in/..." />
                </FormField>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Upload CV
                </span>
                <FileUploader
                  value={cv}
                  onChange={setCv}
                  onBusyChange={setCvBusy}
                  prompt="Click to upload your CV or drag & drop"
                />
              </div>

              <FormField label="Short Message / Note">
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="form-input resize-none" placeholder="Tell Kylie why you're a good fit..." />
              </FormField>

              <label className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800" />
                <span>I agree to let RecruMate store and process my information for recruitment purposes.</span>
              </label>

              <button type="submit" disabled={submitting || cvBusy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60">
                {(submitting || cvBusy) && <Loader2 className="h-4 w-4 animate-spin" />}
                {cvBusy ? "Processing CV..." : submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Related jobs */}
      {relatedJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">You may also be interested in</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {relatedJobs.map((rj) => (
              <Link key={rj.id} to={`/jobs/${rj.id}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">{rj.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{rj.company}</p>
                <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {rj.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {rj.experience} · {rj.contractType}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {rj.salaryRange}</span>
                </div>
                <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 dark:text-brand-400">
                  View Details <ArrowRight className="h-3 w-3 transition-all" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailSection({ icon: Icon, title, items }: { icon: typeof ListChecks; title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        <Icon className="h-4 w-4" /> {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}
