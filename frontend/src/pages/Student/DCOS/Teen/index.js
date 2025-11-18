// DCOS Teen Games Imports
import PasswordSharingStory from './PasswordSharingStory';
import PrivacySettingsQuiz from './PrivacySettingsQuiz';
import OTPFraudReflex from './OTPFraudReflex';
import ProfilePictureSimulation from './ProfilePictureSimulation';
import SocialMediaJournal from './SocialMediaJournal';
import DataConsentQuiz from './DataConsentQuiz';
import FakeFriendStory from './FakeFriendStory';
import SafetyReflex from './SafetyReflex';
import DebateStageOnlineFriends from './DebateStageOnlineFriends';
import OnlineSafetyBadge from './OnlineSafetyBadge';
import CyberBullyReflex from './CyberBullyReflex';
import PeerPressureStory from './PeerPressureStory';
import GossipChainSimulation from './GossipChainSimulation';
import DebateStageTrolling from './DebateStageTrolling';
import DiversityQuiz from './DiversityQuiz';
import EncourageRoleplay from './EncourageRoleplay';
import EmpathyJournal from './EmpathyJournal';
import AntiBullyReflex from './AntiBullyReflex';
import UpstanderSimulation from './UpstanderSimulation';
import CourageBadge from './CourageBadge';
import AIJobsDebate1 from './AIJobsDebate1';
import AILeaderBadge from './AILeaderBadge';
import BankingSafetyPuzzle from './BankingSafetyPuzzle';
import BiasStory from './BiasStory';
import CancelCultureQuiz from './CancelCultureQuiz';
import CareerPuzzle from './CareerPuzzle';
import CollegeApplicationSimulation from './CollegeApplicationSimulation';
import ConsentStory from './ConsentStory';
import ContentOwnershipQuiz from './ContentOwnershipQuiz';
import CopyrightStory from './CopyrightStory';
import DataQuiz from './DataQuiz';
import DebateStage from './DebateStage';
import DebateStage1 from './DebateStage1';
import DebateStage2 from './DebateStage2';
import DebateStage3 from './DebateStage3';
import DeepfakeQuiz from './DeepfakeQuiz';
import DeepfakeVideoQuiz from './DeepfakeVideoQuiz';
import DigitalDetoxSimulation from './DigitalDetoxSimulation';
import DigitalFootprintStory1 from './DigitalFootprintStory1';
import DigitalReputationPuzzle from './DigitalReputationPuzzle';
import DopamineReflex from './DopamineReflex';
import EntrepreneurStory from './EntrepreneurStory';
import FactCheckBadge from './FactCheckBadge';
import FactCheckSimulation from './FactCheckSimulation';
import FakeAppReflex from './FakeAppReflex';
import FakeJobAdStory from './FakeJobAdStory';
import FakeJobScamStory from './FakeJobScamStory';
import FamilyRuleDebate from './FamilyRuleDebate';
import ForwardReflex from './ForwardReflex';
import FraudFighterBadge from './FraudFighterBadge';
import FraudJournal from './FraudJournal';
import FreedomVsAbuseQuiz from './FreedomVsAbuseQuiz';
import FutureJobStory from './FutureJobStory';
import GroupChatSimulation from './GroupChatSimulation';
import HateCommentStory from './HateCommentStory';
import IdentityBadge from './IdentityBadge';
import JournalAiRule from './JournalAiRule';
import JournalFutureUse from './JournalFutureUse';
import JournalMyIdentity from './JournalMyIdentity';
import JournalOfPrivacy from './JournalOfPrivacy';
import JournalOnlineRespect from './JournalOnlineRespect';
import LoanTrapStory from './LoanTrapStory';
import MemeTruthPuzzle from './MemeTruthPuzzle';
import NewsReflex from './NewsReflex';
import OTPScamReflex from './OTPScamReflex';
import OnlineCourseSimulation from './OnlineCourseSimulation';
import PhishingEmailQuiz from './PhishingEmailQuiz';
import PrivacyLawsPuzzle from './PrivacyLawsPuzzle';
import ProductivityHeroBadge from './ProductivityHeroBadge';
import ProductivityPuzzle from './ProductivityPuzzle';
import PuzzleAiUses from './PuzzleAiUses';
import PuzzleRespectVsHate from './PuzzleRespectVsHate';
import ReflexAIResponsibility from './ReflexAIResponsibility';
import ReflexAdTrap from './ReflexAdTrap';
import ReflexFairAI from './ReflexFairAI';
import ReflexFlag1 from './ReflexFlag1';
import ReflexPositiveIdentity from './ReflexPositiveIdentity';
import ReflexProductivity from './ReflexProductivity';
import ReflexRecruiter from './ReflexRecruiter';
import ReflexSmartScreen from './ReflexSmartScreen';
import ReflexSupport from './ReflexSupport';
import RespectChampionBadge from './RespectChampionBadge';
import RightsDefenderBadge from './RightsDefenderBadge';
import RoleModelTask from './RoleModelTask';
import RoleplayCalmReply from './RoleplayCalmReply';
import ScamDebate from './ScamDebate';
import ScreenLogStory from './ScreenLogStory';
import SharingRightsSimulation from './SharingRightsSimulation';
import ShoppingSimulation from './ShoppingSimulation';
import SleepHealthQuiz from './SleepHealthQuiz';
import SleepHygieneReflex from './SleepHygieneReflex';
import SocialMediaStory1 from './SocialMediaStory1';
import StoryOfPositivity from './StoryOfPositivity';
import SuccessStorySimulation from './SuccessStorySimulation';
import TruthJournal2 from './TruthJournal2';
import ViralPostStory from './ViralPostStory';
import WellbeingBadge from './WellbeingBadge';
import WhatsAppDebate from './WhatsAppDebate';
import AIInExams from './AIInExams';

