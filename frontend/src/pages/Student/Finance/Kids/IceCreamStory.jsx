import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const IceCreamStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-11";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You have ₹10. You see an ice cream shop. Do you spend on ice cream now or save for a toy you want?",
      options: [
        { 
          id: "save", 
          text: "Save for toy", 
          emoji: "🧸", 
          description: "Save your money for the toy you really want",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy ice cream", 
          emoji: "🍦", 
          description: "Spend money on ice cream right now",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend bought an expensive ice cream and is enjoying it. You only have ₹5. What do you do?",
      options: [
        { 
          id: "save", 
          text: "Save for bigger goal", 
          emoji: "🎯", 
          description: "Keep saving for something more important",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy small treat", 
          emoji: "🍭", 
          description: "Buy a small treat for yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You planned to save ₹50 for a new book, but see a 'Buy 1 Get 1 Free' ice cream offer. What's smart?",
      options: [
        { 
          id: "save", 
          text: "Stick to savings plan", 
          emoji: "📚", 
          description: "Continue saving for your book",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Take the offer", 
          emoji: "🍦", 
          description: "Buy ice cream because it's a good deal",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You've saved ₹30 for a bicycle. Your sibling offers to share their ice cream if you buy some. What do you choose?",
      options: [
        { 
          id: "save", 
          text: "Focus on bicycle", 
          emoji: "🚲", 
          description: "Keep working toward your bicycle goal",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Share treat", 
          emoji: "🍦", 
          description: "Spend ₹10 to share ice cream with sibling",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "It's a hot day and everyone is eating ice cream. You have ₹15 saved. What's the wisest choice?",
      options: [
        { 
          id: "save", 
          text: "Save for later", 
          emoji: "💰", 
          description: "Save your money for something more important",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Cool off now", 
          emoji: "🍦", 
          description: "Buy ice cream to cool off from the heat",
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
    navigate("/student/finance/kids/quiz-on-spending");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Ice Cream Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
       // Use finalScore (number of correct answers) as score
      gameId="finance-kids-11"
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
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You're learning to make smart spending choices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You correctly chose to save money instead of spending on treats. That's a smart habit!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, sometimes it's better to save for bigger goals!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that saves money for more important things.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IceCreamStory;