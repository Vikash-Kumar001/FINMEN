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
import StudentActivity from "./pages/Student/StudentActivity";
import AssignmentAttempt from "./pages/Student/AssignmentAttempt";
import CategoryView from "./pages/Student/CategoryView";
import QuickQuiz from "./pages/Student/QuickQuiz";
import MoodTracker from "./pages/Student/MoodTracker";
import Journal from "./pages/Student/Journal";
import MindfulnessBreak from "./pages/Student/MindfulnessBreak";

import RewardsPage from "./pages/Student/RewardsPage";
import RedeemPage from "./pages/Student/RedeemPage";
import WalletPage from "./pages/Student/WalletPage";
import Leaderboard from "./pages/Student/Leaderboard";
import StudentGame from "./pages/Student/StudentGame";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import TeacherProfile from "./pages/School/TeacherProfile";
import Setting from "./components/Settings";
import BreathingExercise from "./pages/Student/BreathingExercise";
import FinancialLiteracy from "./pages/Student/FinancialLiteracy";
import PaymentPage from "./pages/Student/PaymentPage";
import SubscriptionCheckout from "./pages/Student/SubscriptionCheckout";
import PresentationPage from "./pages/Student/PresentationPage";
import BudgetPlanner from "./pages/Student/BudgetPlanner";
import InvestmentSimulator from "./pages/Student/InvestmentSimulator";
import SavingsGoals from "./pages/Student/SavingsGoals";
import FinancialQuiz from "./pages/Student/FinancialQuiz";
import ExpenseTracker from "./pages/Student/ExpenseTracker";
import GameCategoryPage from "./pages/Games/GameCategoryPage";
import DCOSGames from "./pages/Games/DCOSGames";
import BrainTeaserGames from "./pages/Games/BrainTeaserGames";
import BrainTeaserPlay from "./pages/Games/BrainTeaserPlay";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPanel from "./pages/Admin/AdminPanel";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AllStudents from "./pages/Admin/AllStudents";
import AdminRedemptions from "./pages/Admin/AdminRedemptions";
import FeedbackHistoryModal from "./pages/Admin/FeedbackHistoryModal";
import AllRedemptions from "./pages/Admin/AllRedemptions";
import AdminStatsPanel from "./pages/Admin/AdminStatsPanel";
import AdminUsersPanel from "./pages/Admin/AdminUsersPanel";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminSettingsCommunications from "./pages/Admin/AdminSettingsCommunications";
import AdminSchoolApprovals from "./pages/Admin/AdminSchoolApprovals";
import IncidentManagement from "./pages/Admin/IncidentManagement";
import AdminTrackingDashboard from "./pages/Admin/AdminTrackingDashboard";
import AdminPaymentTracker from "./pages/Admin/AdminPaymentTracker";
import AdminMarketplace from "./pages/Admin/AdminMarketplace";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminReports from "./pages/Admin/AdminReports";
import BehaviorAnalytics from "./pages/Admin/BehaviorAnalytics";
import SmartInsights from "./pages/Admin/SmartInsights";
import FinancialConsole from "./pages/Admin/FinancialConsole";
import SupportDesk from "./pages/Admin/SupportDesk";
import LifecycleManagement from "./pages/Admin/LifecycleManagement";
import ContentGovernance from "./pages/Admin/ContentGovernance";
import AuditTimeline from "./pages/Admin/AuditTimeline";
import ConfigurationControlCenter from "./pages/Admin/ConfigurationControlCenter";
import CommunicationSuite from "./pages/Admin/CommunicationSuite";
import OperationalTools from "./pages/Admin/OperationalTools";
import PredictiveModels from "./pages/Admin/PredictiveModels";
import APIControlPlane from "./pages/Admin/APIControlPlane";
import AdminPlatform from "./pages/Admin/AdminPlatform";

// Parent Pages
import ParentDashboard from "./pages/Parent/ParentDashboard";
import ParentOverview from "./pages/Parent/ParentOverview";
import ParentChildren from "./pages/Parent/ParentChildren";
import ParentChildAnalytics from "./pages/Parent/ParentChildAnalytics";
import ChildProgress from "./pages/Parent/ChildProgress";
import ChildMoodWellbeing from "./pages/Parent/ChildMoodWellbeing";
import ChildWalletRewards from "./pages/Parent/ChildWalletRewards";
import ParentMessages from "./pages/Parent/ParentMessages";
import ParentSettings from "./pages/Parent/ParentSettings";
import ParentUpgrade from "./pages/Parent/ParentUpgrade";
import ParentProfile from "./pages/Parent/ParentProfile";

// Seller Pages
import SellerDashboard from "./pages/Seller/SellerDashboard";

// CSR Pages
import CSRDashboard from "./pages/CSR/CSRDashboard";
import CSROverview from "./pages/CSR/CSROverview";
import CSRCampaigns from "./pages/CSR/CSRCampaigns";
import CSRCampaignWizard from "./pages/CSR/CSRCampaignWizard";
import CSRFinancial from "./pages/CSR/CSRFinancial";
import CSRReports from "./pages/CSR/CSRReports";
import CSRApprovals from "./pages/CSR/CSRApprovals";
import CSRBudgetTracking from "./pages/CSR/CSRBudgetTracking";
import CSRBudget from "./pages/CSR/CSRBudget";
import CSRCobranding from "./pages/CSR/CSRCobranding";

// Multi-Tenant Pages
import CompanySignup from "./pages/MultiTenant/CompanySignup";
import CreateOrganization from "./pages/MultiTenant/CreateOrganization";
import SchoolAdminDashboard from "./pages/School/SchoolAdminDashboard";
import AnnouncementManagement from "./pages/School/AnnouncementManagement";
import Announcements from "./pages/School/Announcements";
import SchoolAdminAnalytics from "./pages/School/SchoolAdminAnalytics";
import SchoolAdminStudents from "./pages/School/SchoolAdminStudents";
import SchoolAdminTeachers from "./pages/School/SchoolAdminTeachers";
import SchoolAdminClasses from "./pages/School/SchoolAdminClasses";
import SchoolAdminStaff from "./pages/School/SchoolAdminStaff";
import SchoolAdminApprovals from "./pages/School/SchoolAdminApprovals";
import SchoolAdminTemplates from "./pages/School/SchoolAdminTemplates";
import SchoolAdminNEPTracking from "./pages/School/SchoolAdminNEPTracking";
import SchoolAdminCompliance from "./pages/School/SchoolAdminCompliance";
import SchoolAdminBilling from "./pages/School/SchoolAdminBilling";
import SchoolAdminPaymentTracker from "./pages/School/SchoolAdminPaymentTracker";
import AdminSchools from "./pages/Admin/AdminSchools";
import AdminSchoolDetail from "./pages/Admin/AdminSchoolDetail";
import SchoolAdminEmergency from "./pages/School/SchoolAdminEmergency";
import SchoolAdminEvents from "./pages/School/SchoolAdminEvents";
import SchoolAdminSettings from "./pages/School/SchoolAdminSettings";
import SchoolAdminProfile from "./pages/School/SchoolAdminProfile";
import SchoolAdminSettingsPersonal from "./pages/School/SchoolAdminSettingsPersonal";
import SchoolTeacherDashboard from "./pages/School/SchoolTeacherDashboard";
import SchoolStudentDashboard from "./pages/School/SchoolStudentDashboard";
import SchoolParentDashboard from "./pages/School/SchoolParentDashboard";
import TeacherOverview from "./pages/School/TeacherOverview";
import TeacherStudents from "./pages/School/TeacherStudents";
import TeacherAnalytics from "./pages/School/TeacherAnalytics";
import TeacherMessages from "./pages/School/TeacherMessages";
import TeacherTasks from "./pages/School/TeacherTasks";
import TeacherChatContacts from "./pages/School/TeacherChatContacts";
import TeacherSettings from "./pages/School/TeacherSettings";
import TeacherStudentProgress from "./pages/School/TeacherStudentProgress";
import TeacherParentChat from "./pages/School/TeacherParentChat";
import TeacherStudentChat from "./pages/School/TeacherStudentChat";
import SchoolStudentChat from "./pages/School/SchoolStudentChat";
import ParentChat from "./pages/Parent/ParentChat";
import AssignmentTracking from "./pages/School/AssignmentTracking";
import LandingPage from "./pages/LandingPage";
import IndividualAccountSelection from "./pages/IndividualAccountSelection";
// Multi-tenant registration pages
import InstitutionTypeSelection from "./pages/MultiTenant/InstitutionTypeSelection";
import SchoolRegistration from "./pages/MultiTenant/SchoolRegistration";
// 404 Page
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
// Toast notification provider
import { Toaster } from "react-hot-toast";

// Additional Pages
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import CareerApply from "./pages/CareerApply";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import UniversalGameRenderer from "./components/UniversalGameRenderer";

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
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "parent")
      return <Navigate to="/parent/overview" replace />;
    if (user.role === "seller")
      return <Navigate to="/seller/dashboard" replace />;
    if (user.role === "csr") return <Navigate to="/csr/dashboard" replace />;

    // School roles
    if (user.role === "school_admin")
      return <Navigate to="/school/admin/dashboard" replace />;
    if (user.role === "school_teacher")
      return <Navigate to="/school-teacher/overview" replace />;
    if (user.role === "school_student")
      return <Navigate to="/student/dashboard" replace />;
    if (user.role === "school_parent")
      return <Navigate to="/school-parent/dashboard" replace />;

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

  // Hide navbar on full-screen game routes and standalone pages with back buttons
  const isFullScreenGame =
    location.pathname.startsWith("/student/games/") ||
    location.pathname.startsWith("/student/finance/kids/") ||
    location.pathname.startsWith("/student/finance/teen/") ||
    location.pathname.startsWith("/student/brain/kids/") ||
    location.pathname.startsWith("/student/brain/teen/") ||
    location.pathname.startsWith("/student/uvls/kids/") ||
    location.pathname.startsWith("/student/uvls/teen/") ||
    location.pathname.startsWith("/student/dcos/kids/") ||
    location.pathname.startsWith("/student/dcos/teen/") ||
    location.pathname.startsWith("/student/moral-values/kids/") ||
    location.pathname.startsWith("/student/moral-values/teen/") ||
    location.pathname.startsWith("/student/ai-for-all/kids/") ||
    location.pathname.startsWith("/student/ai-for-all/teen/") ||
    location.pathname.startsWith("/student/ehe/kids/") ||
    location.pathname.startsWith("/student/ehe/teen/") ||
    location.pathname.startsWith("/student/civic-responsibility/kids/") ||
    location.pathname.startsWith("/student/civic-responsibility/teen/") ||
    location.pathname.startsWith("/games/") ||
    location.pathname.startsWith("/tools/") ||
    location.pathname.startsWith("/learn/") ||
    location.pathname === "/student/breathing";

  // Hide navbar on chat pages
  const isChatPage = location.pathname.includes("/chat");

  // Hide navbar on public pages
  const isPublicPage =
    [
    "/about",
    "/careers",
    "/blog",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    ].includes(location.pathname) || location.pathname.startsWith("/careers/apply");

  // Hide navbar on presentation pages (when editing or presenting a specific presentation)
  // Show navbar on /student/presentation (list page), hide on /student/presentation/:id or /student/presentation/share/:shareCode
  const isPresentationPage = location.pathname.startsWith("/student/presentation") && 
    location.pathname !== "/student/presentation" &&
    (location.pathname.match(/\/student\/presentation\/[^/]+$/) || location.pathname.includes("/student/presentation/share/"));

  const isChatbotRestrictedPage = location.pathname.startsWith("/student/payment");

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthPage &&
        !isFullScreenGame &&
        !isChatPage &&
        !isPublicPage &&
        !isPresentationPage &&
        location.pathname !== "/" &&
        location.pathname !== "/school-registration" &&
        location.pathname !== "/institution-type" &&
        location.pathname !== "/individual-account" &&
        location.pathname !== "/choose-account-type" &&
        location.pathname !== "/register-parent" &&
        location.pathname !== "/register-seller" &&
        location.pathname !== "/register-teacher" &&
        location.pathname !== "/register-stakeholder" &&
        location.pathname !== "/pending-approval" &&
        !location.pathname.includes("/student-chat/") &&
        !location.pathname.includes("/parent-chat") && <Navbar />}
      {!isAuthPage &&
        user &&
        (user.role === "student" || user.role === "school_student") &&
        !isChatbotRestrictedPage && (
          <Chatbot />
        )}{" "}
      {/* ✅ Floating Chatbot - Only for students */}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={user ? <RootRedirect /> : <LandingPage />} />
          <Route
            path="/individual-account"
            element={<IndividualAccountSelection />}
          />

          {/* Auth Routes */}
          {/* If authenticated, redirect away from login to role dashboard */}
          <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
          <Route path="/register" element={<Register />} />
          {/* Google login route removed */}
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/register-stakeholder"
            element={<StakeholderRegister />}
          />
          <Route path="/register-parent" element={<ParentRegister />} />
          <Route path="/register-seller" element={<SellerRegister />} />
          <Route path="/register-teacher" element={<TeacherRegister />} />
          <Route
            path="/choose-account-type"
            element={<AccountTypeSelection />}
          />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />

          {/* Multi-Tenant Routes */}
          <Route path="/company-signup" element={<CompanySignup />} />
          <Route path="/create-organization" element={<CreateOrganization />} />

          {/* Institution Registration Routes */}
          <Route
            path="/institution-type"
            element={<InstitutionTypeSelection />}
          />
          <Route path="/school-registration" element={<SchoolRegistration />} />

          {/* School Admin Routes */}
          <Route
            path="/school/admin/dashboard"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/analytics"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/students"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/teachers"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/classes"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/staff"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/announcements"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <AnnouncementManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/approvals"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/templates"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/nep-tracking"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminNEPTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/compliance"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminCompliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/billing"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/emergency"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminEmergency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/events"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/settings"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/payment-tracker"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminPaymentTracker />
              </ProtectedRoute>
            }
          />

          {/* School Admin Profile & Settings Routes */}
          <Route
            path="/school_admin/profile"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school_admin/settings"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminSettingsPersonal />
              </ProtectedRoute>
            }
          />

          {/* School Teacher Routes */}
          <Route
            path="/school-teacher/overview"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/dashboard"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <SchoolTeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/students"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/analytics"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/messages"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/chat-contacts"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherChatContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/announcements"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/tasks"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/tracking"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <AssignmentTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/settings"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school_teacher/settings"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/progress"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherStudentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student-chat/:studentId"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherStudentChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/parent-chat"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherParentChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/profile"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school_teacher/profile"
            element={
              <ProtectedRoute roles={["school_teacher"]}>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/school-student/dashboard"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <SchoolStudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-student/announcements"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-student/chat"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <SchoolStudentChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/dashboard"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <SchoolParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/announcements"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/student/:studentId/chat"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <ParentChat />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/activity"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignment/:assignmentId/attempt"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AssignmentAttempt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/announcements"
            element={
              <ProtectedRoute roles={["student"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard/quick-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuickQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard/:categorySlug"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CategoryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mindfull-break"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MindfulnessBreak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mood-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MoodTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/journal"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Journal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/rewards"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/redeem"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RedeemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/wallet"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/leaderboard"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute roles={["student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/settings"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Setting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payment"
            element={
              <ProtectedRoute roles={["student"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payment/checkout"
            element={
              <ProtectedRoute roles={["student"]}>
                <SubscriptionCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/upgrade/checkout"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <SubscriptionCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/presentation/:id?"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PresentationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/presentation/share/:shareCode"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PresentationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/breathing"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MindfulnessBreak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/financial-literacy"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialLiteracy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/budget-planner"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BudgetPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/investment-simulator"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <InvestmentSimulator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools/savings-goals"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SavingsGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/financial-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/expense-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ExpenseTracker />
              </ProtectedRoute>
            }
          />


        {/* Universal Game Routes - Can render any game within single component*/}
        <Route path="/student/:category/:age/:game" element={<ProtectedRoute roles={['student', 'school_student']}><UniversalGameRenderer /></ProtectedRoute>} />

        {/* Legacy Game Category Pages - Keep for backward compatibility */}
        <Route path="/games/dcos" element={<ProtectedRoute roles={['student', 'school_student']}><DCOSGames /></ProtectedRoute>} />
        <Route path="/games/brain-teaser" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserGames /></ProtectedRoute>} />
        <Route path="/games/brain-teaser/:gameId" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserPlay /></ProtectedRoute>} />
        <Route path="/games/:category/:ageGroup" element={<ProtectedRoute roles={['student', 'school_student']}><GameCategoryPage /></ProtectedRoute>} />


          {/* Admin Routes */}
          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/redemptions"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminRedemptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute roles={["admin"]}>
                <FeedbackHistoryModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/all-redemptions"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllRedemptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminStatsPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsersPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/communications"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettingsCommunications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchoolApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schools"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schools/:schoolId"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchoolDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/incidents"
            element={
              <ProtectedRoute roles={["admin"]}>
                <IncidentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tracking"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminTrackingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payment-tracker"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPaymentTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/marketplace"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminMarketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/behavior-analytics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <BehaviorAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/smart-insights"
            element={
              <ProtectedRoute roles={["admin"]}>
                <SmartInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/financial-console"
            element={
              <ProtectedRoute roles={["admin"]}>
                <FinancialConsole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/support-desk"
            element={
              <ProtectedRoute roles={["admin"]}>
                <SupportDesk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lifecycle"
            element={
              <ProtectedRoute roles={["admin"]}>
                <LifecycleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content-governance"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ContentGovernance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-timeline"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AuditTimeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuration"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ConfigurationControlCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/communication"
            element={
              <ProtectedRoute roles={["admin"]}>
                <CommunicationSuite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operational"
            element={
              <ProtectedRoute roles={["admin"]}>
                <OperationalTools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/predictive"
            element={
              <ProtectedRoute roles={["admin"]}>
                <PredictiveModels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/api-control"
            element={
              <ProtectedRoute roles={["admin"]}>
                <APIControlPlane />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/platform"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPlatform />
              </ProtectedRoute>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/parent/overview"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/announcements"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/children"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildren />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/messages"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/settings"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/upgrade"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentUpgrade />
              </ProtectedRoute>
            }
          />

          {/* Child Analytics Routes */}
          <Route
            path="/parent/child/:childId"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/analytics"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/wellbeing"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildMoodWellbeing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/wallet"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildWalletRewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/chat"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/profile"
            element={
              <ProtectedRoute roles={["parent"]}>
                <ParentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/notifications"
            element={
              <ProtectedRoute roles={["parent"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/parent-progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute roles={["seller"]} requireApproved={true}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* CSR Routes */}
          <Route
            path="/csr"
            element={<Navigate to="/csr/overview" replace />}
          />
          <Route
            path="/csr/dashboard"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/overview"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSROverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/campaigns"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRCampaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/campaign-wizard"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRCampaignWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/financial"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRFinancial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/reports"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/approvals"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/budget-tracking"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRBudgetTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/budget"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/cobranding"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRCobranding />
              </ProtectedRoute>
            }
          />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply/:jobId" element={<CareerApply />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Toaster /> {/* Toast notification container */}
    </div>
  );
};

export default App;