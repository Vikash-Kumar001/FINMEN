import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SpendingQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-12";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is the smartest spending approach?",
      options: [
        { 
          id: "a", 
          text: "Comparing price + quality", 
          emoji: "🔍", 
          description: "Researching and choosing the best value for money",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Buying branded shoes always", 
          emoji: "👟", 
          description: "Always choosing branded items regardless of need or price",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Buying whatever is cheap", 
          emoji: "💰", 
          description: "Choosing only the cheapest option without considering quality",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do before making a big purchase?",
      options: [
        { 
          id: "a", 
          text: "Buy immediately", 
          emoji: "🛒", 
          description: "Purchase right away to avoid missing out",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Research and compare", 
          emoji: "📚", 
          description: "Research options, compare prices, and read reviews",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask friends only", 
          emoji: "👥", 
          description: "Only ask friends for advice without researching yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which spending habit helps build wealth?",
      options: [
        { 
          id: "a", 
          text: "Impulse buying", 
          emoji: "⚡", 
          description: "Making spontaneous purchases without planning",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Keeping up with trends", 
          emoji: "📈", 
          description: "Buying what's popular to fit in with others",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Budgeting first", 
          emoji: "📋", 
          description: "Creating a budget and sticking to it before spending",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What's the best approach to shopping lists?",
      options: [
        { 
          id: "a", 
          text: "Stick to the list", 
          emoji: "✅", 
          description: "Follow your planned list to avoid unnecessary purchases",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Buy what looks good", 
          emoji: "👀", 
          description: "Purchase items that catch your eye even if not planned",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Forget the list", 
          emoji: "🗑️", 
          description: "Ignore your shopping list and buy whatever you want",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should you handle sales and discounts?",
      options: [
        { 
          id: "a", 
          text: "Buy everything on sale", 
          emoji: "🎉", 
          description: "Purchase all discounted items even if you don't need them",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ignore all sales", 
          emoji: "🚫", 
          description: "Never take advantage of sales or discounts",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Buy only needed items", 
          emoji: "🎯", 
          description: "Purchase discounted items only if you actually need them",
          isCorrect: true
        }
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
      title="Spending Quiz"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
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
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {currentQuestionData.options.map((option, idx) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">{option.emoji}</div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                        <p className="text-white/90">{option.description}</p>
                      </div>
                    </div>
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
                <h3 className="text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You know how to make smart spending choices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of comparing options, budgeting, and making thoughtful purchases!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember, smart spending means thinking before you buy!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that involves planning and comparing before spending.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpendingQuiz;