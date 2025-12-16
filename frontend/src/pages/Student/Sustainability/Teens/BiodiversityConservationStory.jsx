import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const BiodiversityConservationStory = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-21");
  const gameId = gameData?.id || "sustainability-teens-21";
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
      console.log(`🎮 Biodiversity Conservation Story game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      text: "Your community plans to build on a forest. What's your stance?",
      options: [
        { id: "oppose", text: "Oppose and suggest alternatives", emoji: "🌳", description: "Protect biodiversity", isCorrect: true },
        { id: "ignore", text: "Ignore the issue", emoji: "😐", description: "Action is needed", isCorrect: false },
        { id: "support", text: "Support the development", emoji: "🏗️", description: "Harms ecosystems", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How can you help conserve biodiversity?",
      options: [
        { id: "destroy", text: "Destroy habitats", emoji: "🪓", description: "Harms biodiversity", isCorrect: false },
        { id: "protect", text: "Protect natural habitats", emoji: "🦋", description: "Preserves species", isCorrect: true },
        { id: "ignore", text: "Do nothing", emoji: "🤷", description: "Action is needed", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What's the best approach to biodiversity conservation?",
      options: [
        { id: "develop", text: "Develop without limits", emoji: "🏗️", description: "Harms nature", isCorrect: false },
        { id: "stop", text: "Stop all development", emoji: "🚫", description: "Unrealistic", isCorrect: false },
        { id: "balance", text: "Balance development with conservation", emoji: "⚖️", description: "Sustainable approach", isCorrect: true }
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
      title="Biodiversity Conservation Story"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
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
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

export default BiodiversityConservationStory;

