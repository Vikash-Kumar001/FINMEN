import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const OutdoorFunStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-27";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getDcosKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  const scenarios = [
    {
      id: 1,
      title: "Park Invitation",
      emoji: "🌳",
      situation: "Your friend invites you to the park to play. You're in the middle of a mobile game.",
      options: [
        { id: 1, text: "Say no and keep playing the game", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Go to the park and play outside", emoji: "⚽", isCorrect: true },
        { id: 3, text: "Ask them to wait until you finish", emoji: "⏳", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Bike Ride",
      emoji: "🚴",
      situation: "Your family wants to go for a bike ride. You're watching videos on your tablet.",
      options: [
        { id: 1, text: "Join the bike ride", emoji: "🚴", isCorrect: true },
        { id: 2, text: "Stay home and watch videos", emoji: "📱", isCorrect: false },
        { id: 3, text: "Bring the tablet on the ride", emoji: "📲", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Playground Time",
      emoji: "🛝",
      situation: "It's a beautiful sunny day. Your friends are at the playground. You're playing games on your phone.",
      options: [
        { id: 1, text: "Put the phone away and go play", emoji: "🏃", isCorrect: true },
        { id: 2, text: "Stay inside and keep playing", emoji: "🎮", isCorrect: false },
        { id: 3, text: "Play games while at the playground", emoji: "📱", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Nature Walk",
      emoji: "🌿",
      situation: "Your parents suggest a nature walk. You're in the middle of an online game.",
      options: [
        { id: 1, text: "Save the game and go for the walk", emoji: "🚶", isCorrect: true },
        { id: 2, text: "Skip the walk and keep gaming", emoji: "💻", isCorrect: false },
        { id: 3, text: "Ask to finish the game first", emoji: "⏰", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Sports Day",
      emoji: "⚽",
      situation: "It's sports day at school. You can play outside or stay in and use devices.",
      options: [
        { id: 1, text: "Join the sports activities", emoji: "🏃", isCorrect: true },
        { id: 2, text: "Stay inside with your device", emoji: "📱", isCorrect: false },
        { id: 3, text: "Watch others play from inside", emoji: "👀", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentScenario];
    const selectedOption = currentScenarioData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Outdoor Fun Story"
      score={score}
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      maxScore={scenarios.length}
      showConfetti={showResult && score === scenarios.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentScenarioData.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">{currentScenarioData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed">{currentScenarioData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>
            
            <div className="space-y-3 mb-6">
              {currentScenarioData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all text-left ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{option.emoji}</div>
                    <div className="text-white font-semibold text-base md:text-lg">{option.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌳</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Outdoor Lover! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You always choose outdoor fun and physical activities over screen time!"
                : "Great job! Remember that outdoor activities are important for your health and happiness."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Playing outside helps you stay healthy, make friends, and have real fun!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OutdoorFunStory;
