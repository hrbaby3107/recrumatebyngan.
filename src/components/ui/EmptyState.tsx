import type { ReactNode } from "react";
import { ClayCv, ClayFolder, ClayLeaf, ClayMagnifier, ClayProfile } from "./ClayArt";

const ART = {
  cv: ClayCv,
  folder: ClayFolder,
  leaf: ClayLeaf,
  magnifier: ClayMagnifier,
  profile: ClayProfile,
};

export default function EmptyState({
  art = "folder",
  title,
  description,
  action,
}: {
  art?: keyof typeof ART;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const Art = ART[art];
  return (
    <div className="rounded-2xl border border-dashed border-brand-200 bg-white/70 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <Art className="mx-auto h-28 w-28" />
      <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
