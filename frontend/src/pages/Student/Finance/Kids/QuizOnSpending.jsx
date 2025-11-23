import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSpending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What is the best spending habit?",
      options: [
        { 
          id: "a", 
          text: "Buy without thinking", 
          emoji: "💸", 
          description: "Purchase things immediately when you want them",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Compare and choose", 
          emoji: "🤔", 
          description: "Look at different options and choose the best one",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Borrow for fun", 
          emoji: "💳", 
          description: "Use credit to buy things you want",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which is a smart way to spend money?",
      options: [
        { 
          id: "a", 
          text: "Spend all at once", 
          emoji: "🛍️", 
          description: "Use all your money on one big purchase",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Budget first", 
          emoji: "📋", 
          description: "Plan what you'll spend before buying",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Buy what's popular", 
          emoji: "🔥", 
          description: "Buy things just because others have them",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do before a big purchase?",
      options: [
        { 
          id: "a", 
          text: "Save up first", 
          emoji: "🏦", 
          description: "Set aside money over time for the purchase",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Buy on credit", 
          emoji: "💳", 
          description: "Use a credit card even if you can't pay immediately",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask friends", 
          emoji: "👥", 
          description: "Buy what your friends think you should buy",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which spending habit helps you in the future?",
      options: [
        { 
          id: "a", 
          text: "Spend on wants", 
          emoji: "🎯", 
          description: "Buy things you want right now",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Save for needs", 
          emoji: "💰", 
          description: "Set money aside for important future needs",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Buy expensive items", 
          emoji: "💎", 
          description: "Always choose the most expensive options",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the smartest approach to shopping?",
      options: [
        { 
          id: "a", 
          text: "Impulse buying", 
          emoji: "⚡", 
          description: "Buy things immediately when you see them",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Make a list", 
          emoji: "📝", 
          description: "Plan what you need before going shopping",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Follow trends", 
          emoji: "📈", 
          description: "Buy what's currently popular",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/kids/reflex-spending");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Spending"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
       // Use finalScore (number of correct answers) as score
      gameId="finance-kids-12"
      gameType="finance"
      totalLevels={questions.length}
      maxScore={questions.length} // Max score is total number of questions (all correct)
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You know how to make smart spending choices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of comparing options and planning before spending!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
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

export default QuizOnSpending;