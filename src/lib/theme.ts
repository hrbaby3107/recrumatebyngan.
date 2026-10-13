export type AccentId = "clay" | "pink" | "blue" | "green" | "orange" | "teal";
export type Density = "Compact" | "Comfortable";

export const ACCENTS: { id: AccentId; label: string; swatch: string }[] = [
  { id: "clay", label: "Clay (Sage & Blush)", swatch: "#55705c" },
  { id: "pink", label: "Pink / Magenta", swatch: "#db2777" },
  { id: "blue", label: "Blue", swatch: "#2563eb" },
  { id: "green", label: "Green", swatch: "#16a34a" },
  { id: "orange", label: "Orange", swatch: "#ea580c" },
  { id: "teal", label: "Teal", swatch: "#0d9488" },
];

export interface Appearance {
  accent: AccentId;
  density: Density;
  language: string;
  dateFormat: string;
  timeZone: string;
}

export const DEFAULT_APPEARANCE: Appearance = {
  accent: "clay",
  density: "Comfortable",
  language: "English",
  dateFormat: "DD/MM/YYYY",
  timeZone: "Asia/Ho_Chi_Minh (GMT+7)",
};

export function sanitizeAppearance(a: Appearance): Appearance {
  return {
    ...a,
    accent: ACCENTS.some((x) => x.id === a.accent) ? a.accent : "clay",
    density: a.density === "Compact" ? "Compact" : "Comfortable",
  };
}

export function applyAppearance(a: Appearance) {
  const root = document.documentElement;
  root.setAttribute("data-accent", a.accent);
  root.setAttribute("data-density", a.density.toLowerCase());
}
