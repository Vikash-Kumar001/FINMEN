import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const QuizSustainableAgriculture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "sustainability-teens-22";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
      console.log(`🎮 Quiz on Sustainable Agriculture game completed! Score: ${finalScore}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      text: "What is sustainable agriculture?",
      options: [
        { id: "a", text: "Farming that protects environment", emoji: "🌾", description: "Eco-friendly farming", isCorrect: true },
        { id: "b", text: "Using lots of chemicals", emoji: "🧪", description: "Harms environment", isCorrect: false },
        { id: "c", text: "Ignoring soil health", emoji: "🌍", description: "Not sustainable", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How can farming be more sustainable?",
      options: [
        { id: "a", text: "Use only chemicals", emoji: "💊", description: "Harms soil", isCorrect: false },
        { id: "b", text: "Use organic methods and crop rotation", emoji: "🔄", description: "Maintains soil health", isCorrect: true },
        { id: "c", text: "Ignore water conservation", emoji: "💧", description: "Wastes resources", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What benefits does sustainable agriculture provide?",
      options: [
        { id: "a", text: "Only short-term profits", emoji: "💰", description: "Not sustainable", isCorrect: false },
        { id: "b", text: "Harms the environment", emoji: "🌍", description: "Opposite of sustainable", isCorrect: false },
        { id: "c", text: "Protects soil, water, and biodiversity", emoji: "🌱", description: "Long-term benefits", isCorrect: true }
      ]
    }
  ];

  const handleAnswer = (optionId, isCorrect) => {
    if (choices.find(c => c.questionId === questions[currentQuestion].id)) return;
    
    const newChoice = { questionId: questions[currentQuestion].id, optionId, isCorrect };
    setChoices([...choices, newChoice]);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setFinalScore(coins + (isCorrect ? 1 : 0));
        setShowResult(true);
      }
    }, 1000);
  };

  const currentQuestionData = questions[currentQuestion];
  const selectedChoice = choices.find(c => c.questionId === currentQuestionData?.id);

  return (
    <GameShell
      title="Quiz on Sustainable Agriculture"
      score={coins}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && finalScore >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <p className="text-white text-lg mb-6">{currentQuestionData.text}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id, option.isCorrect)}
                  disabled={!!selectedChoice}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedChoice?.optionId === option.id
                      ? option.isCorrect
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-red-500 to-pink-600"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  } text-white`}
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

export default QuizSustainableAgriculture;

