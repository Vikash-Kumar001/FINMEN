// Unified DCOS Games Export
// Combines Kids and Teen DCOS games into a single object

// Import all Kids DCOS games
import {
  StrongPasswordReflex,
  StrangerChatStory,
  PhotoShareQuiz,
  PersonalInfoPuzzle,
  GameInviteReflex,
  SafetyPoster,
  FamilyRulesStory,
  DeviceSharingQuiz,
  OnlineFriendReflex,
  SafeUserBadge,
  SpotBullyQuiz,
  KindWordsReflex,
  SmileStory,
  GossipPuzzle,
  PlaygroundBystander,
  CyberBullyReport,
  RoleSwap,
  KindnessJournal,
  FriendshipReflex,
  KindFriendBadge
} from './Kids';

// Import all Teen DCOS games
import {
  PasswordSharingStory,
  PrivacySettingsQuiz,
  OTPFraudReflex,
  ProfilePictureSimulation,
  SocialMediaJournal,
  DataConsentQuiz,
  FakeFriendStory,
  SafetyReflex,
  DebateStageOnlineFriends,
  OnlineSafetyBadge,
  CyberBullyReflex,
  PeerPressureStory,
  GossipChainSimulation,
  DebateStageTrolling,
  DiversityQuiz,
  EncourageRoleplay,
  EmpathyJournal,
  AntiBullyReflex,
  UpstanderSimulation,
  CourageBadge
} from './Teen';

// Create unified games registry
const dcosGames = {
  // Kids Games (20 games)
  kids: {
    'strong-password-reflex': StrongPasswordReflex,
    'stranger-chat-story': StrangerChatStory,
    'photo-share-quiz': PhotoShareQuiz,
    'personal-info-puzzle': PersonalInfoPuzzle,
    'game-invite-reflex': GameInviteReflex,
    'safety-poster': SafetyPoster,
    'family-rules-story': FamilyRulesStory,
    'device-sharing-quiz': DeviceSharingQuiz,
    'online-friend-reflex': OnlineFriendReflex,
    'safe-user-badge': SafeUserBadge,
    'spot-bully-quiz': SpotBullyQuiz,
    'kind-words-reflex': KindWordsReflex,
    'smile-story': SmileStory,
    'gossip-puzzle': GossipPuzzle,
    'playground-bystander': PlaygroundBystander,
    'cyberbully-report': CyberBullyReport,
    'role-swap': RoleSwap,
    'kindness-journal': KindnessJournal,
    'friendship-reflex': FriendshipReflex,
    'kind-friend-badge': KindFriendBadge
  },

  // Teen Games (20 games)
  teen: {
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
    'cyberbully-reflex': CyberBullyReflex,
    'peer-pressure-story': PeerPressureStory,
    'gossip-chain-simulation': GossipChainSimulation,
    'debate-stage-trolling': DebateStageTrolling,
    'diversity-quiz': DiversityQuiz,
    'encourage-roleplay': EncourageRoleplay,
    'empathy-journal': EmpathyJournal,
    'anti-bully-reflex': AntiBullyReflex,
    'upstander-simulation': UpstanderSimulation,
    'courage-badge': CourageBadge
  }
};

// Export functions to get games
export const getDcosGame = (age, gameId) => {
  return dcosGames[age]?.[gameId];
};

export const getAllDcosGames = (age = null) => {
  if (age) {
    return dcosGames[age] || {};
  }
  return {
    kids: dcosGames.kids,
    teen: dcosGames.teen
  };
};

export const getDcosGameIds = (age = null) => {
  if (age) {
    return Object.keys(dcosGames[age] || {});
  }
  return {
    kids: Object.keys(dcosGames.kids),
    teen: Object.keys(dcosGames.teen)
  };
};

export default dcosGames;
