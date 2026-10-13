import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  /** Text shown in the closed field (defaults to label). */
  short?: string;
  /** Small right-aligned text in the list (e.g. currency symbol). */
  hint?: string;
  group?: string;
  /** Extra searchable text. */
  keywords?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  icon?: ReactNode;
  /** Let people type a value that is not in the list. */
  allowCustom?: boolean;
  customLabel?: (query: string) => string;
  emptyText?: string;
  className?: string;
  panelClassName?: string;
}

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

interface Item extends SelectOption {
  isCustom?: boolean;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  icon,
  allowCustom = false,
  customLabel,
  emptyText = "No results",
  className = "",
  panelClassName = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const items: Item[] = useMemo(() => {
    const q = normalizeText(query.trim());
    const filtered: Item[] = q
      ? options.filter((o) =>
          normalizeText(`${o.value} ${o.label} ${o.keywords ?? ""}`).includes(q)
        )
      : options;
    const raw = query.trim();
    if (
      allowCustom &&
      raw &&
      !options.some((o) => normalizeText(o.value) === q)
    ) {
      return [
        ...filtered,
        {
          value: raw,
          label: customLabel ? customLabel(raw) : `Use "${raw}"`,
          isCustom: true,
        },
      ];
    }
    return filtered;
  }, [options, query, allowCustom, customLabel]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // wait for the panel to mount
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (item: Item) => {
    onChange(item.value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault(); // never submit the surrounding form
      if (items[active]) choose(items[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const triggerText = selected ? selected.short ?? selected.label : value;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`form-input flex items-center justify-between gap-2 text-left ${
          icon ? "pl-9" : ""
        }`}
      >
        <span
          className={`truncate ${
            triggerText ? "" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {triggerText || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}

      {open && (
        <div
          className={`absolute left-0 z-40 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 ${panelClassName}`}
        >
          <div className="relative border-b border-slate-100 dark:border-slate-800">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200"
            />
          </div>
          <div ref={listRef} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {items.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-slate-400">
                {emptyText}
              </p>
            )}
            {items.map((item, i) => {
              const showGroup =
                item.group && (i === 0 || items[i - 1].group !== item.group);
              const isSelected = item.value === value && !item.isCustom;
              return (
                <div key={`${item.group ?? ""}-${item.value}-${i}`}>
                  {showGroup && (
                    <p className="px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {item.group}
                    </p>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-index={i}
                    onClick={() => choose(item)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                      i === active
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300"
                        : "text-slate-700 dark:text-slate-200"
                    } ${item.isCustom ? "font-medium" : ""}`}
                  >
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.hint && (
                      <span className="shrink-0 text-xs text-slate-400">
                        {item.hint}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-brand-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
