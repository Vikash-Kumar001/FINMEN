// Unified Brain Health Games Export
// Combines Kids and Teen brain health games into a single object

// Import all Kids brain games
import {
  WaterStory,
  QuizOnBrainFood,
  ReflexBrainBoost,
  PuzzleOfBrainCare,
  BreakfastStory,
  PosterBrainHealth,
  JournalOfHabits,
  SportsStory,
  ReflexDailyHabit,
  BadgeBrainCareKid,
  ClassroomStory,
  QuizOnFocus,
  ReflexAttention,
  PuzzleOfFocus,
  HomeworkStory,
  PosterFocusMatters,
  JournalOfFocus,
  GameStory,
  ReflexQuickAttention,
  BadgeFocusKid
} from './Kids';

// Import all Teen brain games
import {
  ExerciseStory,
  QuizOnHabits,
  ReflexMindCheck,
  PuzzleBrainFuel,
  JunkFoodStory,
  DebateBrainVsBody,
  JournalOfBrainFitness,
  SimulationDailyRoutine,
  ReflexBrainBoost as ReflexBrainBoostTeen,
  BadgeBrainHealthHero,
  ExamStory,
  QuizOnAttention,
  ReflexConcentration,
  PuzzleOfDistractions,
  SocialMediaStory,
  DebateMultitaskVsFocus,
  JournalOfAttention,
  SimulationStudyPlan,
  ReflexDistractionAlert,
  BadgeFocusHero
} from './Teen';

// Create unified games registry
const brainGames = {
  // Kids Games (20 games)
  kids: {
    'water-story': WaterStory,
    'quiz-on-brain-food': QuizOnBrainFood,
    'reflex-brain-boost': ReflexBrainBoost,
    'puzzle-of-brain-care': PuzzleOfBrainCare,
    'breakfast-story': BreakfastStory,
    'poster-brain-health': PosterBrainHealth,
    'journal-of-habits': JournalOfHabits,
    'sports-story': SportsStory,
    'reflex-daily-habit': ReflexDailyHabit,
    'badge-brain-care-kid': BadgeBrainCareKid,
    'classroom-story': ClassroomStory,
    'quiz-on-focus': QuizOnFocus,
    'reflex-attention': ReflexAttention,
    'puzzle-of-focus': PuzzleOfFocus,
    'homework-story': HomeworkStory,
    'poster-focus-matters': PosterFocusMatters,
    'journal-of-focus': JournalOfFocus,
    'game-story': GameStory,
    'reflex-quick-attention': ReflexQuickAttention,
    'badge-focus-kid': BadgeFocusKid
  },

  // Teen Games (20 games)
  teen: {
    'exercise-story': ExerciseStory,
    'quiz-on-habits': QuizOnHabits,
    'reflex-mind-check': ReflexMindCheck,
    'puzzle-brain-fuel': PuzzleBrainFuel,
    'junk-food-story': JunkFoodStory,
    'debate-brain-vs-body': DebateBrainVsBody,
    'journal-of-brain-fitness': JournalOfBrainFitness,
    'simulation-daily-routine': SimulationDailyRoutine,
    'reflex-brain-boost-teen': ReflexBrainBoostTeen,
    'badge-brain-health-hero': BadgeBrainHealthHero,
    'exam-story': ExamStory,
    'quiz-on-attention': QuizOnAttention,
    'reflex-concentration': ReflexConcentration,
    'puzzle-of-distractions': PuzzleOfDistractions,
    'social-media-story': SocialMediaStory,
    'debate-multitask-vs-focus': DebateMultitaskVsFocus,
    'journal-of-attention': JournalOfAttention,
    'simulation-study-plan': SimulationStudyPlan,
    'reflex-distraction-alert': ReflexDistractionAlert,
    'badge-focus-hero': BadgeFocusHero
  }
};

// Export functions to get games
export const getBrainGame = (age, gameId) => {
  return brainGames[age]?.[gameId];
};

export const getAllBrainGames = (age = null) => {
  if (age) {
    return brainGames[age] || {};
  }
  return {
    kids: brainGames.kids,
    teen: brainGames.teen
  };
};

export const getBrainGameIds = (age = null) => {
  if (age) {
    return Object.keys(brainGames[age] || {});
  }
  return {
    kids: Object.keys(brainGames.kids),
    teen: Object.keys(brainGames.teen)
  };
};

export default brainGames;
