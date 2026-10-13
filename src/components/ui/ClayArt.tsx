// Lightweight "pastel 3D clay" illustrations drawn with SVG gradients.
// Purely decorative: every graphic is aria-hidden.
import type { CSSProperties } from "react";

interface ArtProps {
  className?: string;
  style?: CSSProperties;
}

const PINK = ["#fbe6ee", "#f8dde7", "#e2afc4"] as const;
const GREEN = ["#e6f1e6", "#b9d3b3", "#7f9f86"] as const;

function Grad({ id, c }: { id: string; c: readonly [string, string, string] }) {
  return (
    <radialGradient id={id} cx="30%" cy="22%" r="85%">
      <stop offset="0" stopColor="#fff" stopOpacity=".85" />
      <stop offset=".35" stopColor={c[0]} />
      <stop offset=".72" stopColor={c[1]} />
      <stop offset="1" stopColor={c[2]} />
    </radialGradient>
  );
}

function Shadow({ id, cx = 60, cy = 110, rx = 30 }: { id: string; cx?: number; cy?: number; rx?: number }) {
  return (
    <>
      <defs>
        <filter id={id} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry="6" fill="#64816b" opacity=".28" filter={`url(#${id})`} />
    </>
  );
}

const svgProps = { viewBox: "0 0 120 120", "aria-hidden": true, focusable: false } as const;

export function ClayCv({ className = "", style }: ArtProps) {
  return (
    <svg {...svgProps} className={className} style={style}>
      <defs>
        <Grad id="cv-pink" c={PINK} />
        <Grad id="cv-green" c={GREEN} />
      </defs>
      <Shadow id="cv-blur" />
      <g transform="rotate(-6 60 60)">
        <rect x="26" y="12" width="68" height="90" rx="16" fill="url(#cv-pink)" />
        <rect x="26" y="12" width="68" height="90" rx="16" fill="none" stroke="#fff" strokeOpacity=".65" strokeWidth="2" />
        <circle cx="60" cy="38" r="11" fill="url(#cv-green)" />
        <rect x="40" y="58" width="40" height="6" rx="3" fill="#fff" fillOpacity=".9" />
        <rect x="40" y="70" width="32" height="6" rx="3" fill="#fff" fillOpacity=".75" />
        <rect x="40" y="82" width="24" height="6" rx="3" fill="#fff" fillOpacity=".6" />
      </g>
      <circle cx="90" cy="90" r="14" fill="url(#cv-green)" />
      <path d="M83.5 90.5l4.5 4.5 8.5-10" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function ClayMagnifier({ className = "", style }: ArtProps) {
  return (
    <svg {...svgProps} className={className} style={style}>
      <defs>
        <Grad id="mg-pink" c={PINK} />
        <Grad id="mg-green" c={GREEN} />
      </defs>
      <Shadow id="mg-blur" cx={64} cy={112} rx={34} />
      <rect x="75" y="62" width="15" height="44" rx="7.5" transform="rotate(-45 82.5 84)" fill="url(#mg-green)" />
      <circle cx="50" cy="48" r="28" fill="#fff" fillOpacity=".5" />
      <circle cx="50" cy="48" r="28" fill="none" stroke="url(#mg-pink)" strokeWidth="13" />
      <path d="M33 38a20 20 0 0 1 14-10" stroke="#fff" strokeOpacity=".9" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ClayFolder({ className = "", style }: ArtProps) {
  return (
    <svg {...svgProps} className={className} style={style}>
      <defs>
        <Grad id="fd-pink" c={PINK} />
        <Grad id="fd-green" c={GREEN} />
      </defs>
      <Shadow id="fd-blur" cy={108} rx={40} />
      <path d="M14 42a12 12 0 0 1 12-12h24l10 10h34a12 12 0 0 1 12 12v8H14z" fill="url(#fd-green)" />
      <rect x="24" y="32" width="72" height="42" rx="8" fill="#fff9f2" transform="rotate(-3 60 52)" />
      <rect x="14" y="52" width="92" height="50" rx="14" fill="url(#fd-pink)" />
      <rect x="14" y="52" width="92" height="50" rx="14" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
    </svg>
  );
}

export function ClayProfile({ className = "", style }: ArtProps) {
  return (
    <svg {...svgProps} className={className} style={style}>
      <defs>
        <Grad id="pf-pink" c={PINK} />
        <Grad id="pf-green" c={GREEN} />
      </defs>
      <Shadow id="pf-blur" cy={110} rx={32} />
      <path d="M22 106c0-27 18-40 38-40s38 13 38 40z" fill="url(#pf-green)" />
      <circle cx="60" cy="40" r="20" fill="url(#pf-pink)" />
      <circle cx="60" cy="40" r="20" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
    </svg>
  );
}

export function ClayLeaf({ className = "", style }: ArtProps) {
  return (
    <svg {...svgProps} className={className} style={style}>
      <defs>
        <Grad id="lf-green" c={GREEN} />
        <Grad id="lf-pink" c={PINK} />
      </defs>
      <Shadow id="lf-blur" cy={112} rx={26} />
      <path d="M60 108V36" stroke="#7f9f86" strokeWidth="5" strokeLinecap="round" />
      <path d="M58 100C26 92 16 58 34 36c22 8 32 38 24 64z" fill="url(#lf-green)" />
      <path d="M62 88c28-6 36-32 24-50-16 6-26 28-24 50z" fill="url(#lf-green)" opacity=".92" />
      <g transform="translate(60 26)">
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx="0" cy="-9" r="8" fill="url(#lf-pink)" transform={`rotate(${a})`} />
        ))}
        <circle r="5.5" fill="#fff9f2" />
      </g>
    </svg>
  );
}

export function ClayBlob({
  tone = "pink",
  className = "",
  style,
}: {
  tone?: "pink" | "green" | "cream";
  className?: string;
  style?: CSSProperties;
}) {
  const c =
    tone === "pink"
      ? { "--c1": "#f8dde7", "--c2": "#e8b9cb" }
      : tone === "green"
        ? { "--c1": "#cfe3cc", "--c2": "#9dbb9a" }
        : { "--c1": "#fff9f2", "--c2": "#eadfcf" };
  return (
    <div
      aria-hidden="true"
      className={`clay-blob rounded-[45%_55%_60%_40%/55%_45%_55%_45%] ${className}`}
      style={{ ...(c as CSSProperties), ...style }}
    />
  );
}
