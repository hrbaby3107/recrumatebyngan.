import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Code,
  Zap,
  Flame,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import type { WorkMode, JobTag, ExperienceLevel, ContractType, EnglishLevel, CvFile } from "../../types";
import LocationSelect from "../../components/ui/LocationSelect";
import { CurrencySelect, MoneyInput } from "../../components/ui/CurrencySelect";
import FileUploader from "../../components/ui/FileUploader";
import MultiSelect from "../../components/ui/MultiSelect";
import { TECH_OPTIONS } from "../../lib/techStack";
import { formatSalaryRange } from "../../lib/currencies";

export default function PostJobPage() {
  const { addJob, pushToast } = useApp();
  const [mode, setMode] = useState<"create" | "upload">("create");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jdFile, setJdFile] = useState<CvFile | null>(null);
  const [jdBusy, setJdBusy] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    workMode: "Remote" as WorkMode,
    salaryRange: "",
    techStack: "",
    description: "",
    experience: "Middle" as ExperienceLevel,
    contractType: "Full-time" as ContractType,
    englishLevel: "Good" as EnglishLevel,
    domain: "",
    responsibilities: "",
    requirements: "",
    niceToHave: "",
    benefits: "",
  });
  const [selectedTags, setSelectedTags] = useState<JobTag[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company) {
      pushToast("Please fill in the job title and company name.", "error");
      return;
    }
    if (jdBusy) {
      pushToast("Please wait — your file is still being processed.", "info");
      return;
    }
    const minN = salaryMin ? Number(salaryMin) : undefined;
    const maxN = salaryMax ? Number(salaryMax) : undefined;
    if (minN && maxN && minN > maxN) {
      pushToast("Minimum salary can't be higher than the maximum.", "error");
      return;
    }
    if (mode === "upload" && !jdFile && !form.description) {
      pushToast("Please upload a JD file or switch to create mode.", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const desc =
        mode === "upload" && jdFile
          ? form.description || `JD uploaded from file: ${jdFile.name}`
          : form.description;
      if (jdFile) URL.revokeObjectURL(jdFile.url);
      addJob({ ...form, techStack: techStack.join(", "), salaryRange: formatSalaryRange(currency, minN, maxN), salaryCurrency: currency, salaryMin: minN, salaryMax: maxN, description: desc, tags: selectedTags, experience: form.experience, contractType: form.contractType, englishLevel: form.englishLevel, domain: form.domain, responsibilities: form.responsibilities, requirements: form.requirements, niceToHave: form.niceToHave, benefits: form.benefits });
      pushToast("Job posted successfully! It's now live on your job board.", "success");
      setSubmitting(false);
      setSubmitted(true);
    }, 300);
  };

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
          Job posted!
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          "{form.title}" at {form.company} is now live. Candidates can start
          applying right away.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              title: "",
              company: "",
              location: "",
              workMode: "Remote",
              salaryRange: "",
              techStack: "",
              description: "",
              experience: "Middle",
              contractType: "Full-time",
              englishLevel: "Good",
              domain: "",
              responsibilities: "",
              requirements: "",
              niceToHave: "",
              benefits: "",
            });
            setSelectedTags([]);
            setJdFile(null);
            setTechStack([]);
            setCurrency("USD");
            setSalaryMin("");
            setSalaryMax("");
          }}
          className="mt-8 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Post another job
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-600/20 dark:text-brand-300">
          <Briefcase className="h-3.5 w-3.5" /> For Hiring Managers
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Post a Job
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Upload an existing job description or create one from scratch.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="mb-8 flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={() => setMode("create")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            mode === "create"
              ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" /> Create JD
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            mode === "upload"
              ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Upload className="h-4 w-4" /> Upload JD
        </button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        {mode === "upload" && (
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Upload Job Description file
            </span>
            <FileUploader
              value={jdFile}
              onChange={setJdFile}
              onBusyChange={setJdBusy}
              accept={[".pdf", ".doc", ".docx", ".txt"]}
              prompt="Click to upload your JD or drag & drop"
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Job title *">
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="form-input pl-9"
                placeholder="Senior Frontend Engineer"
              />
            </div>
          </Field>
          <Field label="Company *">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="form-input pl-9"
                placeholder="Acme Corp"
              />
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Location
            </span>
            <LocationSelect
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
              icon={<MapPin className="h-4 w-4" />}
              placeholder="Select or search location"
            />
          </div>
          <Field label="Work mode">
            <select
              value={form.workMode}
              onChange={(e) =>
                setForm({ ...form, workMode: e.target.value as WorkMode })
              }
              className="form-input"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Office">Office</option>
            </select>
          </Field>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Salary range (per month)
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[11rem_1fr_1fr]">
            <CurrencySelect
              value={currency}
              onChange={setCurrency}
              className="col-span-2 sm:col-span-1"
            />
            <MoneyInput value={salaryMin} onChange={setSalaryMin} placeholder="Min  e.g. 2,000" />
            <MoneyInput value={salaryMax} onChange={setSalaryMax} placeholder="Max  e.g. 4,000" />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Leave both empty to show “Negotiable”.
          </p>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tech stack
          </span>
          <MultiSelect
            value={techStack}
            onChange={setTechStack}
            options={TECH_OPTIONS}
            icon={<Code className="h-4 w-4" />}
            placeholder="Select or search technologies (React, Java, AWS...)"
            allowCustom
            emptyText="No match — press Enter to add your own"
          />
        </div>

        <Field label="Tags (optional)">
          <div className="flex gap-2">
            {(["Urgent", "Hot"] as JobTag[]).map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      active
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    active
                      ? tag === "Urgent"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "border border-slate-200 text-slate-400 hover:border-slate-300 dark:border-slate-700 dark:text-slate-500"
                  }`}
                >
                  {tag === "Urgent" ? (
                    <Zap className="h-3.5 w-3.5" />
                  ) : (
                    <Flame className="h-3.5 w-3.5" />
                  )}
                  {tag}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Experience">
            <select
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value as ExperienceLevel })}
              className="form-input"
            >
              <option value="Junior">Junior</option>
              <option value="Middle">Middle</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </Field>
          <Field label="Contract type">
            <select
              value={form.contractType}
              onChange={(e) => setForm({ ...form, contractType: e.target.value as ContractType })}
              className="form-input"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </Field>
          <Field label="English level">
            <select
              value={form.englishLevel}
              onChange={(e) => setForm({ ...form, englishLevel: e.target.value as EnglishLevel })}
              className="form-input"
            >
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Good">Good</option>
              <option value="Fluent">Fluent</option>
            </select>
          </Field>
        </div>

        <Field label="Domain (e.g. Fintech, E-commerce, Healthcare)">
          <input
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            className="form-input"
            placeholder="Fintech"
          />
        </Field>

        <Field label="Responsibilities (one per line)">
          <textarea
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            rows={3}
            className="form-input resize-none"
            placeholder="Lead the frontend architecture&#10;Mentor junior engineers&#10;Review code"
          />
        </Field>

        <Field label="Requirements (one per line)">
          <textarea
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            rows={3}
            className="form-input resize-none"
            placeholder="5+ years React experience&#10;Strong TypeScript&#10;Next.js knowledge"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nice to have (one per line)">
            <textarea
              value={form.niceToHave}
              onChange={(e) => setForm({ ...form, niceToHave: e.target.value })}
              rows={3}
              className="form-input resize-none"
              placeholder="Design system experience&#10;Open source contributions"
            />
          </Field>
          <Field label="Benefits (one per line)">
            <textarea
              value={form.benefits}
              onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              rows={3}
              className="form-input resize-none"
              placeholder="Health insurance&#10;Flexible hours&#10;Learning budget"
            />
          </Field>
        </div>

        <Field label={mode === "upload" ? "Additional notes (optional)" : "Job description *"}>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={mode === "upload" ? 3 : 6}
            className="form-input resize-none"
            placeholder={
              mode === "upload"
                ? "Any extra details about the role..."
                : "Describe the role, responsibilities, and requirements..."
            }
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? (
            "Posting..."
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Post Job
            </>
          )}
        </button>
      </motion.form>
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
