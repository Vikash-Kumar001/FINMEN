// Unified Moral Values Games Export
// Combines Kids and Teen moral values games into a single object

// Import all Kids moral values games
import {
  LostPencilStory,
  HomeworkQuiz,
  TruthReflex,
  PuzzleOfTrust,
  CheatingStory,
  PosterOfHonesty,
  JournalOfTruth,
  CandyShopStory,
  ReflexQuickChoice,
  BadgeTruthfulKid,
  RespectEldersStory,
  PoliteWordsQuiz,
  ReflexRespect,
  PuzzleRespectMatch,
  TeacherGreetingStory,
  GratitudePoster,
  JournalOfGratitude,
  PlaygroundRespectStory,
  ReflexHelp,
  BadgeRespectKid
} from './Kids';

// Import all Teen moral values games
import {
  FriendLieStory,
  WhiteLieQuiz,
  ReflexSpotFake,
  PuzzleOfIntegrity,
  BribeSimulation,
  DebateLyingForFriend,
  IntegrityJournal,
  ExamCheatingStory,
  RoleplayTruthfulLeader,
  BadgeIntegrityHero,
  DebateObeyOrQuestion,
  GratitudeStory,
  ReflexPoliteness,
  PuzzleOfGratitude,
  ServiceStory,
  RespectJournal,
  DebateRespectTeachers,
  RoleplayRespectLeader,
  ReflexGratitude,
  BadgeGratitudeHero
} from './Teen';

// Create unified games registry
const moralValuesGames = {
  // Kids Games (20 games)
  kids: {
    'lost-pencil-story': LostPencilStory,
    'homework-quiz': HomeworkQuiz,
    'truth-reflex': TruthReflex,
    'puzzle-of-trust': PuzzleOfTrust,
    'cheating-story': CheatingStory,
    'poster-of-honesty': PosterOfHonesty,
    'journal-of-truth': JournalOfTruth,
    'candy-shop-story': CandyShopStory,
    'reflex-quick-choice': ReflexQuickChoice,
    'badge-truthful-kid': BadgeTruthfulKid,
    'respect-elders-story': RespectEldersStory,
    'polite-words-quiz': PoliteWordsQuiz,
    'reflex-respect': ReflexRespect,
    'puzzle-respect-match': PuzzleRespectMatch,
    'teacher-greeting-story': TeacherGreetingStory,
    'gratitude-poster': GratitudePoster,
    'journal-of-gratitude': JournalOfGratitude,
    'playground-respect-story': PlaygroundRespectStory,
    'reflex-help': ReflexHelp,
    'badge-respect-kid': BadgeRespectKid
  },

  // Teen Games (20 games)
  teen: {
    'friend-lie-story': FriendLieStory,
    'white-lie-quiz': WhiteLieQuiz,
    'reflex-spot-fake': ReflexSpotFake,
    'puzzle-of-integrity': PuzzleOfIntegrity,
    'bribe-simulation': BribeSimulation,
    'debate-lying-for-friend': DebateLyingForFriend,
    'integrity-journal': IntegrityJournal,
    'exam-cheating-story': ExamCheatingStory,
    'roleplay-truthful-leader': RoleplayTruthfulLeader,
    'badge-integrity-hero': BadgeIntegrityHero,
    'debate-obey-or-question': DebateObeyOrQuestion,
    'gratitude-story': GratitudeStory,
    'reflex-politeness': ReflexPoliteness,
    'puzzle-of-gratitude': PuzzleOfGratitude,
    'service-story': ServiceStory,
    'respect-journal': RespectJournal,
    'debate-respect-teachers': DebateRespectTeachers,
    'roleplay-respect-leader': RoleplayRespectLeader,
    'reflex-gratitude': ReflexGratitude,
    'badge-gratitude-hero': BadgeGratitudeHero
  }
};

// Export functions to get games
export const getMoralValuesGame = (age, gameId) => {
  return moralValuesGames[age]?.[gameId];
};

export const getAllMoralValuesGames = (age = null) => {
  if (age) {
    return moralValuesGames[age] || {};
  }
  return {
    kids: moralValuesGames.kids,
    teen: moralValuesGames.teen
  };
};

export const getMoralValuesGameIds = (age = null) => {
  if (age) {
    return Object.keys(moralValuesGames[age] || {});
  }
  return {
    kids: Object.keys(moralValuesGames.kids),
    teen: Object.keys(moralValuesGames.teen)
  };
};

export default moralValuesGames;
