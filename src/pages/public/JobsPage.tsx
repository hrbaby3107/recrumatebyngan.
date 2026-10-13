import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  X,
  Zap,
  Flame,
  Clock,
  Globe,
  Heart,
  ArrowRight,
  Users,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useApp } from "../../store/AppContext";
import type { WorkMode, ExperienceLevel, ContractType, EnglishLevel, Job } from "../../types";
import { ClayMagnifier } from "../../components/ui/ClayArt";
import { toUsdApprox } from "../../lib/currencies";

const salaryRanges = [
  "All",
  "Under $1,000",
  "$1,000–$2,000",
  "$2,000–$3,000",
  "$3,000+",
  "Negotiable",
];

const englishLevels: (EnglishLevel | "All")[] = ["All", "Basic", "Intermediate", "Good", "Fluent"];
const sortOptions = ["Most Recent", "Relevance", "Salary: High → Low", "Salary: Low → High"];

export default function JobsPage() {
  const { jobs, toggleSaveJob, isJobSaved, pushToast } = useApp();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [mode, setMode] = useState<WorkMode | "All">("All");
  const [experience, setExperience] = useState<ExperienceLevel | "All">("All");
  const [contract, setContract] = useState<ContractType | "All">("All");
  const [domain, setDomain] = useState("All");
  const [english, setEnglish] = useState<EnglishLevel | "All">("All");
  const [salaryRange, setSalaryRange] = useState("All");
  const [sortBy, setSortBy] = useState("Most Recent");

  const openJobs = useMemo(() => jobs.filter((j) => j.status === "Open"), [jobs]);

  const locations = useMemo(
    () => ["All", ...Array.from(new Set(openJobs.map((j) => j.location)))],
    [openJobs]
  );
  const domains = useMemo(
    () => ["All", ...Array.from(new Set(openJobs.map((j) => j.domain)))],
    [openJobs]
  );

  const filtered = useMemo(() => {
    let result = openJobs.filter((j) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.techStack.some((t) => t.toLowerCase().includes(q)) ||
        j.domain.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      const matchesLocation = location === "All" || j.location === location;
      const matchesMode = mode === "All" || j.workMode === mode;
      const matchesExp = experience === "All" || j.experience === experience;
      const matchesContract = contract === "All" || j.contractType === contract;
      const matchesDomain = domain === "All" || j.domain === domain;
      const matchesEnglish = english === "All" || j.englishLevel === english;
      return matchesQuery && matchesLocation && matchesMode && matchesExp && matchesContract && matchesDomain && matchesEnglish;
    });

    if (sortBy === "Most Recent") {
      result = [...result].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (sortBy === "Salary: High → Low") {
      result = [...result].sort((a, b) => jobSalaryScore(b) - jobSalaryScore(a));
    } else if (sortBy === "Salary: Low → High") {
      result = [...result].sort((a, b) => jobSalaryScore(a) - jobSalaryScore(b));
    }

    return result;
  }, [openJobs, query, location, mode, experience, contract, domain, english, sortBy]);

  const hasFilters = query || location !== "All" || mode !== "All" || experience !== "All" || contract !== "All" || domain !== "All" || english !== "All" || salaryRange !== "All";

  const clearFilters = () => {
    setQuery(""); setLocation("All"); setMode("All"); setExperience("All");
    setContract("All"); setDomain("All"); setEnglish("All"); setSalaryRange("All");
  };

  const handleSave = (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(jobId);
    pushToast(isJobSaved(jobId) ? "Job removed from saved." : "Job saved! You can find it in your saved jobs.", "success");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Open Positions
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {openJobs.length} {openJobs.length === 1 ? "opportunity" : "opportunities"} available
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by job title, skill, company, or keyword..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-brand-900/40"
        />
      </div>

      {/* Filters row */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <FilterSelect label="Location" value={location} onChange={setLocation} options={locations} />
        <FilterSelect label="Work Mode" value={mode} onChange={(v) => setMode(v as WorkMode | "All")} options={["All", "Remote", "Hybrid", "Office"]} />
        <FilterSelect label="Experience" value={experience} onChange={(v) => setExperience(v as ExperienceLevel | "All")} options={["All", "Junior", "Middle", "Senior", "Lead"]} />
        <FilterSelect label="Employment" value={contract} onChange={(v) => setContract(v as ContractType | "All")} options={["All", "Full-time", "Part-time", "Contract", "Freelance"]} />
        <FilterSelect label="Domain" value={domain} onChange={setDomain} options={domains} />
        <FilterSelect label="English" value={english} onChange={(v) => setEnglish(v as EnglishLevel | "All")} options={englishLevels} />
        <FilterSelect label="Salary" value={salaryRange} onChange={setSalaryRange} options={salaryRanges} />

        <div className="ml-auto">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 focus:border-brand-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {sortOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <X className="h-4 w-4" /> Clear filters
        </button>
      )}

      {/* Job cards or empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <ClayMagnifier className="mx-auto h-28 w-28" />
          <h3 className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-300">No jobs found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We couldn't find any opportunities matching your search.
          </p>
          <button onClick={clearFilters} className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            Clear Filters
          </button>
          <p className="mt-4 text-sm text-slate-400">Or join our Talent Pool to hear about future opportunities.</p>
          <Link to="/talent-pool" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
            Join Talent Pool <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to={`/jobs/${job.id}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                      {job.tags.includes("Urgent") && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          <Zap className="h-2.5 w-2.5" /> Urgent
                        </span>
                      )}
                      {job.tags.includes("Hot") && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                          <Flame className="h-2.5 w-2.5" /> Hot
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    job.workMode === "Remote" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : job.workMode === "Hybrid" ? "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                  }`}>
                    {job.workMode}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> {job.salaryRange}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {job.experience} · {job.contractType}</span>
                  <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {job.domain} · English: {job.englishLevel}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t}</span>
                  ))}
                  {job.techStack.length > 3 && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500">+{job.techStack.length - 3}</span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <p className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Clock className="h-3 w-3" /> Posted {job.postedDaysAgo}d ago
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleSave(job.id, e)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
                        isJobSaved(job.id)
                          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isJobSaved(job.id) ? "fill-current" : ""}`} />
                      {isJobSaved(job.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Comparable (approx. USD) salary so jobs in different currencies sort sensibly. */
function jobSalaryScore(job: Job): number {
  const amount = job.salaryMax ?? job.salaryMin;
  if (amount && job.salaryCurrency) return toUsdApprox(amount, job.salaryCurrency);
  return extractSalary(job.salaryRange);
}

function extractSalary(range: string): number {
  const match = range.match(/\$?([\d,]+)/);
  if (!match) return 0;
  return parseInt(match[1].replace(/,/g, ""), 10);
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-brand-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "All" ? `All ${label.toLowerCase()}` : o}
        </option>
      ))}
    </select>
  );
}
