import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const SimulationGreenCommunityProject = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-24");
  const gameId = gameData?.id || "sustainability-teens-24";
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
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

  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Simulation: Green Community Project game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      text: "What's the first step in planning a green community project?",
      options: [
        { id: "assess", text: "Assess community needs", emoji: "📊", description: "Understand what's needed", isCorrect: true },
        { id: "ignore", text: "Ignore community input", emoji: "😐", description: "Not effective", isCorrect: false },
        { id: "rush", text: "Rush into action", emoji: "⚡", description: "Needs planning", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How should you engage the community?",
      options: [
        { id: "exclude", text: "Exclude community members", emoji: "🚫", description: "Lacks support", isCorrect: false },
        { id: "involve", text: "Involve everyone in planning", emoji: "👥", description: "Builds support", isCorrect: true },
        { id: "dictate", text: "Dictate the plan", emoji: "📢", description: "Not collaborative", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What makes a community project sustainable?",
      options: [
        { id: "shortterm", text: "Quick fixes only", emoji: "⚡", description: "Not sustainable", isCorrect: false },
        { id: "ignore", text: "Ignore maintenance", emoji: "🔧", description: "Won't last", isCorrect: false },
        { id: "longterm", text: "Long-term impact and maintenance", emoji: "🌱", description: "Lasting change", isCorrect: true }
      ]
    },
    {
      id: 4,
      text: "How do you measure project success?",
      options: [
        { id: "metrics", text: "Track environmental metrics", emoji: "📈", description: "Measure impact", isCorrect: true },
        { id: "ignore", text: "Ignore results", emoji: "😶", description: "No learning", isCorrect: false },
        { id: "guess", text: "Guess the impact", emoji: "🎲", description: "Not accurate", isCorrect: false }
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
      title="Simulation: Green Community Project"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Simulation Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
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
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

export default SimulationGreenCommunityProject;

