import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const QuizSavingEnergy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "sustainability-kids-12";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
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
      const games = getSustainabilityKidsGames({});
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
      console.log(`🎮 Quiz on Saving Energy game completed! Score: ${finalScore}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, finalScore, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "What saves energy?",
      options: [
        { id: "a", text: "Turn off TV when not watching", emoji: "📺", description: "Saves electricity", isCorrect: true },
        { id: "b", text: "Leave all lights on", emoji: "💡", description: "Wastes energy", isCorrect: false },
        { id: "c", text: "Keep AC on all day", emoji: "❄️", description: "Uses lots of energy", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which helps save energy?",
      options: [
        { id: "b", text: "Leave everything plugged in", emoji: "⚡", description: "Uses energy", isCorrect: false },
        { id: "a", text: "Unplug devices when not using", emoji: "🔌", description: "Saves power", isCorrect: true },
        { id: "c", text: "Use all appliances at once", emoji: "🔋", description: "Wastes energy", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Why is saving energy important?",
      options: [
        { id: "b", text: "It doesn't matter", emoji: "😐", description: "Energy matters", isCorrect: false },
        { id: "c", text: "Makes more pollution", emoji: "🏭", description: "Saving reduces pollution", isCorrect: false },
        { id: "a", text: "Helps protect our planet", emoji: "🌍", description: "Reduces pollution", isCorrect: true }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (showResult) return;
    const newChoices = [...choices, option];
    setChoices(newChoices);
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setFinalScore(newChoices.filter(c => c.isCorrect).length);
        setShowResult(true);
        if (newChoices.filter(c => c.isCorrect).length === questions.length) {
          showAnswerConfetti();
        }
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/sustainability/kids/reflex-energy-saver");
  };

  return (
    <GameShell
      title="Quiz on Saving Energy"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}: Test your energy knowledge!` : "Quiz Complete!"}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={finalScore}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={questions.length}
      showConfetti={showResult && finalScore === questions.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      {!showResult ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {questions[currentQuestion].text}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{option.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{option.text}</div>
                      <div className="text-sm text-gray-300">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-white">Great job!</h3>
          <p className="text-gray-300">
            You got {finalScore} out of {questions.length} questions correct!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep saving energy! 🌍
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default QuizSavingEnergy;

