// Template for updating AI games to integrate with heal coins system
// This template shows the required changes for each AI game component

/*
REQUIRED CHANGES FOR EACH AI GAME:

1. IMPORTS - Add LevelCompleteHandler and ScoreFlash:
   OLD: import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti } from "./GameShell";
   NEW: import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

2. STATE - Add gameOver and flashPoints:
   ADD: const [gameOver, setGameOver] = useState(false);
   ADD: const [flashPoints, setFlashPoints] = useState(null);

3. HANDLE CORRECT ANSWER - Add score flash:
   OLD: setScore(prev => prev + points);
   NEW: setScore(prev => prev + points);
        setFlashPoints(points);
        setTimeout(() => setFlashPoints(null), 1000);

4. HANDLE NEXT LEVEL - Use gameOver instead of alert:
   OLD: alert(`Game Over! Your final score is: ${score}`);
   NEW: setGameOver(true);

5. GAMESHELL PROPS - Add heal coins integration:
   ADD TO GAMESHELL:
   - showGameOver={gameOver}
   - score={score}
   - gameId="your-game-id"
   - gameType="ai"
   - totalLevels={questions.length}

6. GAME CONTENT - Wrap GameCard in LevelCompleteHandler:
   OLD: <GameCard>...</GameCard>
   NEW: <LevelCompleteHandler
          gameId="your-game-id"
          gameType="ai"
          levelNumber={currentLevelIndex + 1}
          levelScore={feedback.type === 'correct' ? rewardPoints : 0}
          maxLevelScore={rewardPoints}
        >
          <GameCard>...</GameCard>
        </LevelCompleteHandler>

7. ADD SCORE FLASH - Add to JSX:
   ADD: {flashPoints && <ScoreFlash points={flashPoints} />}
*/

// Game ID mapping for all AI games
export const gameIdMapping = {
  'AIArtistGame.jsx': 'ai-artist-game',
  'AIBasicsBadge.jsx': 'ai-basics-badge',
  'AIDailyLifeBadge.jsx': 'ai-daily-life-badge', 
  'AIDoctorQuiz.jsx': 'ai-doctor-quiz',
  'AIDoctorSimulation.jsx': 'ai-doctor-simulation',
  'AIInBankingQuiz.jsx': 'ai-in-banking-quiz',
  'AIInGames.jsx': 'ai-in-games',
  'AIInMapsStory.jsx': 'ai-in-maps-story',
  'AINewsStory.jsx': 'ai-news-story',
  'AIOrHumanQuiz.jsx': 'ai-or-human-quiz',
  'AIOrNotQuiz.jsx': 'ai-or-not-quiz',
  'AITranslatorQuiz.jsx': 'ai-translator-quiz',
  'AirportScannerStory.jsx': 'airport-scanner-story',
  'ChatbotFriend.jsx': 'chatbot-friend',
  'EmojiClassifier.jsx': 'emoji-classifier',
  'FaceUnlockGame.jsx': 'face-unlock-game',
  'FriendlyAIQuiz.jsx': 'friendly-ai-quiz',
  'MatchAITools.jsx': 'match-ai-tools',
  'MatchAIUses.jsx': 'match-ai-uses',
  'MusicAIStory.jsx': 'music-ai-story',
  'OnlineShoppingAI.jsx': 'online-shopping-ai',
  'PatternFindingPuzzle.jsx': 'pattern-finding-puzzle',
  'PatternMusicGame.jsx': 'pattern-music-game',
  'PatternMusicGame2.jsx': 'pattern-music-game-2',
  'PatternMusicGame3.jsx': 'pattern-music-game-3',
  'PredictionPuzzle.jsx': 'prediction-puzzle',
  'RecommendationGame.jsx': 'recommendation-game',
  'RobotEmotionStory.jsx': 'robot-emotion-story',
  'RobotHelperReflex.jsx': 'robot-helper-reflex',
  'RobotHelperStory.jsx': 'robot-helper-story',
  'RobotVacuumGame.jsx': 'robot-vacuum-game',
  'RobotVisionGame.jsx': 'robot-vision-game',
  'SelfDrivingCarGame.jsx': 'self-driving-car-game',
  'SiriAlexaQuiz.jsx': 'siri-alexa-quiz',
  'SmartCityTrafficGame.jsx': 'smart-city-traffic-game',
  'SmartFarmingQuiz.jsx': 'smart-farming-quiz',
  'SmartFridgeStory.jsx': 'smart-fridge-story',
  'SmartHomeLightsGame.jsx': 'smart-home-lights-game',
  'SmartHomeStory.jsx': 'smart-home-story',
  'SmartSpeakerStory.jsx': 'smart-speaker-story',
  'SmartwatchGame.jsx': 'smartwatch-game',
  'SortingAnimals.jsx': 'sorting-animals',
  'SortingColors.jsx': 'sorting-colors',
  'SpamVsNotSpam.jsx': 'spam-vs-not-spam',
  'TrafficLightAI.jsx': 'traffic-light-ai',
  'TrainTheRobot.jsx': 'train-the-robot',
  'VoiceAssistantQuiz.jsx': 'voice-assistant-quiz',
  'WeatherPredictionStory.jsx': 'weather-prediction-story',
  'YoutubeRecommendationGame.jsx': 'youtube-recommendation-game'
};

// Example of a completed transformation:
export const exampleTransformation = `
// BEFORE (Basic AI Game):
import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti } from "./GameShell";

const YourGame = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const handleNextLevel = () => {
    if (currentLevelIndex < questions.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      alert(\`Game Over! Your final score is: \${score}\`);
    }
  };

  return (
    <GameShell title="Your Game">
      <GameCard>
        <p>Question content</p>
      </GameCard>
    </GameShell>
  );
};

// AFTER (With Heal Coins Integration):
import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const YourGame = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [gameOver, setGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null);

  const handleCorrectAnswer = (points) => {
    setScore(prev => prev + points);
    setFlashPoints(points);
    setTimeout(() => setFlashPoints(null), 1000);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < questions.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  return (
    <GameShell 
      title="Your Game"
      showGameOver={gameOver}
      score={score}
      gameId="your-game-id"
      gameType="ai"
      totalLevels={questions.length}
    >
      {flashPoints && <ScoreFlash points={flashPoints} />}
      
      <LevelCompleteHandler
        gameId="your-game-id"
        gameType="ai"
        levelNumber={currentLevelIndex + 1}
        levelScore={feedback.type === 'correct' ? rewardPoints : 0}
        maxLevelScore={rewardPoints}
      >
        <GameCard>
          <p>Question content</p>
        </GameCard>
      </LevelCompleteHandler>
    </GameShell>
  );
};
`;

console.log('🎮 AI Games Heal Coins Integration Template Ready!');
console.log('📝 Follow the transformation pattern above for each game.');