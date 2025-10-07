import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PiggyBankStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You received ₹10 as a gift from your grandmother. What would you like to do?",
      options: [
        { 
          id: "save", 
          text: "Save ₹5", 
          emoji: "💰", 
          description: "Put ₹5 in your piggy bank for later",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend All", 
          emoji: "🛍️", 
          description: "Buy toys and treats right now",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have ₹20 saved up. Your friend invites you to the movies which costs ₹15. What do you do?",
      options: [
        { 
          id: "save", 
          text: "Save for Later", 
          emoji: "🏦", 
          description: "Keep saving for something bigger",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Go to Movies", 
          emoji: "🎬", 
          description: "Spend ₹15 on the movie",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You found ₹5 on the street. What's the best thing to do with it?",
      options: [
        { 
          id: "save", 
          text: "Save It", 
          emoji: "🫙", 
          description: "Add it to your savings",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy Candy", 
          emoji: "🍬", 
          description: "Buy sweets from the shop",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your birthday is coming up and you want a new bicycle that costs ₹500. You currently have ₹200. What should you do?",
      options: [
        { 
          id: "save", 
          text: "Save More", 
          emoji: "📈", 
          description: "Keep saving ₹50 each month",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy Now", 
          emoji: "🛒", 
          description: "Ask parents to buy it now",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You have ₹30 saved and see a toy you really want for ₹25. What's the smart choice?",
      options: [
        { 
          id: "save", 
          text: "Save for Bigger", 
          emoji: "🎯", 
          description: "Save for something more expensive",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy the Toy", 
          emoji: "🧸", 
          description: "Buy the toy you want now",
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
    navigate("/student/finance/kids/quiz-on-saving");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Piggy Bank Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="finance-kids-piggy-bank-story"
      gameType="finance"
      totalLevels={10}
      currentLevel={1}
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
                  You're learning smart financial decisions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You correctly chose to save money in most situations. That's a smart habit!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, saving some money for later is usually a smart choice!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that saves money for later in most situations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PiggyBankStory;