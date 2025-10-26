// Unified CRGC Games Export
// Combines Kids and Teen CRGC games into a single object

// Import all Kids CRGC games
import {
  FriendsSadStory,
  QuizOnEmpathy,
  ReflexKindness,
  PuzzleMatchFeelings,
  AnimalStory,
  PosterBeKindAlways,
  JournalOfEmpathy,
  BullyStory,
  ReflexHelpAlert,
  BadgeKindKid,
  ClassroomStory,
  QuizOnRespect,
  ReflexRespectCRGC,
  PuzzleRespectMatch,
  GenderStory,
  PosterRespectAll,
  JournalOfRespect,
  DisabilityStory,
  ReflexInclusion,
  BadgeRespectKid
} from './Kids';

// Import all Teen CRGC games
import {
  StrangerStory,
  QuizOnCompassion,
  ReflexTeenCompassion,
  PuzzleKindActs,
  RefugeeStory,
  DebateKindnessWeakness,
  JournalOfCompassion,
  SimulationHospitalVisit,
  ReflexGlobalEmpathy,
  BadgeCompassionLeader,
  CulturalStory,
  QuizOnInclusion,
  ReflexTeenRespect,
  PuzzleInclusionActs,
  ReligionStory,
  DebateEqualityForAll,
  JournalOfInclusion,
  SimulationSchoolEvent,
  ReflexTeenInclusion,
  BadgeInclusionLeader
} from './Teen';

// Create unified games registry
const crgcGames = {
  // Kids Games (20 games)
  kids: {
    'friends-sad-story': FriendsSadStory,
    'quiz-on-empathy': QuizOnEmpathy,
    'reflex-kindness': ReflexKindness,
    'puzzle-match-feelings': PuzzleMatchFeelings,
    'animal-story': AnimalStory,
    'poster-be-kind-always': PosterBeKindAlways,
    'journal-of-empathy': JournalOfEmpathy,
    'bully-story': BullyStory,
    'reflex-help-alert': ReflexHelpAlert,
    'badge-kind-kid': BadgeKindKid,
    'classroom-story': ClassroomStory,
    'quiz-on-respect': QuizOnRespect,
    'reflex-respect-crgc': ReflexRespectCRGC,
    'puzzle-respect-match': PuzzleRespectMatch,
    'gender-story': GenderStory,
    'poster-respect-all': PosterRespectAll,
    'journal-of-respect': JournalOfRespect,
    'disability-story': DisabilityStory,
    'reflex-inclusion': ReflexInclusion,
    'badge-respect-kid': BadgeRespectKid
  },

  // Teen Games (20 games)
  teen: {
    'stranger-story': StrangerStory,
    'quiz-on-compassion': QuizOnCompassion,
    'reflex-teen-compassion': ReflexTeenCompassion,
    'puzzle-kind-acts': PuzzleKindActs,
    'refugee-story': RefugeeStory,
    'debate-kindness-weakness': DebateKindnessWeakness,
    'journal-of-compassion': JournalOfCompassion,
    'simulation-hospital-visit': SimulationHospitalVisit,
    'reflex-global-empathy': ReflexGlobalEmpathy,
    'badge-compassion-leader': BadgeCompassionLeader,
    'cultural-story': CulturalStory,
    'quiz-on-inclusion': QuizOnInclusion,
    'reflex-teen-respect': ReflexTeenRespect,
    'puzzle-inclusion-acts': PuzzleInclusionActs,
    'religion-story': ReligionStory,
    'debate-equality-for-all': DebateEqualityForAll,
    'journal-of-inclusion': JournalOfInclusion,
    'simulation-school-event': SimulationSchoolEvent,
    'reflex-teen-inclusion': ReflexTeenInclusion,
    'badge-inclusion-leader': BadgeInclusionLeader
  }
};

// Export functions to get games
export const getCrgcGame = (age, gameId) => {
  return crgcGames[age]?.[gameId];
};

export const getAllCrgcGames = (age = null) => {
  if (age) {
    return crgcGames[age] || {};
  }
  return {
    kids: crgcGames.kids,
    teen: crgcGames.teen
  };
};

export const getCrgcGameIds = (age = null) => {
  if (age) {
    return Object.keys(crgcGames[age] || {});
  }
  return {
    kids: Object.keys(crgcGames.kids),
    teen: Object.keys(crgcGames.teen)
  };
};

export default crgcGames;
