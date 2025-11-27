import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const questions = [
  {
    id: 1,
    question: "What's the best way to track your spending?",
    correctAnswer: "Record all expenses daily",
    options: [
      { 
        text: "Record all expenses daily", 
        isCorrect: true, 
        emoji: "📝" 
      },
      { 
        text: "Ignore small purchases", 
        isCorrect: false, 
        emoji: "🙈" 
      },
      { 
        text: "Only track monthly totals", 
        isCorrect: false, 
        emoji: "📊" 
      },
      { 
        text: "Guess your spending", 
        isCorrect: false, 
        emoji: "🎲" 
      }
    ],
    explanation: "Tracking daily expenses helps you understand where your money goes and stay within budget"
  },
  {
    id: 2,
    question: "How often should you check your budget?",
    correctAnswer: "Weekly or monthly",
    options: [
      { 
        text: "Never check it", 
        isCorrect: false, 
        emoji: "🚫" 
      },
      { 
        text: "Weekly or monthly", 
        isCorrect: true, 
        emoji: "📅" 
      },
      { 
        text: "Only when you run out of money", 
        isCorrect: false, 
        emoji: "💸" 
      },
      { 
        text: "Once a year", 
        isCorrect: false, 
        emoji: "📆" 
      }
    ],
    explanation: "Regular budget reviews help you stay on track and adjust spending as needed"
  },
  {
    id: 3,
    question: "What should you do with receipts?",
    correctAnswer: "Save them for tracking expenses",
    options: [
      { 
        text: "Throw them away immediately", 
        isCorrect: false, 
        emoji: "🗑️" 
      },
      { 
        text: "Only keep expensive receipts", 
        isCorrect: false, 
        emoji: "💎" 
      },
      { 
        text: "Save them for tracking expenses", 
        isCorrect: true, 
        emoji: "💼" 
      },
      { 
        text: "Give them to friends", 
        isCorrect: false, 
        emoji: "👥" 
      }
    ],
    explanation: "Saving receipts helps you verify expenses and track your spending accurately"
  },
  {
    id: 4,
    question: "What's the first step in planning expenses?",
    correctAnswer: "List all income sources",
    options: [
      { 
        text: "List all income sources", 
        isCorrect: true, 
        emoji: "💰" 
      },
      { 
        text: "Spend freely first", 
        isCorrect: false, 
        emoji: "🛍️" 
      },
      { 
        text: "Borrow money", 
        isCorrect: false, 
        emoji: "💳" 
      },
      { 
        text: "Ignore planning", 
        isCorrect: false, 
        emoji: "🙅" 
      }
    ],
    explanation: "Knowing your income is essential before planning how to allocate your money"
  },
  {
    id: 5,
    question: "When should you update your budget?",
    correctAnswer: "When income or expenses change",
    options: [
      { 
        text: "Never update it", 
        isCorrect: false, 
        emoji: "🚫" 
      },
      { 
        text: "Only at year end", 
        isCorrect: false, 
        emoji: "🎉" 
      },
      { 
        text: "When income or expenses change", 
        isCorrect: true, 
        emoji: "🔄" 
      },
      { 
        text: "When you feel like it", 
        isCorrect: false, 
        emoji: "😊" 
      }
    ],
    explanation: "Updating your budget when circumstances change keeps it relevant and useful"
  }
];

const ReflexBudgett = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-23");
  const gameId = gameData?.id || "finance-teens-23";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
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
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Reflex Budget Check"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="finance"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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
                {currentQuestionData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand budgeting well!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Regular budget tracking and planning help you manage your finances effectively!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to track expenses and review your budget regularly!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Budgeting involves tracking expenses, saving receipts, and regularly reviewing your financial plan.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexBudgett;