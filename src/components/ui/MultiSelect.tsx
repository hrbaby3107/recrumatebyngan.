import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, X } from "lucide-react";
import { normalizeText, type SelectOption } from "./SearchableSelect";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: ReactNode;
  /** Let people type something that is not in the list and add it as a tag. */
  allowCustom?: boolean;
  emptyText?: string;
}

interface Item extends SelectOption {
  isCustom?: boolean;
}

export default function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon,
  allowCustom = false,
  emptyText = "No results",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const cleaned = query.trim().replace(/,/g, " ").replace(/\s+/g, " ").trim();

  const items: Item[] = useMemo(() => {
    const q = normalizeText(cleaned);
    const base: Item[] = q
      ? options.filter((o) =>
          normalizeText(`${o.value} ${o.label} ${o.keywords ?? ""}`).includes(q)
        )
      : options;
    const exists =
      options.some((o) => normalizeText(o.value) === q) ||
      value.some((v) => normalizeText(v) === q);
    if (allowCustom && cleaned && !exists) {
      return [...base, { value: cleaned, label: `Add "${cleaned}"`, isCustom: true }];
    }
    return base;
  }, [options, cleaned, allowCustom, value]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const toggle = (item: Item) => {
    const has = value.some((v) => v.toLowerCase() === item.value.toLowerCase());
    onChange(
      has
        ? value.filter((v) => v.toLowerCase() !== item.value.toLowerCase())
        : [...value, item.value]
    );
    setQuery("");
    inputRef.current?.focus();
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault(); // never submit the surrounding form
      if (open && items[active]) toggle(items[active]);
    } else if (e.key === ",") {
      e.preventDefault();
      if (allowCustom && cleaned) {
        const custom = items.find((i) => i.isCustom);
        if (custom) toggle(custom);
      }
    } else if (e.key === "Backspace" && !query && value.length > 0) {
      remove(value[value.length - 1]);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className={`form-input flex min-h-[2.75rem] cursor-text flex-wrap items-center gap-1.5 !py-1.5 ${
          icon ? "pl-9" : ""
        } ${open ? "!border-brand-400 ring-2 ring-brand-100 dark:ring-brand-900/40" : ""}`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-brand-50 py-1 pl-2 pr-1 text-xs font-semibold text-brand-700 dark:bg-brand-600/20 dark:text-brand-300"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(tag);
              }}
              className="rounded p-0.5 hover:bg-brand-100 dark:hover:bg-brand-600/30"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? placeholder : "Add more..."}
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200"
        />
      </div>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-[1.3rem] -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}

      {open && (
        <div className="absolute left-0 z-40 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
          <div ref={listRef} role="listbox" aria-multiselectable className="max-h-72 overflow-y-auto py-1">
            {items.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-slate-400">{emptyText}</p>
            )}
            {items.map((item, i) => {
              const selected =
                !item.isCustom &&
                value.some((v) => v.toLowerCase() === item.value.toLowerCase());
              const showGroup =
                item.group && (i === 0 || items[i - 1].group !== item.group);
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
                    aria-selected={selected}
                    data-index={i}
                    onClick={() => toggle(item)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ${
                      i === active
                        ? "bg-brand-50 dark:bg-brand-600/20"
                        : ""
                    } ${item.isCustom ? "font-medium text-brand-700 dark:text-brand-300" : "text-slate-700 dark:text-slate-200"}`}
                  >
                    {!item.isCustom && (
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-xs text-slate-400 dark:border-slate-800">
            <span>{value.length} selected</span>
            <div className="flex items-center gap-3">
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="font-medium text-slate-500 hover:text-red-600"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
