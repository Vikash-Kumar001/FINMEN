import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Global UI
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot"; 
import Footer from "./components/Footer";
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
import PiggyBankStory from "./pages/Student/Finance/Kids/PiggyBankStory";
import QuizOnSaving from "./pages/Student/Finance/Kids/QuizOnSaving";
import ReflexSavings from "./pages/Student/Finance/Kids/ReflexSavings";
import PuzzleSaveOrSpend from "./pages/Student/Finance/Kids/PuzzleSaveOrSpend";
import BirthdayMoneyStory from "./pages/Student/Finance/Kids/BirthdayMoneyStory";
import PosterSavingHabit from "./pages/Student/Finance/Kids/PosterSavingHabit";
import JournalOfSaving from "./pages/Student/Finance/Kids/JournalOfSaving";
import ShopStory from "./pages/Student/Finance/Kids/ShopStory";
import ReflexMoneyChoice from "./pages/Student/Finance/Kids/ReflexMoneyChoice";
import BadgeSaverKid from "./pages/Student/Finance/Kids/BadgeSaverKid";
import IceCreamStory from "./pages/Student/Finance/Kids/IceCreamStory";
import QuizOnSpending from "./pages/Student/Finance/Kids/QuizOnSpending";
import ReflexSpending from "./pages/Student/Finance/Kids/ReflexSpending";
import PuzzleSmartVsWaste from "./pages/Student/Finance/Kids/PuzzleSmartVsWaste";
import ShopStory2 from "./pages/Student/Finance/Kids/ShopStory2";
import PosterSmartShopping from "./pages/Student/Finance/Kids/PosterSmartShopping";
import JournalOfSmartBuy from "./pages/Student/Finance/Kids/JournalOfSmartBuy";
import CandyOfferStory from "./pages/Student/Finance/Kids/CandyOfferStory";
import ReflexNeedsFirst from "./pages/Student/Finance/Kids/ReflexNeedsFirst";
import BadgeSmartSpenderKid from "./pages/Student/Finance/Kids/BadgeSmartSpenderKid";

// Teen Finance Game Levels
import PocketMoneyStory from "./pages/Student/Finance/Teen/PocketMoneyStory";
import QuizOnSavingsRate from "./pages/Student/Finance/Teen/QuizOnSavingsRate";
import ReflexSmartSaver from "./pages/Student/Finance/Teen/ReflexSmartSaver";
import PuzzleOfSavingGoals from "./pages/Student/Finance/Teen/PuzzleOfSavingGoals";
import SalaryStory from "./pages/Student/Finance/Teen/SalaryStory";
import DebateSaveVsSpend from "./pages/Student/Finance/Teen/DebateSaveVsSpend";
import JournalOfSavingGoal from "./pages/Student/Finance/Teen/JournalOfSavingGoal";
import SimulationMonthlyMoney from "./pages/Student/Finance/Teen/SimulationMonthlyMoney";
import ReflexWiseUse from "./pages/Student/Finance/Teen/ReflexWiseUse";
import BadgeSmartSaver from "./pages/Student/Finance/Teen/BadgeSmartSaver";
import AllowanceStory from "./pages/Student/Finance/Teen/AllowanceStory";
import SpendingQuiz from "./pages/Student/Finance/Teen/SpendingQuiz";
import ReflexWiseChoices from "./pages/Student/Finance/Teen/ReflexWiseChoices";
import PuzzleSmartSpending from "./pages/Student/Finance/Teen/PuzzleSmartSpending";
import PartyStory from "./pages/Student/Finance/Teen/PartyStory";
import DebateNeedsVsWants from "./pages/Student/Finance/Teen/DebateNeedsVsWants";
import JournalOfSpending from "./pages/Student/Finance/Teen/JournalOfSpending";
import SimulationShoppingMall from "./pages/Student/Finance/Teen/SimulationShoppingMall";
import ReflexControl from "./pages/Student/Finance/Teen/ReflexControl";
import BadgeSmartSpenderTeen from "./pages/Student/Finance/Teen/BadgeSmartSpenderTeen";

