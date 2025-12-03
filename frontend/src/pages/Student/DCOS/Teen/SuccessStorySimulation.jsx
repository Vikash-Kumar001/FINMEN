import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const SuccessStorySimulation = () => {
  const location = useLocation();
  const gameId = "dcos-teen-29";
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
      title: "Morning Routine",
      emoji: "🌅",
      situation: "You need to balance sports practice, studies, and tech. What's your morning plan?",
      options: [
        { id: 1, text: "Spend all morning on phone", emoji: "📱", isCorrect: false },
        { id: 2, text: "Exercise, study, then limited tech", emoji: "✅", isCorrect: true },
        { id: 3, text: "Skip everything, just relax", emoji: "😴", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Study Time",
      emoji: "📚",
      situation: "You have exams and also want to use tech. How do you balance?",
      options: [
        { id: 1, text: "Study with phone nearby", emoji: "📱", isCorrect: false },
        { id: 2, text: "Study first, tech as reward", emoji: "✅", isCorrect: true },
        { id: 3, text: "Just use tech, study later", emoji: "😑", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Sports Practice",
      emoji: "⚽",
      situation: "You have sports practice but also want screen time. What's the priority?",
      options: [
        { id: 1, text: "Skip practice, use tech", emoji: "📱", isCorrect: false },
        { id: 2, text: "Go to practice, tech after", emoji: "✅", isCorrect: true },
        { id: 3, text: "Do both at the same time", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Evening Balance",
      emoji: "🌆",
      situation: "Evening time - how do you balance activities?",
      options: [
        { id: 1, text: "Only use tech all evening", emoji: "📱", isCorrect: false },
        { id: 2, text: "Mix tech with family time and hobbies", emoji: "✅", isCorrect: true },
        { id: 3, text: "Ignore everything else", emoji: "😑", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Success Formula",
      emoji: "🏆",
      situation: "What's the key to balancing sports, studies, and tech successfully?",
      options: [
        { id: 1, text: "Focus only on tech", emoji: "📱", isCorrect: false },
        { id: 2, text: "Prioritize important tasks, limit tech", emoji: "✅", isCorrect: true },
        { id: 3, text: "Do everything randomly", emoji: "😐", isCorrect: false }
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
      title="Success Story Simulation"
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

            <h3 className="text-white font-bold mb-4 text-center">What's your choice?</h3>

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
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Success Story! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! Balancing sports, studies, and tech leads to success! Prioritize important tasks like exercise and studying, then use tech as a reward. This balance helps you achieve your goals and stay healthy!"
                : "Great job! Keep learning to balance all aspects of life!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Balance sports, studies, and tech for success! Prioritize what matters most!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SuccessStorySimulation;
