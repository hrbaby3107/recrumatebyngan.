import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Job, Candidate, CvFile, Stage, ActivityEntry, CandidateNote, JobTag, JobNote, ExperienceLevel, ContractType, EnglishLevel } from "../types";
import { initialJobs, initialCandidates } from "../data/mockData";
import { loadJSON, saveJSON } from "../lib/storage";
import {
  DEFAULT_APPEARANCE,
  applyAppearance,
  sanitizeAppearance,
  type Appearance,
} from "../lib/theme";
import { DEFAULT_PROFILE, type RecruiterProfile } from "../lib/profile";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface ApplyFormValues {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  facebookUrl: string;
  cvFileName: string;
  cvFile?: CvFile | null;
  techStack: string;
  birthYear: string;
  residence: string;
  salaryExpectation: string;
  salaryMin: string;
  jobId: string;
}

interface JobFormValues {
  title: string;
  company: string;
  location: string;
  workMode: Job["workMode"];
  salaryRange: string;
  salaryCurrency?: string;
  salaryMin?: number;
  salaryMax?: number;
  techStack: string;
  description: string;
  tags: JobTag[];
  experience: ExperienceLevel;
  contractType: ContractType;
  englishLevel: EnglishLevel;
  domain: string;
  responsibilities: string;
  requirements: string;
  niceToHave: string;
  benefits: string;
}

interface AppContextValue {
  jobs: Job[];
  candidates: Candidate[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  appearance: Appearance;
  updateAppearance: (patch: Partial<Appearance>) => void;
  resetAppearance: () => void;
  profile: RecruiterProfile;
  updateProfile: (patch: Partial<RecruiterProfile>) => void;
  toasts: Toast[];
  pushToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
  applyToJob: (values: ApplyFormValues) => Candidate;
  addJob: (values: JobFormValues) => Job;
  deleteJob: (jobId: string) => void;
  toggleJobTag: (jobId: string, tag: JobTag) => void;
  addJobNote: (jobId: string, text: string) => void;
  moveCandidateStage: (candidateId: string, newStage: Stage) => void;
  addNote: (candidateId: string, text: string) => void;
  updateCV: (email: string, cv: CvFile | string) => Candidate | null;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  getJob: (jobId?: string) => Job | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const avatarColors = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-cyan-500",
  "bg-orange-500",
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("recrumate-dark") === "1";
    } catch {
      return false;
    }
  });
  const [appearance, setAppearance] = useState<Appearance>(() =>
    sanitizeAppearance(loadJSON("recrumate-appearance-v2", DEFAULT_APPEARANCE))
  );
  const [profile, setProfile] = useState<RecruiterProfile>(() =>
    loadJSON("recrumate-profile", DEFAULT_PROFILE)
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("recrumate-dark", darkMode ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [darkMode]);

  // Appearance changes apply instantly (CSS variables on <html>) and are remembered.
  useEffect(() => {
    applyAppearance(appearance);
    saveJSON("recrumate-appearance-v2", appearance);
  }, [appearance]);

  useEffect(() => {
    saveJSON("recrumate-profile", profile);
  }, [profile]);

  const updateAppearance = (patch: Partial<Appearance>) =>
    setAppearance((prev) => sanitizeAppearance({ ...prev, ...patch }));
  const resetAppearance = () => {
    setAppearance(DEFAULT_APPEARANCE);
    setDarkMode(false);
  };
  const updateProfile = (patch: Partial<RecruiterProfile>) =>
    setProfile((prev) => ({ ...prev, ...patch }));
  const pushToast: AppContextValue["pushToast"] = (message, type = "success") => {
    const id = uid("toast");
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => setDarkMode((v) => !v);

  const getJob = (jobId?: string) => jobs.find((j) => j.id === jobId);

  const applyToJob: AppContextValue["applyToJob"] = (values) => {
    const job = jobs.find((j) => j.id === values.jobId);
    const now = new Date().toISOString();
    const newCandidate: Candidate = {
      id: uid("cand"),
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      linkedinUrl: values.linkedinUrl || undefined,
      facebookUrl: values.facebookUrl || undefined,
      cvFileName: values.cvFile?.name ?? (values.cvFileName || undefined),
      cvFile: values.cvFile ?? undefined,
      birthYear: values.birthYear ? Number(values.birthYear) : undefined,
      residence: values.residence || undefined,
      salaryExpectation: values.salaryExpectation || undefined,
      salaryMin: values.salaryMin || undefined,
      currentPosition: "Applicant",
      yearsOfExp: 0,
      techStack: values.techStack
        ? values.techStack.split(",").map((t) => t.trim()).filter(Boolean)
        : job
        ? [...job.techStack]
        : [],
      stage: "New",
      jobId: values.jobId,
      notes: [],
      activity: [
        {
          id: uid("a"),
          type: "applied",
          message: `Applied to ${job?.title ?? "a job"}`,
          createdAt: now,
        },
      ],
      appliedAt: now,
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    };
    setCandidates((prev) => [newCandidate, ...prev]);
    return newCandidate;
  };

  const addJob: AppContextValue["addJob"] = (values) => {
    const newJob: Job = {
      id: uid("job"),
      title: values.title,
      company: values.company,
      location: values.location,
      workMode: values.workMode,
      salaryRange: values.salaryRange,
      salaryCurrency: values.salaryCurrency,
      salaryMin: values.salaryMin,
      salaryMax: values.salaryMax,
      techStack: values.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: "Open",
      description: values.description,
      postedDaysAgo: 0,
      tags: values.tags || [],
      notes: [],
      experience: values.experience || "Middle",
      contractType: values.contractType || "Full-time",
      englishLevel: values.englishLevel || "Good",
      domain: values.domain || "General",
      responsibilities: values.responsibilities
        ? values.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      requirements: values.requirements
        ? values.requirements.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      niceToHave: values.niceToHave
        ? values.niceToHave.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      benefits: values.benefits
        ? values.benefits.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const deleteJob: AppContextValue["deleteJob"] = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const toggleJobTag: AppContextValue["toggleJobTag"] = (jobId, tag) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const has = j.tags.includes(tag);
        return {
          ...j,
          tags: has ? j.tags.filter((t) => t !== tag) : [...j.tags, tag],
        };
      })
    );
  };

  const addJobNote: AppContextValue["addJobNote"] = (jobId, text) => {
    const note: JobNote = {
      id: uid("jn"),
      text,
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, notes: [note, ...j.notes] } : j
      )
    );
  };

  const moveCandidateStage: AppContextValue["moveCandidateStage"] = (
    candidateId,
    newStage
  ) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        if (c.stage === newStage) return c;
        const entry: ActivityEntry = {
          id: uid("a"),
          type: newStage === "Contacted" ? "contacted" : "stage_changed",
          message: `Moved to ${newStage} stage`,
          createdAt: new Date().toISOString(),
        };
        return { ...c, stage: newStage, activity: [...c.activity, entry] };
      })
    );
  };

  const addNote: AppContextValue["addNote"] = (candidateId, text) => {
    const note: CandidateNote = {
      id: uid("note"),
      text,
      createdAt: new Date().toISOString(),
    };
    const entry: ActivityEntry = {
      id: uid("a"),
      type: "note_added",
      message: "Note added",
      createdAt: note.createdAt,
    };
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, notes: [note, ...c.notes], activity: [...c.activity, entry] }
          : c
      )
    );
  };

  const updateCV: AppContextValue["updateCV"] = (email, cv) => {
    const cvFile = typeof cv === "string" ? undefined : cv;
    const cvFileName = typeof cv === "string" ? cv : cv.name;
    const now = new Date().toISOString();
    let updated: Candidate | null = null;
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.email.toLowerCase() !== email.toLowerCase()) return c;
        const entry: ActivityEntry = {
          id: uid("a"),
          type: "note_added",
          message: "CV updated",
          createdAt: now,
        };
        updated = {
          ...c,
          cvFileName,
          cvFile,
          cvUpdatedAt: now,
          activity: [...c.activity, entry],
        };
        return updated;
      })
    );
    return updated;
  };

  const toggleSaveJob: AppContextValue["toggleSaveJob"] = (jobId) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const isJobSaved: AppContextValue["isJobSaved"] = (jobId) =>
    savedJobIds.includes(jobId);

  const value = useMemo<AppContextValue>(
    () => ({
      jobs,
      candidates,
      darkMode,
      toggleDarkMode,
      setDarkMode,
      appearance,
      updateAppearance,
      resetAppearance,
      profile,
      updateProfile,
      toasts,
      pushToast,
      dismissToast,
      applyToJob,
      addJob,
      deleteJob,
      toggleJobTag,
      addJobNote,
      moveCandidateStage,
      addNote,
      updateCV,
      savedJobIds,
      toggleSaveJob,
      isJobSaved,
      getJob,
    }),
    [jobs, candidates, darkMode, appearance, profile, toasts, savedJobIds]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