// Brain Health Game Levels for Kids
import WaterStory from "./pages/Student/Brain/Kids/WaterStory";
import QuizOnBrainFood from "./pages/Student/Brain/Kids/QuizOnBrainFood";
import ReflexBrainBoost from "./pages/Student/Brain/Kids/ReflexBrainBoost";
import PuzzleOfBrainCare from "./pages/Student/Brain/Kids/PuzzleOfBrainCare";
import BreakfastStory from "./pages/Student/Brain/Kids/BreakfastStory";
import PosterBrainHealth from "./pages/Student/Brain/Kids/PosterBrainHealth";
import JournalOfHabits from "./pages/Student/Brain/Kids/JournalOfHabits";
import SportsStory from "./pages/Student/Brain/Kids/SportsStory";
import ReflexDailyHabit from "./pages/Student/Brain/Kids/ReflexDailyHabit";
import BadgeBrainCareKid from "./pages/Student/Brain/Kids/BadgeBrainCareKid";
import ClassroomStory from "./pages/Student/Brain/Kids/ClassroomStory";
import QuizOnFocus from "./pages/Student/Brain/Kids/QuizOnFocus";
import ReflexAttention from "./pages/Student/Brain/Kids/ReflexAttention";
import PuzzleOfFocus from "./pages/Student/Brain/Kids/PuzzleOfFocus";
import HomeworkStory from "./pages/Student/Brain/Kids/HomeworkStory";
import PosterFocusMatters from "./pages/Student/Brain/Kids/PosterFocusMatters";
import JournalOfFocus from "./pages/Student/Brain/Kids/JournalOfFocus";
import GameStory from "./pages/Student/Brain/Kids/GameStory";
import ReflexQuickAttention from "./pages/Student/Brain/Kids/ReflexQuickAttention";
import BadgeFocusKid from "./pages/Student/Brain/Kids/BadgeFocusKid";

// Brain Health Game Levels for Teens
import ExerciseStory from "./pages/Student/Brain/Teen/ExerciseStory";
import QuizOnHabits from "./pages/Student/Brain/Teen/QuizOnHabits";
import ReflexMindCheck from "./pages/Student/Brain/Teen/ReflexMindCheck";
import PuzzleBrainFuel from "./pages/Student/Brain/Teen/PuzzleBrainFuel";
import JunkFoodStory from "./pages/Student/Brain/Teen/JunkFoodStory";
import DebateBrainVsBody from "./pages/Student/Brain/Teen/DebateBrainVsBody";
import JournalOfBrainFitness from "./pages/Student/Brain/Teen/JournalOfBrainFitness";
import SimulationDailyRoutine from "./pages/Student/Brain/Teen/SimulationDailyRoutine";
import ReflexBrainBoostTeen from "./pages/Student/Brain/Teen/ReflexBrainBoost";
import BadgeBrainHealthHero from "./pages/Student/Brain/Teen/BadgeBrainHealthHero";
import ExamStory from "./pages/Student/Brain/Teen/ExamStory";
import QuizOnAttention from "./pages/Student/Brain/Teen/QuizOnAttention";
import ReflexConcentration from "./pages/Student/Brain/Teen/ReflexConcentration";
import PuzzleOfDistractions from "./pages/Student/Brain/Teen/PuzzleOfDistractions";
import SocialMediaStory from "./pages/Student/Brain/Teen/SocialMediaStory";
import DebateMultitaskVsFocus from "./pages/Student/Brain/Teen/DebateMultitaskVsFocus";
import JournalOfAttention from "./pages/Student/Brain/Teen/JournalOfAttention";
import SimulationStudyPlan from "./pages/Student/Brain/Teen/SimulationStudyPlan";
import ReflexDistractionAlert from "./pages/Student/Brain/Teen/ReflexDistractionAlert";
import BadgeFocusHero from "./pages/Student/Brain/Teen/BadgeFocusHero";

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
import LandingPage from "./pages/LandingPage";
import IndividualAccountSelection from "./pages/IndividualAccountSelection";

// Multi-tenant registration pages
import InstitutionTypeSelection from "./pages/MultiTenant/InstitutionTypeSelection";
import SchoolRegistration from "./pages/MultiTenant/SchoolRegistration";

