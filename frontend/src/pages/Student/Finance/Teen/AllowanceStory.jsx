import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AllowanceStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-11";
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
      text: "You receive ₹500 as weekly allowance. How should you manage it?",
      options: [
        { 
          id: "save", 
          text: "Keep for books", 
          emoji: "📚", 
          description: "Save the money for important educational expenses",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all on clothes", 
          emoji: "👕", 
          description: "Use the entire amount for new clothes",
          isCorrect: false
        },
        { 
          id: "waste", 
          text: "Waste it all", 
          emoji: "💸", 
          description: "Spend on unnecessary things",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You want to buy a ₹300 game but need ₹200 for school supplies. What's the smart choice?",
      options: [
        { 
          id: "spend", 
          text: "Buy the game", 
          emoji: "🎮", 
          description: "Buy the game because you really want it",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Buy supplies first", 
          emoji: "✏️", 
          description: "Prioritize necessary school supplies over entertainment",
          isCorrect: true
        },
        { 
          id: "waste", 
          text: "Buy both on credit", 
          emoji: "💳", 
          description: "Use credit to buy both items",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friends are buying expensive snacks every day. You can't afford that. What do you do?",
      options: [
        { 
          id: "spend", 
          text: "Buy expensive snacks", 
          emoji: "🍕", 
          description: "Buy the same expensive snacks to fit in",
          isCorrect: false
        },
        { 
          id: "waste", 
          text: "Borrow money", 
          emoji: "💸", 
          description: "Borrow money to buy expensive snacks",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Bring homemade snacks", 
          emoji: "🍱", 
          description: "Prepare your own snacks to save money",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You saved ₹400 but see a limited-time offer for a ₹600 item. What should you do?",
      options: [
        { 
          id: "save", 
          text: "Wait and save more", 
          emoji: "⏳", 
          description: "Wait until you have enough money to buy it without credit",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy with partial payment", 
          emoji: "💳", 
          description: "Buy it now and pay the remaining amount later with interest",
          isCorrect: false
        },
        { 
          id: "waste", 
          text: "Ignore savings", 
          emoji: "🚫", 
          description: "Don't think about saving more",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You get a ₹100 bonus for helping with chores. How should you use it?",
      options: [
        { 
          id: "waste", 
          text: "Waste it", 
          emoji: "💸", 
          description: "Spend on unnecessary things",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Add to savings", 
          emoji: "🏦", 
          description: "Put the bonus money into your savings account",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend on treats", 
          emoji: "🍭", 
          description: "Use the bonus money for immediate pleasures",
          isCorrect: false
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
      title="Allowance Story"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option, idx) => (
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You're learning smart financial decisions with your allowance!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of prioritizing needs over wants and saving your allowance!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember, saving some money from your allowance is important for your future!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that saves money for important needs and future goals.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AllowanceStory;