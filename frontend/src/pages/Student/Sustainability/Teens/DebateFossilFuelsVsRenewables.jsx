import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const DebateFossilFuelsVsRenewables = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-6");
  const gameId = gameData?.id || "sustainability-teens-6";
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
      console.log(`🎮 Debate: Fossil Fuels vs Renewables game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "Should we transition from fossil fuels to renewable energy?",
      options: [
        { id: "yes", text: "Yes, immediately", emoji: "✅", description: "Urgent action needed for climate", isCorrect: true },
        { id: "gradual", text: "Gradually over time", emoji: "⏳", description: "Balance is important", isCorrect: true },
        { id: "no", text: "No, keep fossil fuels", emoji: "❌", description: "Fossil fuels harm the environment", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "What's the main advantage of renewable energy?",
      options: [
        { id: "cheap", text: "Always cheaper", emoji: "💰", description: "Costs vary", isCorrect: false },
        { id: "clean", text: "Clean and sustainable", emoji: "🌱", description: "Reduces pollution", isCorrect: true },
        { id: "reliable", text: "Always available", emoji: "⚡", description: "Depends on conditions", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What's a challenge with renewable energy?",
      options: [
        { id: "cost", text: "Too expensive", emoji: "💸", description: "Costs are decreasing", isCorrect: false },
        { id: "ineffective", text: "Doesn't work", emoji: "❌", description: "Renewable energy is effective", isCorrect: false },
        { id: "storage", text: "Energy storage", emoji: "🔋", description: "Need better battery technology", isCorrect: true }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    setAnswered(true);
    resetFeedback();
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentQuestion === questions.length - 1) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Fossil Fuels vs Renewables"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
            </div>
            <p className="text-white text-lg mb-6">{currentQuestionData.text}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="text-3xl mb-3">{option.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                  <p className="text-white/90 text-sm">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateFossilFuelsVsRenewables;

