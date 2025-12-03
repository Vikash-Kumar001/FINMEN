import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const ScreenLogStory = () => {
  const location = useLocation();
  const gameId = "dcos-teen-21";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
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
      const games = getDcosTeenGames({});
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
      title: "Gaming Marathon",
      emoji: "🎮",
      situation: "You've been gaming for 6 hours straight. Your eyes are tired and you have homework. What should you do?",
      options: [
        { id: 1, text: "Keep playing - just one more game", emoji: "😴", isCorrect: false },
        { id: 2, text: "Take a break and limit screen time", emoji: "⏰", isCorrect: true },
        { id: 3, text: "Play for 2 more hours then stop", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Social Media Scroll",
      emoji: "📱",
      situation: "You've been scrolling social media for 4 hours. You feel drained and haven't done anything productive. What's the best choice?",
      options: [
        { id: 1, text: "Keep scrolling - it's relaxing", emoji: "😑", isCorrect: false },
        { id: 2, text: "Set a time limit and do something offline", emoji: "⏰", isCorrect: true },
        { id: 3, text: "Scroll for 1 more hour", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Video Binge",
      emoji: "📺",
      situation: "You've been watching videos for 5 hours. It's late and you're exhausted. What should you do?",
      options: [
        { id: 1, text: "Watch a few more videos", emoji: "😴", isCorrect: false },
        { id: 2, text: "Stop and get proper rest", emoji: "⏰", isCorrect: true },
        { id: 3, text: "Watch for 30 more minutes", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Study vs Screen",
      emoji: "📚",
      situation: "You've been on your phone for 3 hours instead of studying. Exams are tomorrow. What's the right action?",
      options: [
        { id: 1, text: "Keep using phone - study later", emoji: "😑", isCorrect: false },
        { id: 2, text: "Put phone away and focus on studying", emoji: "⏰", isCorrect: true },
        { id: 3, text: "Use phone while studying", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "All Day Screen Time",
      emoji: "💻",
      situation: "You've spent 8 hours on screens today. You feel tired and haven't exercised. What should you do?",
      options: [
        { id: 1, text: "Continue using screens", emoji: "😴", isCorrect: false },
        { id: 2, text: "Limit screen time and do physical activity", emoji: "⏰", isCorrect: true },
        { id: 3, text: "Use screens for 2 more hours", emoji: "😐", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setSelectedChoice(optionId);
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
        setSelectedChoice(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Screen Log Story"
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
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed">{currentScenarioData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3">
              {currentScenarioData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all text-left ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect && selectedChoice === option.id
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedChoice === option.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
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
            <div className="text-7xl mb-4">⏰</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Screen Time Manager! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! Limiting screen time is essential for your health, sleep, and productivity. Balance is key - enjoy technology but also make time for offline activities, exercise, and rest!"
                : "Great job! Keep learning to manage your screen time!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Set screen time limits and take regular breaks for better wellbeing!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ScreenLogStory;
