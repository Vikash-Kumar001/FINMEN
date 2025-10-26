// Unified AI For All Games Export
// Combines Kids and Teen AI games into a single object

// Import all Kids AI games
import {
  SpotThePattern,
  CatOrDogGame,
  SortingColors,
  TrueFalseAIQuiz,
  EmojiClassifier,
  SelfDrivingCar,
  PatternFinderPuzzle,
  RobotHelperStory,
  SpamVsNotSpam,
  SiriAlexaQuiz,
  AIInGames,
  MatchAITools,
  PatternMusicGame,
  RobotVisionGame,
  SmartHomeStory,
  TrainTheRobot,
  PredictionPuzzle,
  FriendlyAIQuiz,
  RobotEmotionStory,
  RecommendationGame
} from './Kids';

// Import all Teen AI games
import {
  WhatIsAIQuiz,
  PatternPredictionPuzzle,
  ImageClassifierGame,
  HumanVsAIQuiz,
  PredictNextWord,
  SelfDrivingCarReflex,
  SortingEmotionsGame,
  TrueFalseAIQuiz as TrueFalseAIQuizTeen,
  ChatbotSimulation,
  AIInGamingStory,
  PatternMusicReflex,
  ComputerVisionBasics,
  AIInSmartphonesQuiz,
  PredictionStory,
  MachineVsHumanReflex,
  LanguageAIQuiz,
  SimpleAlgorithmPuzzle,
  SmartHomeStory as SmartHomeStoryTeen,
  RecommendationSimulation,
  AIEverywhereQuiz
} from './Teen';

// Create unified games registry
const aiForAllGames = {
  // Kids Games (20 games)
  kids: {
    'spot-the-pattern': SpotThePattern,
    'cat-or-dog-game': CatOrDogGame,
    'sorting-colors': SortingColors,
    'true-or-false-ai-quiz': TrueFalseAIQuiz,
    'emoji-classifier': EmojiClassifier,
    'self-driving-car': SelfDrivingCar,
    'pattern-finder-puzzle': PatternFinderPuzzle,
    'robot-helper-story': RobotHelperStory,
    'spam-vs-not-spam': SpamVsNotSpam,
    'siri-alexa-quiz': SiriAlexaQuiz,
    'ai-in-games': AIInGames,
    'match-ai-tools': MatchAITools,
    'pattern-music-game': PatternMusicGame,
    'robot-vision-game': RobotVisionGame,
    'smart-home-story': SmartHomeStory,
    'train-the-robot': TrainTheRobot,
    'prediction-puzzle': PredictionPuzzle,
    'friendly-ai-quiz': FriendlyAIQuiz,
    'robot-emotion-story': RobotEmotionStory,
    'recommendation-game': RecommendationGame
  },

  // Teen Games (20 games)
  teen: {
    'what-is-ai-quiz': WhatIsAIQuiz,
    'pattern-prediction-puzzle': PatternPredictionPuzzle,
    'image-classifier-game': ImageClassifierGame,
    'human-vs-ai-quiz': HumanVsAIQuiz,
    'predict-next-word': PredictNextWord,
    'self-driving-car-reflex': SelfDrivingCarReflex,
    'sorting-emotions-game': SortingEmotionsGame,
    'true-or-false-ai-quiz-teen': TrueFalseAIQuizTeen,
    'chatbot-simulation': ChatbotSimulation,
    'ai-in-gaming-story': AIInGamingStory,
    'pattern-music-reflex': PatternMusicReflex,
    'computer-vision-basics': ComputerVisionBasics,
    'ai-in-smartphones-quiz': AIInSmartphonesQuiz,
    'prediction-story': PredictionStory,
    'machine-vs-human-reflex': MachineVsHumanReflex,
    'language-ai-quiz': LanguageAIQuiz,
    'simple-algorithm-puzzle': SimpleAlgorithmPuzzle,
    'smart-home-story-teen': SmartHomeStoryTeen,
    'recommendation-simulation': RecommendationSimulation,
    'ai-everywhere-quiz': AIEverywhereQuiz
  }
};

// Export functions to get games
export const getAiForAllGame = (age, gameId) => {
  return aiForAllGames[age]?.[gameId];
};

export const getAllAiForAllGames = (age = null) => {
  if (age) {
    return aiForAllGames[age] || {};
  }
  return {
    kids: aiForAllGames.kids,
    teen: aiForAllGames.teen
  };
};

export const getAiForAllGameIds = (age = null) => {
  if (age) {
    return Object.keys(aiForAllGames[age] || {});
  }
  return {
    kids: Object.keys(aiForAllGames.kids),
    teen: Object.keys(aiForAllGames.teen)
  };
};

export default aiForAllGames;
