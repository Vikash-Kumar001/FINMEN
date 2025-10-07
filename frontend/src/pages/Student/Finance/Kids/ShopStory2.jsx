import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShopStory2 = () => {
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
      text: "You see two pens in the store. One costs ₹50 and the other costs ₹15. Both work the same. Which should you buy?",
      options: [
        { 
          id: "affordable", 
          text: "Affordable pen", 
          emoji: "✏️", 
          description: "Buy the ₹15 pen that works just as well",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Costly pen", 
          emoji: "🖋️", 
          description: "Buy the ₹50 pen because it looks better",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have ₹100 to spend on clothes. You find a shirt you like for ₹80 and another similar one for ₹30. What's smart?",
      options: [
        { 
          id: "affordable", 
          text: "Buy cheaper shirt", 
          emoji: "👕", 
          description: "Save ₹50 by buying the ₹30 shirt",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy expensive shirt", 
          emoji: "👔", 
          description: "Spend more on the ₹80 shirt",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're buying snacks for a party. Brand A costs ₹200 and Brand B costs ₹120. Both have the same amount. Which?",
      options: [
        { 
          id: "affordable", 
          text: "Buy Brand B", 
          emoji: "🍪", 
          description: "Save ₹80 by choosing the cheaper brand",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy Brand A", 
          emoji: "🍫", 
          description: "Spend more on the expensive brand",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You need a backpack for school. One costs ₹800 and another costs ₹400. Both are good quality. What's wise?",
      options: [
        { 
          id: "affordable", 
          text: "Buy ₹400 backpack", 
          emoji: "🎒", 
          description: "Save ₹400 by choosing the affordable option",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy ₹800 backpack", 
          emoji: "💼", 
          description: "Spend more on the expensive backpack",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You're buying groceries. Organic vegetables cost ₹300 and regular ones cost ₹150. Both are nutritious. Which?",
      options: [
        { 
          id: "affordable", 
          text: "Buy regular veggies", 
          emoji: "🥕", 
          description: "Save ₹150 by choosing regular vegetables",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy organic veggies", 
          emoji: "🥦", 
          description: "Spend more on organic vegetables",
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
    navigate("/student/finance/kids/poster-smart-shopping");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Shop Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="finance-kids-shop-story-2"
      gameType="finance"
      totalLevels={10}
      currentLevel={5}
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
                <h3 className="text-2xl font-bold text-white mb-4">Smart Shopping!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You're learning to make smart purchasing decisions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand that choosing affordable options when quality is similar is a smart financial habit!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, buying affordable items with similar quality saves money!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that saves money while still meeting your needs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShopStory2;