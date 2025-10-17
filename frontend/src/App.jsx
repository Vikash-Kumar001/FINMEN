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
import Setting from "./components/Settings";
import BreathingExercise from "./pages/Student/BreathingExercise";
import DailyChallenges from "./pages/Student/DailyChallenges";
import Challenge from "./pages/Student/Challenge";
import FinancialLiteracy from "./pages/Student/FinancialLiteracy";
import BudgetPlanner from "./pages/Student/BudgetPlanner";
import InvestmentSimulator from "./pages/Student/InvestmentSimulator";
import SavingsGoals from "./pages/Student/SavingsGoals";
import FinancialQuiz from "./pages/Student/FinancialQuiz";
import ExpenseTracker from "./pages/Student/ExpenseTracker";
import GameCategoryPage from "./pages/Games/GameCategoryPage";
import DCOSGames from "./pages/Games/DCOSGames";
import BrainTeaserGames from "./pages/Games/BrainTeaserGames";
import BrainTeaserPlay from "./pages/Games/BrainTeaserPlay";

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

// UVLS Kids Games - Set 1 (Empathy & Compassion)
import ShareYourToy from "./pages/Student/UVLS/Kids/ShareYourToy";
import FeelingsQuiz from "./pages/Student/UVLS/Kids/FeelingsQuiz";
import KindReflex from "./pages/Student/UVLS/Kids/KindReflex";
import MatchFaces from "./pages/Student/UVLS/Kids/MatchFaces";
import SpotHelp from "./pages/Student/UVLS/Kids/SpotHelp";
import KindPoster from "./pages/Student/UVLS/Kids/KindPoster";
import MiniJournal from "./pages/Student/UVLS/Kids/MiniJournal";
import ComfortRoleplay from "./pages/Student/UVLS/Kids/ComfortRoleplay";
import ShareReflex from "./pages/Student/UVLS/Kids/ShareReflex";
import LittleEmpathBadge from "./pages/Student/UVLS/Kids/LittleEmpathBadge";

// UVLS Kids Games - Set 2 (Respect & Inclusion)
import GreetTheNewKid from "./pages/Student/UVLS/Kids/GreetTheNewKid";
import PoliteWordsQuiz from "./pages/Student/UVLS/Kids/PoliteWordsQuiz";
import RespectTap from "./pages/Student/UVLS/Kids/RespectTap";
import InclusionMatch from "./pages/Student/UVLS/Kids/InclusionMatch";
import InviteToPlay from "./pages/Student/UVLS/Kids/InviteToPlay";
import InclusionPoster from "./pages/Student/UVLS/Kids/InclusionPoster";
import InclusionJournal from "./pages/Student/UVLS/Kids/InclusionJournal";
import InviteRoleplay from "./pages/Student/UVLS/Kids/InviteRoleplay";
import RespectSignals from "./pages/Student/UVLS/Kids/RespectSignals";
import InclusiveKidBadge from "./pages/Student/UVLS/Kids/InclusiveKidBadge";

// UVLS Teen Games
import ListenDeep from "./pages/Student/UVLS/Teen/ListenDeep";
import EmpathyQuizTeen from "./pages/Student/UVLS/Teen/EmpathyQuiz";
import PerspectivePuzzle from "./pages/Student/UVLS/Teen/PerspectivePuzzle";
import WalkInShoes from "./pages/Student/UVLS/Teen/WalkInShoes";
import EmpathyDebate from "./pages/Student/UVLS/Teen/EmpathyDebate";
import ReflectiveJournal from "./pages/Student/UVLS/Teen/ReflectiveJournal";
import PeerSupportRoleplay from "./pages/Student/UVLS/Teen/PeerSupportRoleplay";
import CaseResponsePuzzle from "./pages/Student/UVLS/Teen/CaseResponsePuzzle";
import SpotDistressReflex from "./pages/Student/UVLS/Teen/SpotDistressReflex";
import EmpathyChampionBadge from "./pages/Student/UVLS/Teen/EmpathyChampionBadge";
import CulturalGreeting from "./pages/Student/UVLS/Teen/CulturalGreeting";
import InclusionQuizTeen from "./pages/Student/UVLS/Teen/InclusionQuiz";
import AccessibilityPuzzle from "./pages/Student/UVLS/Teen/AccessibilityPuzzle";
import InclusiveClassSimulation from "./pages/Student/UVLS/Teen/InclusiveClassSimulation";
import RespectDebate from "./pages/Student/UVLS/Teen/RespectDebate";
import InclusionJournalTeen from "./pages/Student/UVLS/Teen/InclusionJournal";
import CorrectingBiasRoleplay from "./pages/Student/UVLS/Teen/CorrectingBiasRoleplay";
import NameRespectReflex from "./pages/Student/UVLS/Teen/NameRespectReflex";
import PolicyCasePuzzle from "./pages/Student/UVLS/Teen/PolicyCasePuzzle";
import RespectLeaderBadge from "./pages/Student/UVLS/Teen/RespectLeaderBadge";

// DCOS Kids Games
import StrongPasswordReflex from "./pages/Student/DCOS/Kids/StrongPasswordReflex";
import StrangerChatStory from "./pages/Student/DCOS/Kids/StrangerChatStory";
import PhotoShareQuiz from "./pages/Student/DCOS/Kids/PhotoShareQuiz";
import PersonalInfoPuzzle from "./pages/Student/DCOS/Kids/PersonalInfoPuzzle";
import GameInviteReflex from "./pages/Student/DCOS/Kids/GameInviteReflex";
import SafetyPoster from "./pages/Student/DCOS/Kids/SafetyPoster";
import FamilyRulesStory from "./pages/Student/DCOS/Kids/FamilyRulesStory";
import DeviceSharingQuiz from "./pages/Student/DCOS/Kids/DeviceSharingQuiz";
import OnlineFriendReflex from "./pages/Student/DCOS/Kids/OnlineFriendReflex";
import SafeUserBadge from "./pages/Student/DCOS/Kids/SafeUserBadge";
import SpotBullyQuiz from "./pages/Student/DCOS/Kids/SpotBullyQuiz";
import KindWordsReflex from "./pages/Student/DCOS/Kids/KindWordsReflex";
import SmileStory from "./pages/Student/DCOS/Kids/SmileStory";
import GossipPuzzle from "./pages/Student/DCOS/Kids/GossipPuzzle";
import PlaygroundBystander from "./pages/Student/DCOS/Kids/PlaygroundBystander";
import CyberBullyReport from "./pages/Student/DCOS/Kids/CyberBullyReport";
import RoleSwap from "./pages/Student/DCOS/Kids/RoleSwap";
import KindnessJournal from "./pages/Student/DCOS/Kids/KindnessJournal";
import FriendshipReflex from "./pages/Student/DCOS/Kids/FriendshipReflex";
import KindFriendBadge from "./pages/Student/DCOS/Kids/KindFriendBadge";

// DCOS Teen Games
import PasswordSharingStory from "./pages/Student/DCOS/Teen/PasswordSharingStory";
import PrivacySettingsQuiz from "./pages/Student/DCOS/Teen/PrivacySettingsQuiz";
import OTPFraudReflex from "./pages/Student/DCOS/Teen/OTPFraudReflex";
import ProfilePictureSimulation from "./pages/Student/DCOS/Teen/ProfilePictureSimulation";
import SocialMediaJournal from "./pages/Student/DCOS/Teen/SocialMediaJournal";
import DataConsentQuiz from "./pages/Student/DCOS/Teen/DataConsentQuiz";
import FakeFriendStory from "./pages/Student/DCOS/Teen/FakeFriendStory";
import SafetyReflex from "./pages/Student/DCOS/Teen/SafetyReflex";
import DebateStageOnlineFriends from "./pages/Student/DCOS/Teen/DebateStageOnlineFriends";
import OnlineSafetyBadge from "./pages/Student/DCOS/Teen/OnlineSafetyBadge";
import CyberBullyReflex from "./pages/Student/DCOS/Teen/CyberBullyReflex";
import PeerPressureStory from "./pages/Student/DCOS/Teen/PeerPressureStory";
import GossipChainSimulation from "./pages/Student/DCOS/Teen/GossipChainSimulation";
import DebateStageTrolling from "./pages/Student/DCOS/Teen/DebateStageTrolling";
import DiversityQuiz from "./pages/Student/DCOS/Teen/DiversityQuiz";
import EncourageRoleplay from "./pages/Student/DCOS/Teen/EncourageRoleplay";
import EmpathyJournal from "./pages/Student/DCOS/Teen/EmpathyJournal";
import AntiBullyReflex from "./pages/Student/DCOS/Teen/AntiBullyReflex";
import UpstanderSimulation from "./pages/Student/DCOS/Teen/UpstanderSimulation";
import CourageBadge from "./pages/Student/DCOS/Teen/CourageBadge";

// Moral Values Kids Games
import LostPencilStory from "./pages/Student/MoralValues/Kids/LostPencilStory";
import HomeworkQuiz from "./pages/Student/MoralValues/Kids/HomeworkQuiz";
import TruthReflex from "./pages/Student/MoralValues/Kids/TruthReflex";
import PuzzleOfTrust from "./pages/Student/MoralValues/Kids/PuzzleOfTrust";
import CheatingStory from "./pages/Student/MoralValues/Kids/CheatingStory";
import PosterOfHonesty from "./pages/Student/MoralValues/Kids/PosterOfHonesty";
import JournalOfTruth from "./pages/Student/MoralValues/Kids/JournalOfTruth";
import CandyShopStory from "./pages/Student/MoralValues/Kids/CandyShopStory";
import ReflexQuickChoice from "./pages/Student/MoralValues/Kids/ReflexQuickChoice";
import BadgeTruthfulKid from "./pages/Student/MoralValues/Kids/BadgeTruthfulKid";
import RespectEldersStory from "./pages/Student/MoralValues/Kids/RespectEldersStory";
import PoliteWordsQuiz2 from "./pages/Student/MoralValues/Kids/PoliteWordsQuiz2";
import ReflexRespect from "./pages/Student/MoralValues/Kids/ReflexRespect";
import PuzzleRespectMatch from "./pages/Student/MoralValues/Kids/PuzzleRespectMatch";
import TeacherGreetingStory from "./pages/Student/MoralValues/Kids/TeacherGreetingStory";
import GratitudePoster from "./pages/Student/MoralValues/Kids/GratitudePoster";
import JournalOfGratitude from "./pages/Student/MoralValues/Kids/JournalOfGratitude";
import PlaygroundRespectStory from "./pages/Student/MoralValues/Kids/PlaygroundRespectStory";
import ReflexHelp from "./pages/Student/MoralValues/Kids/ReflexHelp";
import BadgeRespectKid from "./pages/Student/MoralValues/Kids/BadgeRespectKid";

// Moral Values Teen Games
import FriendLieStory from "./pages/Student/MoralValues/Teen/FriendLieStory";
import WhiteLieQuiz from "./pages/Student/MoralValues/Teen/WhiteLieQuiz";
import ReflexSpotFake from "./pages/Student/MoralValues/Teen/ReflexSpotFake";
import PuzzleOfIntegrity from "./pages/Student/MoralValues/Teen/PuzzleOfIntegrity";
import BribeSimulation from "./pages/Student/MoralValues/Teen/BribeSimulation";
import DebateLyingForFriend from "./pages/Student/MoralValues/Teen/DebateLyingForFriend";
import IntegrityJournal from "./pages/Student/MoralValues/Teen/IntegrityJournal";
import ExamCheatingStory from "./pages/Student/MoralValues/Teen/ExamCheatingStory";
import RoleplayTruthfulLeader from "./pages/Student/MoralValues/Teen/RoleplayTruthfulLeader";
import BadgeIntegrityHero from "./pages/Student/MoralValues/Teen/BadgeIntegrityHero";
import DebateObeyOrQuestion from "./pages/Student/MoralValues/Teen/DebateObeyOrQuestion";
import GratitudeStory from "./pages/Student/MoralValues/Teen/GratitudeStory";
import ReflexPoliteness from "./pages/Student/MoralValues/Teen/ReflexPoliteness";
import PuzzleOfGratitude from "./pages/Student/MoralValues/Teen/PuzzleOfGratitude";
import ServiceStory from "./pages/Student/MoralValues/Teen/ServiceStory";
import RespectJournal from "./pages/Student/MoralValues/Teen/RespectJournal";
import DebateRespectTeachers from "./pages/Student/MoralValues/Teen/DebateRespectTeachers";
import RoleplayRespectLeader from "./pages/Student/MoralValues/Teen/RoleplayRespectLeader";
import ReflexGratitude from "./pages/Student/MoralValues/Teen/ReflexGratitude";
import BadgeGratitudeHero from "./pages/Student/MoralValues/Teen/BadgeGratitudeHero";

// AI For All Kids Games
import SpotThePattern from "./pages/Student/AiForAll/Kids/SpotThePattern";
import CatOrDogGame from "./pages/Student/AiForAll/Kids/CatOrDogGame";
import SortingColors from "./pages/Student/AiForAll/Kids/SortingColors";
import TrueFalseAIQuiz from "./pages/Student/AiForAll/Kids/TrueFalseAIQuiz";
import EmojiClassifier from "./pages/Student/AiForAll/Kids/EmojiClassifier";
import SelfDrivingCar from "./pages/Student/AiForAll/Kids/SelfDrivingCar";
import PatternFinderPuzzle from "./pages/Student/AiForAll/Kids/PatternFinderPuzzle";
import RobotHelperStory from "./pages/Student/AiForAll/Kids/RobotHelperStory";
import SpamVsNotSpam from "./pages/Student/AiForAll/Kids/SpamVsNotSpam";
import SiriAlexaQuiz from "./pages/Student/AiForAll/Kids/SiriAlexaQuiz";
import AIInGames from "./pages/Student/AiForAll/Kids/AIInGames";
import MatchAITools from "./pages/Student/AiForAll/Kids/MatchAITools";
import PatternMusicGame from "./pages/Student/AiForAll/Kids/PatternMusicGame";
import RobotVisionGame from "./pages/Student/AiForAll/Kids/RobotVisionGame";
import SmartHomeStory from "./pages/Student/AiForAll/Kids/SmartHomeStory";
import TrainTheRobot from "./pages/Student/AiForAll/Kids/TrainTheRobot";
import PredictionPuzzle from "./pages/Student/AiForAll/Kids/PredictionPuzzle";
import FriendlyAIQuiz from "./pages/Student/AiForAll/Kids/FriendlyAIQuiz";
import RobotEmotionStory from "./pages/Student/AiForAll/Kids/RobotEmotionStory";
import RecommendationGame from "./pages/Student/AiForAll/Kids/RecommendationGame";

// AI For All Teen Games
import WhatIsAIQuiz from "./pages/Student/AiForAll/Teen/WhatIsAIQuiz";
import PatternPredictionPuzzle from "./pages/Student/AiForAll/Teen/PatternPredictionPuzzle";
import ImageClassifierGame from "./pages/Student/AiForAll/Teen/ImageClassifierGame";
import HumanVsAIQuiz from "./pages/Student/AiForAll/Teen/HumanVsAIQuiz";
import PredictNextWord from "./pages/Student/AiForAll/Teen/PredictNextWord";
import SelfDrivingCarReflex from "./pages/Student/AiForAll/Teen/SelfDrivingCarReflex";
import SortingEmotionsGame from "./pages/Student/AiForAll/Teen/SortingEmotionsGame";
import TrueFalseAIQuizTeen from "./pages/Student/AiForAll/Teen/TrueFalseAIQuiz";
import ChatbotSimulation from "./pages/Student/AiForAll/Teen/ChatbotSimulation";
import AIInGamingStory from "./pages/Student/AiForAll/Teen/AIInGamingStory";
import PatternMusicReflexTeen from "./pages/Student/AiForAll/Teen/PatternMusicReflex";
import ComputerVisionBasics from "./pages/Student/AiForAll/Teen/ComputerVisionBasics";
import AIInSmartphonesQuiz from "./pages/Student/AiForAll/Teen/AIInSmartphonesQuiz";
import PredictionStory from "./pages/Student/AiForAll/Teen/PredictionStory";
import MachineVsHumanReflex from "./pages/Student/AiForAll/Teen/MachineVsHumanReflex";
import LanguageAIQuiz from "./pages/Student/AiForAll/Teen/LanguageAIQuiz";
import SimpleAlgorithmPuzzle from "./pages/Student/AiForAll/Teen/SimpleAlgorithmPuzzle";
import SmartHomeStoryTeen from "./pages/Student/AiForAll/Teen/SmartHomeStory";
import RecommendationSimulation from "./pages/Student/AiForAll/Teen/RecommendationSimulation";
import AIEverywhereQuiz from "./pages/Student/AiForAll/Teen/AIEverywhereQuiz";

