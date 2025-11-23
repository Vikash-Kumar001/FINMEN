import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CandyOfferStory = () => {
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
      text: "A shop offers 'Buy 1, Get 1 Free' candy. You don't really need more candy. What should you do?",
      options: [
        { 
          id: "need", 
          text: "Don't buy", 
          emoji: "🙅", 
          description: "Don't buy because you don't need extra candy",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy anyway", 
          emoji: "🙋", 
          description: "Buy because it's a good deal",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A 'Buy 2, Get 1 Free' offer on toys. You already have many toys. What's smart?",
      options: [
        { 
          id: "need", 
          text: "Skip the offer", 
          emoji: "⏭️", 
          description: "Don't buy because you have enough toys",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Take the deal", 
          emoji: "🛒", 
          description: "Buy because you're getting a free item",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A '3 for the price of 2' deal on snacks. You just bought snacks yesterday. What should you do?",
      options: [
        { 
          id: "need", 
          text: "Wait until needed", 
          emoji: "⏳", 
          description: "Wait until you need more snacks",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy now", 
          emoji: "😋", 
          description: "Buy because it's a savings opportunity",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A 'Buy 1, Get 1 Half Off' deal on books. You need one book for school. What's wise?",
      options: [
        { 
          id: "need", 
          text: "Buy just one", 
          emoji: "📚", 
          description: "Buy only the book you need",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy two", 
          emoji: "📖", 
          description: "Buy two to get the discount",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A 'Buy 3, Get 50% Off' deal on clothes. You have enough clothes. What should you choose?",
      options: [
        { 
          id: "need", 
          text: "Pass on deal", 
          emoji: "CloseOperation", 
          description: "Don't buy because you don't need more clothes",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Take advantage", 
          emoji: "👗", 
          description: "Buy because it's a big discount",
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
    navigate("/student/finance/kids/reflex-needs-first");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Candy Offer Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
       // Use finalScore (number of correct answers) as score
      gameId="finance-kids-18"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🍬</div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Decision Maker!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand when to pass on deals that aren't necessary!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You know that good deals aren't always good if you don't need the items!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, just because something is on sale doesn't mean you should buy it!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that considers whether you actually need the item.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CandyOfferStory;