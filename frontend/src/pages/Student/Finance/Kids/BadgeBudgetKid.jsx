import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBudgetKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-30";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Budget Basics",
      question: "What is a budget?",
      options: [
        { 
          text: "A plan for how to spend your money", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          text: "A type of savings account", 
          emoji: "🏦", 
          isCorrect: false
        },
        { 
          text: "Money you get from parents", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "A shopping list", 
          emoji: "📋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! A budget helps you plan your spending wisely!",
        wrong: "A budget is a plan for how to spend your money!"
      }
    },
    {
      id: 2,
      title: "Budget Benefits",
      question: "Why is it important to make a budget?",
      options: [
        { 
          text: "To spend all your money quickly", 
          emoji: "💨", 
          isCorrect: false
        },
        { 
          text: "To track your money and avoid overspending", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          text: "To buy expensive things", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          text: "To hide money from parents", 
          emoji: "🔒", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Budgeting helps you manage money smartly!",
        wrong: "Budgeting helps you track money and avoid overspending!"
      }
    },
    {
      id: 3,
      title: "Money Math",
      question: "If you have ₹100 and want to save ₹30, how much can you spend?",
      options: [
        { 
          text: "₹100", 
          emoji: "1️⃣", 
          isCorrect: false
        },
        { 
          text: "₹130", 
          emoji: "3️⃣", 
          isCorrect: false
        },
        { 
          text: "₹30", 
          emoji: "3️⃣", 
          isCorrect: false
        },
        { 
          text: "₹70", 
          emoji: "7️⃣", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great math! ₹100 - ₹30 = ₹70 to spend!",
        wrong: "Subtract savings from total: ₹100 - ₹30 = ₹70!"
      }
    },
    {
      id: 4,
      title: "Budget Planning",
      question: "What should you do first when making a budget?",
      options: [
        { 
          text: "Spend all your money", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          text: "Buy everything you want", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "List your income and expenses", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          text: "Ask for more money", 
          emoji: "🤝", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Smart! Knowing your income and expenses is the first step!",
        wrong: "First, list what money you have (income) and what you need to spend (expenses)!"
      }
    },
    {
      id: 5,
      title: "Budget Success",
      question: "What is the best way to stick to your budget?",
      options: [
        { 
          text: "Track your spending and adjust when needed", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Ignore it and spend freely", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Spend more than planned", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          text: "Never save money", 
          emoji: "❌", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Tracking helps you stay on budget!",
        wrong: "Track your spending regularly and adjust your budget when needed!"
      }
    }
  ];

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const currentChallenge = challenges[challenge];
  const finalScore = score;

  return (
    <GameShell
      title="Badge: Budget Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}>
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
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
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Budget Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart budgeting decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Budget Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Budget Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to plan your spending, track your money, do budget math, 
                      and stick to your budget!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you manage your money wisely and reach your goals!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart budgeting decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, budgeting means planning your spending, tracking your money, 
                  and making thoughtful financial decisions.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeBudgetKid;
