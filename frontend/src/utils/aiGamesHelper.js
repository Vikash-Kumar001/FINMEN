// Script to add heal coins integration to all AI games
// This will help systematically update each game component

import fs from 'fs';
import path from 'path';

const AI_GAMES_DIR = 'c:/Users/MARDAV JADAUN/OneDrive/Desktop/FINMEN/frontend/src/pages/Student/AI';

// List of all AI games with their respective game IDs
const aiGamesList = [
  { file: 'AIArtistGame.jsx', gameId: 'ai-artist-game', totalLevels: 5 },
  { file: 'AIBasicsBadge.jsx', gameId: 'ai-basics-badge', totalLevels: 5 },
  { file: 'AIDailyLifeBadge.jsx', gameId: 'ai-daily-life-badge', totalLevels: 5 },
  { file: 'AIDoctorQuiz.jsx', gameId: 'ai-doctor-quiz', totalLevels: 5 },
  { file: 'AIDoctorSimulation.jsx', gameId: 'ai-doctor-simulation', totalLevels: 5 },
  { file: 'AIInBankingQuiz.jsx', gameId: 'ai-in-banking-quiz', totalLevels: 5 },
  { file: 'AIInGames.jsx', gameId: 'ai-in-games', totalLevels: 5 },
  { file: 'AIInMapsStory.jsx', gameId: 'ai-in-maps-story', totalLevels: 5 },
  { file: 'AINewsStory.jsx', gameId: 'ai-news-story', totalLevels: 5 },
  { file: 'AIOrHumanQuiz.jsx', gameId: 'ai-or-human-quiz', totalLevels: 5 },
  { file: 'AIOrNotQuiz.jsx', gameId: 'ai-or-not-quiz', totalLevels: 5 },
  { file: 'AITranslatorQuiz.jsx', gameId: 'ai-translator-quiz', totalLevels: 5 },
  { file: 'AirportScannerStory.jsx', gameId: 'airport-scanner-story', totalLevels: 5 },
  { file: 'ChatbotFriend.jsx', gameId: 'chatbot-friend', totalLevels: 5 },
  { file: 'EmojiClassifier.jsx', gameId: 'emoji-classifier', totalLevels: 5 },
  { file: 'FaceUnlockGame.jsx', gameId: 'face-unlock-game', totalLevels: 5 },
  { file: 'FriendlyAIQuiz.jsx', gameId: 'friendly-ai-quiz', totalLevels: 5 },
  { file: 'MatchAITools.jsx', gameId: 'match-ai-tools', totalLevels: 5 },
  { file: 'MatchAIUses.jsx', gameId: 'match-ai-uses', totalLevels: 5 },
  { file: 'MusicAIStory.jsx', gameId: 'music-ai-story', totalLevels: 5 },
  { file: 'OnlineShoppingAI.jsx', gameId: 'online-shopping-ai', totalLevels: 5 },
  { file: 'PatternFindingPuzzle.jsx', gameId: 'pattern-finding-puzzle', totalLevels: 5 },
  { file: 'PatternMusicGame.jsx', gameId: 'pattern-music-game', totalLevels: 5 },
  { file: 'PatternMusicGame2.jsx', gameId: 'pattern-music-game-2', totalLevels: 5 },
  { file: 'PatternMusicGame3.jsx', gameId: 'pattern-music-game-3', totalLevels: 5 },
  { file: 'PredictionPuzzle.jsx', gameId: 'prediction-puzzle', totalLevels: 5 },
  { file: 'RecommendationGame.jsx', gameId: 'recommendation-game', totalLevels: 5 },
  { file: 'RobotEmotionStory.jsx', gameId: 'robot-emotion-story', totalLevels: 5 },
  { file: 'RobotHelperReflex.jsx', gameId: 'robot-helper-reflex', totalLevels: 5 },
  { file: 'RobotHelperStory.jsx', gameId: 'robot-helper-story', totalLevels: 5 },
  { file: 'RobotVacuumGame.jsx', gameId: 'robot-vacuum-game', totalLevels: 5 },
  { file: 'RobotVisionGame.jsx', gameId: 'robot-vision-game', totalLevels: 5 },
  { file: 'SelfDrivingCarGame.jsx', gameId: 'self-driving-car-game', totalLevels: 5 },
  { file: 'SiriAlexaQuiz.jsx', gameId: 'siri-alexa-quiz', totalLevels: 5 },
  { file: 'SmartCityTrafficGame.jsx', gameId: 'smart-city-traffic-game', totalLevels: 5 },
  { file: 'SmartFarmingQuiz.jsx', gameId: 'smart-farming-quiz', totalLevels: 5 },
  { file: 'SmartFridgeStory.jsx', gameId: 'smart-fridge-story', totalLevels: 5 },
  { file: 'SmartHomeLightsGame.jsx', gameId: 'smart-home-lights-game', totalLevels: 5 },
  { file: 'SmartHomeStory.jsx', gameId: 'smart-home-story', totalLevels: 5 },
  { file: 'SmartSpeakerStory.jsx', gameId: 'smart-speaker-story', totalLevels: 5 },
  { file: 'SmartwatchGame.jsx', gameId: 'smartwatch-game', totalLevels: 5 },
  { file: 'SortingAnimals.jsx', gameId: 'sorting-animals', totalLevels: 5 },
  { file: 'SortingColors.jsx', gameId: 'sorting-colors', totalLevels: 5 },
  { file: 'SpamVsNotSpam.jsx', gameId: 'spam-vs-not-spam', totalLevels: 5 },
  { file: 'TrafficLightAI.jsx', gameId: 'traffic-light-ai', totalLevels: 5 },
  { file: 'TrainTheRobot.jsx', gameId: 'train-the-robot', totalLevels: 5 },
  { file: 'VoiceAssistantQuiz.jsx', gameId: 'voice-assistant-quiz', totalLevels: 5 },
  { file: 'WeatherPredictionStory.jsx', gameId: 'weather-prediction-story', totalLevels: 5 },
  { file: 'YoutubeRecommendationGame.jsx', gameId: 'youtube-recommendation-game', totalLevels: 5 }
];

console.log('🎮 AI Games Integration Checklist:');
console.log('='.repeat(50));

aiGamesList.forEach((game, index) => {
  console.log(`${index + 1}. ${game.file} -> gameId: "${game.gameId}"`);
});

console.log(`\n📊 Total AI Games: ${aiGamesList.length}`);
console.log('\n✅ Already Updated:');
console.log('- CatOrDog.jsx');
console.log('- TrueOrFalseAIQuiz.jsx');
console.log('- SpotThePattern.jsx');

console.log('\n🔧 Need Integration:');
const needUpdate = aiGamesList.filter(game => 
  !['CatOrDog.jsx', 'TrueOrFalseAIQuiz.jsx', 'SpotThePattern.jsx'].includes(game.file)
);

needUpdate.forEach((game, index) => {
  console.log(`${index + 1}. ${game.file}`);
});

console.log(`\n📝 ${needUpdate.length} games need heal coins integration`);

export { aiGamesList, needUpdate };