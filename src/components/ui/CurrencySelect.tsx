import { useMemo } from "react";
import SearchableSelect, { type SelectOption } from "./SearchableSelect";
import {
  currencyKeywords,
  getCurrencies,
  groupDigits,
  POPULAR_CURRENCY_CODES,
} from "../../lib/currencies";

export function CurrencySelect({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}) {
  const options: SelectOption[] = useMemo(
    () =>
      getCurrencies().map((c) => ({
        value: c.code,
        label: `${c.code} — ${c.name}`,
        short: `${c.symbol === c.code ? "" : c.symbol + " "}${c.code}`,
        hint: c.symbol === c.code ? undefined : c.symbol,
        group: POPULAR_CURRENCY_CODES.includes(c.code)
          ? "Popular"
          : "All currencies",
        keywords: currencyKeywords(c.code),
      })),
    []
  );

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      searchPlaceholder="Search currency (VND, USD, yen...)"
      emptyText="No currency found"
      className={className}
      panelClassName="min-w-[20rem]"
    />
  );
}

/** Number input that shows thousands separators. `value` is raw digits. */
export function MoneyInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={groupDigits(value)}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 15))}
      placeholder={placeholder}
      className={`form-input ${className}`}
    />
  );
}
