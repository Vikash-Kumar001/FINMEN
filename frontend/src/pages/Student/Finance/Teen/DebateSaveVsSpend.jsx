import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateSaveVsSpend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-6";
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
      text: "Is it better to save money or spend all of it?",
      options: [
        { 
          id: "save", 
          text: "Save money", 
          emoji: "💰", 
          description: "Saving provides financial security and helps achieve future goals",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all", 
          emoji: "🛍️", 
          description: "Spending brings immediate happiness and satisfaction",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should teenagers focus on saving or enjoying their money now?",
      options: [
        { 
          id: "save", 
          text: "Focus on saving", 
          emoji: "🏦", 
          description: "Building saving habits early leads to financial success later",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Enjoy now", 
          emoji: "🎉", 
          description: "You're young, so enjoy your money while you can",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When you get a bonus or extra money, what should you do?",
      options: [
        { 
          id: "save", 
          text: "Save most of it", 
          emoji: "📈", 
          description: "Save the majority and use a small portion for rewards",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend it all", 
          emoji: "💸", 
          description: "Treat yourself since you didn't expect the extra money",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Is it better to buy expensive branded items or affordable quality items?",
      options: [
        { 
          id: "save", 
          text: "Choose quality over brand", 
          emoji: "🎯", 
          description: "Focus on value and quality rather than brand names",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy branded items", 
          emoji: "💎", 
          description: "Branded items show status and are usually better quality",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should you use credit cards to buy things you can't afford?",
      options: [
        { 
          id: "save", 
          text: "No, avoid debt", 
          emoji: "🛡️", 
          description: "Only buy what you can afford to pay for immediately",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Yes, use credit", 
          emoji: "💳", 
          description: "Credit cards allow you to buy what you want now",
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
      setCoins(prev => prev + 2); // More coins for debate questions
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/finance/teen/journal-of-saving-goal");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Save vs Spend"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp} // Pass if 3 or more correct
      showGameOver={showResult && finalScore >= 3}
      
      gameId="finance-teens-6"
      gameType="finance"
      totalLevels={20}
      currentLevel={6}
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Debate Skills!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the importance of saving over spending!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You know that saving money provides financial security and helps achieve future goals!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, saving money is important for your financial future!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that emphasizes the long-term benefits of saving.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateSaveVsSpend;