import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import HomePage from "./pages/public/HomePage";
import JobsPage from "./pages/public/JobsPage";
import JobDetailPage from "./pages/public/JobDetailPage";
import TalentPoolPage from "./pages/public/TalentPoolPage";
import PostJobPage from "./pages/public/PostJobPage";
import DashboardPage from "./pages/admin/DashboardPage";
import PipelinePage from "./pages/admin/PipelinePage";
import CandidatesPage from "./pages/admin/CandidatesPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import TalentPoolAdminPage from "./pages/admin/TalentPoolAdminPage";
import FollowUpsPage from "./pages/admin/FollowUpsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminGuard from "./components/admin/AdminGuard";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import ToastContainer from "./components/ToastContainer";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/talent-pool" element={<TalentPoolPage />} />
          <Route
            path="/post-job"
            element={
              <AdminOnlyRoute>
                <PostJobPage />
              </AdminOnlyRoute>
            }
          />
          <Route path="/upload-cv" element={<Navigate to="/talent-pool" replace />} />
        </Route>
        <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/pipeline" element={<PipelinePage />} />
          <Route path="/admin/candidates" element={<CandidatesPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/talent-pool" element={<TalentPoolAdminPage />} />
          <Route path="/admin/follow-ups" element={<FollowUpsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
