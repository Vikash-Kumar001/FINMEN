import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const QuizOnSustainableLiving = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-87";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
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
      console.log(`🎮 Quiz on Sustainable Living game completed! Score: ${finalScore}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
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
      text: "What is sustainable living?",
      options: [
        { id: "a", text: "Waste lots", emoji: "🗑️", isCorrect: false },
        { id: "b", text: "Use less, save more", emoji: "🌱", isCorrect: true },
        { id: "c", text: "Buy everything", emoji: "🛒", isCorrect: false },
        { id: "d", text: "Ignore the environment", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which is a sustainable practice?",
      options: [
        { id: "b", text: "Recycling paper", emoji: "📄", isCorrect: true },
        { id: "a", text: "Throwing away batteries", emoji: "🔋", isCorrect: false },
        { id: "c", text: "Leaving lights on", emoji: "💡", isCorrect: false },
        { id: "d", text: "Using plastic bags", emoji: "🛍️", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "How can you help the environment?",
      options: [
        { id: "a", text: "Use more water", emoji: "💧", isCorrect: false },
        { id: "c", text: "Drive everywhere", emoji: "🚗", isCorrect: false },
        { id: "d", text: "Litter", emoji: "🗑️", isCorrect: false },
        { id: "b", text: "Plant trees", emoji: "🌳", isCorrect: true },
      ]
    },
    {
      id: 4,
      text: "What is a sustainable way to travel?",
      options: [
        { id: "b", text: "Drive alone", emoji: "🚗", isCorrect: false },
        { id: "c", text: "Fly often", emoji: "✈️", isCorrect: false },
        { id: "a", text: "Walk or bike", emoji: "🚶", isCorrect: true },
        { id: "d", text: "Take taxis", emoji: "🚕", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Why is sustainable living important?",
      options: [
        { id: "a", text: "To waste resources", emoji: "❌", isCorrect: false },
        { id: "b", text: "To protect our planet", emoji: "🌍", isCorrect: true },
        { id: "c", text: "To ignore nature", emoji: "🙈", isCorrect: false },
        { id: "d", text: "To use more energy", emoji: "⚡", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        const score = choices.filter(choice => choice.isCorrect).length + (isCorrect ? 1 : 0);
        setFinalScore(score);
        setShowResult(true);
      }
    }, 1500);
  };

  const currentQuestionData = questions[currentQuestion];
  
  return (
    <GameShell
      title="Quiz on Sustainable Living"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={coins}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={questions.length}
      showConfetti={showResult && finalScore === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      {!showResult ? (
        <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">🌱</div>
              
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {currentQuestionData.text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrectOption = option.isCorrect;
                  let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
                  
                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = isCorrectOption 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg" 
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg";
                    } else if (isCorrectOption) {
                      buttonClass = "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg";
                    }
                  }
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !showFeedback && handleChoice(option.id)}
                      disabled={showFeedback}
                      className={buttonClass}
                    >
                      <div className="text-4xl mb-3">{option.emoji}</div>
                      <h4 className="font-bold text-base">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && (
                <div className={`rounded-lg p-5 mt-6 ${
                  questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white whitespace-pre-line">
                    {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                      ? "Great job! Sustainable living helps protect our planet! 🎉"
                      : "Not quite right. Sustainable living means using resources wisely to protect our environment!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-2xl font-bold text-white">Great job!</h3>
          <p className="text-gray-300">
            You got {finalScore} out of {questions.length} questions correct!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep learning about sustainable living! 🌍
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default QuizOnSustainableLiving;