export interface RecruiterProfile {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  facebook: string;
  signature: string;
  /** Small JPEG data URL, empty when no avatar was chosen. */
  avatar: string;
}

export const DEFAULT_PROFILE: RecruiterProfile = {
  name: "Kylie (Ngan)",
  jobTitle: "IT Headhunter & Talent Acquisition",
  email: "ngan.tran4@reco-vn.com",
  phone: "0776 931 508",
  linkedin: "https://linkedin.com/in/kylie-ngan",
  facebook: "https://facebook.com/kylie.ngan",
  signature:
    "Best regards,\nKylie (Ngan)\nIT Headhunter | RecruMate\nZalo: 0776 931 508",
  avatar: "",
};

/** "Kylie (Ngan)" -> "Ngan", "Nguyen Van A" -> "Nguyen" */
export function displayFirstName(name: string): string {
  const inParens = name.match(/\(([^)]+)\)/);
  if (inParens) return inParens[1].trim();
  return name.trim().split(/\s+/)[0] || "there";
}

export function initialOf(name: string): string {
  return (name.trim()[0] ?? "?").toUpperCase();
}
