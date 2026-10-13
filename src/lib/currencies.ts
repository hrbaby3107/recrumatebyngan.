export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

/** Shown first in the dropdown. */
export const POPULAR_CURRENCY_CODES = [
  "VND", "USD", "EUR", "GBP", "JPY", "KRW", "THB", "SGD", "CAD", "AUD",
  "CNY", "HKD", "TWD", "MYR", "IDR", "PHP", "INR",
];

// Used only when the browser has no Intl.supportedValuesOf.
const FALLBACK_CODES = [
  ...POPULAR_CURRENCY_CODES,
  "NZD", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "TRY", "RUB",
  "UAH", "AED", "SAR", "QAR", "KWD", "ILS", "EGP", "ZAR", "NGN", "KES", "MAD",
  "BRL", "ARS", "CLP", "COP", "MXN", "PEN", "KHR", "LAK", "MMK", "BDT", "PKR",
  "LKR", "NPR", "MNT", "KZT",
];

// Extra search keywords (Vietnamese names) for popular currencies.
const VI_KEYWORDS: Record<string, string> = {
  VND: "dong viet nam dong",
  USD: "do la my dola my",
  EUR: "euro chau au",
  GBP: "bang anh",
  JPY: "yen nhat",
  KRW: "won han quoc",
  THB: "bat thai lan",
  SGD: "do la singapore",
  CAD: "do la canada",
  AUD: "do la uc",
  CNY: "nhan dan te yuan trung quoc",
  HKD: "do la hong kong",
  TWD: "do la dai loan",
};

export function currencyKeywords(code: string): string {
  return VI_KEYWORDS[code] ?? "";
}

function symbolFor(code: string): string {
  try {
    const part = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((p) => p.type === "currency");
    return part?.value ?? code;
  } catch {
    return code;
  }
}

function nameFor(code: string, dn: Intl.DisplayNames | null): string {
  try {
    return dn?.of(code) ?? code;
  } catch {
    return code;
  }
}

let cache: CurrencyOption[] | null = null;

/** Every ISO 4217 currency the browser knows about (popular ones first). */
export function getCurrencies(): CurrencyOption[] {
  if (cache) return cache;

  let codes: string[] = FALLBACK_CODES;
  try {
    const intl = Intl as unknown as {
      supportedValuesOf?: (key: string) => string[];
    };
    const all = intl.supportedValuesOf?.("currency");
    if (all && all.length > 0) codes = all;
  } catch {
    /* use fallback */
  }

  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames(["en"], { type: "currency" });
  } catch {
    dn = null;
  }

  const unique = Array.from(new Set([...POPULAR_CURRENCY_CODES, ...codes]));
  const list = unique.map((code) => ({
    code,
    name: nameFor(code, dn),
    symbol: symbolFor(code),
  }));
  const popular = POPULAR_CURRENCY_CODES.map((c) => list.find((x) => x.code === c)!);
  const rest = list
    .filter((x) => !POPULAR_CURRENCY_CODES.includes(x.code))
    .sort((a, b) => a.code.localeCompare(b.code));
  cache = [...popular, ...rest];
  return cache;
}

export function formatMoney(amount: number, code: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString("en-US")}`;
  }
}

export function formatSalaryRange(
  code: string,
  min?: number,
  max?: number
): string {
  if (!min && !max) return "Negotiable";
  if (min && max) return `${formatMoney(min, code)} - ${formatMoney(max, code)}`;
  if (min) return `From ${formatMoney(min, code)}`;
  return `Up to ${formatMoney(max as number, code)}`;
}

/** "25000000" -> "25,000,000" */
export function groupDigits(raw: string): string {
  if (!raw) return "";
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Rough rates, ONLY used to order jobs by salary across currencies.
const USD_PER_UNIT: Record<string, number> = {
  USD: 1, EUR: 1.08, GBP: 1.27, JPY: 0.0067, KRW: 0.00072, VND: 0.000039,
  THB: 0.028, SGD: 0.74, CAD: 0.73, AUD: 0.65, CNY: 0.14, HKD: 0.128,
  TWD: 0.031, MYR: 0.22, IDR: 0.000062, PHP: 0.017, INR: 0.012, NZD: 0.6,
  CHF: 1.12, SEK: 0.095, NOK: 0.093, DKK: 0.145, AED: 0.272, SAR: 0.267,
};

export function toUsdApprox(amount: number, code: string): number {
  return amount * (USD_PER_UNIT[code] ?? 0);
}