// EHE Kids Games
import DoctorStory from "./pages/Student/EHE/Kids/DoctorStory";
import QuizOnJobs from "./pages/Student/EHE/Kids/QuizOnJobs";
import ReflexJobMatch from "./pages/Student/EHE/Kids/ReflexJobMatch";
import PuzzleWhoDoesWhat from "./pages/Student/EHE/Kids/PuzzleWhoDoesWhat";
import DreamJobStory from "./pages/Student/EHE/Kids/DreamJobStory";
import PosterMyDreamJob from "./pages/Student/EHE/Kids/PosterMyDreamJob";
import JournalOfJobs from "./pages/Student/EHE/Kids/JournalOfJobs";
import SchoolHelperStory from "./pages/Student/EHE/Kids/SchoolHelperStory";
import ReflexCareerCheck from "./pages/Student/EHE/Kids/ReflexCareerCheck";
import BadgeCareerExplorer from "./pages/Student/EHE/Kids/BadgeCareerExplorer";
import IdeaStory from "./pages/Student/EHE/Kids/IdeaStory";
import QuizOnSkills from "./pages/Student/EHE/Kids/QuizOnSkills";
import ReflexSkillCheck from "./pages/Student/EHE/Kids/ReflexSkillCheck";
import PuzzleMatchSkills from "./pages/Student/EHE/Kids/PuzzleMatchSkills";
import TeamworkStory from "./pages/Student/EHE/Kids/TeamworkStory";
import PosterSkillsForSuccess from "./pages/Student/EHE/Kids/PosterSkillsForSuccess";
import JournalOfSkills from "./pages/Student/EHE/Kids/JournalOfSkills";
import RiskStory from "./pages/Student/EHE/Kids/RiskStory";
import ReflexInnovation from "./pages/Student/EHE/Kids/ReflexInnovation";
import BadgeYoungInnovator from "./pages/Student/EHE/Kids/BadgeYoungInnovator";

// EHE Teen Games
import CareerStory from "./pages/Student/EHE/Teen/CareerStory";
import QuizOnCareers from "./pages/Student/EHE/Teen/QuizOnCareers";
import ReflexTeenCareer from "./pages/Student/EHE/Teen/ReflexTeenCareer";
import PuzzleCareerMatch from "./pages/Student/EHE/Teen/PuzzleCareerMatch";
import PassionStory from "./pages/Student/EHE/Teen/PassionStory";
import DebateOneCareerOrMany from "./pages/Student/EHE/Teen/DebateOneCareerOrMany";
import JournalOfCareerChoice from "./pages/Student/EHE/Teen/JournalOfCareerChoice";
import SimulationCareerFair from "./pages/Student/EHE/Teen/SimulationCareerFair";
import ReflexFutureCheck from "./pages/Student/EHE/Teen/ReflexFutureCheck";
import BadgeCareerAwareTeen from "./pages/Student/EHE/Teen/BadgeCareerAwareTeen";
import OpportunityStory from "./pages/Student/EHE/Teen/OpportunityStory";
import QuizOnEntrepreneurTraits from "./pages/Student/EHE/Teen/QuizOnEntrepreneurTraits";
import ReflexTeenSkills from "./pages/Student/EHE/Teen/ReflexTeenSkills";
import PuzzleMatchTraits from "./pages/Student/EHE/Teen/PuzzleMatchTraits";
import FailureStory from "./pages/Student/EHE/Teen/FailureStory";
import DebateBornOrMade from "./pages/Student/EHE/Teen/DebateBornOrMade";
import JournalOfStrengths from "./pages/Student/EHE/Teen/JournalOfStrengths";
import SimulationTeamProject from "./pages/Student/EHE/Teen/SimulationTeamProject";
import ReflexTeenInnovator from "./pages/Student/EHE/Teen/ReflexTeenInnovator";
import BadgeFutureEntrepreneur from "./pages/Student/EHE/Teen/BadgeFutureEntrepreneur";

// CRGC Kids Games
import FriendsSadStory from "./pages/Student/CRGC/Kids/FriendsSadStory";
import QuizOnEmpathy from "./pages/Student/CRGC/Kids/QuizOnEmpathy";
import ReflexKindness from "./pages/Student/CRGC/Kids/ReflexKindness";
import PuzzleMatchFeelings from "./pages/Student/CRGC/Kids/PuzzleMatchFeelings";
import AnimalStory from "./pages/Student/CRGC/Kids/AnimalStory";
import PosterBeKindAlways from "./pages/Student/CRGC/Kids/PosterBeKindAlways";
import JournalOfEmpathy from "./pages/Student/CRGC/Kids/JournalOfEmpathy";
import BullyStory from "./pages/Student/CRGC/Kids/BullyStory";
import ReflexHelpAlert from "./pages/Student/CRGC/Kids/ReflexHelpAlert";
import BadgeKindKid from "./pages/Student/CRGC/Kids/BadgeKindKid";
import ClassroomStoryCRGC from "./pages/Student/CRGC/Kids/ClassroomStory";
import QuizOnRespect from "./pages/Student/CRGC/Kids/QuizOnRespect";
import ReflexRespectCRGC from "./pages/Student/CRGC/Kids/ReflexRespectCRGC";
import PuzzleRespectMatchCRGC from "./pages/Student/CRGC/Kids/PuzzleRespectMatch";
import GenderStory from "./pages/Student/CRGC/Kids/GenderStory";
import PosterRespectAll from "./pages/Student/CRGC/Kids/PosterRespectAll";
import JournalOfRespect from "./pages/Student/CRGC/Kids/JournalOfRespect";
import DisabilityStory from "./pages/Student/CRGC/Kids/DisabilityStory";
import ReflexInclusion from "./pages/Student/CRGC/Kids/ReflexInclusion";
import BadgeRespectKidCRGC from "./pages/Student/CRGC/Kids/BadgeRespectKid";

// CRGC Teen Games
import StrangerStory from "./pages/Student/CRGC/Teen/StrangerStory";
import QuizOnCompassionTeen from "./pages/Student/CRGC/Teen/QuizOnCompassion";
import ReflexTeenCompassion from "./pages/Student/CRGC/Teen/ReflexTeenCompassion";
import PuzzleKindActs from "./pages/Student/CRGC/Teen/PuzzleKindActs";
import RefugeeStory from "./pages/Student/CRGC/Teen/RefugeeStory";
import DebateKindnessWeakness from "./pages/Student/CRGC/Teen/DebateKindnessWeakness";
import JournalOfCompassionTeen from "./pages/Student/CRGC/Teen/JournalOfCompassion";
import SimulationHospitalVisit from "./pages/Student/CRGC/Teen/SimulationHospitalVisit";
import ReflexGlobalEmpathy from "./pages/Student/CRGC/Teen/ReflexGlobalEmpathy";
import BadgeCompassionLeader from "./pages/Student/CRGC/Teen/BadgeCompassionLeader";
import CulturalStory from "./pages/Student/CRGC/Teen/CulturalStory";
import QuizOnInclusionTeen from "./pages/Student/CRGC/Teen/QuizOnInclusion";
import ReflexTeenRespect from "./pages/Student/CRGC/Teen/ReflexTeenRespect";
import PuzzleInclusionActs from "./pages/Student/CRGC/Teen/PuzzleInclusionActs";
import ReligionStory from "./pages/Student/CRGC/Teen/ReligionStory";
import DebateEqualityForAll from "./pages/Student/CRGC/Teen/DebateEqualityForAll";
import JournalOfInclusionTeen from "./pages/Student/CRGC/Teen/JournalOfInclusion";
import SimulationSchoolEvent from "./pages/Student/CRGC/Teen/SimulationSchoolEvent";
import ReflexTeenInclusionCRGC from "./pages/Student/CRGC/Teen/ReflexTeenInclusion";
import BadgeInclusionLeader from "./pages/Student/CRGC/Teen/BadgeInclusionLeader";

import TestSolarGame from "./pages/Student/Sustainability/SolarAndCity/TestSolarGame";
import TestWaterRecycleGame from "./pages/Student/Sustainability/WaterAndRecycle/TestWaterRecycleGame";
import TestCarbonGame from "./pages/Student/Sustainability/CarbonAndClimate/TestCarbonGame";
import TestWaterEnergyGame from "./pages/Student/Sustainability/WaterAndEnergy/TestWaterEnergyGame";

// Admin Pages
import AdminPanel from "./pages/Admin/AdminPanel";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AllStudents from "./pages/Admin/AllStudents";
import AdminRedemptions from "./pages/Admin/AdminRedemptions";
import FeedbackHistoryModal from "./pages/Admin/FeedbackHistoryModal";
import AllRedemptions from "./pages/Admin/AllRedemptions";
import AdminStatsPanel from "./pages/Admin/AdminStatsPanel";
import AdminUsersPanel from "./pages/Admin/AdminUsersPanel";
import AdminSettings from "./pages/Admin/AdminSettings";

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