const teenDcosGames = {
  // Privacy and Security Games (1-10)
  'password-sharing-story': PasswordSharingStory,
  'privacy-settings-quiz': PrivacySettingsQuiz,
  'otp-fraud-reflex': OTPFraudReflex,
  'profile-picture-simulation': ProfilePictureSimulation,
  'social-media-journal': SocialMediaJournal,
  'data-consent-quiz': DataConsentQuiz,
  'fake-friend-story': FakeFriendStory,
  'safety-reflex': SafetyReflex,
  'debate-stage-online-friends': DebateStageOnlineFriends,
  'online-safety-badge': OnlineSafetyBadge,

  // Bullying and Respect Games (11-20)
  'cyberbully-reflex': CyberBullyReflex,
  'peer-pressure-story': PeerPressureStory,
  'gossip-chain-simulation': GossipChainSimulation,
  'debate-stage-trolling': DebateStageTrolling,
  'diversity-quiz': DiversityQuiz,
  'encourage-roleplay': EncourageRoleplay,
  'empathy-journal': EmpathyJournal,
  'anti-bully-reflex': AntiBullyReflex,
  'upstander-simulation': UpstanderSimulation,
  'courage-badge': CourageBadge,

  // AI and Future Tech Games (21-40)
  'ai-jobs-debate1': AIJobsDebate1,
  'ai-leader-badge': AILeaderBadge,
  'banking-safety-puzzle': BankingSafetyPuzzle,
  'bias-story': BiasStory,
  'cancel-culture-quiz': CancelCultureQuiz,
  'career-puzzle': CareerPuzzle,
  'college-application-simulation': CollegeApplicationSimulation,
  'consent-story': ConsentStory,
  'content-ownership-quiz': ContentOwnershipQuiz,
  'copyright-story': CopyrightStory,
  'data-quiz': DataQuiz,
  'debate-stage': DebateStage,
  'debate-stage1': DebateStage1,
  'debate-stage2': DebateStage2,
  'debate-stage3': DebateStage3,
  'deepfake-quiz': DeepfakeQuiz,
  'deepfake-video-quiz': DeepfakeVideoQuiz,
  'digital-detox-simulation': DigitalDetoxSimulation,
  'digital-footprint-story1': DigitalFootprintStory1,
  'digital-reputation-puzzle': DigitalReputationPuzzle,
  'dopamine-reflex': DopamineReflex,

  // Career and Future Planning Games (41-50)
  'entrepreneur-story': EntrepreneurStory,
  'fact-check-badge': FactCheckBadge,
  'fact-check-simulation': FactCheckSimulation,
  'fake-app-reflex': FakeAppReflex,
  'fake-job-ad-story': FakeJobAdStory,
  'fake-job-scam-story': FakeJobScamStory,
  'family-rule-debate': FamilyRuleDebate,
  'forward-reflex': ForwardReflex,
  'fraud-fighter-badge': FraudFighterBadge,
  'fraud-journal': FraudJournal,

  // Digital Rights and Ethics Games (51-70)
  'freedom-vs-abuse-quiz': FreedomVsAbuseQuiz,
  'future-job-story': FutureJobStory,
  'group-chat-simulation': GroupChatSimulation,
  'hate-comment-story': HateCommentStory,
  'identity-badge': IdentityBadge,
  'journal-ai-rule': JournalAiRule,
  'journal-future-use': JournalFutureUse,
  'journal-my-identity': JournalMyIdentity,
  'journal-of-privacy': JournalOfPrivacy,
  'journal-online-respect': JournalOnlineRespect,
  'loan-trap-story': LoanTrapStory,
  'meme-truth-puzzle': MemeTruthPuzzle,
  'news-reflex': NewsReflex,
  'otp-scam-reflex': OTPScamReflex,
  'online-course-simulation': OnlineCourseSimulation,
  'phishing-email-quiz': PhishingEmailQuiz,
  'privacy-laws-puzzle': PrivacyLawsPuzzle,
  'productivity-hero-badge': ProductivityHeroBadge,
  'productivity-puzzle': ProductivityPuzzle,
  'puzzle-ai-uses': PuzzleAiUses,
  'puzzle-respect-vs-hate': PuzzleRespectVsHate,

  // Digital Wellness and Productivity Games (71-90)
  'reflex-ai-responsibility': ReflexAIResponsibility,
  'reflex-ad-trap': ReflexAdTrap,
  'reflex-fair-ai': ReflexFairAI,
  'reflex-flag1': ReflexFlag1,
  'reflex-positive-identity': ReflexPositiveIdentity,
  'reflex-productivity': ReflexProductivity,
  'reflex-recruiter': ReflexRecruiter,
  'reflex-smart-screen': ReflexSmartScreen,
  'reflex-support': ReflexSupport,
  'respect-champion-badge': RespectChampionBadge,
  'rights-defender-badge': RightsDefenderBadge,
  'role-model-task': RoleModelTask,
  'roleplay-calm-reply': RoleplayCalmReply,
  'scam-debate': ScamDebate,
  'screen-log-story': ScreenLogStory,
  'sharing-rights-simulation': SharingRightsSimulation,
  'shopping-simulation': ShoppingSimulation,
  'sleep-health-quiz': SleepHealthQuiz,
  'sleep-hygiene-reflex': SleepHygieneReflex,
  'social-media-story1': SocialMediaStory1,
  'story-of-positivity': StoryOfPositivity,

  // Achievement and Reflection Games (91-100)
  'success-story-simulation': SuccessStorySimulation,
  'truth-journal2': TruthJournal2,
  'viral-post-story': ViralPostStory,
  'wellbeing-badge': WellbeingBadge,
  'whats-app-debate': WhatsAppDebate,
  'ai-in-exams': AIInExams,
};

export default teenDcosGames;