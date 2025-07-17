import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// Global UI
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot"; // ✅ Floating Chatbot

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import GoogleLogin from "./pages/Auth/GoogleLogin";
import VerifyOTP from "./pages/Auth/VerifyOTP";
import ForgotPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Student Pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import MoodTracker from "./pages/Student/MoodTracker";
import Journal from "./pages/Student/Journal";
import Games from "./pages/Student/Games";
import RewardsPage from "./pages/Student/RewardsPage";
import RedeemPage from "./pages/Student/RedeemPage";
import WalletPage from "./pages/Student/WalletPage";
import Leaderboard from "./pages/Student/Leaderboard";
import StudentGame from "./pages/Student/StudentGame";
import Notifications from "./pages/Student/Notifications";
import Profile from "./pages/Student/Profile";
import Setting from "./pages/Student/Settings";
import BreathingExercise from "./pages/Student/BreathingExercise";

// Educator Pages
import EducatorDashboard from "./pages/Educator/EducatorDashboard";
import StudentManagement from "./pages/Educator/StudentManagement";
import EducatorTools from "./pages/Educator/EducatorTools";
import RedemptionRequests from "./pages/Educator/RedemptionRequests";
import PendingApproval from "./pages/Educator/PendingApproval";
import SystemSettings from "./pages/Educator/SystemSettings";
import AISupport from "./pages/Educator/AISupport";
import QuickActions from "./pages/Educator/QuickActions";
import ResourceLibrary from "./pages/Educator/ResourceLibrary";
import SmartAlerts from "./pages/Educator/SmartAlerts";
import SmartRewardsSystem from "./pages/Educator/SmartRewardsSystem";
import ProgressAnalytics from "./pages/Educator/ProgressAnalytics";
import RealTimeAnalytics from "./pages/Educator/RealTimeAnalytics";
import CommunicationCenter from "./pages/Educator/CommunicationCenter";
import CurriculumBuilder from "./pages/Educator/CurriculumBuilder";
import WellnessMonitor from "./pages/Educator/WellnessMonitor";

// Admin Pages
import AdminPanel from "./pages/Admin/AdminPanel";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AllStudents from "./pages/Admin/AllStudents";
import AllEducator from "./pages/Admin/AllEducator";
import PendingEducators from "./pages/Admin/PendingEducators";
import AdminRedemptions from "./pages/Admin/AdminRedemptions";
import FeedbackHistoryModal from "./pages/Admin/FeedbackHistoryModal";
import AllRedemptions from "./pages/Admin/AllRedemptions";
import AdminStatsPanel from "./pages/Admin/AdminStatsPanel";
import AdminUsersPanel from "./pages/Admin/AdminUsersPanel";

// 404 Page
import NotFound from "./pages/NotFound";

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].includes(location.pathname);

  const RootRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "educator") return <Navigate to="/educator/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-600 dark:text-white bg-white dark:bg-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {!isAuthPage && <Navbar />}
      {!isAuthPage && user && <Chatbot />} {/* ✅ Floating Chatbot */}

      <Routes>
        <Route path="/" element={<RootRedirect />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-login" element={<GoogleLogin />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/mood-tracker" element={<ProtectedRoute roles={['student']}><MoodTracker /></ProtectedRoute>} />
        <Route path="/student/journal" element={<ProtectedRoute roles={['student']}><Journal /></ProtectedRoute>} />
        <Route path="/student/games" element={<ProtectedRoute roles={['student']}><Games /></ProtectedRoute>} />
        <Route path="/student/rewards" element={<ProtectedRoute roles={['student']}><RewardsPage /></ProtectedRoute>} />
        <Route path="/student/redeem" element={<ProtectedRoute roles={['student']}><RedeemPage /></ProtectedRoute>} />
        <Route path="/student/wallet" element={<ProtectedRoute roles={['student']}><WalletPage /></ProtectedRoute>} />
        <Route path="/student/leaderboard" element={<ProtectedRoute roles={['student']}><Leaderboard /></ProtectedRoute>} />
        <Route path="/student/game" element={<ProtectedRoute roles={['student']}><StudentGame /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute roles={['student']}><Notifications /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><Profile /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute roles={['student']}><Setting /></ProtectedRoute>} />
        <Route path="/student/breathing" element={<ProtectedRoute roles={['student']}><BreathingExercise /></ProtectedRoute>} />

        {/* Educator Routes */}
        <Route path="/educator/dashboard" element={<ProtectedRoute roles={['educator']} requireApproved={true}><EducatorDashboard /></ProtectedRoute>} />
        <Route path="/educator/students" element={<ProtectedRoute roles={['educator']}><StudentManagement /></ProtectedRoute>} />
        <Route path="/educator/tools" element={<ProtectedRoute roles={['educator']}><EducatorTools /></ProtectedRoute>} />
        <Route path="/educator/redemptions" element={<ProtectedRoute roles={['educator']}><RedemptionRequests /></ProtectedRoute>} />
        <Route path="/pending-approval" element={<ProtectedRoute roles={['educator']}><PendingApproval /></ProtectedRoute>} />
        <Route path="/educator/settings" element={<ProtectedRoute roles={['educator']}><SystemSettings /></ProtectedRoute>} />
        <Route path="/educator/ai-support" element={<ProtectedRoute roles={['educator']}><AISupport /></ProtectedRoute>} />
        <Route path="/educator/quick-actions" element={<ProtectedRoute roles={['educator']}><QuickActions /></ProtectedRoute>} />
        <Route path="/educator/resources" element={<ProtectedRoute roles={['educator']}><ResourceLibrary /></ProtectedRoute>} />
        <Route path="/educator/alerts" element={<ProtectedRoute roles={['educator']}><SmartAlerts /></ProtectedRoute>} />
        <Route path="/educator/rewards" element={<ProtectedRoute roles={['educator']}><SmartRewardsSystem /></ProtectedRoute>} />
        <Route path="/educator/progress" element={<ProtectedRoute roles={['educator']}><ProgressAnalytics /></ProtectedRoute>} />
        <Route path="/educator/analytics" element={<ProtectedRoute roles={['educator']}><RealTimeAnalytics /></ProtectedRoute>} />
        <Route path="/educator/communication" element={<ProtectedRoute roles={['educator']}><CommunicationCenter /></ProtectedRoute>} />
        <Route path="/educator/curriculum" element={<ProtectedRoute roles={['educator']}><CurriculumBuilder /></ProtectedRoute>} />
        <Route path="/educator/wellness" element={<ProtectedRoute roles={['educator']}><WellnessMonitor /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/panel" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute roles={['admin']}><AllStudents /></ProtectedRoute>} />
        <Route path="/admin/educators" element={<ProtectedRoute roles={['admin']}><AllEducator /></ProtectedRoute>} />
        <Route path="/admin/pending-educators" element={<ProtectedRoute roles={['admin']}><PendingEducators /></ProtectedRoute>} />
        <Route path="/admin/redemptions" element={<ProtectedRoute roles={['admin']}><AdminRedemptions /></ProtectedRoute>} />
        <Route path="/admin/feedback" element={<ProtectedRoute roles={['admin']}><FeedbackHistoryModal /></ProtectedRoute>} />
        <Route path="/admin/all-redemptions" element={<ProtectedRoute roles={['admin']}><AllRedemptions /></ProtectedRoute>} />
        <Route path="/admin/stats" element={<ProtectedRoute roles={['admin']}><AdminStatsPanel /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPanel /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
