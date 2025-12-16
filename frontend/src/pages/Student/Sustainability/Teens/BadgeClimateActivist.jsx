import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Globe, Sun, Leaf, Trophy } from "lucide-react";

const BadgeClimateActivist = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-10");
  const gameId = gameData?.id || "sustainability-teens-10";
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Climate Activist game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const levels = [
    {
      id: 1,
      title: "Climate Knowledge",
      question: "What is the main cause of climate change?",
      icon: Globe,
      options: [
        { text: "Greenhouse gas emissions", correct: true, emoji: "🌍" },
        { text: "Natural weather patterns", correct: false, emoji: "🌤️" },
        { text: "Ocean currents", correct: false, emoji: "🌊" }
      ],
      feedback: { correct: "Correct! Greenhouse gases trap heat.", wrong: "Greenhouse gas emissions from human activities are the main cause." }
    },
    {
      id: 2,
      title: "Renewable Energy",
      question: "Which is a renewable energy source?",
      icon: Sun,
      options: [
        { text: "Coal", correct: false, emoji: "⛽" },
        { text: "Solar power", correct: true, emoji: "☀️" },
        { text: "Natural gas", correct: false, emoji: "🔥" }
      ],
      feedback: { correct: "Excellent! Solar is renewable!", wrong: "Solar power is renewable and sustainable." }
    },
    {
      id: 3,
      title: "Action",
      question: "How can you reduce your carbon footprint?",
      icon: Leaf,
      options: [
        { text: "Drive alone everywhere", correct: false, emoji: "🚗" },
        { text: "Waste energy", correct: false, emoji: "💡" },
        { text: "Use public transport", correct: true, emoji: "🚌" }
      ],
      feedback: { correct: "Great! Public transport reduces emissions!", wrong: "Using public transport helps reduce your carbon footprint." }
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return;
    setAnswered(true);
    resetFeedback();
    if (option.correct) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    setTimeout(() => {
      if (currentLevel < levels.length) {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData?.icon;

  return (
    <GameShell
      title="Badge: Climate Activist"
      score={score}
      subtitle={!showResult ? `Question ${currentLevel} of ${levels.length}: Earn your badge!` : "Badge Earned!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={levels.length}
      currentLevel={currentLevel}
      maxScore={levels.length}
      showConfetti={showResult && score === levels.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            {Icon && <Icon className="w-16 h-16 text-green-400 mx-auto mb-4" />}
            <p className="text-white text-lg mb-6 text-center">{currentLevelData.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentLevelData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-xl font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="text-xl">{option.emoji}</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeClimateActivist;

