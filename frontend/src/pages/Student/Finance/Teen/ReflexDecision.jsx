import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexDecision = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-33");
  const gameId = gameData?.id || "finance-teens-33";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexDecision, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      question: "You have money. Should you pay fees or skip for gadgets?",
      options: [
        { 
          text: "Pay Fees", 
          isCorrect: true, 
          emoji: "💰",
          description: "Prioritize essential expenses"
        },
        { 
          text: "Skip for Gadgets", 
          isCorrect: false, 
          emoji: "🎮",
          description: "Not a smart financial choice"
        },
        { 
          text: "Save everything", 
          isCorrect: false, 
          emoji: "🏦",
          description: "Fees are still important to pay"
        },
        { 
          text: "Spend on both", 
          isCorrect: false, 
          emoji: "💸",
          description: "Prioritize needs first"
        }
      ]
    },
    {
      id: 2,
      question: "What should you do with extra money?",
      options: [
        { 
          text: "Buy Games", 
          isCorrect: false, 
          emoji: "🎮",
          description: "Not a priority"
        },
        { 
          text: "Save Money", 
          isCorrect: true, 
          emoji: "💰",
          description: "Build your savings"
        },
        { 
          text: "Spend immediately", 
          isCorrect: false, 
          emoji: "🛒",
          description: "Not a wise choice"
        },
        { 
          text: "Lend to friends", 
          isCorrect: false, 
          emoji: "👥",
          description: "Save first, then consider"
        }
      ]
    },
    {
      id: 3,
      question: "How should you manage your budget?",
      options: [
        { 
          text: "Track Budget", 
          isCorrect: true, 
          emoji: "📊",
          description: "Stay aware of your finances"
        },
        { 
          text: "Ignore Budget", 
          isCorrect: false, 
          emoji: "🙈",
          description: "Leads to overspending"
        },
        { 
          text: "Guess expenses", 
          isCorrect: false, 
          emoji: "🎲",
          description: "Not accurate"
        },
        { 
          text: "Track sometimes", 
          isCorrect: false, 
          emoji: "📅",
          description: "Consistency is key"
        }
      ]
    },
    {
      id: 4,
      question: "What's the priority when you have bills?",
      options: [
        { 
          text: "Spend on Party", 
          isCorrect: false, 
          emoji: "🎉",
          description: "Not essential"
        },
        { 
          text: "Pay Rent", 
          isCorrect: true, 
          emoji: "🏠",
          description: "Essential expense"
        },
        { 
          text: "Buy clothes", 
          isCorrect: false, 
          emoji: "👕",
          description: "Rent comes first"
        },
        { 
          text: "Save for later", 
          isCorrect: false, 
          emoji: "💵",
          description: "Pay bills first"
        }
      ]
    },
    {
      id: 5,
      question: "What should you do with money for education?",
      options: [
        { 
          text: "Buy Snacks", 
          isCorrect: false, 
          emoji: "🍕",
          description: "Not a priority"
        },
        { 
          text: "Save for Books", 
          isCorrect: true, 
          emoji: "📚",
          description: "Invest in education"
        },
        { 
          text: "Spend on entertainment", 
          isCorrect: false, 
          emoji: "🎬",
          description: "Education first"
        },
        { 
          text: "Give away", 
          isCorrect: false, 
          emoji: "🎁",
          description: "Use for education"
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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
      title="Reflex Decision"
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
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You make smart financial decisions quickly!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Quick decisions should prioritize needs over wants!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to prioritize essential expenses over wants!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always prioritize needs (fees, rent, savings) over wants (gadgets, games, parties).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexDecision;