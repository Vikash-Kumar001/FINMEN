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
import CandyStory from "./pages/Student/Finance/Kids/CandyStory";
import BudgetingQuiz from "./pages/Student/Finance/Kids/BudgetingQuiz";
import ReflexBudget from "./pages/Student/Finance/Kids/ReflexBudget";
import BudgetItemsPuzzle from "./pages/Student/Finance/Kids/BudgetItemsPuzzle";
import BirthdayMoney from "./pages/Student/Finance/Kids/BirthdayMoney";
import PosterPlanFirst from "./pages/Student/Finance/Kids/PosterPlanFirst";
import JournalOfBudgeting from "./pages/Student/Finance/Kids/JournalOfBudgeting";
import SchoolFairStory from "./pages/Student/Finance/Kids/SchoolFairStory";
import ReflexMoneyPlan from "./pages/Student/Finance/Kids/ReflexMoneyPlan";
import BadgeBudgetKid from "./pages/Student/Finance/Kids/BadgeBudgetKid";
import IceCreamVsBookStory from "./pages/Student/Finance/Kids/IceCreamVsBookStory";
import QuizOnNeeds from "./pages/Student/Finance/Kids/QuizOnNeeds";
import ReflexNeedVsWant from "./pages/Student/Finance/Kids/ReflexNeedVsWant";
import PuzzleNeedsWants from "./pages/Student/Finance/Kids/PuzzleNeedsWants";
import SnackStory from "./pages/Student/Finance/Kids/SnackStory";
import PosterNeedsFirst from "./pages/Student/Finance/Kids/PosterNeedsFirst";
import JournalOfNeeds from "./pages/Student/Finance/Kids/JournalOfNeeds";
import GiftMoneyStory from "./pages/Student/Finance/Kids/GiftMoneyStory";
import ReflexSmartPick from "./pages/Student/Finance/Kids/ReflexSmartPick";
import NeedsFirstKidBadge from "./pages/Student/Finance/Kids/NeedsFirstKidBadge";
import BankVisitStory from "./pages/Student/Finance/Kids/BankVisitStory";
import QuizBanks from "./pages/Student/Finance/Kids/QuizBanks";
import ReflexBank from "./pages/Student/Finance/Kids/ReflexBank";
import PuzzleBankUses from "./pages/Student/Finance/Kids/PuzzleBankUses";
import SavingsStory from "./pages/Student/Finance/Kids/SavingsStory";
import PosterBanksHelp from "./pages/Student/Finance/Kids/PosterBanksHelp";
import JournalFirstBank from "./pages/Student/Finance/Kids/JournalFirstBank";
import ATMStory from "./pages/Student/Finance/Kids/ATMStory";
import ReflexBankSymbols from "./pages/Student/Finance/Kids/ReflexBankSymbols";
import BadgeBankExplorer from "./pages/Student/Finance/Kids/BadgeBankExplorer";
import PencilStory from "./pages/Student/Finance/Kids/PencilStory";
import QuizBorrowing from "./pages/Student/Finance/Kids/QuizBorrowing";
import ReflexBorrowSteal from "./pages/Student/Finance/Kids/ReflexBorrowSteal";
import PuzzleBorrowMatch from "./pages/Student/Finance/Kids/PuzzleBorrowMatch";
import LunchBoxStory from "./pages/Student/Finance/Kids/LunchBoxStory";
import PosterReturnBorrow from "./pages/Student/Finance/Kids/PosterReturnBorrow";
import JournalBorrowing from "./pages/Student/Finance/Kids/JournalBorrowing";
import ToyStory from "./pages/Student/Finance/Kids/ToyStory";
import ReflexBorrowRight from "./pages/Student/Finance/Kids/ReflexBorrowRight";
import BadgeGoodBorrower from "./pages/Student/Finance/Kids/BadgeGoodBorrower";
import TreeStory from "./pages/Student/Finance/Kids/TreeStory";
import QuizOnGrowth from "./pages/Student/Finance/Kids/QuizOnGrowth";
import ReflexInvestmentBasics from "./pages/Student/Finance/Kids/ReflexInvestmentBasics";
import PuzzleOfGrowth from "./pages/Student/Finance/Kids/PuzzleOfGrowth";
import PiggyBank from "./pages/Student/Finance/Kids/PiggyBank";
import PosterGrowYourMoney from "./pages/Student/Finance/Kids/PosterGrowYourMoney";
import JournalOfGrowth from "./pages/Student/Finance/Kids/JournalOfGrowth";
import ToyVsSavingStory from "./pages/Student/Finance/Kids/ToyVsSavingStory";
import ReflexGrowthCheck from "./pages/Student/Finance/Kids/ReflexGrowthCheck";
import BadgeMoneyGardener from "./pages/Student/Finance/Kids/BadgeMoneyGardener";
import LemonadeStory from "./pages/Student/Finance/Kids/LemonadeStory";
import QuizOnEarning from "./pages/Student/Finance/Kids/QuizOnEarning";
import ReflexWorkVsPlay from "./pages/Student/Finance/Kids/ReflexWorkVsPlay";
import PuzzleOfJobs from "./pages/Student/Finance/Kids/PuzzleOfJobs";
import HelpingParentsStory from "./pages/Student/Finance/Kids/HelpingParentsStory";
import PosterWorkToEarn from "./pages/Student/Finance/Kids/PosterWorkToEarn";
import JournalOfEarning from "./pages/Student/Finance/Kids/JournalOfEarning";
import PetSittingStory from "./pages/Student/Finance/Kids/PetSittingStory";
import ReflexSmallBusiness from "./pages/Student/Finance/Kids/ReflexSmallBusiness";
import BadgeYoungEarner from "./pages/Student/Finance/Kids/BadgeYoungEarner";
import CandyShopStoryy from "./pages/Student/Finance/Kids/CandyShopStoryy";
import QuizOnHonesty from "./pages/Student/Finance/Kids/QuizOnHonesty";
import ReflexScamAlert from "./pages/Student/Finance/Kids/ReflexScamAlert";
import PuzzleHonestVsFraud from "./pages/Student/Finance/Kids/PuzzleHonestVsFraud";
import StrangerStoryy from "./pages/Student/Finance/Kids/StrangerStoryy";
import PosterBeAlert from "./pages/Student/Finance/Kids/PosterBeAlert";
import JournalSafety from "./pages/Student/Finance/Kids/JournalSafety";
import ToyShopStory from "./pages/Student/Finance/Kids/ToyShopStory";
import ReflexCheckFirst from "./pages/Student/Finance/Kids/ReflexCheckFirst";
import BadgeScamSpotterKid from "./pages/Student/Finance/Kids/BadgeScamSpotterKid";
import LostCoinStoryGame from "./pages/Student/Finance/Kids/LostCoinStoryGame";
import MoneyHonestyQuizGame from "./pages/Student/Finance/Kids/MoneyHonestyQuizGame";
import ReflexEthicsGame from "./pages/Student/Finance/Kids/ReflexEthicsGame";
import HonestyPuzzleGame from "./pages/Student/Finance/Kids/HonestyPuzzleGame";
import FriendsMoneyStoryGame from "./pages/Student/Finance/Kids/FriendsMoneyStoryGame";
import HonestyPosterGame from "./pages/Student/Finance/Kids/HonestyPosterGame";
import EthicsJournalGame from "./pages/Student/Finance/Kids/EthicsJournalGame";
import ShopStoryGame from "./pages/Student/Finance/Kids/ShopStoryGame";
import ReflexMoneyTruthGame from "./pages/Student/Finance/Kids/ReflexMoneyTruthGame";
import HonestKidBadgeGame from "./pages/Student/Finance/Kids/HonestKidBadgeGame";

// Teen Finance Game Levels
import PocketMoneyStory from "./pages/Student/Finance/Teen/PocketMoneyStory";
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
import Allowance from "./pages/Student/Finance/Teen/Allowance";
import BudgetQuiz from "./pages/Student/Finance/Teen/BudgetQuiz";
import ReflexBudgett from "./pages/Student/Finance/Teen/ReflexBudgett";
import QuizOnSavingsRate from "./pages/Student/Finance/Teen/QuizOnSavingsRate";
import PuzzlePriorities from "./pages/Student/Finance/Teen/PuzzlePriorities";
import CollegeStory from "./pages/Student/Finance/Teen/CollegeStory";
import DebateBudgetFreedom from "./pages/Student/Finance/Teen/DebateBudgetFreedom";
import JournalMonthlyBudget from "./pages/Student/Finance/Teen/JournalMonthlyBudget";
import SimulationMonthlyAllowance from "./pages/Student/Finance/Teen/SimulationMonthlyAllowance";
import ReflexBudgetSmarts from "./pages/Student/Finance/Teen/ReflexBudgetSmarts";
import BadgeBudgetHero from "./pages/Student/Finance/Teen/BadgeBudgetHero";
import MovieVsBusFareStory from "./pages/Student/Finance/Teen/MovieVsBusFareStory";
import NeedsVsWantsQuiz from "./pages/Student/Finance/Teen/NeedsVsWantsQuiz";
import ReflexDecision from "./pages/Student/Finance/Teen/ReflexDecision";
import PuzzleRealPriorities from "./pages/Student/Finance/Teen/PuzzleRealPriorities";
import ExamPrepStory from "./pages/Student/Finance/Teen/ExamPrepStory";
import DebateWantsMatter from "./pages/Student/Finance/Teen/DebateWantsMatter";
import JournalOfBalance from "./pages/Student/Finance/Teen/JournalOfBalance";
import SimulationMonthlyBudget from "./pages/Student/Finance/Teen/SimulationMonthlyBudget";
import ReflexSmartSpend from "./pages/Student/Finance/Teen/ReflexSmartSpend";
import BadgeWiseChooser from "./pages/Student/Finance/Teen/BadgeWiseChooser";
import OnlinePaymentStory from "./pages/Student/Finance/Teen/OnlinePaymentStory";
import QuizOnDigitalMoney from "./pages/Student/Finance/Teen/QuizOnDigitalMoney";
import ReflexSecureUse from "./pages/Student/Finance/Teen/ReflexSecureUse";
import PuzzleOfDigitalTools from "./pages/Student/Finance/Teen/PuzzleOfDigitalTools";
import OnlineFraudStory from "./pages/Student/Finance/Teen/OnlineFraudStory";
import DebateCashVsDigital from "./pages/Student/Finance/Teen/DebateCashVsDigital";
import JournalOfDigitalUse from "./pages/Student/Finance/Teen/JournalOfDigitalUse";
import SimulationDigitalSpend from "./pages/Student/Finance/Teen/SimulationDigitalSpend";
import ReflexFraudAlert from "./pages/Student/Finance/Teen/ReflexFraudAlert";
import BadgeDigitalMoneySmart from "./pages/Student/Finance/Teen/BadgeDigitalMoneySmart";
import MoneyBorrowStory from "./pages/Student/Finance/Teen/MoneyBorrowStory";
import DebtQuiz from "./pages/Student/Finance/Teen/DebtQuiz";
import ReflexDebtDangers from "./pages/Student/Finance/Teen/ReflexDebtDangers";
import PuzzleLoanBasics from "./pages/Student/Finance/Teen/PuzzleLoanBasics";
import BorrowingStory from "./pages/Student/Finance/Teen/BorrowingStory";
import DebateBorrowGoodOrBad from "./pages/Student/Finance/Teen/DebateBorrowGoodOrBad";
import JournalOfBorrowing from "./pages/Student/Finance/Teen/JournalOfBorrowing";
import SimulationLoanRepayment from "./pages/Student/Finance/Teen/SimulationLoanRepayment";
import ReflexDebtControl from "./pages/Student/Finance/Teen/ReflexDebtControl";
import BadgeDebtSmart from "./pages/Student/Finance/Teen/BadgeDebtSmart";
import SavingsAccountStory from "./pages/Student/Finance/Teen/SavingsAccountStory";
import InvestmentQuiz from "./pages/Student/Finance/Teen/InvestmentQuiz";
import ReflexInvestorSmartness from "./pages/Student/Finance/Teen/ReflexInvestorSmartness";
import PuzzleInvestmentTypes from "./pages/Student/Finance/Teen/PuzzleInvestmentTypes";
import StartupStory from "./pages/Student/Finance/Teen/StartupStory";
import DebateSaveVsInvest from "./pages/Student/Finance/Teen/DebateSaveVsInvest";
import JournalFutureInvesting from "./pages/Student/Finance/Teen/JournalFutureInvesting";
import SimulationChoice1000 from "./pages/Student/Finance/Teen/SimulationChoice1000";
import ReflexSmartGrowth from "./pages/Student/Finance/Teen/ReflexSmartGrowth";
import BadgeSmartInvestor from "./pages/Student/Finance/Teen/BadgeSmartInvestor";
import StartupIdeaStory from "./pages/Student/Finance/Teen/StartupIdeaStory";
import QuizEntrepreneurship from "./pages/Student/Finance/Teen/QuizEntrepreneurship";
import ReflexEntrepreneurTraits from "./pages/Student/Finance/Teen/ReflexEntrepreneurTraits";
import PuzzleEntrepreneurs from "./pages/Student/Finance/Teen/PuzzleEntrepreneurs";
import BusinessRiskStory from "./pages/Student/Finance/Teen/BusinessRiskStory";
import DebateJobVsBusiness from "./pages/Student/Finance/Teen/DebateJobVsBusiness";
import JournalEntrepreneurDream from "./pages/Student/Finance/Teen/JournalEntrepreneurDream";
import SimulationMiniStartup from "./pages/Student/Finance/Teen/SimulationMiniStartup";
import ReflexSmartEntrepreneur from "./pages/Student/Finance/Teen/ReflexSmartEntrepreneur";
import BadgeYoungEntrepreneur from "./pages/Student/Finance/Teen/BadgeYoungEntrepreneur";
import FakeOnlineOfferStory from "./pages/Student/Finance/Teen/FakeOnlineOfferStory";
import ConsumerQuiz from "./pages/Student/Finance/Teen/ConsumerQuiz";
import ReflexFraudSafety from "./pages/Student/Finance/Teen/ReflexFraudSafety";
import PuzzleOfRights from "./pages/Student/Finance/Teen/PuzzleOfRights";
import FakeCallStory from "./pages/Student/Finance/Teen/FakeCallStory";
import DebateCashVsOnlineSafety from "./pages/Student/Finance/Teen/DebateCashVsOnlineSafety";
import JournalConsumerRights from "./pages/Student/Finance/Teen/JournalConsumerRights";
import SimulationFraudAlert from "./pages/Student/Finance/Teen/SimulationFraudAlert";
import ReflexScamCheck from "./pages/Student/Finance/Teen/ReflexScamCheck";
import BadgeConsumerProtector from "./pages/Student/Finance/Teen/BadgeConsumerProtector";
import ScholarshipStory from "./pages/Student/Finance/Teen/ScholarshipStory";
import EthicsQuiz from "./pages/Student/Finance/Teen/EthicsQuiz";
import ReflexEthicalChoice from "./pages/Student/Finance/Teen/ReflexEthicalChoice";
import PuzzleRightVsWrong from "./pages/Student/Finance/Teen/PuzzleRightVsWrong";
import BriberyStory from "./pages/Student/Finance/Teen/BriberyStory";
import DebateMoneyAndMorals from "./pages/Student/Finance/Teen/DebateMoneyAndMorals";
import JournalOfResponsibility from "./pages/Student/Finance/Teen/JournalOfResponsibility";
import SimulationCharityChoice from "./pages/Student/Finance/Teen/SimulationCharityChoice";
import ReflexFairness from "./pages/Student/Finance/Teen/ReflexFairness";
import BadgeEthicalFinancier from "./pages/Student/Finance/Teen/BadgeEthicalFinancier";

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
import ShoppingListStory from "./pages/Student/Brain/Kids/ShoppingListStory";
import MemoryQuiz from "./pages/Student/Brain/Kids/MemoryQuiz";
import ReflexRecall from "./pages/Student/Brain/Kids/ReflexRecall";
import MemoryMatchPuzzle from "./pages/Student/Brain/Kids/MemoryMatchPuzzle";
import RepetitionStory from "./pages/Student/Brain/Kids/RepetitionStory";
import StrongMemoryPoster from "./pages/Student/Brain/Kids/StrongMemoryPoster";
import RecallJournal from "./pages/Student/Brain/Kids/RecallJournal";
import Game from "./pages/Student/Brain/Kids/Game";
import ReflexSequence from "./pages/Student/Brain/Kids/ReflexSequence";
import MemoryKidBadge from "./pages/Student/Brain/Kids/MemoryKidBadge";
import Homework from "./pages/Student/Brain/Kids/Homework";
import CalmnessQuiz from "./pages/Student/Brain/Kids/CalmnessQuiz";
import ReflexCalm from "./pages/Student/Brain/Kids/ReflexCalm";
import RelaxingPuzzle from "./pages/Student/Brain/Kids/RelaxingPuzzle";
import ExamStoryy from "./pages/Student/Brain/Kids/ExamStoryy";
import StayCoolPoster from "./pages/Student/Brain/Kids/StayCoolPoster";
import CalmnessJournal from "./pages/Student/Brain/Kids/CalmnessJournal";
import Sports from "./pages/Student/Brain/Kids/Sports";
import QuickCalmReflex from "./pages/Student/Brain/Kids/QuickCalmReflex";
import CalmKidBadge from "./pages/Student/Brain/Kids/CalmKidBadge";
import ToyBrokenStory from "./pages/Student/Brain/Kids/ToyBrokenStory";
import FeelingsQuizz from "./pages/Student/Brain/Kids/FeelingsQuizz";
import ReflexEmotions from "./pages/Student/Brain/Kids/ReflexEmotions";
import MatchFeelingsPuzzle from "./pages/Student/Brain/Kids/MatchFeelingsPuzzle";
import SharingStory from "./pages/Student/Brain/Kids/SharingStory";
import FeelingsMatterPoster from "./pages/Student/Brain/Kids/FeelingsMatterPoster";
import FeelingsJournal from "./pages/Student/Brain/Kids/FeelingsJournal";
import LostGameStory from "./pages/Student/Brain/Kids/LostGameStory";
import QuickEmotionReflex from "./pages/Student/Brain/Kids/QuickEmotionReflex";
import EmotionKidBadge from "./pages/Student/Brain/Kids/EmotionKidBadge";
import RainyDayStory from "./pages/Student/Brain/Kids/RainyDayStory";
import PositivityQuiz from "./pages/Student/Brain/Kids/PositivityQuiz";
import HappyThoughtsReflex from "./pages/Student/Brain/Kids/HappyThoughtsReflex";
import PositiveWordsPuzzle from "./pages/Student/Brain/Kids/PositiveWordsPuzzle";
import LostMatchStory from "./pages/Student/Brain/Kids/LostMatchStory";
import StayPositivePoster from "./pages/Student/Brain/Kids/StayPositivePoster";
import GoodThingsJournal from "./pages/Student/Brain/Kids/GoodThingsJournal";
import Homeworkk from "./pages/Student/Brain/Kids/Homeworkk";
import PositiveNegativeReflex from "./pages/Student/Brain/Kids/PositiveNegativeReflex";
import PositiveKidBadge from "./pages/Student/Brain/Kids/PositiveKidBadge";
import BedtimeStory from "./pages/Student/Brain/Kids/BedtimeStory";
import SleepQuiz from "./pages/Student/Brain/Kids/SleepQuiz";
import SleepHabitsReflex from "./pages/Student/Brain/Kids/SleepHabitsReflex";
import RestPuzzle from "./pages/Student/Brain/Kids/RestPuzzle";
import ExamStori from "./pages/Student/Brain/Kids/ExamStori";
import SleepWellPoster from "./pages/Student/Brain/Kids/SleepWellPoster";
import RestJournal from "./pages/Student/Brain/Kids/RestJournal";
import HolidayStory from "./pages/Student/Brain/Kids/HolidayStory";
import RestAlertReflex from "./pages/Student/Brain/Kids/RestAlertReflex";
import SleepChampBadge from "./pages/Student/Brain/Kids/SleepChampBadge";
import TabletStory from "./pages/Student/Brain/Kids/TabletStory";
import ScreensQuiz from "./pages/Student/Brain/Kids/ScreensQuiz";
import DigitalChoiceReflex from "./pages/Student/Brain/Kids/DigitalChoiceReflex";
import BalancePuzzle from "./pages/Student/Brain/Kids/BalancePuzzle";
import HomeworkStories from "./pages/Student/Brain/Kids/HomeworkStories";
import BalanceTechPoster from "./pages/Student/Brain/Kids/BalanceTechPoster";
import ScreenUseJournal from "./pages/Student/Brain/Kids/ScreenUseJournal";
import OutdoorStory from "./pages/Student/Brain/Kids/OutdoorStory";
import ScreenAlertReflex from "./pages/Student/Brain/Kids/ScreenAlertReflex";
import BalancedKidBadge from "./pages/Student/Brain/Kids/BalancedKidBadge";
import LostKeyStory from "./pages/Student/Brain/Kids/LostKeyStory";
import CreativityQuiz from "./pages/Student/Brain/Kids/CreativityQuiz";
import ProblemSolverReflex from "./pages/Student/Brain/Kids/ProblemSolverReflex";
import SolutionsPuzzle from "./pages/Student/Brain/Kids/SolutionsPuzzle";
import GroupStory from "./pages/Student/Brain/Kids/GroupStory";
import BeCreativePoster from "./pages/Student/Brain/Kids/BeCreativePoster";
import IdeasJournal from "./pages/Student/Brain/Kids/IdeasJournal";
import ArtStory from "./pages/Student/Brain/Kids/ArtStory";
import CreativeThinkingReflex from "./pages/Student/Brain/Kids/CreativeThinkingReflex";
import CreativeKidBadge from "./pages/Student/Brain/Kids/CreativeKidBadge";
import FallStory from "./pages/Student/Brain/Kids/FallStory";
import ResilienceQuiz from "./pages/Student/Brain/Kids/ResilienceQuiz";
import TryAgainReflex from "./pages/Student/Brain/Kids/TryAgainReflex";
import ResiliencePuzzle from "./pages/Student/Brain/Kids/ResiliencePuzzle";
import TestStory from "./pages/Student/Brain/Kids/TestStory";
import DontGiveUpPoster from "./pages/Student/Brain/Kids/DontGiveUpPoster";
import BounceBackJournal from "./pages/Student/Brain/Kids/BounceBackJournal";
import SportsStories from "./pages/Student/Brain/Kids/SportsStories";
import GrowthThinkingReflex from "./pages/Student/Brain/Kids/GrowthThinkingReflex";
import BounceBackKidBadge from "./pages/Student/Brain/Kids/BounceBackKidBadge";

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
import ExamRecallStory from "./pages/Student/Brain/Teen/ExamRecallStory";
import QuizOnMemoryHacks from "./pages/Student/Brain/Teen/QuizOnMemoryHacks";
import ReflexMemoryBoost from "./pages/Student/Brain/Teen/ReflexMemoryBoost";
import PuzzleMnemonicMatch from "./pages/Student/Brain/Teen/PuzzleMnemonicMatch";
import NoteTakingStory from "./pages/Student/Brain/Teen/NoteTakingStory";
import DebateRoteVsUnderstanding from "./pages/Student/Brain/Teen/DebateRoteVsUnderstanding";
import JournalOfTricks from "./pages/Student/Brain/Teen/JournalOfTricks";
import SimulationStudyyPlan from "./pages/Student/Brain/Teen/SimulationStudyyPlan";
import ReflexRecallQuick from "./pages/Student/Brain/Teen/ReflexRecallQuick";
import BadgeMemoryHero from "./pages/Student/Brain/Teen/BadgeMemoryHero";
import StudyPressureStory from "./pages/Student/Brain/Teen/StudyPressureStory";
import StresssQuiz from "./pages/Student/Brain/Teen/StresssQuiz";
import ReflexStressCheck from "./pages/Student/Brain/Teen/ReflexStressCheck";
import PuzzleOfRelief from "./pages/Student/Brain/Teen/PuzzleOfRelief";
import FailureeStory from "./pages/Student/Brain/Teen/FailureeStory";
import DebateStressGoodOrBad from "./pages/Student/Brain/Teen/DebateStressGoodOrBad";
import JournalOfStressRelief from "./pages/Student/Brain/Teen/JournalOfStressRelief";
import SimulationStressDay from "./pages/Student/Brain/Teen/SimulationStressDay";
import ReflexHealthyCalm from "./pages/Student/Brain/Teen/ReflexHealthyCalm";
import BadgeStressManager from "./pages/Student/Brain/Teen/BadgeStressManager";
import PeerPressureeStory from "./pages/Student/Brain/Teen/PeerPressureeStory";
import EmotionQuiz from "./pages/Student/Brain/Teen/EmotionQuiz";
import ReflexEmotionControl from "./pages/Student/Brain/Teen/ReflexEmotionControl";
import PuzzleEmotionMatch from "./pages/Student/Brain/Teen/PuzzleEmotionMatch";
import AngerStory from "./pages/Student/Brain/Teen/AngerStory";
import DebateShowOrHideEmotions from "./pages/Student/Brain/Teen/DebateShowOrHideEmotions";
import JournalOfEmotionalMoment from "./pages/Student/Brain/Teen/JournalOfEmotionalMoment";
import SimulationStressfulDay from "./pages/Student/Brain/Teen/SimulationStressfulDay";
import ReflexPositiveEmotion from "./pages/Student/Brain/Teen/ReflexPositiveEmotion";
import BadgeEmotionHero from "./pages/Student/Brain/Teen/BadgeEmotionHero";
import FaillureStory from "./pages/Student/Brain/Teen/FaillureStory";
import PositivittyQuiz from "./pages/Student/Brain/Teen/PositivittyQuiz";
import ReflexOptimism from "./pages/Student/Brain/Teen/ReflexOptimism";
import PuzzlePositivePractices from "./pages/Student/Brain/Teen/PuzzlePositivePractices";
import FriendBetrayalStory from "./pages/Student/Brain/Teen/FriendBetrayalStory";
import DebateOptimismVsRealism from "./pages/Student/Brain/Teen/DebateOptimismVsRealism";
import JournallOfGratitude from "./pages/Student/Brain/Teen/JournallOfGratitude";
import SimulationNegativeDay from "./pages/Student/Brain/Teen/SimulationNegativeDay";
import ReflexMindsetCheck from "./pages/Student/Brain/Teen/ReflexMindsetCheck";
import BadgeOptimistHero from "./pages/Student/Brain/Teen/BadgeOptimistHero";
import SleepStory from "./pages/Student/Brain/Teen/SleepStory";
import SleeppQuiz from "./pages/Student/Brain/Teen/SleeppQuiz";
import ReflexRestHabits from "./pages/Student/Brain/Teen/ReflexRestHabits";
import PuzzleOfSleepHealth from "./pages/Student/Brain/Teen/PuzzleOfSleepHealth";
import PhoneStory from "./pages/Student/Brain/Teen/PhoneStory";
import DebateSleepVsStudy from "./pages/Student/Brain/Teen/DebateSleepVsStudy";
import JournalOfSleepHealth from "./pages/Student/Brain/Teen/JournalOfSleepHealth";
import SimulationExamPrep from "./pages/Student/Brain/Teen/SimulationExamPrep";
import ReflexSmartRest from "./pages/Student/Brain/Teen/ReflexSmartRest";
import BadgeRestHero from "./pages/Student/Brain/Teen/BadgeRestHero";
import MidnightStory from "./pages/Student/Brain/Teen/MidnightStory";
import QuizOnDigitalBalance from "./pages/Student/Brain/Teen/QuizOnDigitalBalance";
import ReflexTechControl from "./pages/Student/Brain/Teen/ReflexTechControl";
import PuzzleOfBalanceHabits from "./pages/Student/Brain/Teen/PuzzleOfBalanceHabits";
import GamingStory from "./pages/Student/Brain/Teen/GamingStory";
import DebateTechGoodOrBad from "./pages/Student/Brain/Teen/DebateTechGoodOrBad";
import JournalOfBalancee from "./pages/Student/Brain/Teen/JournalOfBalancee";
import SimulationDailyRoutinee from "./pages/Student/Brain/Teen/SimulationDailyRoutinee";
import ReflexHealthyUse from "./pages/Student/Brain/Teen/ReflexHealthyUse";
import BadgeDigitalHero from "./pages/Student/Brain/Teen/BadgeDigitalHero";
import ScienceProjectStory from "./pages/Student/Brain/Teen/ScienceProjectStory";
import QuizOnInnovation from "./pages/Student/Brain/Teen/QuizOnInnovation";
import ReflexSolutionMode from "./pages/Student/Brain/Teen/ReflexSolutionMode";
import PuzzleInnovators from "./pages/Student/Brain/Teen/PuzzleInnovators";
import StartupIdeaStoryy from "./pages/Student/Brain/Teen/StartupIdeaStoryy";
import DebateCopyVsCreate from "./pages/Student/Brain/Teen/DebateCopyVsCreate";
import JournalOfCreativity from "./pages/Student/Brain/Teen/JournalOfCreativity";
import SimulationSchoolFair from "./pages/Student/Brain/Teen/SimulationSchoolFair";
import ReflexInnovatorsChoice from "./pages/Student/Brain/Teen/ReflexInnovatorsChoice";
import BadgeInnovatorHero from "./pages/Student/Brain/Teen/BadgeInnovatorHero";
import ExamFailureStory from "./pages/Student/Brain/Teen/ExamFailureStory";
import GrowthMindsetQuiz from "./pages/Student/Brain/Teen/GrowthMindsetQuiz";
import ReflexGrowthAttitude from "./pages/Student/Brain/Teen/ReflexGrowthAttitude";
import PuzzleOfGrowthh from "./pages/Student/Brain/Teen/PuzzleOfGrowthh";
import CareerStoryy from "./pages/Student/Brain/Teen/CareerStoryy";
import DebateTalentVsEffort from "./pages/Student/Brain/Teen/DebateTalentVsEffort";
import JournalOfGrowthh from "./pages/Student/Brain/Teen/JournalOfGrowthh";
import SimulationLifeChoices from "./pages/Student/Brain/Teen/SimulationLifeChoices";
import ReflexNeverQuit from "./pages/Student/Brain/Teen/ReflexNeverQuit";
import BadgeGrowthChampion from "./pages/Student/Brain/Teen/BadgeGrowthChampion";

