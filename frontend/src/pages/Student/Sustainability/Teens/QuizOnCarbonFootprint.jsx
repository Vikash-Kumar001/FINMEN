import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const QuizOnCarbonFootprint = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-2");
  const gameId = gameData?.id || "sustainability-teens-2";
  
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for QuizOnCarbonFootprint, using fallback ID");
  }
  
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
      console.log(`🎮 Quiz on Carbon Footprint game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      text: "What is a carbon footprint?",
      options: [
        { id: "a", text: "The size of your shoe", emoji: "👟", description: "Not related to shoes", isCorrect: false },
        { id: "b", text: "Total greenhouse gases you produce", emoji: "🌍", description: "Measures your environmental impact", isCorrect: true },
        { id: "c", text: "The weather forecast", emoji: "🌤️", description: "Not about weather", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which activity has the highest carbon footprint?",
      options: [
        { id: "a", text: "Riding a bicycle", emoji: "🚲", description: "Bikes have zero emissions", isCorrect: false },
        { id: "b", text: "Walking", emoji: "🚶", description: "Walking has no emissions", isCorrect: false },
        { id: "c", text: "Flying in a plane", emoji: "✈️", description: "Air travel emits a lot of CO2", isCorrect: true }
      ]
    },
    {
      id: 3,
      text: "How can you reduce your carbon footprint?",
      options: [
        { id: "a", text: "Use public transport", emoji: "🚌", description: "Reduces individual emissions", isCorrect: true },
        { id: "b", text: "Eat more meat", emoji: "🥩", description: "Meat production has high emissions", isCorrect: false },
        { id: "c", text: "Drive alone everywhere", emoji: "🚗", description: "Increases emissions", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "What is the main greenhouse gas?",
      options: [
        { id: "a", text: "Carbon dioxide (CO2)", emoji: "🌫️", description: "CO2 is the primary greenhouse gas", isCorrect: true },
        { id: "b", text: "Oxygen", emoji: "💨", description: "Oxygen is not a greenhouse gas", isCorrect: false },
        { id: "c", text: "Nitrogen", emoji: "💨", description: "Nitrogen is not a greenhouse gas", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Which energy source has the lowest carbon footprint?",
      options: [
        { id: "a", text: "Coal", emoji: "⛽", description: "Coal has very high emissions", isCorrect: false },
        { id: "b", text: "Natural gas", emoji: "🔥", description: "Still produces emissions", isCorrect: false },
        { id: "c", text: "Solar power", emoji: "☀️", description: "Renewable energy has low emissions", isCorrect: true }
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
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Carbon Footprint"
      score={score}
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
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
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
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizOnCarbonFootprint;