// Seller Pages
import SellerDashboard from "./pages/Seller/SellerDashboard";

// CSR Pages
import CSRDashboard from "./pages/CSR/CSRDashboard";

// Multi-Tenant Pages
import CompanySignup from "./pages/MultiTenant/CompanySignup";
import CreateOrganization from "./pages/MultiTenant/CreateOrganization";
import SchoolAdminDashboard from "./pages/School/SchoolAdminDashboard";
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
import TeacherSettings from "./pages/School/TeacherSettings";
import TeacherStudentProgress from "./pages/School/TeacherStudentProgress";
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
    if (user.role === "parent") return <Navigate to="/parent/overview" replace />;
    if (user.role === "seller") return <Navigate to="/seller/dashboard" replace />;
    if (user.role === "csr") return <Navigate to="/csr/dashboard" replace />;
    
  // School roles
  if (user.role === "school_admin") return <Navigate to="/school/admin/dashboard" replace />;
    if (user.role === "school_teacher") return <Navigate to="/school-teacher/overview" replace />;
    if (user.role === "school_student") return <Navigate to="/student/dashboard" replace />;
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

  // Hide navbar on full-screen game routes and standalone pages with back buttons
  const isFullScreenGame = location.pathname.startsWith("/student/games/") ||
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
      {!isAuthPage && user && (user.role === 'student' || user.role === 'school_student') && <Chatbot />} {/* ✅ Floating Chatbot - Only for students */}

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
          
          {/* School Admin Routes */}
          <Route path="/school/admin/dashboard" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminDashboard /></ProtectedRoute>} />
          <Route path="/school/admin/analytics" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminAnalytics /></ProtectedRoute>} />
          <Route path="/school/admin/students" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminStudents /></ProtectedRoute>} />
          <Route path="/school/admin/teachers" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminTeachers /></ProtectedRoute>} />
          <Route path="/school/admin/classes" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminClasses /></ProtectedRoute>} />
          <Route path="/school/admin/staff" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminStaff /></ProtectedRoute>} />
          <Route path="/school/admin/approvals" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminApprovals /></ProtectedRoute>} />
          <Route path="/school/admin/templates" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminTemplates /></ProtectedRoute>} />
          <Route path="/school/admin/nep-tracking" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminNEPTracking /></ProtectedRoute>} />
          <Route path="/school/admin/compliance" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminCompliance /></ProtectedRoute>} />
          <Route path="/school/admin/billing" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminBilling /></ProtectedRoute>} />
          <Route path="/school/admin/emergency" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminEmergency /></ProtectedRoute>} />
          <Route path="/school/admin/events" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminEvents /></ProtectedRoute>} />
          <Route path="/school/admin/settings" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminSettings /></ProtectedRoute>} />
          
          {/* School Admin Profile & Settings Routes */}
          <Route path="/school_admin/profile" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminProfile /></ProtectedRoute>} />
          <Route path="/school_admin/settings" element={<ProtectedRoute roles={['school_admin']}><SchoolAdminSettingsPersonal /></ProtectedRoute>} />
          
          {/* School Teacher Routes */}
          <Route path="/school-teacher/overview" element={<ProtectedRoute roles={['school_teacher']}><TeacherOverview /></ProtectedRoute>} />
          <Route path="/school-teacher/dashboard" element={<ProtectedRoute roles={['school_teacher']}><SchoolTeacherDashboard /></ProtectedRoute>} />
          <Route path="/school-teacher/students" element={<ProtectedRoute roles={['school_teacher']}><TeacherStudents /></ProtectedRoute>} />
          <Route path="/school-teacher/analytics" element={<ProtectedRoute roles={['school_teacher']}><TeacherAnalytics /></ProtectedRoute>} />
          <Route path="/school-teacher/messages" element={<ProtectedRoute roles={['school_teacher']}><TeacherMessages /></ProtectedRoute>} />
          <Route path="/school-teacher/tasks" element={<ProtectedRoute roles={['school_teacher']}><TeacherTasks /></ProtectedRoute>} />
          <Route path="/school-teacher/settings" element={<ProtectedRoute roles={['school_teacher']}><TeacherSettings /></ProtectedRoute>} />
          <Route path="/school_teacher/settings" element={<ProtectedRoute roles={['school_teacher']}><TeacherSettings /></ProtectedRoute>} />
          <Route path="/school-teacher/student/:studentId/progress" element={<ProtectedRoute roles={['school_teacher']}><TeacherStudentProgress /></ProtectedRoute>} />
          <Route path="/school-teacher/profile" element={<ProtectedRoute roles={['school_teacher']}><Profile /></ProtectedRoute>} />
          <Route path="/school_teacher/profile" element={<ProtectedRoute roles={['school_teacher']}><Profile /></ProtectedRoute>} />
          
          <Route path="/school-student/dashboard" element={<ProtectedRoute roles={['school_student']}><SchoolStudentDashboard /></ProtectedRoute>} />
          <Route path="/school-parent/dashboard" element={<ProtectedRoute roles={['school_parent']}><SchoolParentDashboard /></ProtectedRoute>} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute roles={['student', 'school_student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/dashboard/quick-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><QuickQuiz /></ProtectedRoute>} />
          <Route path="/student/dashboard/:categorySlug" element={<ProtectedRoute roles={['student', 'school_student']}><CategoryView /></ProtectedRoute>} />
          <Route path="/student/mindfull-break" element={<ProtectedRoute roles={['student', 'school_student']}><MindfulnessBreak /></ProtectedRoute>} />
          <Route path="/student/mood-tracker" element={<ProtectedRoute roles={['student', 'school_student']}><MoodTracker /></ProtectedRoute>} />
          <Route path="/student/journal" element={<ProtectedRoute roles={['student', 'school_student']}><Journal /></ProtectedRoute>} />
          <Route path="/student/rewards" element={<ProtectedRoute roles={['student', 'school_student']}><RewardsPage /></ProtectedRoute>} />
          <Route path="/student/redeem" element={<ProtectedRoute roles={['student', 'school_student']}><RedeemPage /></ProtectedRoute>} />
          <Route path="/student/wallet" element={<ProtectedRoute roles={['student', 'school_student']}><WalletPage /></ProtectedRoute>} />
          <Route path="/student/leaderboard" element={<ProtectedRoute roles={['student', 'school_student']}><Leaderboard /></ProtectedRoute>} />
          <Route path="/student/game" element={<ProtectedRoute roles={['student', 'school_student']}><StudentGame /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute roles={['student', 'school_student']}><Notifications /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute roles={['student', 'school_student']}><Profile /></ProtectedRoute>} />
          <Route path="/student/settings" element={<ProtectedRoute roles={['student', 'school_student']}><Setting /></ProtectedRoute>} />
          <Route path="/student/breathing" element={<ProtectedRoute roles={['student', 'school_student']}><MindfulnessBreak /></ProtectedRoute>} />
          <Route path="/student/daily-challenges" element={<ProtectedRoute roles={['student', 'school_student']}><DailyChallenges /></ProtectedRoute>} />
          <Route path="/student/challenge" element={<ProtectedRoute roles={['student', 'school_student']}><Challenge /></ProtectedRoute>} />
          <Route path="/learn/financial-literacy" element={<ProtectedRoute roles={['student', 'school_student']}><FinancialLiteracy /></ProtectedRoute>} />
          <Route path="/tools/budget-planner" element={<ProtectedRoute roles={['student', 'school_student']}><BudgetPlanner /></ProtectedRoute>} />
          <Route path="/games/investment-simulator" element={<ProtectedRoute roles={['student', 'school_student']}><InvestmentSimulator /></ProtectedRoute>} />

          <Route path="/tools/savings-goals" element={<ProtectedRoute roles={['student', 'school_student']}><SavingsGoals /></ProtectedRoute>} />
          <Route path="/learn/financial-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><FinancialQuiz /></ProtectedRoute>} />
          <Route path="/tools/expense-tracker" element={<ProtectedRoute roles={['student', 'school_student']}><ExpenseTracker /></ProtectedRoute>} />

          {/* Game Category Pages */}
          <Route path="/games/dcos" element={<ProtectedRoute roles={['student', 'school_student']}><DCOSGames /></ProtectedRoute>} />
          <Route path="/games/brain-teaser" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserGames /></ProtectedRoute>} />
          <Route path="/games/brain-teaser/:gameId" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserPlay /></ProtectedRoute>} />
          <Route path="/games/:category/:ageGroup" element={<ProtectedRoute roles={['student', 'school_student']}><GameCategoryPage /></ProtectedRoute>} />

          {/* Finance Games for Kids */}
          <Route path="/student/finance/kids/piggy-bank-story" element={<ProtectedRoute roles={['student', 'school_student']}><PiggyBankStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/quiz-on-saving" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnSaving /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-savings" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexSavings /></ProtectedRoute>} />
          <Route path="/student/finance/kids/puzzle-save-or-spend" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleSaveOrSpend /></ProtectedRoute>} />
          <Route path="/student/finance/kids/birthday-money-story" element={<ProtectedRoute roles={['student', 'school_student']}><BirthdayMoneyStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/poster-saving-habit" element={<ProtectedRoute roles={['student', 'school_student']}><PosterSavingHabit /></ProtectedRoute>} />
          <Route path="/student/finance/kids/journal-of-saving" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfSaving /></ProtectedRoute>} />
          <Route path="/student/finance/kids/shop-story" element={<ProtectedRoute roles={['student', 'school_student']}><ShopStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-money-choice" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexMoneyChoice /></ProtectedRoute>} />
          <Route path="/student/finance/kids/badge-saver-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeSaverKid /></ProtectedRoute>} />
          <Route path="/student/finance/kids/ice-cream-story" element={<ProtectedRoute roles={['student', 'school_student']}><IceCreamStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/quiz-on-spending" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnSpending /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-spending" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexSpending /></ProtectedRoute>} />
          <Route path="/student/finance/kids/puzzle-smart-vs-waste" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleSmartVsWaste /></ProtectedRoute>} />
          <Route path="/student/finance/kids/shop-story-2" element={<ProtectedRoute roles={['student', 'school_student']}><ShopStory2 /></ProtectedRoute>} />
          <Route path="/student/finance/kids/poster-smart-shopping" element={<ProtectedRoute roles={['student', 'school_student']}><PosterSmartShopping /></ProtectedRoute>} />
          <Route path="/student/finance/kids/journal-of-smart-buy" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfSmartBuy /></ProtectedRoute>} />
          <Route path="/student/finance/kids/candy-offer-story" element={<ProtectedRoute roles={['student', 'school_student']}><CandyOfferStory /></ProtectedRoute>} />
          <Route path="/student/finance/kids/reflex-needs-first" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexNeedsFirst /></ProtectedRoute>} />
          <Route path="/student/finance/kids/badge-smart-spender-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeSmartSpenderKid /></ProtectedRoute>} />

          {/* Finance Games for Teens */}
          <Route path="/student/finance/teen/pocket-money-story" element={<ProtectedRoute roles={['student', 'school_student']}><PocketMoneyStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/quiz-on-savings-rate" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnSavingsRate /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-smart-saver" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexSmartSaver /></ProtectedRoute>} />
          <Route path="/student/finance/teen/puzzle-of-saving-goals" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleOfSavingGoals /></ProtectedRoute>} />
          <Route path="/student/finance/teen/salary-story" element={<ProtectedRoute roles={['student', 'school_student']}><SalaryStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/debate-save-vs-spend" element={<ProtectedRoute roles={['student', 'school_student']}><DebateSaveVsSpend /></ProtectedRoute>} />
          <Route path="/student/finance/teen/journal-of-saving-goal" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfSavingGoal /></ProtectedRoute>} />
          <Route path="/student/finance/teen/simulation-monthly-money" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationMonthlyMoney /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-wise-use" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexWiseUse /></ProtectedRoute>} />
          <Route path="/student/finance/teen/badge-smart-saver" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeSmartSaver /></ProtectedRoute>} />
          <Route path="/student/finance/teen/allowance-story" element={<ProtectedRoute roles={['student', 'school_student']}><AllowanceStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/spending-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><SpendingQuiz /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-wise-choices" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexWiseChoices /></ProtectedRoute>} />
          <Route path="/student/finance/teen/puzzle-smart-spending" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleSmartSpending /></ProtectedRoute>} />
          <Route path="/student/finance/teen/party-story" element={<ProtectedRoute roles={['student', 'school_student']}><PartyStory /></ProtectedRoute>} />
          <Route path="/student/finance/teen/debate-needs-vs-wants" element={<ProtectedRoute roles={['student', 'school_student']}><DebateNeedsVsWants /></ProtectedRoute>} />
          <Route path="/student/finance/teen/journal-of-spending" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfSpending /></ProtectedRoute>} />
          <Route path="/student/finance/teen/simulation-shopping-mall" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationShoppingMall /></ProtectedRoute>} />
          <Route path="/student/finance/teen/reflex-control" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexControl /></ProtectedRoute>} />
          <Route path="/student/finance/teen/badge-smart-spender-teen" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeSmartSpenderTeen /></ProtectedRoute>} />

          {/* Brain Health Games for Kids */}
          <Route path="/student/brain/kids/water-story" element={<ProtectedRoute roles={['student', 'school_student']}><WaterStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/quiz-on-brain-food" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnBrainFood /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-brain-boost" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexBrainBoost /></ProtectedRoute>} />
          <Route path="/student/brain/kids/puzzle-of-brain-care" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleOfBrainCare /></ProtectedRoute>} />
          <Route path="/student/brain/kids/breakfast-story" element={<ProtectedRoute roles={['student', 'school_student']}><BreakfastStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/poster-brain-health" element={<ProtectedRoute roles={['student', 'school_student']}><PosterBrainHealth /></ProtectedRoute>} />
          <Route path="/student/brain/kids/journal-of-habits" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfHabits /></ProtectedRoute>} />
          <Route path="/student/brain/kids/sports-story" element={<ProtectedRoute roles={['student', 'school_student']}><SportsStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-daily-habit" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexDailyHabit /></ProtectedRoute>} />
          <Route path="/student/brain/kids/badge-brain-care-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeBrainCareKid /></ProtectedRoute>} />
          <Route path="/student/brain/kids/classroom-story" element={<ProtectedRoute roles={['student', 'school_student']}><ClassroomStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/quiz-on-focus" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnFocus /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-attention" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexAttention /></ProtectedRoute>} />
          <Route path="/student/brain/kids/puzzle-of-focus" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleOfFocus /></ProtectedRoute>} />
          <Route path="/student/brain/kids/homework-story" element={<ProtectedRoute roles={['student', 'school_student']}><HomeworkStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/poster-focus-matters" element={<ProtectedRoute roles={['student', 'school_student']}><PosterFocusMatters /></ProtectedRoute>} />
          <Route path="/student/brain/kids/journal-of-focus" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfFocus /></ProtectedRoute>} />
          <Route path="/student/brain/kids/game-story" element={<ProtectedRoute roles={['student', 'school_student']}><GameStory /></ProtectedRoute>} />
          <Route path="/student/brain/kids/reflex-quick-attention" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexQuickAttention /></ProtectedRoute>} />
          <Route path="/student/brain/kids/badge-focus-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeFocusKid /></ProtectedRoute>} />

          {/* Brain Health Games for Teens */}
          <Route path="/student/brain/teen/exercise-story" element={<ProtectedRoute roles={['student', 'school_student']}><ExerciseStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/quiz-on-habits" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnHabits /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-mind-check" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexMindCheck /></ProtectedRoute>} />
          <Route path="/student/brain/teen/puzzle-brain-fuel" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleBrainFuel /></ProtectedRoute>} />
          <Route path="/student/brain/teen/junk-food-story" element={<ProtectedRoute roles={['student', 'school_student']}><JunkFoodStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/debate-brain-vs-body" element={<ProtectedRoute roles={['student', 'school_student']}><DebateBrainVsBody /></ProtectedRoute>} />
          <Route path="/student/brain/teen/journal-of-brain-fitness" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfBrainFitness /></ProtectedRoute>} />
          <Route path="/student/brain/teen/simulation-daily-routine" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationDailyRoutine /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-brain-boost" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexBrainBoostTeen /></ProtectedRoute>} />
          <Route path="/student/brain/teen/badge-brain-health-hero" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeBrainHealthHero /></ProtectedRoute>} />
          <Route path="/student/brain/teen/exam-story" element={<ProtectedRoute roles={['student', 'school_student']}><ExamStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/quiz-on-attention" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnAttention /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-concentration" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexConcentration /></ProtectedRoute>} />
          <Route path="/student/brain/teen/puzzle-of-distractions" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleOfDistractions /></ProtectedRoute>} />
          <Route path="/student/brain/teen/social-media-story" element={<ProtectedRoute roles={['student', 'school_student']}><SocialMediaStory /></ProtectedRoute>} />
          <Route path="/student/brain/teen/debate-multitask-vs-focus" element={<ProtectedRoute roles={['student', 'school_student']}><DebateMultitaskVsFocus /></ProtectedRoute>} />
          <Route path="/student/brain/teen/journal-of-attention" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfAttention /></ProtectedRoute>} />
          <Route path="/student/brain/teen/simulation-study-plan" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationStudyPlan /></ProtectedRoute>} />
          <Route path="/student/brain/teen/reflex-distraction-alert" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexDistractionAlert /></ProtectedRoute>} />
          <Route path="/student/brain/teen/badge-focus-hero" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeFocusHero /></ProtectedRoute>} />

          {/* UVLS Kids Games - Set 1 (Empathy & Compassion) */}
          <Route path="/student/uvls/kids/share-your-toy" element={<ProtectedRoute roles={['student', 'school_student']}><ShareYourToy /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/feelings-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><FeelingsQuiz /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/kind-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><KindReflex /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/match-faces" element={<ProtectedRoute roles={['student', 'school_student']}><MatchFaces /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/spot-help" element={<ProtectedRoute roles={['student', 'school_student']}><SpotHelp /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/kind-poster" element={<ProtectedRoute roles={['student', 'school_student']}><KindPoster /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/mini-journal" element={<ProtectedRoute roles={['student', 'school_student']}><MiniJournal /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/comfort-roleplay" element={<ProtectedRoute roles={['student', 'school_student']}><ComfortRoleplay /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/share-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><ShareReflex /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/little-empath-badge" element={<ProtectedRoute roles={['student', 'school_student']}><LittleEmpathBadge /></ProtectedRoute>} />
          
          {/* UVLS Kids Games - Set 2 (Respect & Inclusion) */}
          <Route path="/student/uvls/kids/greet-the-new-kid" element={<ProtectedRoute roles={['student', 'school_student']}><GreetTheNewKid /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/polite-words-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><PoliteWordsQuiz /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/respect-tap" element={<ProtectedRoute roles={['student', 'school_student']}><RespectTap /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/inclusion-match" element={<ProtectedRoute roles={['student', 'school_student']}><InclusionMatch /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/invite-to-play" element={<ProtectedRoute roles={['student', 'school_student']}><InviteToPlay /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/inclusion-poster" element={<ProtectedRoute roles={['student', 'school_student']}><InclusionPoster /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/inclusion-journal" element={<ProtectedRoute roles={['student', 'school_student']}><InclusionJournal /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/invite-roleplay" element={<ProtectedRoute roles={['student', 'school_student']}><InviteRoleplay /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/respect-signals" element={<ProtectedRoute roles={['student', 'school_student']}><RespectSignals /></ProtectedRoute>} />
          <Route path="/student/uvls/kids/inclusive-kid-badge" element={<ProtectedRoute roles={['student', 'school_student']}><InclusiveKidBadge /></ProtectedRoute>} />

          {/* UVLS Teen Games */}
          <Route path="/student/uvls/teen/listen-deep" element={<ProtectedRoute roles={['student', 'school_student']}><ListenDeep /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/empathy-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><EmpathyQuizTeen /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/perspective-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><PerspectivePuzzle /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/walk-in-shoes" element={<ProtectedRoute roles={['student', 'school_student']}><WalkInShoes /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/empathy-debate" element={<ProtectedRoute roles={['student', 'school_student']}><EmpathyDebate /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/reflective-journal" element={<ProtectedRoute roles={['student', 'school_student']}><ReflectiveJournal /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/peer-support-roleplay" element={<ProtectedRoute roles={['student', 'school_student']}><PeerSupportRoleplay /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/case-response-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><CaseResponsePuzzle /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/spot-distress-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><SpotDistressReflex /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/empathy-champion-badge" element={<ProtectedRoute roles={['student', 'school_student']}><EmpathyChampionBadge /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/cultural-greeting" element={<ProtectedRoute roles={['student', 'school_student']}><CulturalGreeting /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/inclusion-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><InclusionQuizTeen /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/accessibility-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><AccessibilityPuzzle /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/inclusive-class-simulation" element={<ProtectedRoute roles={['student', 'school_student']}><InclusiveClassSimulation /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/respect-debate" element={<ProtectedRoute roles={['student', 'school_student']}><RespectDebate /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/inclusion-journal" element={<ProtectedRoute roles={['student', 'school_student']}><InclusionJournalTeen /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/correcting-bias-roleplay" element={<ProtectedRoute roles={['student', 'school_student']}><CorrectingBiasRoleplay /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/name-respect-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><NameRespectReflex /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/policy-case-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><PolicyCasePuzzle /></ProtectedRoute>} />
          <Route path="/student/uvls/teen/respect-leader-badge" element={<ProtectedRoute roles={['student', 'school_student']}><RespectLeaderBadge /></ProtectedRoute>} />

          {/* DCOS Kids Games - Digital Citizenship & Online Safety */}
          <Route path="/student/dcos/kids/strong-password-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><StrongPasswordReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/stranger-chat-story" element={<ProtectedRoute roles={['student', 'school_student']}><StrangerChatStory /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/photo-share-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><PhotoShareQuiz /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/personal-info-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><PersonalInfoPuzzle /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/game-invite-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><GameInviteReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/safety-poster" element={<ProtectedRoute roles={['student', 'school_student']}><SafetyPoster /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/family-rules-story" element={<ProtectedRoute roles={['student', 'school_student']}><FamilyRulesStory /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/device-sharing-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><DeviceSharingQuiz /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/online-friend-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><OnlineFriendReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/safe-user-badge" element={<ProtectedRoute roles={['student', 'school_student']}><SafeUserBadge /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/spot-bully-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><SpotBullyQuiz /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/kind-words-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><KindWordsReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/smile-story" element={<ProtectedRoute roles={['student', 'school_student']}><SmileStory /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/gossip-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><GossipPuzzle /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/playground-bystander" element={<ProtectedRoute roles={['student', 'school_student']}><PlaygroundBystander /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/cyberbully-report" element={<ProtectedRoute roles={['student', 'school_student']}><CyberBullyReport /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/role-swap" element={<ProtectedRoute roles={['student', 'school_student']}><RoleSwap /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/kindness-journal" element={<ProtectedRoute roles={['student', 'school_student']}><KindnessJournal /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/friendship-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><FriendshipReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/kids/kind-friend-badge" element={<ProtectedRoute roles={['student', 'school_student']}><KindFriendBadge /></ProtectedRoute>} />

          {/* DCOS Teen Games - Digital Citizenship & Online Safety */}
          <Route path="/student/dcos/teen/password-sharing-story" element={<ProtectedRoute roles={['student', 'school_student']}><PasswordSharingStory /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/privacy-settings-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><PrivacySettingsQuiz /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/otp-fraud-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><OTPFraudReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/profile-picture-simulation" element={<ProtectedRoute roles={['student', 'school_student']}><ProfilePictureSimulation /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/social-media-journal" element={<ProtectedRoute roles={['student', 'school_student']}><SocialMediaJournal /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/data-consent-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><DataConsentQuiz /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/fake-friend-story" element={<ProtectedRoute roles={['student', 'school_student']}><FakeFriendStory /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/safety-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><SafetyReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/debate-stage-online-friends" element={<ProtectedRoute roles={['student', 'school_student']}><DebateStageOnlineFriends /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/online-safety-badge" element={<ProtectedRoute roles={['student', 'school_student']}><OnlineSafetyBadge /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/cyberbully-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><CyberBullyReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/peer-pressure-story" element={<ProtectedRoute roles={['student', 'school_student']}><PeerPressureStory /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/gossip-chain-simulation" element={<ProtectedRoute roles={['student', 'school_student']}><GossipChainSimulation /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/debate-stage-trolling" element={<ProtectedRoute roles={['student', 'school_student']}><DebateStageTrolling /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/diversity-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><DiversityQuiz /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/encourage-roleplay" element={<ProtectedRoute roles={['student', 'school_student']}><EncourageRoleplay /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/empathy-journal" element={<ProtectedRoute roles={['student', 'school_student']}><EmpathyJournal /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/anti-bully-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><AntiBullyReflex /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/upstander-simulation" element={<ProtectedRoute roles={['student', 'school_student']}><UpstanderSimulation /></ProtectedRoute>} />
          <Route path="/student/dcos/teen/courage-badge" element={<ProtectedRoute roles={['student', 'school_student']}><CourageBadge /></ProtectedRoute>} />

          {/* Moral Values Kids Games - Honesty & Respect */}
          <Route path="/student/moral-values/kids/lost-pencil-story" element={<ProtectedRoute roles={['student', 'school_student']}><LostPencilStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/homework-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><HomeworkQuiz /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/truth-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><TruthReflex /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/puzzle-of-trust" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleOfTrust /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/cheating-story" element={<ProtectedRoute roles={['student', 'school_student']}><CheatingStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/poster-of-honesty" element={<ProtectedRoute roles={['student', 'school_student']}><PosterOfHonesty /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/journal-of-truth" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfTruth /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/candy-shop-story" element={<ProtectedRoute roles={['student', 'school_student']}><CandyShopStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/reflex-quick-choice" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexQuickChoice /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/badge-truthful-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeTruthfulKid /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/respect-elders-story" element={<ProtectedRoute roles={['student', 'school_student']}><RespectEldersStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/polite-words-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><PoliteWordsQuiz2 /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/reflex-respect" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexRespect /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/puzzle-respect-match" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleRespectMatch /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/teacher-greeting-story" element={<ProtectedRoute roles={['student', 'school_student']}><TeacherGreetingStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/gratitude-poster" element={<ProtectedRoute roles={['student', 'school_student']}><GratitudePoster /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/journal-of-gratitude" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfGratitude /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/playground-respect-story" element={<ProtectedRoute roles={['student', 'school_student']}><PlaygroundRespectStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/reflex-help" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexHelp /></ProtectedRoute>} />
          <Route path="/student/moral-values/kids/badge-respect-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeRespectKid /></ProtectedRoute>} />

          {/* Moral Values Teen Games - Integrity & Respect */}
          <Route path="/student/moral-values/teen/friend-lie-story" element={<ProtectedRoute roles={['student', 'school_student']}><FriendLieStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/white-lie-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><WhiteLieQuiz /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/reflex-spot-fake" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexSpotFake /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/puzzle-of-integrity" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleOfIntegrity /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/bribe-simulation" element={<ProtectedRoute roles={['student', 'school_student']}><BribeSimulation /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/debate-lying-for-friend" element={<ProtectedRoute roles={['student', 'school_student']}><DebateLyingForFriend /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/integrity-journal" element={<ProtectedRoute roles={['student', 'school_student']}><IntegrityJournal /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/exam-cheating-story" element={<ProtectedRoute roles={['student', 'school_student']}><ExamCheatingStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/roleplay-truthful-leader" element={<ProtectedRoute roles={['student', 'school_student']}><RoleplayTruthfulLeader /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/badge-integrity-hero" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeIntegrityHero /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/debate-obey-or-question" element={<ProtectedRoute roles={['student', 'school_student']}><DebateObeyOrQuestion /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/gratitude-story" element={<ProtectedRoute roles={['student', 'school_student']}><GratitudeStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/reflex-politeness" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexPoliteness /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/puzzle-of-gratitude" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleOfGratitude /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/service-story" element={<ProtectedRoute roles={['student', 'school_student']}><ServiceStory /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/respect-journal" element={<ProtectedRoute roles={['student', 'school_student']}><RespectJournal /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/debate-respect-teachers" element={<ProtectedRoute roles={['student', 'school_student']}><DebateRespectTeachers /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/roleplay-respect-leader" element={<ProtectedRoute roles={['student', 'school_student']}><RoleplayRespectLeader /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/reflex-gratitude" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexGratitude /></ProtectedRoute>} />
          <Route path="/student/moral-values/teen/badge-gratitude-hero" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeGratitudeHero /></ProtectedRoute>} />

          {/* AI For All Kids Games */}
          <Route path="/student/ai-for-all/kids/spot-the-pattern" element={<ProtectedRoute roles={['student', 'school_student']}><SpotThePattern /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/cat-or-dog-game" element={<ProtectedRoute roles={['student', 'school_student']}><CatOrDogGame /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/sorting-colors" element={<ProtectedRoute roles={['student', 'school_student']}><SortingColors /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/true-false-ai-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><TrueFalseAIQuiz /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/emoji-classifier" element={<ProtectedRoute roles={['student', 'school_student']}><EmojiClassifier /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/self-driving-car" element={<ProtectedRoute roles={['student', 'school_student']}><SelfDrivingCar /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/pattern-finder-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><PatternFinderPuzzle /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/robot-helper-story" element={<ProtectedRoute roles={['student', 'school_student']}><RobotHelperStory /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/spam-vs-not-spam" element={<ProtectedRoute roles={['student', 'school_student']}><SpamVsNotSpam /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/siri-alexa-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><SiriAlexaQuiz /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/ai-in-games" element={<ProtectedRoute roles={['student', 'school_student']}><AIInGames /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/match-ai-tools" element={<ProtectedRoute roles={['student', 'school_student']}><MatchAITools /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/pattern-music-game" element={<ProtectedRoute roles={['student', 'school_student']}><PatternMusicGame /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/robot-vision-game" element={<ProtectedRoute roles={['student', 'school_student']}><RobotVisionGame /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/smart-home-story" element={<ProtectedRoute roles={['student', 'school_student']}><SmartHomeStory /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/train-the-robot" element={<ProtectedRoute roles={['student', 'school_student']}><TrainTheRobot /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/prediction-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><PredictionPuzzle /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/friendly-ai-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><FriendlyAIQuiz /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/robot-emotion-story" element={<ProtectedRoute roles={['student', 'school_student']}><RobotEmotionStory /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/kids/recommendation-game" element={<ProtectedRoute roles={['student', 'school_student']}><RecommendationGame /></ProtectedRoute>} />

          {/* AI For All Teen Games */}
          <Route path="/student/ai-for-all/teen/what-is-ai-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><WhatIsAIQuiz /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/pattern-prediction-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><PatternPredictionPuzzle /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/image-classifier-game" element={<ProtectedRoute roles={['student', 'school_student']}><ImageClassifierGame /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/human-vs-ai-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><HumanVsAIQuiz /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/predict-next-word" element={<ProtectedRoute roles={['student', 'school_student']}><PredictNextWord /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/self-driving-car-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><SelfDrivingCarReflex /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/sorting-emotions-game" element={<ProtectedRoute roles={['student', 'school_student']}><SortingEmotionsGame /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/true-false-ai-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><TrueFalseAIQuizTeen /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/chatbot-simulation" element={<ProtectedRoute roles={['student', 'school_student']}><ChatbotSimulation /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/ai-in-gaming-story" element={<ProtectedRoute roles={['student', 'school_student']}><AIInGamingStory /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/pattern-music-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><PatternMusicReflexTeen /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/computer-vision-basics" element={<ProtectedRoute roles={['student', 'school_student']}><ComputerVisionBasics /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/ai-in-smartphones-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><AIInSmartphonesQuiz /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/prediction-story" element={<ProtectedRoute roles={['student', 'school_student']}><PredictionStory /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/machine-vs-human-reflex" element={<ProtectedRoute roles={['student', 'school_student']}><MachineVsHumanReflex /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/language-ai-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><LanguageAIQuiz /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/simple-algorithm-puzzle" element={<ProtectedRoute roles={['student', 'school_student']}><SimpleAlgorithmPuzzle /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/smart-home-story" element={<ProtectedRoute roles={['student', 'school_student']}><SmartHomeStoryTeen /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/recommendation-simulation" element={<ProtectedRoute roles={['student', 'school_student']}><RecommendationSimulation /></ProtectedRoute>} />
          <Route path="/student/ai-for-all/teen/ai-everywhere-quiz" element={<ProtectedRoute roles={['student', 'school_student']}><AIEverywhereQuiz /></ProtectedRoute>} />

          {/* EHE Kids Games */}
          <Route path="/student/ehe/kids/doctor-story" element={<ProtectedRoute roles={['student', 'school_student']}><DoctorStory /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/quiz-on-jobs" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnJobs /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/reflex-job-match" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexJobMatch /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/puzzle-who-does-what" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleWhoDoesWhat /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/dream-job-story" element={<ProtectedRoute roles={['student', 'school_student']}><DreamJobStory /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/poster-my-dream-job" element={<ProtectedRoute roles={['student', 'school_student']}><PosterMyDreamJob /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/journal-of-jobs" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfJobs /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/school-helper-story" element={<ProtectedRoute roles={['student', 'school_student']}><SchoolHelperStory /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/reflex-career-check" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexCareerCheck /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/badge-career-explorer" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeCareerExplorer /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/idea-story" element={<ProtectedRoute roles={['student', 'school_student']}><IdeaStory /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/quiz-on-skills" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnSkills /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/reflex-skill-check" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexSkillCheck /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/puzzle-match-skills" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleMatchSkills /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/teamwork-story" element={<ProtectedRoute roles={['student', 'school_student']}><TeamworkStory /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/poster-skills-for-success" element={<ProtectedRoute roles={['student', 'school_student']}><PosterSkillsForSuccess /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/journal-of-skills" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfSkills /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/risk-story" element={<ProtectedRoute roles={['student', 'school_student']}><RiskStory /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/reflex-innovation" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexInnovation /></ProtectedRoute>} />
          <Route path="/student/ehe/kids/badge-young-innovator" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeYoungInnovator /></ProtectedRoute>} />

          {/* EHE Teen Games */}
          <Route path="/student/ehe/teen/career-story" element={<ProtectedRoute roles={['student', 'school_student']}><CareerStory /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/quiz-on-careers" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnCareers /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/reflex-teen-career" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexTeenCareer /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/puzzle-career-match" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleCareerMatch /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/passion-story" element={<ProtectedRoute roles={['student', 'school_student']}><PassionStory /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/debate-one-career-or-many" element={<ProtectedRoute roles={['student', 'school_student']}><DebateOneCareerOrMany /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/journal-of-career-choice" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfCareerChoice /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/simulation-career-fair" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationCareerFair /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/reflex-future-check" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexFutureCheck /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/badge-career-aware-teen" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeCareerAwareTeen /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/opportunity-story" element={<ProtectedRoute roles={['student', 'school_student']}><OpportunityStory /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/quiz-on-entrepreneur-traits" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnEntrepreneurTraits /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/reflex-teen-skills" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexTeenSkills /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/puzzle-match-traits" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleMatchTraits /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/failure-story" element={<ProtectedRoute roles={['student', 'school_student']}><FailureStory /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/debate-born-or-made" element={<ProtectedRoute roles={['student', 'school_student']}><DebateBornOrMade /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/journal-of-strengths" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfStrengths /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/simulation-team-project" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationTeamProject /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/reflex-teen-innovator" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexTeenInnovator /></ProtectedRoute>} />
          <Route path="/student/ehe/teen/badge-future-entrepreneur" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeFutureEntrepreneur /></ProtectedRoute>} />

          {/* CRGC Kids Games */}
          <Route path="/student/civic-responsibility/kids/friends-sad-story" element={<ProtectedRoute roles={['student', 'school_student']}><FriendsSadStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/quiz-on-empathy" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnEmpathy /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/reflex-kindness" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexKindness /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/puzzle-match-feelings" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleMatchFeelings /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/animal-story" element={<ProtectedRoute roles={['student', 'school_student']}><AnimalStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/poster-be-kind-always" element={<ProtectedRoute roles={['student', 'school_student']}><PosterBeKindAlways /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/journal-of-empathy" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfEmpathy /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/bully-story" element={<ProtectedRoute roles={['student', 'school_student']}><BullyStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/reflex-help-alert" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexHelpAlert /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/badge-kind-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeKindKid /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/classroom-story" element={<ProtectedRoute roles={['student', 'school_student']}><ClassroomStoryCRGC /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/quiz-on-respect" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnRespect /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/reflex-respect" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexRespectCRGC /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/puzzle-respect-match" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleRespectMatchCRGC /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/gender-story" element={<ProtectedRoute roles={['student', 'school_student']}><GenderStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/poster-respect-all" element={<ProtectedRoute roles={['student', 'school_student']}><PosterRespectAll /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/journal-of-respect" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfRespect /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/disability-story" element={<ProtectedRoute roles={['student', 'school_student']}><DisabilityStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/reflex-inclusion" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexInclusion /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/kids/badge-respect-kid" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeRespectKidCRGC /></ProtectedRoute>} />

          {/* CRGC Teen Games */}
          <Route path="/student/civic-responsibility/teen/stranger-story" element={<ProtectedRoute roles={['student', 'school_student']}><StrangerStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/quiz-on-compassion" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnCompassionTeen /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/reflex-teen-compassion" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexTeenCompassion /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/puzzle-kind-acts" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleKindActs /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/refugee-story" element={<ProtectedRoute roles={['student', 'school_student']}><RefugeeStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/debate-kindness-weakness" element={<ProtectedRoute roles={['student', 'school_student']}><DebateKindnessWeakness /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/journal-of-compassion" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfCompassionTeen /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/simulation-hospital-visit" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationHospitalVisit /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/reflex-global-empathy" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexGlobalEmpathy /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/badge-compassion-leader" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeCompassionLeader /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/cultural-story" element={<ProtectedRoute roles={['student', 'school_student']}><CulturalStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/quiz-on-inclusion" element={<ProtectedRoute roles={['student', 'school_student']}><QuizOnInclusionTeen /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/reflex-teen-respect" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexTeenRespect /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/puzzle-inclusion-acts" element={<ProtectedRoute roles={['student', 'school_student']}><PuzzleInclusionActs /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/religion-story" element={<ProtectedRoute roles={['student', 'school_student']}><ReligionStory /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/debate-equality-for-all" element={<ProtectedRoute roles={['student', 'school_student']}><DebateEqualityForAll /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/journal-of-inclusion" element={<ProtectedRoute roles={['student', 'school_student']}><JournalOfInclusionTeen /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/simulation-school-event" element={<ProtectedRoute roles={['student', 'school_student']}><SimulationSchoolEvent /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/reflex-teen-inclusion" element={<ProtectedRoute roles={['student', 'school_student']}><ReflexTeenInclusionCRGC /></ProtectedRoute>} />
          <Route path="/student/civic-responsibility/teen/badge-inclusion-leader" element={<ProtectedRoute roles={['student', 'school_student']}><BadgeInclusionLeader /></ProtectedRoute>} />

          {/* Sustainability Games */}
          <Route path="/student/sustainability/solar-and-city/test-solar-game" element={<ProtectedRoute roles={['student', 'school_student']}><TestSolarGame /></ProtectedRoute>} />
          <Route path="/student/sustainability/water-and-recycle/test-water-recycle-game" element={<ProtectedRoute roles={['student', 'school_student']}><TestWaterRecycleGame /></ProtectedRoute>} />
          <Route path="/student/sustainability/carbon-and-climate/test-carbon-game" element={<ProtectedRoute roles={['student', 'school_student']}><TestCarbonGame /></ProtectedRoute>} />
          <Route path="/student/sustainability/water-and-energy/test-water-energy-game" element={<ProtectedRoute roles={['student', 'school_student']}><TestWaterEnergyGame /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/panel" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute roles={['admin']}><AllStudents /></ProtectedRoute>} />
          <Route path="/admin/redemptions" element={<ProtectedRoute roles={['admin']}><AdminRedemptions /></ProtectedRoute>} />
          <Route path="/admin/feedback" element={<ProtectedRoute roles={['admin']}><FeedbackHistoryModal /></ProtectedRoute>} />
          <Route path="/admin/all-redemptions" element={<ProtectedRoute roles={['admin']}><AllRedemptions /></ProtectedRoute>} />
          <Route path="/admin/stats" element={<ProtectedRoute roles={['admin']}><AdminStatsPanel /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPanel /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute roles={['admin']}><Profile /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute roles={['admin']}><Notifications /></ProtectedRoute>} />

          {/* Parent Routes */}
          <Route path="/parent/overview" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentOverview /></ProtectedRoute>} />
          <Route path="/parent/dashboard" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentDashboard /></ProtectedRoute>} />
          <Route path="/parent/children" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentChildren /></ProtectedRoute>} />
          <Route path="/parent/messages" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentMessages /></ProtectedRoute>} />
          <Route path="/parent/settings" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentSettings /></ProtectedRoute>} />
          
          {/* Child Analytics Routes */}
          <Route path="/parent/child/:childId" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentChildAnalytics /></ProtectedRoute>} />
          <Route path="/parent/child/:childId/analytics" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentChildAnalytics /></ProtectedRoute>} />
          <Route path="/parent/child/:childId/progress" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ChildProgress /></ProtectedRoute>} />
          <Route path="/parent/child/:childId/wellbeing" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ChildMoodWellbeing /></ProtectedRoute>} />
          <Route path="/parent/child/:childId/wallet" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ChildWalletRewards /></ProtectedRoute>} />
          
          <Route path="/parent/profile" element={<ProtectedRoute roles={['parent']}><Profile /></ProtectedRoute>} />
          <Route path="/parent/notifications" element={<ProtectedRoute roles={['parent']}><Notifications /></ProtectedRoute>} />
          <Route path="/parent/progress" element={<ProtectedRoute roles={['parent']} requireApproved={true}><ParentDashboard /></ProtectedRoute>} />

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
    </div>
  );
};

export default App;