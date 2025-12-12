import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getEheTeenGames } from "../../../../pages/Games/GameCategories/EHE/teenGamesData";

const QuizBusinessTerms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-22";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getEheTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : "/games/ehe/teens",
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: "/games/ehe/teens", nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What does ROI stand for?",
      emoji: "📊",
      options: [
        {
          id: "a",
          text: "Rate of Interest",
          emoji: "📈",
          description: "Rate of Interest refers to the cost of borrowing money, not ROI",
          isCorrect: false
        },
        {
          id: "b",
          text: "Return on Investment",
          emoji: "💰",
          description: "Correct! ROI measures the profitability of an investment",
          isCorrect: true
        },
        {
          id: "c",
          text: "Risk of Investing",
          emoji: "⚠️",
          description: "While risk is important, ROI specifically measures returns",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a budget?",
      emoji: " 예산",
      options: [
        {
          id: "a",
          text: "A plan for income and expenses",
          emoji: "📋",
          description: "Exactly! A budget forecasts and tracks financial inflows and outflows",
          isCorrect: true
        },
        {
          id: "b",
          text: "Unlimited spending",
          emoji: "💸",
          description: "A budget actually sets limits on spending to achieve financial goals",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only tracking expenses",
          emoji: "🔍",
          description: "Budgeting involves both income and expense planning, not just tracking",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What does profit mean?",
      emoji: "💵",
      options: [
        {
          id: "a",
          text: "Total revenue only",
          emoji: "📥",
          description: "Revenue is just one component of profit calculation",
          isCorrect: false
        },
        {
          id: "b",
          text: "Total expenses only",
          emoji: "📤",
          description: "Expenses are subtracted from revenue to calculate profit",
          isCorrect: false
        },
        {
          id: "c",
          text: "Revenue minus expenses",
          emoji: "✅",
          description: "Correct! Profit is what remains after deducting all costs from income",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What is cash flow?",
      emoji: "💱",
      options: [
        {
          id: "a",
          text: "Movement of money in and out",
          emoji: "🔄",
          description: "Perfect! Cash flow tracks the timing and amounts of money movements",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only incoming money",
          emoji: "📥",
          description: "Cash flow includes both inflows and outflows of cash",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only outgoing money",
          emoji: "📤",
          description: "Cash flow considers both receipts and payments, not just disbursements",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a liability?",
      emoji: "📜",
      options: [
        {
          id: "a",
          text: "Something you own",
          emoji: "🏠",
          description: "Assets are what you own, not liabilities",
          isCorrect: false
        },
        {
          id: "b",
          text: "Your income",
          emoji: "💳",
          description: "Income is money earned, not an obligation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Something you owe money on",
          emoji: "🧾",
          description: "Exactly! Liabilities are debts or obligations requiring future payment",
          isCorrect: true
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Quiz on Business Terms"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="ehe"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
              
              {answered && (
                <div className={`rounded-lg p-5 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white whitespace-pre-line">
                    {currentQuestionData.options.find(opt => opt.id === selectedOption)?.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizBusinessTerms;