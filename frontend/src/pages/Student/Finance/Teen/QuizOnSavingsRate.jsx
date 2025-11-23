import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSavingsRate = () => {
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
      text: "If you earn ₹1000 and save ₹200, what percentage are you saving?",
      options: [
        { 
          id: "a", 
          text: "10%", 
          emoji: "🔢", 
          description: "10% of ₹1000 is ₹100",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "20%", 
          emoji: "📈", 
          description: "20% of ₹1000 is ₹200",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "25%", 
          emoji: "📊", 
          description: "25% of ₹1000 is ₹250",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "If you want to save 15% of ₹2000, how much should you save?",
      options: [
        { 
          id: "a", 
          text: "₹200", 
          emoji: "💰", 
          description: "10% of ₹2000 is ₹200",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "₹300", 
          emoji: "🏦", 
          description: "15% of ₹2000 is ₹300",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "₹400", 
          emoji: "💵", 
          description: "20% of ₹2000 is ₹400",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What percentage is saved if you earn ₹5000 and spend ₹4000?",
      options: [
        { 
          id: "a", 
          text: "10%", 
          emoji: "📉", 
          description: "You saved ₹1000 out of ₹5000, which is 20%",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "20%", 
          emoji: "✅", 
          description: "You saved ₹1000 out of ₹5000, which is 20%",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "25%", 
          emoji: "🎯", 
          description: "You saved ₹1000 out of ₹5000, which is 20%",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "If your savings rate is 25% and you save ₹500, how much do you earn?",
      options: [
        { 
          id: "a", 
          text: "₹1000", 
          emoji: "🧮", 
          description: "25% of ₹1000 is ₹250, not ₹500",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "₹2000", 
          emoji: "🧮", 
          description: "25% of ₹2000 is ₹500",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "₹2500", 
          emoji: "🧮", 
          description: "25% of ₹2500 is ₹625, not ₹500",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which savings rate is the most sustainable for long-term financial health?",
      options: [
        { 
          id: "a", 
          text: "5%", 
          emoji: "🐌", 
          description: "Too low for building substantial savings",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "20%", 
          emoji: "⚖️", 
          description: "A balanced rate that allows for both current needs and future savings",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "50%", 
          emoji: "⚠️", 
          description: "Too high, may affect your current quality of life",
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
    navigate("/student/finance/teen/reflex-smart-saver");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Savings Rate"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      
      gameId="finance-teens-2"
      gameType="finance"
      totalLevels={20}
      currentLevel={2}
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
                  You know how to calculate savings percentages!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of calculating and maintaining a healthy savings rate!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, saving a consistent percentage of your income is key to financial health!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to calculate the percentage of income that is being saved in each scenario.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnSavingsRate;