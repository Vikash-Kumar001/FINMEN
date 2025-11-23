import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpendingQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is the smartest spending approach?",
      options: [
        { 
          id: "a", 
          text: "Buying branded shoes always", 
          emoji: "👟", 
          description: "Always choosing branded items regardless of need or price",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Comparing price + quality", 
          emoji: "🔍", 
          description: "Researching and choosing the best value for money",
          isCorrect: true
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
          text: "Budgeting first", 
          emoji: "📋", 
          description: "Creating a budget and sticking to it before spending",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Keeping up with trends", 
          emoji: "📈", 
          description: "Buying what's popular to fit in with others",
          isCorrect: false
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
          text: "Buy only needed items", 
          emoji: "🎯", 
          description: "Purchase discounted items only if you actually need them",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore all sales", 
          emoji: "🚫", 
          description: "Never take advantage of sales or discounts",
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
    navigate("/student/finance/teen/reflex-wise-choices");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Spending Quiz"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      
      gameId="finance-teens-12"
      gameType="finance"
      totalLevels={20}
      currentLevel={12}
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
                  You understand the importance of comparing options, budgeting, and making thoughtful purchases!
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

export default SpendingQuiz;