// UVLS Kids Games
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
import ShareChores from "./pages/Student/UVLS/Kids/ShareChores";
import EqualityQuiz from "./pages/Student/UVLS/Kids/EqualityQuiz";
import SpotStereotype from "./pages/Student/UVLS/Kids/SpotStereotype";
import RightsMatch from "./pages/Student/UVLS/Kids/RightsMatch";
import EncourageDream from "./pages/Student/UVLS/Kids/EncourageDream";
import EqualityPoster from "./pages/Student/UVLS/Kids/EqualityPoster";
import RoleModelJournal from "./pages/Student/UVLS/Kids/RoleModelJournal";
import SupportRoleplay from "./pages/Student/UVLS/Kids/SupportRoleplay";
import ChallengeStereotypes from "./pages/Student/UVLS/Kids/ChallengeStereotypes";
import EqualityAllyBadge from "./pages/Student/UVLS/Kids/EqualityAllyBadge";
import StopTheTease from "./pages/Student/UVLS/Kids/StopTheTease";
import BullyingQuiz from "./pages/Student/UVLS/Kids/BullyingQuiz";
import ReportReflex from "./pages/Student/UVLS/Kids/ReportReflex";
import TypesMatch from "./pages/Student/UVLS/Kids/TypesMatch";
import SupportFriend from "./pages/Student/UVLS/Kids/SupportFriend";
import AntiBullyingPoster from "./pages/Student/UVLS/Kids/AntiBullyingPoster";
import WitnessJournal from "./pages/Student/UVLS/Kids/WitnessJournal";
import BystanderRoleplay from "./pages/Student/UVLS/Kids/BystanderRoleplay";
import CyberSpot from "./pages/Student/UVLS/Kids/CyberSpot";
import PeerProtectorBadge from "./pages/Student/UVLS/Kids/PeerProtectorBadge";
import NameThatFeeling from "./pages/Student/UVLS/Kids/NameThatFeeling";
import BreatheWithMe from "./pages/Student/UVLS/Kids/BreatheWithMe";
import MoodMatch from "./pages/Student/UVLS/Kids/MoodMatch";
import MoodJournal from "./pages/Student/UVLS/Kids/MoodJournal";
import CalmChoice from "./pages/Student/UVLS/Kids/CalmChoice";
import ToolboxPoster from "./pages/Student/UVLS/Kids/ToolboxPoster";
import AskForHelpRoleplay from "./pages/Student/UVLS/Kids/AskForHelpRoleplay";
import CalmReflex from "./pages/Student/UVLS/Kids/CalmReflex";
import TriggerMapPuzzle from "./pages/Student/UVLS/Kids/TriggerMapPuzzle";
import SelfAwareBadge from "./pages/Student/UVLS/Kids/SelfAwareBadge";
import SnackChoice from "./pages/Student/UVLS/Kids/SnackChoice";
import CauseEffectQuiz from "./pages/Student/UVLS/Kids/CauseEffectQuiz";
import TrueFalseReflex from "./pages/Student/UVLS/Kids/TrueFalseReflex";
import LogicPuzzle from "./pages/Student/UVLS/Kids/LogicPuzzle";
import RiskyOffer from "./pages/Student/UVLS/Kids/RiskyOffer";
import DecisionPoster from "./pages/Student/UVLS/Kids/DecisionPoster";
import DecisionJournal from "./pages/Student/UVLS/Kids/DecisionJournal";
import EthicsRoleplay from "./pages/Student/UVLS/Kids/EthicsRoleplay";
import SpotFallacy from "./pages/Student/UVLS/Kids/SpotFallacy";
import CriticalThinkerBadge from "./pages/Student/UVLS/Kids/CriticalThinkerBadge";
import SayHello from "./pages/Student/UVLS/Kids/SayHello";
import ActiveListeningQuiz from "./pages/Student/UVLS/Kids/ActiveListeningQuiz";
import StopListenReflex from "./pages/Student/UVLS/Kids/StopListenReflex";
import ToneMatch from "./pages/Student/UVLS/Kids/ToneMatch";
import AskClearlyStory from "./pages/Student/UVLS/Kids/AskClearlyStory";
import CommunicationPoster from "./pages/Student/UVLS/Kids/CommunicationPoster";
import FeedbackJournal from "./pages/Student/UVLS/Kids/FeedbackJournal";
import DifficultTalkRoleplay from "./pages/Student/UVLS/Kids/DifficultTalkRoleplay";
import EmpathicTap from "./pages/Student/UVLS/Kids/EmpathicTap";
import GoodCommunicatorBadge from "./pages/Student/UVLS/Kids/GoodCommunicatorBadge";
import ToyDispute from "./pages/Student/UVLS/Kids/ToyDispute";
import WinWinQuiz from "./pages/Student/UVLS/Kids/WinWinQuiz";
import CalmReflexx from "./pages/Student/UVLS/Kids/CalmReflexx";
import ResolveStepsPuzzle from "./pages/Student/UVLS/Kids/ResolveStepsPuzzle";
import SplitFairlyRoleplay from "./pages/Student/UVLS/Kids/SplitFairlyRoleplay";
import MediationPoster from "./pages/Student/UVLS/Kids/MediationPoster";
import ResolutionJournal from "./pages/Student/UVLS/Kids/ResolutionJournal";
import FamilySimulation from "./pages/Student/UVLS/Kids/FamilySimulation";
import IdentifyNeedsReflex from "./pages/Student/UVLS/Kids/IdentifyNeedsReflex";
import MediatorBadge from "./pages/Student/UVLS/Kids/MediatorBadge";
import CleanUpStory from "./pages/Student/UVLS/Kids/CleanUpStory";
import CitizenDutiesQuiz from "./pages/Student/UVLS/Kids/CitizenDutiesQuiz";
import VolunteerReflex from "./pages/Student/UVLS/Kids/VolunteerReflex";
import CommunityRolesPuzzle from "./pages/Student/UVLS/Kids/CommunityRolesPuzzle";
import FundraiserStory from "./pages/Student/UVLS/Kids/FundraiserStory";
import CivicPoster from "./pages/Student/UVLS/Kids/CivicPoster";
import ContributionJournal from "./pages/Student/UVLS/Kids/ContributionJournal";
import HelpElderRoleplay from "./pages/Student/UVLS/Kids/HelpElderRoleplay";
import ReportNeedReflex from "./pages/Student/UVLS/Kids/ReportNeedReflex";
import CommunityHelperBadge from "./pages/Student/UVLS/Kids/CommunityHelperBadge";
import MorningRoutine from "./pages/Student/UVLS/Kids/MorningRoutine";
import PriorityQuiz from "./pages/Student/UVLS/Kids/PriorityQuiz";
import TaskDoneReflex from "./pages/Student/UVLS/Kids/TaskDoneReflex";
import PlanYourDayPuzzle from "./pages/Student/UVLS/Kids/PlanYourDayPuzzle";
import GoalSteps from "./pages/Student/UVLS/Kids/GoalSteps";
import SmartPoster from "./pages/Student/UVLS/Kids/SmartPoster";
import WeeklyPlanJournal from "./pages/Student/UVLS/Kids/WeeklyPlanJournal";
import TimeBudgetSimulation from "./pages/Student/UVLS/Kids/TimeBudgetSimulation";
import SafetyReflexx from "./pages/Student/UVLS/Kids/SafetyReflexx";
import LifeSkillsStarterBadge from "./pages/Student/UVLS/Kids/LifeSkillsStarterBadge";

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
import EncourageAmbition from "./pages/Student/UVLS/Teen/EncourageAmbition";
import RightsLawQuiz from "./pages/Student/UVLS/Teen/RightsLawQuiz";
import BiasSpotReflex from "./pages/Student/UVLS/Teen/BiasSpotReflex";
import WorkplacePuzzle from "./pages/Student/UVLS/Teen/WorkplacePuzzle";
import ProgramDesignSimulation from "./pages/Student/UVLS/Teen/ProgramDesignSimulation";
import EqualityDebate from "./pages/Student/UVLS/Teen/EqualityDebate";
import AllyJournal from "./pages/Student/UVLS/Teen/AllyJournal";
import InterventionRoleplay from "./pages/Student/UVLS/Teen/InterventionRoleplay";
import RightsApplicationPuzzle from "./pages/Student/UVLS/Teen/RightsApplicationPuzzle";
import GenderJusticeLeaderBadge from "./pages/Student/UVLS/Teen/GenderJusticeLeaderBadge";
import OnlineHarassScenario from "./pages/Student/UVLS/Teen/OnlineHarassScenario";
import ReportingQuiz from "./pages/Student/UVLS/Teen/ReportingQuiz";
import SupportNetworkPuzzle from "./pages/Student/UVLS/Teen/SupportNetworkPuzzle";
import InterventionSimulation from "./pages/Student/UVLS/Teen/InterventionSimulation";
import RehabVsPunishDebate from "./pages/Student/UVLS/Teen/RehabVsPunishDebate";
import LongTermJournal from "./pages/Student/UVLS/Teen/LongTermJournal";
import CounselorRoleplay from "./pages/Student/UVLS/Teen/CounselorRoleplay";
import CyberSafetyReflex from "./pages/Student/UVLS/Teen/CyberSafetyReflex";
import SystemicCasePuzzle from "./pages/Student/UVLS/Teen/SystemicCasePuzzle";
import AntiBullyingChampionBadge from "./pages/Student/UVLS/Teen/AntiBullyingChampionBadge";
import EmotionalCheckIn from "./pages/Student/UVLS/Teen/EmotionalCheckIn";
import TriggerQuiz from "./pages/Student/UVLS/Teen/TriggerQuiz";
import AdvancedBreathing from "./pages/Student/UVLS/Teen/AdvancedBreathing";
import CopingStrategyPuzzle from "./pages/Student/UVLS/Teen/CopingStrategyPuzzle";
import DeEscalationRoleplay from "./pages/Student/UVLS/Teen/DeEscalationRoleplay";
import EmotionPatternJournal from "./pages/Student/UVLS/Teen/EmotionPatternJournal";
import PeerSupportSimulation from "./pages/Student/UVLS/Teen/PeerSupportSimulation";
import SelfCheckReflex from "./pages/Student/UVLS/Teen/SelfCheckReflex";
import BuildToolboxPuzzle from "./pages/Student/UVLS/Teen/BuildToolboxPuzzle";
import EmotionalResponderBadge from "./pages/Student/UVLS/Teen/EmotionalResponderBadge";
import EvidenceCheck from "./pages/Student/UVLS/Teen/EvidenceCheck";
import FakeNewsQuiz from "./pages/Student/UVLS/Teen/FakeNewsQuiz";
import TradeOffsPuzzle from "./pages/Student/UVLS/Teen/TradeOffsPuzzle";
import ScenarioSimulation from "./pages/Student/UVLS/Teen/ScenarioSimulation";
import EthicalRoleplay from "./pages/Student/UVLS/Teen/EthicalRoleplay";
import BiasDetectionReflex from "./pages/Student/UVLS/Teen/BiasDetectionReflex";
import EvidenceJournal from "./pages/Student/UVLS/Teen/EvidenceJournal";
import TimedDebate from "./pages/Student/UVLS/Teen/TimedDebate";
import PolicyPuzzle from "./pages/Student/UVLS/Teen/PolicyPuzzle";
import DecisionMasterBadge from "./pages/Student/UVLS/Teen/DecisionMasterBadge";
import ToughConversation from "./pages/Student/UVLS/Teen/ToughConversation";
import NonverbalQuiz from "./pages/Student/UVLS/Teen/NonverbalQuiz";
import ClarifyReflex from "./pages/Student/UVLS/Teen/ClarifyReflex";
import InterviewSimulation from "./pages/Student/UVLS/Teen/InterviewSimulation";
import FeedbackRoleplay from "./pages/Student/UVLS/Teen/FeedbackRoleplay";
import PersuasionPuzzle from "./pages/Student/UVLS/Teen/PersuasionPuzzle";
import CommunicationJournal from "./pages/Student/UVLS/Teen/CommunicationJournal";
import PublicSpeakingPrep from "./pages/Student/UVLS/Teen/PublicSpeakingPrep";
import ListeningVsSpeakingDebate from "./pages/Student/UVLS/Teen/ListeningVsSpeakingDebate";
import CommunicationProBadge from "./pages/Student/UVLS/Teen/CommunicationProBadge";
import PowerDynamicsScenario from "./pages/Student/UVLS/Teen/PowerDynamicsScenario";
import NegotiationTacticsQuiz from "./pages/Student/UVLS/Teen/NegotiationTacticsQuiz";
import MediationSimulation from "./pages/Student/UVLS/Teen/MediationSimulation";
import BATNAPuzzle from "./pages/Student/UVLS/Teen/BATNAPuzzle";
import ToughBargainRoleplay from "./pages/Student/UVLS/Teen/ToughBargainRoleplay";
import EthicsInNegotiationDebate from "./pages/Student/UVLS/Teen/EthicsInNegotiationDebate";
import NegotiationJournal from "./pages/Student/UVLS/Teen/NegotiationJournal";
import WalkAwayReflex from "./pages/Student/UVLS/Teen/WalkAwayReflex";
import WorkplaceConflictSim from "./pages/Student/UVLS/Teen/WorkplaceConflictSim";
import ConflictSolverBadge from "./pages/Student/UVLS/Teen/ConflictSolverBadge";
import CampaignStory from "./pages/Student/UVLS/Teen/CampaignStory";
import SDGQuiz from "./pages/Student/UVLS/Teen/SDGQuiz";
import VolunteerSimulation from "./pages/Student/UVLS/Teen/VolunteerSimulation";
import PublicBudgetPuzzle from "./pages/Student/UVLS/Teen/PublicBudgetPuzzle";
import AdvocacyRoleplay from "./pages/Student/UVLS/Teen/AdvocacyRoleplay";
import ImpactJournal from "./pages/Student/UVLS/Teen/ImpactJournal";
import ServiceDesignPuzzle from "./pages/Student/UVLS/Teen/ServiceDesignPuzzle";
import CoalitionSimulation from "./pages/Student/UVLS/Teen/CoalitionSimulation";
import CivicReflex from "./pages/Student/UVLS/Teen/CivicReflex";
import CitizenLeaderBadge from "./pages/Student/UVLS/Teen/CitizenLeaderBadge";
import ShortVsLongGoalsDebate from "./pages/Student/UVLS/Teen/ShortVsLongGoalsDebate";
import EmergencyStepsQuiz from "./pages/Student/UVLS/Teen/EmergencyStepsQuiz";
import OneYearPlanJournal from "./pages/Student/UVLS/Teen/OneYearPlanJournal";
import CrisisSimulation from "./pages/Student/UVLS/Teen/CrisisSimulation";
import RequestExtensionRoleplay from "./pages/Student/UVLS/Teen/RequestExtensionRoleplay";
import SafetyOfferReflex from "./pages/Student/UVLS/Teen/SafetyOfferReflex";
import HabitChainPuzzle from "./pages/Student/UVLS/Teen/HabitChainPuzzle";
import HabitChangeJournal from "./pages/Student/UVLS/Teen/HabitChangeJournal";
import SoloTripSimulation from "./pages/Student/UVLS/Teen/SoloTripSimulation";
import LifeSkillsChampionBadge from "./pages/Student/UVLS/Teen/LifeSkillsChampionBadge";

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

          {/* Game Category Pages */}
          <Route
            path="/games/dcos"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DCOSGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/brain-teaser"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BrainTeaserGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/brain-teaser/:gameId"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BrainTeaserPlay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/:category/:ageGroup"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <GameCategoryPage />
              </ProtectedRoute>
            }
          />

          {/* Finance Games for Kids */}
          <Route
            path="/student/finance/kids/piggy-bank-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <PiggyBankStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-on-saving"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnSaving />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-savings"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSavings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-save-or-spend"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleSaveOrSpend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/birthday-money-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <BirthdayMoneyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-saving-habit"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterSavingHabit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-of-saving"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfSaving />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/shop-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ShopStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-money-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexMoneyChoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/badge-saver-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeSaverKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/ice-cream-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <IceCreamStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-on-spending"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnSpending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-spending"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSpending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-smart-vs-waste"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleSmartVsWaste />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/shop-story-2"
            element={
              <ProtectedRoute roles={["student"]}>
                <ShopStory2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-smart-shopping"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterSmartShopping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-of-smart-buy"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfSmartBuy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/candy-offer-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <CandyOfferStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-needs-first"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexNeedsFirst />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/badge-smart-spender-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeSmartSpenderKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Candy-Story"
            element={
              <ProtectedRoute roles={["student"]}>
                <CandyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Budgeting-Quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <BudgetingQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Reflex-Budget"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Budget-Items-Puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <BudgetItemsPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Birthday-Money"
            element={
              <ProtectedRoute roles={["student"]}>
                <BirthdayMoney />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Poster-Plan-First"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterPlanFirst />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Journal-Of-Budgeting"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfBudgeting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/School-Fair-Story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SchoolFairStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Reflex-Money-Plan"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexMoneyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/Badge-Budget-Kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeBudgetKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/ice-cream-vs-book-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <IceCreamVsBookStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-on-needs"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnNeeds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-need-vs-want"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexNeedVsWant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-needs-wants"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleNeedsWants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/snack-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SnackStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-needs-first"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterNeedsFirst />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-of-needs"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfNeeds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/gift-money-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <GiftMoneyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-smart-pick"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSmartPick />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/needs-first-kid-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <NeedsFirstKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/bank-visit-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <BankVisitStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-banks"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizBanks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-bank"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-bank-uses"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleBankUses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/savings-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SavingsStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-banks-help"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterBanksHelp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-first-bank"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalFirstBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/atm-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ATMStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-bank-symbols"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBankSymbols />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/badge-bank-explorer"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeBankExplorer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/pencil-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <PencilStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-borrowing"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizBorrowing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-borrow-steal"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBorrowSteal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-borrow-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleBorrowMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/lunch-box-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <LunchBoxStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-return-borrow"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterReturnBorrow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-borrowing"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalBorrowing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/toy-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ToyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-borrow-right"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBorrowRight />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/badge-good-borrower"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeGoodBorrower />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/tree-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <TreeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-on-growth"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnGrowth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-investment-basics"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexInvestmentBasics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-of-growth"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfGrowth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/piggy-bank"
            element={
              <ProtectedRoute roles={["student"]}>
                <PiggyBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-grow-your-money"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterGrowYourMoney />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-of-growth"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfGrowth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/toy-vs-saving-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ToyVsSavingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-growth-check"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexGrowthCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/badge-money-gardener"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeMoneyGardener />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/lemonade-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <LemonadeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-on-earning"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnEarning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-work-vs-play"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexWorkVsPlay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-of-jobs"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/helping-parents-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <HelpingParentsStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-work-to-earn"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterWorkToEarn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-of-earning"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfEarning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/pet-sitting-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <PetSittingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-small-business"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSmallBusiness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/badge-young-earner"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeYoungEarner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/candy-shop-storyy"
            element={
              <ProtectedRoute roles={["student"]}>
                <CandyShopStoryy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/quiz-on-honesty"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnHonesty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-scam-alert"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexScamAlert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/puzzle-honest-vs-fraud"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleHonestVsFraud />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/stranger-storyy"
            element={
              <ProtectedRoute roles={["student"]}>
                <StrangerStoryy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/poster-be-alert"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterBeAlert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/journal-safety"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalSafety />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/toy-shop-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ToyShopStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-check-first"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexCheckFirst />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/badge-scam-spotter-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeScamSpotterKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/lost-coin-story-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <LostCoinStoryGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/money-honesty-quiz-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <MoneyHonestyQuizGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-ethics-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexEthicsGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/honesty-puzzle-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <HonestyPuzzleGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/friends-money-story-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <FriendsMoneyStoryGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/honesty-poster-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <HonestyPosterGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/ethics-journal-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <EthicsJournalGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/shop-story-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <ShopStoryGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/reflex-money-truth-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexMoneyTruthGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/kids/honest-kid-badge-game"
            element={
              <ProtectedRoute roles={["student"]}>
                <HonestKidBadgeGame />
              </ProtectedRoute>
            }
          />

          {/* Finance Games for Teens */}
          <Route
            path="/student/finance/teen/pocket-money-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <PocketMoneyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/quiz-on-savings-rate"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnSavingsRate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-smart-saver"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSmartSaver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-of-saving-goals"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfSavingGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/salary-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SalaryStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-save-vs-spend"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateSaveVsSpend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-of-saving-goal"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfSavingGoal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-monthly-money"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationMonthlyMoney />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-wise-use"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexWiseUse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-smart-saver"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeSmartSaver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/allowance-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <AllowanceStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/spending-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <SpendingQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-wise-choices"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexWiseChoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-smart-spending"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleSmartSpending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/party-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <PartyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-needs-vs-wants"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateNeedsVsWants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-of-spending"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfSpending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-shopping-mall"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationShoppingMall />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-control"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexControl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-smart-spender-teen"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeSmartSpenderTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/allowance-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <Allowance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/budget-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <BudgetQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-budget-check"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBudgett />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-priorities"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzlePriorities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/college-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <CollegeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-budget-freedom"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateBudgetFreedom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-planning"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalMonthlyBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-allowance"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationMonthlyAllowance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-budget-smarts"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBudgetSmarts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-budget-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeBudgetHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/movie-vs-bus-fare-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <MovieVsBusFareStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/needs-vs-wants-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <NeedsVsWantsQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-decision"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexDecision />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-real-priorities"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleRealPriorities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/exam-prep-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ExamPrepStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-wants-matter-too"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateWantsMatter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-of-balance"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfBalance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-monthly-budget"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationMonthlyBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-smart-spend"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSmartSpend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-wise-chooser"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeWiseChooser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/online-payment-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <OnlinePaymentStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/quiz-on-digital-money"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnDigitalMoney />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-secure-use"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSecureUse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-of-digital-tools"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfDigitalTools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/online-fraud-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <OnlineFraudStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-cash-vs-digital"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateCashVsDigital />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-of-digital-use"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfDigitalUse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-digital-spend"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationDigitalSpend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-fraud-alert"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexFraudAlert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-digital-money-smart"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeDigitalMoneySmart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/money-borrow-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <MoneyBorrowStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debt-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebtQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-debt-dangers"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexDebtDangers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-loan-basics"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleLoanBasics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/borrowing-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <BorrowingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-borrow-good-or-bad"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateBorrowGoodOrBad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-of-borrowing"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfBorrowing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-loan-repayment"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationLoanRepayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-debt-control"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexDebtControl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-debt-smart"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeDebtSmart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/savings-account-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SavingsAccountStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/investment-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <InvestmentQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-investor-smartness"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexInvestorSmartness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-investment-types"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleInvestmentTypes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/startup-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <StartupStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-save-vs-invest"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateSaveVsInvest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-future-investing"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalFutureInvesting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-1000-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationChoice1000 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-smart-growth"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSmartGrowth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-smart-investor"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeSmartInvestor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/startup-idea-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <StartupIdeaStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/quiz-entrepreneurship"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizEntrepreneurship />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-entrepreneur-traits"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexEntrepreneurTraits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-entrepreneurs"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleEntrepreneurs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/business-risk-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <BusinessRiskStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-job-vs-business"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateJobVsBusiness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-entrepreneur-dream"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalEntrepreneurDream />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-mini-startup"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationMiniStartup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-smart-entrepreneur"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSmartEntrepreneur />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-young-entrepreneur"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeYoungEntrepreneur />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/fake-online-offer-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <FakeOnlineOfferStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/consumer-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <ConsumerQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-fraud-safety"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexFraudSafety />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-of-rights"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfRights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/fake-call-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <FakeCallStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-cash-vs-online-safety"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateCashVsOnlineSafety />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-consumer-rights"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalConsumerRights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-fraud-alert"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationFraudAlert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-scam-check"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexScamCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-consumer-protector"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeConsumerProtector />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/scholarship-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ScholarshipStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/ethics-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <EthicsQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-ethical-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexEthicalChoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/puzzle-right-vs-wrong"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleRightVsWrong />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/bribery-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <BriberyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/debate-money-morals"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateMoneyAndMorals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/journal-responsibility"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfResponsibility />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/simulation-charity-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationCharityChoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/reflex-fairness"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexFairness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/teen/badge-ethical-financier"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeEthicalFinancier />
              </ProtectedRoute>
            }
          />

          {/* Brain Health Games for Kids */}
           <Route
            path="/student/brain/kids/water-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <WaterStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-on-brain-food"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnBrainFood />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-brain-boost"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBrainBoost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-of-brain-care"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfBrainCare />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/breakfast-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <BreakfastStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-brain-health"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterBrainHealth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-of-habits"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfHabits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/sports-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SportsStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-daily-habit"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexDailyHabit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-brain-care-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeBrainCareKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/classroom-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ClassroomStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-on-focus"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnFocus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-attention"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexAttention />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-of-focus"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfFocus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/homework-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <HomeworkStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-focus-matters"
            element={
              <ProtectedRoute roles={["student"]}>
                <PosterFocusMatters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-of-focus"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfFocus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/game-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <GameStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-quick-attention"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexQuickAttention />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-focus-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeFocusKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/shopping-list-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ShoppingListStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-on-memory"
            element={
              <ProtectedRoute roles={["student"]}>
                <MemoryQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-recall"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexRecall />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/memory-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <MemoryMatchPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/story-of-repetition"
            element={
              <ProtectedRoute roles={["student"]}>
                <RepetitionStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-strong-memory"
            element={
              <ProtectedRoute roles={["student"]}>
                <StrongMemoryPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-of-recall"
            element={
              <ProtectedRoute roles={["student"]}>
                <RecallJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/game"
            element={
              <ProtectedRoute roles={["student"]}>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-sequence"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSequence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-memory-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <MemoryKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/homework-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <Homework />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-on-calmness"
            element={
              <ProtectedRoute roles={["student"]}>
                <CalmnessQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-calm"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexCalm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-of-relaxing"
            element={
              <ProtectedRoute roles={["student"]}>
                <RelaxingPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/exam-storyy"
            element={
              <ProtectedRoute roles={["student"]}>
                <ExamStoryy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-stay-cool"
            element={
              <ProtectedRoute roles={["student"]}>
                <StayCoolPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-of-calmness"
            element={
              <ProtectedRoute roles={["student"]}>
                <CalmnessJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/sports-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <Sports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-quick-calm"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuickCalmReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-calm-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <CalmKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/toy-broken-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ToyBrokenStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-on-feelings"
            element={
              <ProtectedRoute roles={["student"]}>
                <FeelingsQuizz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-emotions"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexEmotions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/match-feelings"
            element={
              <ProtectedRoute roles={["student"]}>
                <MatchFeelingsPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/sharing-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SharingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-feelings-matter"
            element={
              <ProtectedRoute roles={["student"]}>
                <FeelingsMatterPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-of-feelings"
            element={
              <ProtectedRoute roles={["student"]}>
                <FeelingsJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/lost-game-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <LostGameStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-quick-emotion"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuickEmotionReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-emotion-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmotionKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/rainy-day-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <RainyDayStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-on-positivity"
            element={
              <ProtectedRoute roles={["student"]}>
                <PositivityQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-happy-thoughts"
            element={
              <ProtectedRoute roles={["student"]}>
                <HappyThoughtsReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-of-positive-words"
            element={
              <ProtectedRoute roles={["student"]}>
                <PositiveWordsPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/lost-match-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <LostMatchStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-stay-positive"
            element={
              <ProtectedRoute roles={["student"]}>
                <StayPositivePoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-of-good-things"
            element={
              <ProtectedRoute roles={["student"]}>
                <GoodThingsJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/homework-positive-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <Homeworkk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-positive-negative"
            element={
              <ProtectedRoute roles={["student"]}>
                <PositiveNegativeReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-positive-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <PositiveKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/bedtime-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <BedtimeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-sleep"
            element={
              <ProtectedRoute roles={["student"]}>
                <SleepQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-sleep-habits"
            element={
              <ProtectedRoute roles={["student"]}>
                <SleepHabitsReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-rest"
            element={
              <ProtectedRoute roles={["student"]}>
                <RestPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/exam-stori"
            element={
              <ProtectedRoute roles={["student"]}>
                <ExamStori />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-sleep-well"
            element={
              <ProtectedRoute roles={["student"]}>
                <SleepWellPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-rest"
            element={
              <ProtectedRoute roles={["student"]}>
                <RestJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/holiday-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <HolidayStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-rest-alert"
            element={
              <ProtectedRoute roles={["student"]}>
                <RestAlertReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-sleep-champ"
            element={
              <ProtectedRoute roles={["student"]}>
                <SleepChampBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/tablet-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <TabletStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-screens"
            element={
              <ProtectedRoute roles={["student"]}>
                <ScreensQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-digital-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <DigitalChoiceReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-balance"
            element={
              <ProtectedRoute roles={["student"]}>
                <BalancePuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/homework-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <HomeworkStories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-balance-tech"
            element={
              <ProtectedRoute roles={["student"]}>
                <BalanceTechPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-screen-use"
            element={
              <ProtectedRoute roles={["student"]}>
                <ScreenUseJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/outdoor-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <OutdoorStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-screen-alert"
            element={
              <ProtectedRoute roles={["student"]}>
                <ScreenAlertReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-balanced-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BalancedKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/lost-key-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <LostKeyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-creativity"
            element={
              <ProtectedRoute roles={["student"]}>
                <CreativityQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-problem-solver"
            element={
              <ProtectedRoute roles={["student"]}>
                <ProblemSolverReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-solutions"
            element={
              <ProtectedRoute roles={["student"]}>
                <SolutionsPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/group-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <GroupStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-be-creative"
            element={
              <ProtectedRoute roles={["student"]}>
                <BeCreativePoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-ideas"
            element={
              <ProtectedRoute roles={["student"]}>
                <IdeasJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/art-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ArtStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-creative-thinking"
            element={
              <ProtectedRoute roles={["student"]}>
                <CreativeThinkingReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-creative-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <CreativeKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/fall-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <FallStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/quiz-resilience"
            element={
              <ProtectedRoute roles={["student"]}>
                <ResilienceQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-try-again"
            element={
              <ProtectedRoute roles={["student"]}>
                <TryAgainReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/puzzle-resilience"
            element={
              <ProtectedRoute roles={["student"]}>
                <ResiliencePuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/test-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <TestStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/poster-dont-give-up"
            element={
              <ProtectedRoute roles={["student"]}>
                <DontGiveUpPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/journal-bounce-back"
            element={
              <ProtectedRoute roles={["student"]}>
                <BounceBackJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/sports-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SportsStories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/reflex-growth-thinking"
            element={
              <ProtectedRoute roles={["student"]}>
                <GrowthThinkingReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/kids/badge-bounce-back-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <BounceBackKidBadge />
              </ProtectedRoute>
            }
          />

          {/* Brain Health Games for Teens */}
          <Route
            path="/student/brain/teen/exercise-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ExerciseStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/quiz-on-habits"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnHabits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-mind-check"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexMindCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-brain-fuel"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleBrainFuel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/junk-food-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <JunkFoodStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-brain-vs-body"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateBrainVsBody />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-of-brain-fitness"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfBrainFitness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-daily-routine"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationDailyRoutine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-brain-boost"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexBrainBoostTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-brain-health-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeBrainHealthHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/exam-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ExamStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/quiz-on-attention"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnAttention />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-concentration"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexConcentration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-of-distractions"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfDistractions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/social-media-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SocialMediaStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-multitask-vs-focus"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateMultitaskVsFocus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-of-attention"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfAttention />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-study-plan"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationStudyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-distraction-alert"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexDistractionAlert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-focus-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeFocusHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/exam-recall-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ExamRecallStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/quiz-memory-hacks"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnMemoryHacks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-memory-boost"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexMemoryBoost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-mnemonic-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleMnemonicMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/note-taking-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <NoteTakingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-rote-vs-understanding"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateRoteVsUnderstanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-of-tricks"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfTricks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-studyy-plan"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationStudyyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-recall-quick"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexRecallQuick />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-memory-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeMemoryHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/study-pressure-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudyPressureStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/stresss-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <StresssQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-stress-check"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexStressCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-of-relief"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfRelief />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/failuree-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <FailureeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-stress-good-or-bad"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateStressGoodOrBad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-stress-relief"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfStressRelief />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-stress-day"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationStressDay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-healthy-calm"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexHealthyCalm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-stress-manager"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeStressManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/peer-pressuree-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <PeerPressureeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/emotion-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmotionQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-emotion-control"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexEmotionControl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-emotion-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleEmotionMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/anger-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <AngerStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-show-hide-emotions"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateShowOrHideEmotions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-emotional-moment"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfEmotionalMoment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-stressful-day"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationStressfulDay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-positive-emotion"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexPositiveEmotion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-emotion-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeEmotionHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/faillure-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <FaillureStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/positivitty-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <PositivittyQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-optimism"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexOptimism />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-positive-practices"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzlePositivePractices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/friend-betrayal-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <FriendBetrayalStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-optimism-vs-realism"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateOptimismVsRealism />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journall-of-gratitude"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournallOfGratitude />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-negative-day"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationNegativeDay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-mindset-check"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexMindsetCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-optimist-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeOptimistHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/sleep-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <SleepStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/sleepp-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <SleeppQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-rest-habits"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexRestHabits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-sleep-health"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfSleepHealth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/phone-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <PhoneStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-sleep-vs-study"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateSleepVsStudy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-sleep-health"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfSleepHealth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-exam-prep"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationExamPrep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-smart-rest"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSmartRest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-rest-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeRestHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/midnight-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <MidnightStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/quiz-digital-balance"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnDigitalBalance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-tech-control"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexTechControl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-balance-habits"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfBalanceHabits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/gaming-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <GamingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-tech-good-or-bad"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateTechGoodOrBad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-balancee"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfBalancee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-daily-routinee"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationDailyRoutinee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-healthy-use"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexHealthyUse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-digital-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeDigitalHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/science-project-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ScienceProjectStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/quiz-on-innovation"
            element={
              <ProtectedRoute roles={["student"]}>
                <QuizOnInnovation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-solution-mode"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexSolutionMode />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/puzzle-innovators"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleInnovators />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/startup-idea-storyy"
            element={
              <ProtectedRoute roles={["student"]}>
                <StartupIdeaStoryy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/debate-copy-vs-create"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateCopyVsCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/journal-of-creativity"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfCreativity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/simulation-school-fair"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationSchoolFair />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-innovators-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexInnovatorsChoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/badge-innovator-hero"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeInnovatorHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/exam-failure-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <ExamFailureStory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/growth-mindset-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <GrowthMindsetQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/reflex-growth-attitude"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexGrowthAttitude />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/puzzle-of-growthh"
            element={
              <ProtectedRoute roles={["student"]}>
                <PuzzleOfGrowthh />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/career-storyy"
            element={
              <ProtectedRoute roles={["student"]}>
                <CareerStoryy />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/debate-talent-vs-effort"
            element={
              <ProtectedRoute roles={["student"]}>
                <DebateTalentVsEffort />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/journal-of-growthh"
            element={
              <ProtectedRoute roles={["student"]}>
                <JournalOfGrowthh />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/simulation-life-choices"
            element={
              <ProtectedRoute roles={["student"]}>
                <SimulationLifeChoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/brain/teen/reflex-never-quit"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflexNeverQuit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/brain/teen/badge-growth-champion"
            element={
              <ProtectedRoute roles={["student"]}>
                <BadgeGrowthChampion />
              </ProtectedRoute>
            }
          />

          {/* UVLS Kids Games  */}
          <Route
            path="/student/uvls/kids/share-your-toy"
            element={
              <ProtectedRoute roles={["student"]}>
                <ShareYourToy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/feelings-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <FeelingsQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/kind-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <KindReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/match-faces"
            element={
              <ProtectedRoute roles={["student"]}>
                <MatchFaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/spot-help"
            element={
              <ProtectedRoute roles={["student"]}>
                <SpotHelp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/kind-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <KindPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/mini-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <MiniJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/comfort-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <ComfortRoleplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/share-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <ShareReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/little-empath-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <LittleEmpathBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/greet-the-new-kid"
            element={
              <ProtectedRoute roles={["student"]}>
                <GreetTheNewKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/polite-words-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <PoliteWordsQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/respect-tap"
            element={
              <ProtectedRoute roles={["student"]}>
                <RespectTap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/inclusion-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <InclusionMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/invite-to-play"
            element={
              <ProtectedRoute roles={["student"]}>
                <InviteToPlay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/inclusion-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <InclusionPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/inclusion-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <InclusionJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/invite-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <InviteRoleplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/respect-signals"
            element={
              <ProtectedRoute roles={["student"]}>
                <RespectSignals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/inclusive-kid-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <InclusiveKidBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/share-chores"
            element={
              <ProtectedRoute roles={["student"]}>
                <ShareChores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/equality-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <EqualityQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/spot-stereotype"
            element={
              <ProtectedRoute roles={["student"]}>
                <SpotStereotype />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/rights-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <RightsMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/encourage-dream"
            element={
              <ProtectedRoute roles={["student"]}>
                <EncourageDream />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/equality-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <EqualityPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/role-model-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <RoleModelJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/support-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <SupportRoleplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/challenge-stereotypes"
            element={
              <ProtectedRoute roles={["student"]}>
                <ChallengeStereotypes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/equality-ally-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <EqualityAllyBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/stop-the-tease"
            element={
              <ProtectedRoute roles={["student"]}>
                <StopTheTease />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/bullying-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <BullyingQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/report-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReportReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/types-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <TypesMatch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/support-friend"
            element={
              <ProtectedRoute roles={["student"]}>
                <SupportFriend />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/anti-bullying-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <AntiBullyingPoster />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/witness-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <WitnessJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/bystander-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <BystanderRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/cyber-spot"
            element={
              <ProtectedRoute roles={["student"]}>
                <CyberSpot />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/peer-protector-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <PeerProtectorBadge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/name-that-feeling"
            element={
              <ProtectedRoute roles={["student"]}>
                <NameThatFeeling />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/breathe-with-me"
            element={
              <ProtectedRoute roles={["student"]}>
                <BreatheWithMe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/mood-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <MoodMatch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/mood-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <MoodJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/calm-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <CalmChoice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/toolbox-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <ToolboxPoster />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/ask-for-help-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <AskForHelpRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/calm-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <CalmReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/trigger-map-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <TriggerMapPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/self-aware-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <SelfAwareBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/snack-choice"
            element={
              <ProtectedRoute roles={["student"]}>
                <SnackChoice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/cause-effect-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <CauseEffectQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/true-false-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <TrueFalseReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/logic-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <LogicPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/risky-offer"
            element={
              <ProtectedRoute roles={["student"]}>
                <RiskyOffer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/decision-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <DecisionPoster />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/decision-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <DecisionJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/ethics-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <EthicsRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/spot-fallacy"
            element={
              <ProtectedRoute roles={["student"]}>
                <SpotFallacy />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/critical-thinker-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <CriticalThinkerBadge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/say-hello"
            element={
              <ProtectedRoute roles={["student"]}>
                <SayHello />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/active-listening-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <ActiveListeningQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/stop-listen-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <StopListenReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/tone-match"
            element={
              <ProtectedRoute roles={["student"]}>
                <ToneMatch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/ask-clearly-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <AskClearlyStory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/communication-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <CommunicationPoster />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/feedback-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <FeedbackJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/difficult-talk-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <DifficultTalkRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/empathic-tap"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmpathicTap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/good-communicator-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <GoodCommunicatorBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/toy-dispute"
            element={
              <ProtectedRoute roles={["student"]}>
                <ToyDispute />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/win-win-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <WinWinQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/calm-reflexx"
            element={
              <ProtectedRoute roles={["student"]}>
                <CalmReflexx />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/resolve-steps-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <ResolveStepsPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/split-fairly-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <SplitFairlyRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/mediation-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <MediationPoster />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/resolution-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <ResolutionJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/family-simulation"
            element={
              <ProtectedRoute roles={["student"]}>
                <FamilySimulation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/identify-needs-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <IdentifyNeedsReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/mediator-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <MediatorBadge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/clean-up-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <CleanUpStory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/citizen-duties-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <CitizenDutiesQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/volunteer-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <VolunteerReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/community-roles-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <CommunityRolesPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/fundraiser-story"
            element={
              <ProtectedRoute roles={["student"]}>
                <FundraiserStory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/civic-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <CivicPoster />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/contribution-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <ContributionJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/help-elder-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <HelpElderRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/report-need-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReportNeedReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/community-helper-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <CommunityHelperBadge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/morning-routine"
            element={
              <ProtectedRoute roles={["student"]}>
                <MorningRoutine />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/priority-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <PriorityQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/task-done-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <TaskDoneReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/kids/plan-your-day-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <PlanYourDayPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/goal-steps"
            element={
              <ProtectedRoute roles={["student"]}>
                <GoalSteps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/smart-poster"
            element={
              <ProtectedRoute roles={["student"]}>
                <SmartPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/weekly-plan-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <WeeklyPlanJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/time-budget-simulation"
            element={
              <ProtectedRoute roles={["student"]}>
                <TimeBudgetSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/safety-reflexx"
            element={
              <ProtectedRoute roles={["student"]}>
                <SafetyReflexx />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/kids/life-skills-starter-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <LifeSkillsStarterBadge />
              </ProtectedRoute>
            }
          />

          {/* UVLS Teen Games */}
          <Route
            path="/student/uvls/teen/listen-deep"
            element={
              <ProtectedRoute roles={["student"]}>
                <ListenDeep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/empathy-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmpathyQuizTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/perspective-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <PerspectivePuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/walk-in-shoes"
            element={
              <ProtectedRoute roles={["student"]}>
                <WalkInShoes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/empathy-debate"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmpathyDebate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/reflective-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReflectiveJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/peer-support-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <PeerSupportRoleplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/case-response-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <CaseResponsePuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/spot-distress-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <SpotDistressReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/empathy-champion-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmpathyChampionBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/cultural-greeting"
            element={
              <ProtectedRoute roles={["student"]}>
                <CulturalGreeting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/inclusion-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <InclusionQuizTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/accessibility-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <AccessibilityPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/inclusive-class-simulation"
            element={
              <ProtectedRoute roles={["student"]}>
                <InclusiveClassSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/respect-debate"
            element={
              <ProtectedRoute roles={["student"]}>
                <RespectDebate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/inclusion-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <InclusionJournalTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/correcting-bias-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <CorrectingBiasRoleplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/name-respect-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <NameRespectReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/policy-case-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <PolicyCasePuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/respect-leader-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <RespectLeaderBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/uvls/teen/encourage-ambition"
            element={
              <ProtectedRoute roles={["student"]}>
                <EncourageAmbition />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/rights-law-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <RightsLawQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/bias-spot-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <BiasSpotReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/workplace-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <WorkplacePuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/program-design-simulation"
            element={
              <ProtectedRoute roles={["student"]}>
                <ProgramDesignSimulation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/equality-debate"
            element={
              <ProtectedRoute roles={["student"]}>
                <EqualityDebate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/ally-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <AllyJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/intervention-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <InterventionRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/rights-application-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <RightsApplicationPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/gender-justice-leader-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <GenderJusticeLeaderBadge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/online-harass-scenario"
            element={
              <ProtectedRoute roles={["student"]}>
                <OnlineHarassScenario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/reporting-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <ReportingQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/support-network-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <SupportNetworkPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/intervention-simulation"
            element={
              <ProtectedRoute roles={["student"]}>
                <InterventionSimulation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/rehab-vs-punish-debate"
            element={
              <ProtectedRoute roles={["student"]}>
                <RehabVsPunishDebate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/long-term-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <LongTermJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/counselor-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <CounselorRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/cyber-safety-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <CyberSafetyReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/systemic-case-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <SystemicCasePuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/anti-bullying-champion-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <AntiBullyingChampionBadge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/emotional-check-in"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmotionalCheckIn />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/trigger-quiz"
            element={
              <ProtectedRoute roles={["student"]}>
                <TriggerQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/advanced-breathing-sim"
            element={
              <ProtectedRoute roles={["student"]}>
                <AdvancedBreathing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/coping-strategy-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <CopingStrategyPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/de-escalation-roleplay"
            element={
              <ProtectedRoute roles={["student"]}>
                <DeEscalationRoleplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/emotion-pattern-journal"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmotionPatternJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/peer-support-simulation"
            element={
              <ProtectedRoute roles={["student"]}>
                <PeerSupportSimulation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/self-check-reflex"
            element={
              <ProtectedRoute roles={["student"]}>
                <SelfCheckReflex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/build-toolbox-puzzle"
            element={
              <ProtectedRoute roles={["student"]}>
                <BuildToolboxPuzzle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/uvls/teen/emotional-responder-badge"
            element={
              <ProtectedRoute roles={["student"]}>
                <EmotionalResponderBadge />
              </ProtectedRoute>
            }
          />
          <Route
      path="/student/uvls/teen/evidence-check"
      element={
        <ProtectedRoute roles={["student"]}>
          <EvidenceCheck />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/fake-news-quiz"
      element={
        <ProtectedRoute roles={["student"]}>
          <FakeNewsQuiz />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/trade-offs-puzzle"
      element={
        <ProtectedRoute roles={["student"]}>
          <TradeOffsPuzzle />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/scenario-simulation"
      element={
        <ProtectedRoute roles={["student"]}>
          <ScenarioSimulation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/ethical-roleplay"
      element={
        <ProtectedRoute roles={["student"]}>
          <EthicalRoleplay />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/bias-detection-reflex"
      element={
        <ProtectedRoute roles={["student"]}>
          <BiasDetectionReflex />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/evidence-journal"
      element={
        <ProtectedRoute roles={["student"]}>
          <EvidenceJournal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/timed-debate"
      element={
        <ProtectedRoute roles={["student"]}>
          <TimedDebate />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/policy-puzzle"
      element={
        <ProtectedRoute roles={["student"]}>
          <PolicyPuzzle />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/decision-master-badge"
      element={
        <ProtectedRoute roles={["student"]}>
          <DecisionMasterBadge />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/tough-conversation"
      element={
        <ProtectedRoute roles={["student"]}>
          <ToughConversation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/nonverbal-quiz"
      element={
        <ProtectedRoute roles={["student"]}>
          <NonverbalQuiz />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/clarify-reflex"
      element={
        <ProtectedRoute roles={["student"]}>
          <ClarifyReflex />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/interview-simulation"
      element={
        <ProtectedRoute roles={["student"]}>
          <InterviewSimulation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/feedback-roleplay"
      element={
        <ProtectedRoute roles={["student"]}>
          <FeedbackRoleplay />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/persuasion-puzzle"
      element={
        <ProtectedRoute roles={["student"]}>
          <PersuasionPuzzle />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/communication-journal"
      element={
        <ProtectedRoute roles={["student"]}>
          <CommunicationJournal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/public-speaking-prep"
      element={
        <ProtectedRoute roles={["student"]}>
          <PublicSpeakingPrep />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/listening-vs-speaking-debate"
      element={
        <ProtectedRoute roles={["student"]}>
          <ListeningVsSpeakingDebate />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/communication-pro-badge"
      element={
        <ProtectedRoute roles={["student"]}>
          <CommunicationProBadge />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/power-dynamics-scenario"
      element={
        <ProtectedRoute roles={["student"]}>
          <PowerDynamicsScenario />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/negotiation-tactics-quiz"
      element={
        <ProtectedRoute roles={["student"]}>
          <NegotiationTacticsQuiz />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/mediation-simulation"
      element={
        <ProtectedRoute roles={["student"]}>
          <MediationSimulation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/tough-bargain-roleplay"
      element={
        <ProtectedRoute roles={["student"]}>
          <ToughBargainRoleplay />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/ethics-in-negotiation-debate"
      element={
        <ProtectedRoute roles={["student"]}>
          <EthicsInNegotiationDebate />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/negotiation-journal"
      element={
        <ProtectedRoute roles={["student"]}>
          <NegotiationJournal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/walk-away-reflex"
      element={
        <ProtectedRoute roles={["student"]}>
          <WalkAwayReflex />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/workplace-conflict-sim"
      element={
        <ProtectedRoute roles={["student"]}>
          <WorkplaceConflictSim />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/conflict-solver-badge"
      element={
        <ProtectedRoute roles={["student"]}>
          <ConflictSolverBadge />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/campaign-story"
      element={
        <ProtectedRoute roles={["student"]}>
          <CampaignStory />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/sdg-quiz"
      element={
        <ProtectedRoute roles={["student"]}>
          <SDGQuiz />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/volunteer-simulation"
      element={
        <ProtectedRoute roles={["student"]}>
          <VolunteerSimulation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/public-budget-puzzle"
      element={
        <ProtectedRoute roles={["student"]}>
          <PublicBudgetPuzzle />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/advocacy-roleplay"
      element={
        <ProtectedRoute roles={["student"]}>
          <AdvocacyRoleplay />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/impact-journal"
      element={
        <ProtectedRoute roles={["student"]}>
          <ImpactJournal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/service-design-puzzle"
      element={
        <ProtectedRoute roles={["student"]}>
          <ServiceDesignPuzzle />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/coalition-simulation"
      element={
        <ProtectedRoute roles={["student"]}>
          <CoalitionSimulation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/civic-reflex"
      element={
        <ProtectedRoute roles={["student"]}>
          <CivicReflex />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/citizen-leader-badge"
      element={
        <ProtectedRoute roles={["student"]}>
          <CitizenLeaderBadge />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/short-vs-long-goals-debate"
      element={
        <ProtectedRoute roles={["student"]}>
          <ShortVsLongGoalsDebate />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/emergency-steps-quiz"
      element={
        <ProtectedRoute roles={["student"]}>
          <EmergencyStepsQuiz />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/one-year-plan-journal"
      element={
        <ProtectedRoute roles={["student"]}>
          <OneYearPlanJournal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/crisis-simulation"
      element={
        <ProtectedRoute roles={["student"]}>
          <CrisisSimulation />
        </ProtectedRoute>
      }
    />
    <Route
      pathagge="/student/uvls/teen/request-extension-roleplay"
      element={
        <ProtectedRoute roles={["student"]}>
          <RequestExtensionRoleplay />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/safety-offer-reflex"
      element={
        <ProtectedRoute roles={["student"]}>
          <SafetyOfferReflex />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/habit-chain-puzzle"
      element={
        <ProtectedRoute roles={["student"]}>
          <HabitChainPuzzle />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/habit-change-journal"
      element={
        <ProtectedRoute roles={["student"]}>
          <HabitChangeJournal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/solo-trip-simulation"
      element={
        <ProtectedRoute roles={["student"]}>
          <SoloTripSimulation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/uvls/teen/life-skills-champion-badge"
      element={
        <ProtectedRoute roles={["student"]}>
          <LifeSkillsChampionBadge />
        </ProtectedRoute>
      }
    />

          {/* DCOS Kids Games - Digital Citizenship & Online Safety */}
          <Route
            path="/student/dcos/kids/strong-password-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StrongPasswordReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/stranger-chat-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StrangerChatStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/photo-share-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PhotoShareQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/personal-info-puzzle"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PersonalInfoPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/game-invite-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <GameInviteReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/safety-poster"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SafetyPoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/family-rules-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FamilyRulesStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/device-sharing-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DeviceSharingQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/online-friend-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <OnlineFriendReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/safe-user-badge"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SafeUserBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/spot-bully-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SpotBullyQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/kind-words-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <KindWordsReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/smile-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SmileStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/gossip-puzzle"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <GossipPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/playground-bystander"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PlaygroundBystander />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/cyberbully-report"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CyberBullyReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/role-swap"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RoleSwap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/kindness-journal"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <KindnessJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/friendship-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FriendshipReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/kids/kind-friend-badge"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <KindFriendBadge />
              </ProtectedRoute>
            }
          />

          {/* DCOS Teen Games - Digital Citizenship & Online Safety */}
          <Route
            path="/student/dcos/teen/password-sharing-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PasswordSharingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/privacy-settings-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PrivacySettingsQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/otp-fraud-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <OTPFraudReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/profile-picture-simulation"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ProfilePictureSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/social-media-journal"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SocialMediaJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/data-consent-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DataConsentQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/fake-friend-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FakeFriendStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/safety-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SafetyReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/debate-stage-online-friends"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateStageOnlineFriends />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/online-safety-badge"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <OnlineSafetyBadge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/cyberbully-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CyberBullyReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/peer-pressure-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PeerPressureStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/gossip-chain-simulation"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <GossipChainSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/debate-stage-trolling"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateStageTrolling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/diversity-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DiversityQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/empathy-journal"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <EmpathyJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/upstander-simulation"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <UpstanderSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dcos/teen/courage-badge"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CourageBadge />
              </ProtectedRoute>
            }
          />

          {/* Moral Values Kids Games - Honesty & Respect */}
          <Route
            path="/student/moral-values/kids/lost-pencil-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <LostPencilStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/homework-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <HomeworkQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/truth-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TruthReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/puzzle-of-trust"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleOfTrust />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/cheating-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CheatingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/poster-of-honesty"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PosterOfHonesty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/journal-of-truth"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfTruth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/candy-shop-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CandyShopStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/reflex-quick-choice"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexQuickChoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/badge-truthful-kid"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeTruthfulKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/respect-elders-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RespectEldersStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/polite-words-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PoliteWordsQuiz2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/reflex-respect"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexRespect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/puzzle-respect-match"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleRespectMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/teacher-greeting-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TeacherGreetingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/gratitude-poster"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <GratitudePoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/journal-of-gratitude"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfGratitude />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/playground-respect-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PlaygroundRespectStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/reflex-help"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexHelp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/kids/badge-respect-kid"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeRespectKid />
              </ProtectedRoute>
            }
          />

          {/* Moral Values Teen Games - Integrity & Respect */}
          <Route
            path="/student/moral-values/teen/friend-lie-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FriendLieStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/white-lie-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <WhiteLieQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/reflex-spot-fake"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexSpotFake />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/puzzle-of-integrity"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleOfIntegrity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/bribe-simulation"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BribeSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/debate-lying-for-friend"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateLyingForFriend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/integrity-journal"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <IntegrityJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/exam-cheating-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ExamCheatingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/roleplay-truthful-leader"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RoleplayTruthfulLeader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/badge-integrity-hero"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeIntegrityHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/debate-obey-or-question"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateObeyOrQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/gratitude-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <GratitudeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/reflex-politeness"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexPoliteness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/puzzle-of-gratitude"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleOfGratitude />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/service-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ServiceStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/respect-journal"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RespectJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/debate-respect-teachers"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateRespectTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/roleplay-respect-leader"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RoleplayRespectLeader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/reflex-gratitude"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexGratitude />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/moral-values/teen/badge-gratitude-hero"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeGratitudeHero />
              </ProtectedRoute>
            }
          />

          {/* AI For All Kids Games */}
          <Route
            path="/student/ai-for-all/kids/spot-the-pattern"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SpotThePattern />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/cat-or-dog-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CatOrDogGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/sorting-colors"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SortingColors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/true-false-ai-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TrueFalseAIQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/emoji-classifier"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <EmojiClassifier />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/self-driving-car"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SelfDrivingCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/pattern-finder-puzzle"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PatternFinderPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/robot-helper-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RobotHelperStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/spam-vs-not-spam"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SpamVsNotSpam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/siri-alexa-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SiriAlexaQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/ai-in-games"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AIInGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/match-ai-tools"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MatchAITools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/pattern-music-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PatternMusicGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/robot-vision-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RobotVisionGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/smart-home-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SmartHomeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/train-the-robot"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TrainTheRobot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/prediction-puzzle"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PredictionPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/friendly-ai-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FriendlyAIQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/robot-emotion-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RobotEmotionStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/kids/recommendation-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RecommendationGame />
              </ProtectedRoute>
            }
          />

          {/* AI For All Teen Games */}
          <Route
            path="/student/ai-for-all/teen/what-is-ai-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <WhatIsAIQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/pattern-prediction-puzzle"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PatternPredictionPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/image-classifier-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ImageClassifierGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/human-vs-ai-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <HumanVsAIQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/predict-next-word"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PredictNextWord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/self-driving-car-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SelfDrivingCarReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/sorting-emotions-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SortingEmotionsGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/true-false-ai-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TrueFalseAIQuizTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/chatbot-simulation"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ChatbotSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/ai-in-gaming-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AIInGamingStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/pattern-music-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PatternMusicReflexTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/computer-vision-basics"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ComputerVisionBasics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/ai-in-smartphones-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AIInSmartphonesQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/prediction-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PredictionStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/machine-vs-human-reflex"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MachineVsHumanReflex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/language-ai-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <LanguageAIQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/simple-algorithm-puzzle"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SimpleAlgorithmPuzzle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/smart-home-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SmartHomeStoryTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/recommendation-simulation"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RecommendationSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-for-all/teen/ai-everywhere-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AIEverywhereQuiz />
              </ProtectedRoute>
            }
          />

          {/* EHE Kids Games */}
          <Route
            path="/student/ehe/kids/doctor-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DoctorStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/quiz-on-jobs"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/reflex-job-match"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexJobMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/puzzle-who-does-what"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleWhoDoesWhat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/dream-job-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DreamJobStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/poster-my-dream-job"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PosterMyDreamJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/journal-of-jobs"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/school-helper-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SchoolHelperStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/reflex-career-check"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexCareerCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/badge-career-explorer"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeCareerExplorer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/idea-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <IdeaStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/quiz-on-skills"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/reflex-skill-check"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexSkillCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/puzzle-match-skills"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleMatchSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/teamwork-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TeamworkStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/poster-skills-for-success"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PosterSkillsForSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/journal-of-skills"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/risk-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RiskStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/reflex-innovation"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexInnovation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/kids/badge-young-innovator"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeYoungInnovator />
              </ProtectedRoute>
            }
          />

          {/* EHE Teen Games */}
          <Route
            path="/student/ehe/teen/career-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CareerStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/quiz-on-careers"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnCareers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/reflex-teen-career"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexTeenCareer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/puzzle-career-match"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleCareerMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/passion-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PassionStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/debate-one-career-or-many"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateOneCareerOrMany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/journal-of-career-choice"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfCareerChoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/simulation-career-fair"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SimulationCareerFair />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/reflex-future-check"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexFutureCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/badge-career-aware-teen"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeCareerAwareTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/opportunity-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <OpportunityStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/quiz-on-entrepreneur-traits"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnEntrepreneurTraits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/reflex-teen-skills"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexTeenSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/puzzle-match-traits"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleMatchTraits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/failure-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FailureStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/debate-born-or-made"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateBornOrMade />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/journal-of-strengths"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfStrengths />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/simulation-team-project"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SimulationTeamProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/reflex-teen-innovator"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexTeenInnovator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ehe/teen/badge-future-entrepreneur"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeFutureEntrepreneur />
              </ProtectedRoute>
            }
          />

          {/* CRGC Kids Games */}
          <Route
            path="/student/civic-responsibility/kids/friends-sad-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FriendsSadStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/quiz-on-empathy"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnEmpathy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/reflex-kindness"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexKindness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/puzzle-match-feelings"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleMatchFeelings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/animal-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AnimalStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/poster-be-kind-always"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PosterBeKindAlways />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/journal-of-empathy"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfEmpathy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/bully-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BullyStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/reflex-help-alert"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexHelpAlert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/badge-kind-kid"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeKindKid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/classroom-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ClassroomStoryCRGC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/quiz-on-respect"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnRespect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/reflex-respect"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexRespectCRGC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/puzzle-respect-match"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleRespectMatchCRGC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/gender-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <GenderStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/poster-respect-all"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PosterRespectAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/journal-of-respect"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfRespect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/disability-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DisabilityStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/reflex-inclusion"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexInclusion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/kids/badge-respect-kid"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeRespectKidCRGC />
              </ProtectedRoute>
            }
          />

          {/* CRGC Teen Games */}
          <Route
            path="/student/civic-responsibility/teen/stranger-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StrangerStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/quiz-on-compassion"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnCompassionTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/reflex-teen-compassion"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexTeenCompassion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/puzzle-kind-acts"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleKindActs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/refugee-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RefugeeStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/debate-kindness-weakness"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateKindnessWeakness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/journal-of-compassion"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfCompassionTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/simulation-hospital-visit"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SimulationHospitalVisit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/reflex-global-empathy"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexGlobalEmpathy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/badge-compassion-leader"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeCompassionLeader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/cultural-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CulturalStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/quiz-on-inclusion"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuizOnInclusionTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/reflex-teen-respect"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexTeenRespect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/puzzle-inclusion-acts"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PuzzleInclusionActs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/religion-story"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReligionStory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/debate-equality-for-all"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebateEqualityForAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/journal-of-inclusion"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <JournalOfInclusionTeen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/simulation-school-event"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SimulationSchoolEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/reflex-teen-inclusion"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ReflexTeenInclusionCRGC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/civic-responsibility/teen/badge-inclusion-leader"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BadgeInclusionLeader />
              </ProtectedRoute>
            }
          />

          {/* Sustainability Games */}
          <Route
            path="/student/sustainability/solar-and-city/test-solar-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TestSolarGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/sustainability/water-and-recycle/test-water-recycle-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TestWaterRecycleGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/sustainability/carbon-and-climate/test-carbon-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TestCarbonGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/sustainability/water-and-energy/test-water-energy-game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <TestWaterEnergyGame />
              </ProtectedRoute>
            }
          />

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