// Unified UVLS Games Export
// Combines Kids and Teen UVLS games into a single object

// Import all Kids UVLS games
import {
  ShareYourToy,
  FeelingsQuiz,
  KindReflex,
  MatchFaces,
  SpotHelp,
  KindPoster,
  MiniJournal,
  ComfortRoleplay,
  ShareReflex,
  LittleEmpathBadge,
  GreetTheNewKid,
  PoliteWordsQuiz,
  RespectTap,
  InclusionMatch,
  InviteToPlay,
  InclusionPoster,
  InclusionJournal,
  InviteRoleplay,
  RespectSignals,
  InclusiveKidBadge
} from './Kids';

// Import all Teen UVLS games
import {
  ListenDeep,
  EmpathyQuiz,
  PerspectivePuzzle,
  WalkInShoes,
  EmpathyDebate,
  ReflectiveJournal,
  PeerSupportRoleplay,
  CaseResponsePuzzle,
  SpotDistressReflex,
  EmpathyChampionBadge,
  CulturalGreeting,
  InclusionQuiz,
  AccessibilityPuzzle,
  InclusiveClassSimulation,
  RespectDebate,
  InclusionJournal as InclusionJournalTeen,
  CorrectingBiasRoleplay,
  NameRespectReflex,
  PolicyCasePuzzle,
  RespectLeaderBadge
} from './Teen';

// Create unified games registry
const uvlsGames = {
  // Kids Games (20 games)
  kids: {
    'share-your-toy': ShareYourToy,
    'feelings-quiz': FeelingsQuiz,
    'kind-reflex': KindReflex,
    'match-faces': MatchFaces,
    'spot-help': SpotHelp,
    'kind-poster': KindPoster,
    'mini-journal': MiniJournal,
    'comfort-roleplay': ComfortRoleplay,
    'share-reflex': ShareReflex,
    'little-empath-badge': LittleEmpathBadge,
    'greet-the-new-kid': GreetTheNewKid,
    'polite-words-quiz': PoliteWordsQuiz,
    'respect-tap': RespectTap,
    'inclusion-match': InclusionMatch,
    'invite-to-play': InviteToPlay,
    'inclusion-poster': InclusionPoster,
    'inclusion-journal': InclusionJournal,
    'invite-roleplay': InviteRoleplay,
    'respect-signals': RespectSignals,
    'inclusive-kid-badge': InclusiveKidBadge
  },

  // Teen Games (20 games)
  teen: {
    'listen-deep': ListenDeep,
    'empathy-quiz': EmpathyQuiz,
    'perspective-puzzle': PerspectivePuzzle,
    'walk-in-shoes': WalkInShoes,
    'empathy-debate': EmpathyDebate,
    'reflective-journal': ReflectiveJournal,
    'peer-support-roleplay': PeerSupportRoleplay,
    'case-response-puzzle': CaseResponsePuzzle,
    'spot-distress-reflex': SpotDistressReflex,
    'empathy-champion-badge': EmpathyChampionBadge,
    'cultural-greeting': CulturalGreeting,
    'inclusion-quiz': InclusionQuiz,
    'accessibility-puzzle': AccessibilityPuzzle,
    'inclusive-class-simulation': InclusiveClassSimulation,
    'respect-debate': RespectDebate,
    'inclusion-journal-teen': InclusionJournalTeen,
    'correcting-bias-roleplay': CorrectingBiasRoleplay,
    'name-respect-reflex': NameRespectReflex,
    'policy-case-puzzle': PolicyCasePuzzle,
    'respect-leader-badge': RespectLeaderBadge
  }
};

// Export functions to get games
export const getUvlsGame = (age, gameId) => {
  return uvlsGames[age]?.[gameId];
};

export const getAllUvlsGames = (age = null) => {
  if (age) {
    return uvlsGames[age] || {};
  }
  return {
    kids: uvlsGames.kids,
    teen: uvlsGames.teen
  };
};

export const getUvlsGameIds = (age = null) => {
  if (age) {
    return Object.keys(uvlsGames[age] || {});
  }
  return {
    kids: Object.keys(uvlsGames.kids),
    teen: Object.keys(uvlsGames.teen)
  };
};

export default uvlsGames;
