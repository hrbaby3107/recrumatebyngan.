export type WorkMode = "Remote" | "Office" | "Hybrid";
export type JobStatus = "Open" | "Closed";
export type JobTag = "Urgent" | "Hot";
export type ExperienceLevel = "Junior" | "Middle" | "Senior" | "Lead";
export type ContractType = "Full-time" | "Part-time" | "Contract" | "Freelance";
export type EnglishLevel = "Basic" | "Intermediate" | "Good" | "Fluent";
export type Stage =
  | "New"
  | "Contacted"
  | "Interview"
  | "Offer"
  | "Hired";

export interface CvFile {
  name: string;
  /** Object URL pointing at the uploaded file (lives for the browser session). */
  url: string;
  type: string;
  size: number;
}

export interface JobNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  salaryRange: string;
  salaryCurrency?: string;
  salaryMin?: number;
  salaryMax?: number;
  techStack: string[];
  status: JobStatus;
  description: string;
  postedDaysAgo: number;
  tags: JobTag[];
  notes: JobNote[];
  experience: ExperienceLevel;
  contractType: ContractType;
  englishLevel: EnglishLevel;
  domain: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  cvFileName?: string;
  cvFile?: CvFile;
  cvUpdatedAt?: string;
  birthYear?: number;
  residence?: string;
  salaryExpectation?: string;
  salaryMin?: string;
  currentPosition: string;
  yearsOfExp: number;
  techStack: string[];
  stage: Stage;
  jobId?: string;
  notes: CandidateNote[];
  activity: ActivityEntry[];
  appliedAt: string;
  avatarColor: string;
}

export interface CandidateNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  type: "applied" | "stage_changed" | "note_added" | "contacted";
  message: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  appliedAt: string;
}
