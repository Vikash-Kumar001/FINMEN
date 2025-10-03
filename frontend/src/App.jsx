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
import Games from "./pages/Student/Games";
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

// Game Components
import MindMaze from "./pages/Games/MindMaze";
import BreatheBalance from "./pages/Games/BreatheBalance";
import PiggyBankBuilder from "./pages/Games/PiggyBankBuilder";
import ShopSmart from "./pages/Games/ShopSmart";
import InvestQuest from "./pages/Games/InvestQuest";
import BudgetHero from "./pages/Games/BudgetHero";
import SpotThePattern from "./pages/Student/AI/SpotThePattern";
import CatOrDog from "./pages/Student/AI/CatOrDog";
import SortingColors from "./pages/Student/AI/SortingColors";
import TrueOrFalseAIQuiz from "./pages/Student/AI/TrueOrFalseAIQuiz";
import EmojiClassifier from "./pages/Student/AI/EmojiClassifier";
import SelfDrivingCarGame from "./pages/Student/AI/SelfDrivingCarGame";
import PatternFindingPuzzle from "./pages/Student/AI/PatternFindingPuzzle";
import RobotHelperStory from "./pages/Student/AI/RobotHelperStory";
import SpamVsNotSpam from "./pages/Student/AI/SpamVsNotSpam";
import SiriAlexaQuiz from "./pages/Student/AI/SiriAlexaQuiz";
import AIInGames from "./pages/Student/AI/AIInGames";
import MatchAITools from "./pages/Student/AI/MatchAITools";
import PatternMusicGame from "./pages/Student/AI/PatternMusicGame";
import RobotVisionGame from "./pages/Student/AI/RobotVisionGame";
import SmartHomeStory from "./pages/Student/AI/SmartHomeStory";
import TrainTheRobot from "./pages/Student/AI/TrainTheRobot";
import PredictionPuzzle from "./pages/Student/AI/PredictionPuzzle";
import TrafficLightAI from "./pages/Student/AI/TrafficLightAI";
import AIInMapsStory from "./pages/Student/AI/AIInMapsStory";
import YoutubeRecommendationGame from "./pages/Student/AI/YoutubeRecommendationGame";
import SmartFridgeStory from "./pages/Student/AI/SmartFridgeStory";
import ChatbotFriend from "./pages/Student/AI/ChatbotFriend";
import FaceUnlockGame from "./pages/Student/AI/FaceUnlockGame";
import AIOrHumanQuiz from "./pages/Student/AI/AIOrHumanQuiz";
import SmartSpeakerStory from "./pages/Student/AI/SmartSpeakerStory";
import AIDoctorSimulation from "./pages/Student/AI/AIDoctorSimulation";
import RobotVacuumGame from "./pages/Student/AI/RobotVacuumGame";
import AITranslatorQuiz from "./pages/Student/AI/AITranslatorQuiz";
import WeatherPredictionStory from "./pages/Student/AI/WeatherPredictionStory";
import SmartwatchGame from "./pages/Student/AI/SmartwatchGame";
import OnlineShoppingAI from "./pages/Student/AI/OnlineShoppingAI";
import AirportScannerStory from "./pages/Student/AI/AirportScannerStory";
import SmartFarmingQuiz from "./pages/Student/AI/SmartFarmingQuiz";
import AIArtistGame from "./pages/Student/AI/AIArtistGame";
import MusicAIStory from "./pages/Student/AI/MusicAIStory";
import AIInBankingQuiz from "./pages/Student/AI/AIInBankingQuiz";
import SmartCityTrafficGame from "./pages/Student/AI/SmartCityTrafficGame";
import AINewsStory from "./pages/Student/AI/AINewsStory";
import AIDoctorQuiz from "./pages/Student/AI/AIDoctorQuiz";
import SmartHomeLightsGame from "./pages/Student/AI/SmartHomeLightsGame";
import AIDailyLifeBadge from "./pages/Student/AI/AIDailyLifeBadge";
import VoiceAssistantQuiz from "./pages/Student/AI/VoiceAssistantQuiz";
import FriendlyAIQuiz from "./pages/Student/AI/FriendlyAIQuiz";
import RobotEmotionStory from "./pages/Student/AI/RobotEmotionStory";
import RecommendationGame from "./pages/Student/AI/RecommendationGame";
import AIOrNotQuiz from "./pages/Student/AI/AIOrNotQuiz";
import RobotHelperReflex from "./pages/Student/AI/RobotHelperReflex";
import MatchAIUses from "./pages/Student/AI/MatchAIUses";
import SortingAnimals from "./pages/Student/AI/SortingAnimals";
import AIBasicsBadge from "./pages/Student/AI/AIBasicsBadge";


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
  const isFullScreenGame = location.pathname.startsWith("/student/games/ai/");

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
          <Route path="/student/quick-start" element={<ProtectedRoute roles={['student']}><QuickStart /></ProtectedRoute>} />
          <Route path="/student/this-week" element={<ProtectedRoute roles={['student']}><ThisWeek /></ProtectedRoute>} />
          <Route path="/student/daily-goal" element={<ProtectedRoute roles={['student']}><DailyGoal /></ProtectedRoute>} />
          <Route path="/student/daily-challenges" element={<ProtectedRoute roles={['student']}><DailyChallenges /></ProtectedRoute>} />
          <Route path="/student/challenge" element={<ProtectedRoute roles={['student']}><Challenge /></ProtectedRoute>} />
          <Route path="/learn/financial-literacy" element={<ProtectedRoute roles={['student']}><FinancialLiteracy /></ProtectedRoute>} />
          <Route path="/tools/budget-planner" element={<ProtectedRoute roles={['student']}><BudgetPlanner /></ProtectedRoute>} />
          <Route path="/games/investment-simulator" element={<ProtectedRoute roles={['student']}><InvestmentSimulator /></ProtectedRoute>} />
          {/* AI Education Pattern Games */}
          <Route path="/student/games/ai/spot-the-pattern" element={<ProtectedRoute roles={['student']}><SpotThePattern /></ProtectedRoute>} />
          <Route path="/student/games/ai/cat-or-dog" element={<ProtectedRoute roles={['student']}><CatOrDog /></ProtectedRoute>} />
          <Route path="/student/games/ai/sorting-colors" element={<ProtectedRoute roles={['student']}><SortingColors /></ProtectedRoute>} />
          <Route path="/student/games/ai/true-or-false-ai-quiz" element={<ProtectedRoute roles={['student']}><TrueOrFalseAIQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/emoji-classifier" element={<ProtectedRoute roles={['student']}><EmojiClassifier /></ProtectedRoute>} />
          <Route path="/student/games/ai/self-driving-car-game" element={<ProtectedRoute roles={['student']}><SelfDrivingCarGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/pattern-finding-puzzle" element={<ProtectedRoute roles={['student']}><PatternFindingPuzzle /></ProtectedRoute>} />
          <Route path="/student/games/ai/robot-helper-story" element={<ProtectedRoute roles={['student']}><RobotHelperStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/spam-vs-not-spam" element={<ProtectedRoute roles={['student']}><SpamVsNotSpam /></ProtectedRoute>} />
          <Route path="/student/games/ai/siri-alexa-quiz" element={<ProtectedRoute roles={['student']}><SiriAlexaQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-in-games" element={<ProtectedRoute roles={['student']}><AIInGames /></ProtectedRoute>} />
          <Route path="/student/games/ai/match-ai-tools" element={<ProtectedRoute roles={['student']}><MatchAITools /></ProtectedRoute>} />
          <Route path="/student/games/ai/pattern-music-game" element={<ProtectedRoute roles={['student']}><PatternMusicGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/robot-vision-game" element={<ProtectedRoute roles={['student']}><RobotVisionGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/smart-home-story" element={<ProtectedRoute roles={['student']}><SmartHomeStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/train-the-robot" element={<ProtectedRoute roles={['student']}><TrainTheRobot /></ProtectedRoute>} />
          <Route path="/student/games/ai/prediction-puzzle" element={<ProtectedRoute roles={['student']}><PredictionPuzzle /></ProtectedRoute>} />
          <Route path="/student/games/ai/friendly-ai-quiz" element={<ProtectedRoute roles={['student']}><FriendlyAIQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/robot-emotion-story" element={<ProtectedRoute roles={['student']}><RobotEmotionStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/recommendation-game" element={<ProtectedRoute roles={['student']}><RecommendationGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-or-not-quiz" element={<ProtectedRoute roles={['student']}><AIOrNotQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/robot-helper-reflex" element={<ProtectedRoute roles={['student']}><RobotHelperReflex /></ProtectedRoute>} />
          <Route path="/student/games/ai/match-ai-uses" element={<ProtectedRoute roles={['student']}><MatchAIUses /></ProtectedRoute>} />
          <Route path="/student/games/ai/sorting-animals" element={<ProtectedRoute roles={['student']}><SortingAnimals /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-basics-badge" element={<ProtectedRoute roles={['student']}><AIBasicsBadge /></ProtectedRoute>} />

          <Route path="/student/games/ai/traffic-light-ai" element={<ProtectedRoute roles={['student']}><TrafficLightAI /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-in-maps-story" element={<ProtectedRoute roles={['student']}><AIInMapsStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/voice-assistant-quiz" element={<ProtectedRoute roles={['student']}><VoiceAssistantQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/youtube-recommendation-game" element={<ProtectedRoute roles={['student']}><YoutubeRecommendationGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/smart-fridge-story" element={<ProtectedRoute roles={['student']}><SmartFridgeStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/chatbot-friend" element={<ProtectedRoute roles={['student']}><ChatbotFriend /></ProtectedRoute>} />
          <Route path="/student/games/ai/face-unlock-game" element={<ProtectedRoute roles={['student']}><FaceUnlockGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-or-human-quiz" element={<ProtectedRoute roles={['student']}><AIOrHumanQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/smart-speaker-story" element={<ProtectedRoute roles={['student']}><SmartSpeakerStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-doctor-simulation" element={<ProtectedRoute roles={['student']}><AIDoctorSimulation /></ProtectedRoute>} />
          <Route path="/student/games/ai/robot-vacuum-game" element={<ProtectedRoute roles={['student']}><RobotVacuumGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-translator-quiz" element={<ProtectedRoute roles={['student']}><AITranslatorQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/weather-prediction-story" element={<ProtectedRoute roles={['student']}><WeatherPredictionStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/smartwatch-game" element={<ProtectedRoute roles={['student']}><SmartwatchGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/online-shopping-ai" element={<ProtectedRoute roles={['student']}><OnlineShoppingAI /></ProtectedRoute>} />
          <Route path="/student/games/ai/airport-scanner-story" element={<ProtectedRoute roles={['student']}><AirportScannerStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/smart-farming-quiz" element={<ProtectedRoute roles={['student']}><SmartFarmingQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-artist-game" element={<ProtectedRoute roles={['student']}><AIArtistGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/music-ai-story" element={<ProtectedRoute roles={['student']}><MusicAIStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-in-banking-quiz" element={<ProtectedRoute roles={['student']}><AIInBankingQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/smart-city-traffic-game" element={<ProtectedRoute roles={['student']}><SmartCityTrafficGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-news-story" element={<ProtectedRoute roles={['student']}><AINewsStory /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-doctor-quiz" element={<ProtectedRoute roles={['student']}><AIDoctorQuiz /></ProtectedRoute>} />
          <Route path="/student/games/ai/smart-home-lights-game" element={<ProtectedRoute roles={['student']}><SmartHomeLightsGame /></ProtectedRoute>} />
          <Route path="/student/games/ai/ai-daily-life-badge" element={<ProtectedRoute roles={['student']}><AIDailyLifeBadge /></ProtectedRoute>} />
          <Route path="/tools/savings-goals" element={<ProtectedRoute roles={['student']}><SavingsGoals /></ProtectedRoute>} />
          <Route path="/learn/financial-quiz" element={<ProtectedRoute roles={['student']}><FinancialQuiz /></ProtectedRoute>} />
          <Route path="/tools/expense-tracker" element={<ProtectedRoute roles={['student']}><ExpenseTracker /></ProtectedRoute>} />
          
          {/* Game Routes */}
          <Route path="/games/mind-maze" element={<ProtectedRoute roles={['student']}><MindMaze /></ProtectedRoute>} />
          <Route path="/games/breathe-balance" element={<ProtectedRoute roles={['student']}><BreatheBalance /></ProtectedRoute>} />
          <Route path="/games/piggy-bank-builder" element={<ProtectedRoute roles={['student']}><PiggyBankBuilder /></ProtectedRoute>} />
          <Route path="/games/shop-smart" element={<ProtectedRoute roles={['student']}><ShopSmart /></ProtectedRoute>} />
          <Route path="/games/invest-quest" element={<ProtectedRoute roles={['student']}><InvestQuest /></ProtectedRoute>} />
          <Route path="/games/budget-hero" element={<ProtectedRoute roles={['student']}><BudgetHero /></ProtectedRoute>} />

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
    </div>
  );
};

export default App;
