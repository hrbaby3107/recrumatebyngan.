/** RecruMate mark: a soft clay tile with a blush dot. */
export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white shadow-clay ${className}`}
      aria-hidden="true"
    >
      R
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blush-300 ring-2 ring-white dark:ring-slate-900" />
    </span>
  );
}
