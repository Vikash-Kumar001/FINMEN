import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const DigitalDetoxSimulation = () => {
  const location = useLocation();
  const gameId = "dcos-teen-24";
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
      title: "Weekend Plan",
      emoji: "📅",
      situation: "It's the weekend! What will you do?",
      options: [
        { id: 1, text: "Screen binge - watch shows all day", emoji: "📺", isCorrect: false },
        { id: 2, text: "Go to the park and play sports", emoji: "🏞️", isCorrect: true },
        { id: 3, text: "Read a book offline", emoji: "📚", isCorrect: true }
      ]
    },
    {
      id: 2,
      title: "Free Time Choice",
      emoji: "⏰",
      situation: "You have 2 hours of free time. What's your choice?",
      options: [
        { id: 1, text: "Scroll social media", emoji: "📱", isCorrect: false },
        { id: 2, text: "Go for a walk outside", emoji: "🚶", isCorrect: true },
        { id: 3, text: "Do a hobby offline", emoji: "🎨", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Evening Activity",
      emoji: "🌆",
      situation: "It's evening. How will you spend your time?",
      options: [
        { id: 1, text: "Play video games for hours", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Spend time with family", emoji: "👨‍👩‍👧", isCorrect: true },
        { id: 3, text: "Read or do crafts", emoji: "✂️", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "Break Time",
      emoji: "☕",
      situation: "You have a break from studying. What do you do?",
      options: [
        { id: 1, text: "Check phone and scroll", emoji: "📱", isCorrect: false },
        { id: 2, text: "Take a walk or stretch", emoji: "🧘", isCorrect: true },
        { id: 3, text: "Have a snack and relax", emoji: "🍎", isCorrect: true }
      ]
    },
    {
      id: 5,
      title: "Holiday Plan",
      emoji: "🎉",
      situation: "It's a holiday! What's your plan?",
      options: [
        { id: 1, text: "Binge watch shows", emoji: "📺", isCorrect: false },
        { id: 2, text: "Go on an outdoor adventure", emoji: "🏔️", isCorrect: true },
        { id: 3, text: "Read books and relax", emoji: "📖", isCorrect: true }
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
      title="Digital Detox Simulation"
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
            <div className="bg-green-500/20 border-2 border-green-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed text-center">{currentScenarioData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose your activity:</h3>

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
            <div className="text-7xl mb-4">🌳</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Digital Detox Master! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! Choosing offline activities like parks, books, and outdoor adventures over screen binges is healthy! Balance screen time with real-world activities for better wellbeing!"
                : "Great job! Keep learning to balance screen time!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Choose offline activities over screen binges for better health and wellbeing!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DigitalDetoxSimulation;
