import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

/** Only the signed-in recruiter may open these routes; everyone else goes to the job list. */
export default function AdminOnlyRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/jobs" replace />;
  return <>{children}</>;
}
