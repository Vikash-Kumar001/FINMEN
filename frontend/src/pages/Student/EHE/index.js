// Unified EHE Games Export
// Combines Kids and Teen EHE games into a single object

// Import all Kids EHE games
import {
  DoctorStory,
  QuizOnJobs,
  ReflexJobMatch,
  PuzzleWhoDoesWhat,
  DreamJobStory,
  PosterMyDreamJob,
  JournalOfJobs,
  SchoolHelperStory,
  ReflexCareerCheck,
  BadgeCareerExplorer,
  IdeaStory,
  QuizOnSkills,
  ReflexSkillCheck,
  PuzzleMatchSkills,
  TeamworkStory,
  PosterSkillsForSuccess,
  JournalOfSkills,
  RiskStory,
  ReflexInnovation,
  BadgeYoungInnovator
} from './Kids';

// Import all Teen EHE games
import {
  CareerStory,
  QuizOnCareers,
  ReflexTeenCareer,
  PuzzleCareerMatch,
  PassionStory,
  DebateOneCareerOrMany,
  JournalOfCareerChoice,
  SimulationCareerFair,
  ReflexFutureCheck,
  BadgeCareerAwareTeen,
  OpportunityStory,
  QuizOnEntrepreneurTraits,
  ReflexTeenSkills,
  PuzzleMatchTraits,
  FailureStory,
  DebateBornOrMade,
  JournalOfStrengths,
  SimulationTeamProject,
  ReflexTeenInnovator,
  BadgeFutureEntrepreneur
} from './Teen';

// Create unified games registry
const eheGames = {
  // Kids Games (20 games)
  kids: {
    'doctor-story': DoctorStory,
    'quiz-on-jobs': QuizOnJobs,
    'reflex-job-match': ReflexJobMatch,
    'puzzle-who-does-what': PuzzleWhoDoesWhat,
    'dream-job-story': DreamJobStory,
    'poster-my-dream-job': PosterMyDreamJob,
    'journal-of-jobs': JournalOfJobs,
    'school-helper-story': SchoolHelperStory,
    'reflex-career-check': ReflexCareerCheck,
    'badge-career-explorer': BadgeCareerExplorer,
    'idea-story': IdeaStory,
    'quiz-on-skills': QuizOnSkills,
    'reflex-skill-check': ReflexSkillCheck,
    'puzzle-match-skills': PuzzleMatchSkills,
    'teamwork-story': TeamworkStory,
    'poster-skills-for-success': PosterSkillsForSuccess,
    'journal-of-skills': JournalOfSkills,
    'risk-story': RiskStory,
    'reflex-innovation': ReflexInnovation,
    'badge-young-innovator': BadgeYoungInnovator
  },

  // Teen Games (20 games)
  teen: {
    'career-story': CareerStory,
    'quiz-on-careers': QuizOnCareers,
    'reflex-teen-career': ReflexTeenCareer,
    'puzzle-career-match': PuzzleCareerMatch,
    'passion-story': PassionStory,
    'debate-one-career-or-many': DebateOneCareerOrMany,
    'journal-of-career-choice': JournalOfCareerChoice,
    'simulation-career-fair': SimulationCareerFair,
    'reflex-future-check': ReflexFutureCheck,
    'badge-career-aware-teen': BadgeCareerAwareTeen,
    'opportunity-story': OpportunityStory,
    'quiz-on-entrepreneur-traits': QuizOnEntrepreneurTraits,
    'reflex-teen-skills': ReflexTeenSkills,
    'puzzle-match-traits': PuzzleMatchTraits,
    'failure-story': FailureStory,
    'debate-born-or-made': DebateBornOrMade,
    'journal-of-strengths': JournalOfStrengths,
    'simulation-team-project': SimulationTeamProject,
    'reflex-teen-innovator': ReflexTeenInnovator,
    'badge-future-entrepreneur': BadgeFutureEntrepreneur
  }
};

// Export functions to get games
export const getEheGame = (age, gameId) => {
  return eheGames[age]?.[gameId];
};

export const getAllEheGames = (age = null) => {
  if (age) {
    return eheGames[age] || {};
  }
  return {
    kids: eheGames.kids,
    teen: eheGames.teen
  };
};

export const getEheGameIds = (age = null) => {
  if (age) {
    return Object.keys(eheGames[age] || {});
  }
  return {
    kids: Object.keys(eheGames.kids),
    teen: Object.keys(eheGames.teen)
  };
};

export default eheGames;