// 404 Page
import NotFound from "./pages/NotFound";
import AssessmentHub from "./pages/Educator/AssessmentHub";
import ErrorBoundary from "./components/ErrorBoundary";
// Toast notification provider
import { Toaster } from "react-hot-toast";

// Additional Pages
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";

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

  // Hide navbar on public pages
  const isPublicPage = [
    "/about",
    "/careers",
    "/blog",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies"
  ].includes(location.pathname);

  // Hide footer on auth and registration pages
  const hideFooter = [
    "/login",
    "/school-registration",
    "/register",
    "/choose-account-type",
    "/register-parent",
    "/register-teacher",
    "/register-seller"
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
  {!isAuthPage &&
    !isFullScreenGame &&
    !isPublicPage &&
    location.pathname !== "/" &&
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
          
          {/* School Routes */}
          <Route path="/school/admin/dashboard" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminDashboard /></ProtectedRoute>} />
          <Route path="/school-teacher/dashboard" element={<ProtectedRoute roles={['school_teacher']}><SchoolTeacherDashboard /></ProtectedRoute>} />
          <Route path="/school-student/dashboard" element={<ProtectedRoute roles={['school_student']}><SchoolStudentDashboard /></ProtectedRoute>} />
          <Route path="/school-parent/dashboard" element={<ProtectedRoute roles={['school_parent']}><SchoolParentDashboard /></ProtectedRoute>} />
          
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
          <Route path="/student/finance/kids/piggy-bank-story" element={<ProtectedRoute roles={['student']}><PiggyBankStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/quiz-on-saving" element={<ProtectedRoute roles={['student']}><QuizOnSaving /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-savings" element={<ProtectedRoute roles={['student']}><ReflexSavings /></ProtectedRoute>} />
          <Route path="/student/finance/kids/puzzle-save-or-spend" element={<ProtectedRoute roles={['student']}><PuzzleSaveOrSpend /></ProtectedRoute>} />
          <Route path="/student/finance/kids/birthday-money-story" element={<ProtectedRoute roles={['student']}><BirthdayMoneyStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/poster-saving-habit" element={<ProtectedRoute roles={['student']}><PosterSavingHabit /></ProtectedRoute>} />
          <Route path="/student/finance/kids/journal-of-saving" element={<ProtectedRoute roles={['student']}><JournalOfSaving /></ProtectedRoute>} />
          <Route path="/student/finance/kids/shop-story" element={<ProtectedRoute roles={['student']}><ShopStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-money-choice" element={<ProtectedRoute roles={['student']}><ReflexMoneyChoice /></ProtectedRoute>} />
          <Route path="/student/finance/kids/badge-saver-kid" element={<ProtectedRoute roles={['student']}><BadgeSaverKid /></ProtectedRoute>} />
          <Route path="/student/finance/kids/ice-cream-story" element={<ProtectedRoute roles={['student']}><IceCreamStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/quiz-on-spending" element={<ProtectedRoute roles={['student']}><QuizOnSpending /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-spending" element={<ProtectedRoute roles={['student']}><ReflexSpending /></ProtectedRoute>} />
          <Route path="/student/finance/kids/puzzle-smart-vs-waste" element={<ProtectedRoute roles={['student']}><PuzzleSmartVsWaste /></ProtectedRoute>} />
          <Route path="/student/finance/kids/shop-story-2" element={<ProtectedRoute roles={['student']}><ShopStory2 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/poster-smart-shopping" element={<ProtectedRoute roles={['student']}><PosterSmartShopping /></ProtectedRoute>} />
          <Route path="/student/finance/kids/journal-of-smart-buy" element={<ProtectedRoute roles={['student']}><JournalOfSmartBuy /></ProtectedRoute>} />
          <Route path="/student/finance/kids/candy-offer-story" element={<ProtectedRoute roles={['student']}><CandyOfferStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-needs-first" element={<ProtectedRoute roles={['student']}><ReflexNeedsFirst /></ProtectedRoute>} />
          <Route path="/student/finance/kids/badge-smart-spender-kid" element={<ProtectedRoute roles={['student']}><BadgeSmartSpenderKid /></ProtectedRoute>} />

          {/* Finance Games for Teens */}
          <Route path="/student/finance/teen/pocket-money-story" element={<ProtectedRoute roles={['student']}><PocketMoneyStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/quiz-on-savings-rate" element={<ProtectedRoute roles={['student']}><QuizOnSavingsRate /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-smart-saver" element={<ProtectedRoute roles={['student']}><ReflexSmartSaver /></ProtectedRoute>} />
          <Route path="/student/finance/teen/puzzle-of-saving-goals" element={<ProtectedRoute roles={['student']}><PuzzleOfSavingGoals /></ProtectedRoute>} />
          <Route path="/student/finance/teen/salary-story" element={<ProtectedRoute roles={['student']}><SalaryStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/debate-save-vs-spend" element={<ProtectedRoute roles={['student']}><DebateSaveVsSpend /></ProtectedRoute>} />
          <Route path="/student/finance/teen/journal-of-saving-goal" element={<ProtectedRoute roles={['student']}><JournalOfSavingGoal /></ProtectedRoute>} />
          <Route path="/student/finance/teen/simulation-monthly-money" element={<ProtectedRoute roles={['student']}><SimulationMonthlyMoney /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-wise-use" element={<ProtectedRoute roles={['student']}><ReflexWiseUse /></ProtectedRoute>} />
          <Route path="/student/finance/teen/badge-smart-saver" element={<ProtectedRoute roles={['student']}><BadgeSmartSaver /></ProtectedRoute>} />
          <Route path="/student/finance/teen/allowance-story" element={<ProtectedRoute roles={['student']}><AllowanceStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/spending-quiz" element={<ProtectedRoute roles={['student']}><SpendingQuiz /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-wise-choices" element={<ProtectedRoute roles={['student']}><ReflexWiseChoices /></ProtectedRoute>} />
          <Route path="/student/finance/teen/puzzle-smart-spending" element={<ProtectedRoute roles={['student']}><PuzzleSmartSpending /></ProtectedRoute>} />
          <Route path="/student/finance/teen/party-story" element={<ProtectedRoute roles={['student']}><PartyStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/debate-needs-vs-wants" element={<ProtectedRoute roles={['student']}><DebateNeedsVsWants /></ProtectedRoute>} />
          <Route path="/student/finance/teen/journal-of-spending" element={<ProtectedRoute roles={['student']}><JournalOfSpending /></ProtectedRoute>} />
          <Route path="/student/finance/teen/simulation-shopping-mall" element={<ProtectedRoute roles={['student']}><SimulationShoppingMall /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-control" element={<ProtectedRoute roles={['student']}><ReflexControl /></ProtectedRoute>} />
          <Route path="/student/finance/teen/badge-smart-spender-teen" element={<ProtectedRoute roles={['student']}><BadgeSmartSpenderTeen /></ProtectedRoute>} />

          {/* Brain Health Games for Kids */}
          <Route path="/student/brain/kids/water-story" element={<ProtectedRoute roles={['student']}><WaterStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/quiz-on-brain-food" element={<ProtectedRoute roles={['student']}><QuizOnBrainFood /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-brain-boost" element={<ProtectedRoute roles={['student']}><ReflexBrainBoost /></ProtectedRoute>} />
          <Route path="/student/brain/kids/puzzle-of-brain-care" element={<ProtectedRoute roles={['student']}><PuzzleOfBrainCare /></ProtectedRoute>} />
          <Route path="/student/brain/kids/breakfast-story" element={<ProtectedRoute roles={['student']}><BreakfastStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/poster-brain-health" element={<ProtectedRoute roles={['student']}><PosterBrainHealth /></ProtectedRoute>} />
          <Route path="/student/brain/kids/journal-of-habits" element={<ProtectedRoute roles={['student']}><JournalOfHabits /></ProtectedRoute>} />
          <Route path="/student/brain/kids/sports-story" element={<ProtectedRoute roles={['student']}><SportsStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-daily-habit" element={<ProtectedRoute roles={['student']}><ReflexDailyHabit /></ProtectedRoute>} />
          <Route path="/student/brain/kids/badge-brain-care-kid" element={<ProtectedRoute roles={['student']}><BadgeBrainCareKid /></ProtectedRoute>} />
          <Route path="/student/brain/kids/classroom-story" element={<ProtectedRoute roles={['student']}><ClassroomStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/quiz-on-focus" element={<ProtectedRoute roles={['student']}><QuizOnFocus /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-attention" element={<ProtectedRoute roles={['student']}><ReflexAttention /></ProtectedRoute>} />
          <Route path="/student/brain/kids/puzzle-of-focus" element={<ProtectedRoute roles={['student']}><PuzzleOfFocus /></ProtectedRoute>} />
          <Route path="/student/brain/kids/homework-story" element={<ProtectedRoute roles={['student']}><HomeworkStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/poster-focus-matters" element={<ProtectedRoute roles={['student']}><PosterFocusMatters /></ProtectedRoute>} />
          <Route path="/student/brain/kids/journal-of-focus" element={<ProtectedRoute roles={['student']}><JournalOfFocus /></ProtectedRoute>} />
          <Route path="/student/brain/kids/game-story" element={<ProtectedRoute roles={['student']}><GameStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-quick-attention" element={<ProtectedRoute roles={['student']}><ReflexQuickAttention /></ProtectedRoute>} />
          <Route path="/student/brain/kids/badge-focus-kid" element={<ProtectedRoute roles={['student']}><BadgeFocusKid /></ProtectedRoute>} />

          {/* Brain Health Games for Teens */}
          <Route path="/student/brain/teen/exercise-story" element={<ProtectedRoute roles={['student']}><ExerciseStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/quiz-on-habits" element={<ProtectedRoute roles={['student']}><QuizOnHabits /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-mind-check" element={<ProtectedRoute roles={['student']}><ReflexMindCheck /></ProtectedRoute>} />
          <Route path="/student/brain/teen/puzzle-brain-fuel" element={<ProtectedRoute roles={['student']}><PuzzleBrainFuel /></ProtectedRoute>} />
          <Route path="/student/brain/teen/junk-food-story" element={<ProtectedRoute roles={['student']}><JunkFoodStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/debate-brain-vs-body" element={<ProtectedRoute roles={['student']}><DebateBrainVsBody /></ProtectedRoute>} />
          <Route path="/student/brain/teen/journal-of-brain-fitness" element={<ProtectedRoute roles={['student']}><JournalOfBrainFitness /></ProtectedRoute>} />
          <Route path="/student/brain/teen/simulation-daily-routine" element={<ProtectedRoute roles={['student']}><SimulationDailyRoutine /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-brain-boost" element={<ProtectedRoute roles={['student']}><ReflexBrainBoostTeen /></ProtectedRoute>} />
          <Route path="/student/brain/teen/badge-brain-health-hero" element={<ProtectedRoute roles={['student']}><BadgeBrainHealthHero /></ProtectedRoute>} />
          <Route path="/student/brain/teen/exam-story" element={<ProtectedRoute roles={['student']}><ExamStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/quiz-on-attention" element={<ProtectedRoute roles={['student']}><QuizOnAttention /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-concentration" element={<ProtectedRoute roles={['student']}><ReflexConcentration /></ProtectedRoute>} />
          <Route path="/student/brain/teen/puzzle-of-distractions" element={<ProtectedRoute roles={['student']}><PuzzleOfDistractions /></ProtectedRoute>} />
          <Route path="/student/brain/teen/social-media-story" element={<ProtectedRoute roles={['student']}><SocialMediaStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/debate-multitask-vs-focus" element={<ProtectedRoute roles={['student']}><DebateMultitaskVsFocus /></ProtectedRoute>} />
          <Route path="/student/brain/teen/journal-of-attention" element={<ProtectedRoute roles={['student']}><JournalOfAttention /></ProtectedRoute>} />
          <Route path="/student/brain/teen/simulation-study-plan" element={<ProtectedRoute roles={['student']}><SimulationStudyPlan /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-distraction-alert" element={<ProtectedRoute roles={['student']}><ReflexDistractionAlert /></ProtectedRoute>} />
          <Route path="/student/brain/teen/badge-focus-hero" element={<ProtectedRoute roles={['student']}><BadgeFocusHero /></ProtectedRoute>} />

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

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
      
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Toaster /> {/* Toast notification container */}
      {!hideFooter && <Footer />} {/* Footer component */}
    </div>
  );
};

export default App;