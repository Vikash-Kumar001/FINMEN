import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Global UI
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot"; 
// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOTP from "./pages/Auth/VerifyOTP";
import ForgotPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import StakeholderRegister from "./pages/Auth/StakeholderRegister";
import PendingApprovalPage from "./pages/Auth/PendingApproval";
import ParentRegister from "./pages/Auth/ParentRegister";
import SellerRegister from "./pages/Auth/SellerRegister";
import TeacherRegister from "./pages/Auth/TeacherRegister";
import AccountTypeSelection from "./pages/Auth/AccountTypeSelection";

// Student Pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import MoodTracker from "./pages/Student/MoodTracker";
import Journal from "./pages/Student/Journal";

import RewardsPage from "./pages/Student/RewardsPage";
import RedeemPage from "./pages/Student/RedeemPage";
import WalletPage from "./pages/Student/WalletPage";
import Leaderboard from "./pages/Student/Leaderboard";
import StudentGame from "./pages/Student/StudentGame";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Setting from "./components/Settings";
import BreathingExercise from "./pages/Student/BreathingExercise";
import QuickStart from "./pages/Student/QuickStart";
import ThisWeek from "./pages/Student/ThisWeek";
import DailyGoal from "./pages/Student/DailyGoal";
import DailyChallenges from "./pages/Student/DailyChallenges";
import Challenge from "./pages/Student/Challenge";
import FinancialLiteracy from "./pages/Student/FinancialLiteracy";
import BudgetPlanner from "./pages/Student/BudgetPlanner";
import InvestmentSimulator from "./pages/Student/InvestmentSimulator";
import SavingsGoals from "./pages/Student/SavingsGoals";
import FinancialQuiz from "./pages/Student/FinancialQuiz";
import ExpenseTracker from "./pages/Student/ExpenseTracker";
import GameCategoryPage from "./pages/Games/GameCategoryPage";

// Kids Finance Game Levels
import Level1 from "./pages/Student/Finance/Kids/Level1";
import Level2 from "./pages/Student/Finance/Kids/Level2";
import Level3 from "./pages/Student/Finance/Kids/Level3";
import Level4 from "./pages/Student/Finance/Kids/Level4";
import Level5 from "./pages/Student/Finance/Kids/Level5";
import Level6 from "./pages/Student/Finance/Kids/Level6";
import Level7 from "./pages/Student/Finance/Kids/Level7";
import Level8 from "./pages/Student/Finance/Kids/Level8";
import Level9 from "./pages/Student/Finance/Kids/Level9";
import Level10 from "./pages/Student/Finance/Kids/Level10";

// Educator Pages
import AssessmentTools from "./pages/Educator/AssessmentHub";
import EducatorDashboard from "./pages/Educator/EducatorDashboard";
import StudentManagement from "./pages/Educator/StudentManagement";
import StudentActivityTracker from "./pages/Educator/StudentActivityTracker";
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
import AdminSettings from "./pages/Admin/AdminSettings";

// Parent Pages
import ParentDashboard from "./pages/Parent/ParentDashboard";

// Seller Pages
import SellerDashboard from "./pages/Seller/SellerDashboard";

// CSR Pages
import CSRDashboard from "./pages/CSR/CSRDashboard";

// Multi-Tenant Pages
import CompanySignup from "./pages/MultiTenant/CompanySignup";
import CreateOrganization from "./pages/MultiTenant/CreateOrganization";
import SchoolAdminDashboard from "./pages/School/SchoolAdminDashboard";
import SchoolTeacherDashboard from "./pages/School/SchoolTeacherDashboard";
import SchoolStudentDashboard from "./pages/School/SchoolStudentDashboard";
import SchoolParentDashboard from "./pages/School/SchoolParentDashboard";
import CollegeAdminDashboard from "./pages/College/CollegeAdminDashboard";
import CollegeFacultyDashboard from "./pages/College/CollegeFacultyDashboard";
import CollegeStudentDashboard from "./pages/College/CollegeStudentDashboard";
import CollegeParentDashboard from "./pages/College/CollegeParentDashboard";
import AlumniNetwork from "./pages/College/AlumniNetwork";
import PlacementOfficerDashboard from "./pages/College/PlacementOfficerDashboard";
import FacilityManagement from "./pages/College/FacilityManagement";
import ReportsDashboard from "./pages/College/ReportsDashboard";
import LandingPage from "./pages/LandingPage";
import IndividualAccountSelection from "./pages/IndividualAccountSelection";
  <Route path="/individual-account" element={<IndividualAccountSelection />} />

// Multi-tenant registration pages
import InstitutionTypeSelection from "./pages/MultiTenant/InstitutionTypeSelection";
import SchoolRegistration from "./pages/MultiTenant/SchoolRegistration";
import CollegeRegistration from "./pages/MultiTenant/CollegeRegistration";

// 404 Page
import NotFound from "./pages/NotFound";
import AssessmentHub from "./pages/Educator/AssessmentHub";
import ErrorBoundary from "./components/ErrorBoundary";
// Toast notification provider
import { Toaster } from "react-hot-toast";

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
    
    // Legacy roles
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "educator") return <Navigate to="/educator/dashboard" replace />;
    if (user.role === "parent") return <Navigate to="/parent/dashboard" replace />;
    if (user.role === "seller") return <Navigate to="/seller/dashboard" replace />;
    if (user.role === "csr") return <Navigate to="/csr/dashboard" replace />;
    
  // School roles
  if (user.role === "school_admin") return <Navigate to="/school/admin/dashboard" replace />;
    if (user.role === "school_teacher") return <Navigate to="/school-teacher/dashboard" replace />;
    if (user.role === "school_student") return <Navigate to="/school-student/dashboard" replace />;
    if (user.role === "school_parent") return <Navigate to="/school-parent/dashboard" replace />;
    
    // College roles
    if (user.role === "college_admin") return <Navigate to="/college-admin/dashboard" replace />;
    if (user.role === "college_faculty") return <Navigate to="/college-faculty/dashboard" replace />;
    if (user.role === "college_student") return <Navigate to="/college-student/dashboard" replace />;
    if (user.role === "college_parent") return <Navigate to="/college-parent/dashboard" replace />;
    
    // Default fallback
    return <Navigate to="/student/dashboard" replace />;
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4" />
        <div className="text-gray-600">Loading your experience...</div>
      </div>
    );
  }

  // Hide navbar on full-screen game routes
  const isFullScreenGame = location.pathname.startsWith("/student/games/ai/") ||
    location.pathname.startsWith("/student/finance/kids/") ||
    location.pathname.startsWith("/games/");

  return (
    <div className="min-h-screen bg-gray-100">
  {!isAuthPage &&
    !isFullScreenGame &&
    location.pathname !== "/" &&
    location.pathname !== "/college-registration" &&
    location.pathname !== "/school-registration" &&
    location.pathname !== "/institution-type" &&
    location.pathname !== "/individual-account" &&
    location.pathname !== "/choose-account-type" &&
    location.pathname !== "/register-parent" &&
    location.pathname !== "/register-seller" &&
    location.pathname !== "/register-teacher" &&
    location.pathname !== "/pending-approval" &&
    <Navbar />}
      {!isAuthPage && user && <Chatbot />} {/* ✅ Floating Chatbot */}

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={user ? <RootRedirect /> : <LandingPage />} />
          <Route path="/individual-account" element={<IndividualAccountSelection />} />

          {/* Auth Routes */}
          {/* If authenticated, redirect away from login to role dashboard */}
          <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
          <Route path="/register" element={<Register />} />
          {/* Google login route removed */}
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register-stakeholder" element={<StakeholderRegister />} />
          <Route path="/register-parent" element={<ParentRegister />} />
          <Route path="/register-seller" element={<SellerRegister />} />
          <Route path="/register-teacher" element={<TeacherRegister />} />
          <Route path="/choose-account-type" element={<AccountTypeSelection />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          
          {/* Multi-Tenant Routes */}
          <Route path="/company-signup" element={<CompanySignup />} />
          <Route path="/create-organization" element={<CreateOrganization />} />
          
          {/* Institution Registration Routes */}
          <Route path="/institution-type" element={<InstitutionTypeSelection />} />
          <Route path="/school-registration" element={<SchoolRegistration />} />
          <Route path="/college-registration" element={<CollegeRegistration />} />
          
          {/* School Routes */}
          <Route path="/school/admin/dashboard" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminDashboard /></ProtectedRoute>} />
          <Route path="/school-teacher/dashboard" element={<ProtectedRoute roles={['school_teacher']}><SchoolTeacherDashboard /></ProtectedRoute>} />
          <Route path="/school-student/dashboard" element={<ProtectedRoute roles={['school_student']}><SchoolStudentDashboard /></ProtectedRoute>} />
          <Route path="/school-parent/dashboard" element={<ProtectedRoute roles={['school_parent']}><SchoolParentDashboard /></ProtectedRoute>} />
          
          {/* College Routes */}
          <Route path="/college-admin/dashboard" element={<ProtectedRoute roles={['college_admin']}><CollegeAdminDashboard /></ProtectedRoute>} />
          <Route path="/college-faculty/dashboard" element={<ProtectedRoute roles={['college_faculty']}><CollegeFacultyDashboard /></ProtectedRoute>} />
          <Route path="/college-student/dashboard" element={<ProtectedRoute roles={['college_student']}><CollegeStudentDashboard /></ProtectedRoute>} />
          <Route path="/college-parent/dashboard" element={<ProtectedRoute roles={['college_parent']}><CollegeParentDashboard /></ProtectedRoute>} />
          <Route path="/college/alumni" element={<ProtectedRoute roles={['college_admin', 'college_faculty', 'college_student']}><AlumniNetwork /></ProtectedRoute>} />
          <Route path="/college/placement" element={<ProtectedRoute roles={['college_admin', 'college_placement_officer']}><PlacementOfficerDashboard /></ProtectedRoute>} />
          <Route path="/college/facilities" element={<ProtectedRoute roles={['college_admin']}><FacilityManagement /></ProtectedRoute>} />
          <Route path="/college/reports" element={<ProtectedRoute roles={['college_admin', 'college_faculty']}><ReportsDashboard /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/mood-tracker" element={<ProtectedRoute roles={['student']}><MoodTracker /></ProtectedRoute>} />
          <Route path="/student/journal" element={<ProtectedRoute roles={['student']}><Journal /></ProtectedRoute>} />
          <Route path="/student/rewards" element={<ProtectedRoute roles={['student']}><RewardsPage /></ProtectedRoute>} />
          <Route path="/student/redeem" element={<ProtectedRoute roles={['student']}><RedeemPage /></ProtectedRoute>} />
          <Route path="/student/wallet" element={<ProtectedRoute roles={['student']}><WalletPage /></ProtectedRoute>} />
          <Route path="/student/leaderboard" element={<ProtectedRoute roles={['student']}><Leaderboard /></ProtectedRoute>} />
          <Route path="/student/game" element={<ProtectedRoute roles={['student']}><StudentGame /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute roles={['student']}><Notifications /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><Profile /></ProtectedRoute>} />
          <Route path="/student/settings" element={<ProtectedRoute roles={['student']}><Setting /></ProtectedRoute>} />
          <Route path="/student/breathing" element={<ProtectedRoute roles={['student']}><BreathingExercise /></ProtectedRoute>} />
          <Route path="/student/quick-start" element={<ProtectedRoute roles={['student']}><QuickStart /></ProtectedRoute>} />
          <Route path="/student/this-week" element={<ProtectedRoute roles={['student']}><ThisWeek /></ProtectedRoute>} />
          <Route path="/student/daily-goal" element={<ProtectedRoute roles={['student']}><DailyGoal /></ProtectedRoute>} />
          <Route path="/student/daily-challenges" element={<ProtectedRoute roles={['student']}><DailyChallenges /></ProtectedRoute>} />
          <Route path="/student/challenge" element={<ProtectedRoute roles={['student']}><Challenge /></ProtectedRoute>} />
          <Route path="/learn/financial-literacy" element={<ProtectedRoute roles={['student']}><FinancialLiteracy /></ProtectedRoute>} />
          <Route path="/tools/budget-planner" element={<ProtectedRoute roles={['student']}><BudgetPlanner /></ProtectedRoute>} />
          <Route path="/games/investment-simulator" element={<ProtectedRoute roles={['student']}><InvestmentSimulator /></ProtectedRoute>} />

          <Route path="/tools/savings-goals" element={<ProtectedRoute roles={['student']}><SavingsGoals /></ProtectedRoute>} />
          <Route path="/learn/financial-quiz" element={<ProtectedRoute roles={['student']}><FinancialQuiz /></ProtectedRoute>} />
          <Route path="/tools/expense-tracker" element={<ProtectedRoute roles={['student']}><ExpenseTracker /></ProtectedRoute>} />

          {/* Game Category Pages */}
          <Route path="/games/:category/:ageGroup" element={<ProtectedRoute roles={['student']}><GameCategoryPage /></ProtectedRoute>} />

          {/* Finance Games for Kids */}
          <Route path="/student/finance/kids/level1" element={<ProtectedRoute roles={['student']}><Level1 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level2" element={<ProtectedRoute roles={['student']}><Level2 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level3" element={<ProtectedRoute roles={['student']}><Level3 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level4" element={<ProtectedRoute roles={['student']}><Level4 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level5" element={<ProtectedRoute roles={['student']}><Level5 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level6" element={<ProtectedRoute roles={['student']}><Level6 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level7" element={<ProtectedRoute roles={['student']}><Level7 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level8" element={<ProtectedRoute roles={['student']}><Level8 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level9" element={<ProtectedRoute roles={['student']}><Level9 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/level10" element={<ProtectedRoute roles={['student']}><Level10 /></ProtectedRoute>} />

          {/* Educator Routes */}
          <Route path="/educator/dashboard" element={<ProtectedRoute roles={['educator']} requireApproved={true}><EducatorDashboard /></ProtectedRoute>} />
          <Route path="/educator/students" element={<ProtectedRoute roles={['educator']}><StudentManagement /></ProtectedRoute>} />
          <Route path="/educator/student/:studentId/activity" element={<ProtectedRoute roles={['educator']}><StudentActivityTracker /></ProtectedRoute>} />
          <Route path="/educator/tools" element={<ProtectedRoute roles={['educator']}><EducatorTools /></ProtectedRoute>} />
          <Route path="/educator/redemptions" element={<ProtectedRoute roles={['educator']}><RedemptionRequests /></ProtectedRoute>} />
          <Route path="/pending-approval" element={<ProtectedRoute roles={['educator']}><PendingApproval /></ProtectedRoute>} />
          <Route path="/educator/settings" element={<ProtectedRoute roles={['educator']}><Setting /></ProtectedRoute>} />
          <Route path="/educator/profile" element={<ProtectedRoute roles={['educator']}><Profile /></ProtectedRoute>} />
          <Route path="/educator/notifications" element={<ProtectedRoute roles={['educator']}><Notifications /></ProtectedRoute>} />
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
          <Route path="/educator/assessment" element={<ProtectedRoute roles={['educator']}><AssessmentHub /></ProtectedRoute>} />

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
          <Route path="/admin/profile" element={<ProtectedRoute roles={['admin']}><Profile /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute roles={['admin']}><Notifications /></ProtectedRoute>} />

          {/* Parent Routes */}
          <Route path="/parent/dashboard" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentDashboard /></ProtectedRoute>} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<ProtectedRoute roles={['seller']} requireApproved={true}><SellerDashboard /></ProtectedRoute>} />

          {/* CSR Routes */}
          <Route path="/csr/dashboard" element={<ProtectedRoute roles={['csr']} requireApproved={true}><CSRDashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Toaster /> {/* Toast notification container */}
    </div>
  );
};

export default App;