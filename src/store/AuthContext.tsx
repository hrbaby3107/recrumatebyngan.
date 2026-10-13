import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// NOTE: this is a front-end only gate. It hides admin screens and blocks admin
// routes in the browser, but the PIN ships inside the JavaScript bundle, so it
// is NOT real security. Real protection needs a backend (e.g. Supabase Auth).
const ADMIN_PIN = "077693";
const SESSION_KEY = "recrumate-admin-session";
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours

function readExpiry(): number {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return 0;
    const exp = Number(JSON.parse(raw).exp);
    return Number.isFinite(exp) && exp > Date.now() ? exp : 0;
  } catch {
    return 0;
  }
}

interface AuthValue {
  isAdmin: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [expiry, setExpiry] = useState<number>(() => readExpiry());

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setExpiry(0);
  }, []);

  const login = useCallback((pin: string) => {
    if (pin !== ADMIN_PIN) return false;
    const exp = Date.now() + SESSION_MS;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ exp }));
    } catch {
      /* ignore */
    }
    setExpiry(exp);
    return true;
  }, []);

  // Expire the session automatically.
  useEffect(() => {
    if (!expiry) return;
    const ms = expiry - Date.now();
    if (ms <= 0) {
      setExpiry(0);
      return;
    }
    const t = setTimeout(() => setExpiry(0), Math.min(ms, 2 ** 31 - 1));
    return () => clearTimeout(t);
  }, [expiry]);

  // Keep several tabs in sync (login / logout in one tab affects the others).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY || e.key === null) setExpiry(readExpiry());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ isAdmin: expiry > Date.now(), login, logout }),
    [expiry, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
