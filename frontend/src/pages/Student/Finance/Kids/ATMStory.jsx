import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, CreditCard, PiggyBank, Wallet, ShoppingCart, Coins } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ATMStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const levels = [
    {
      id: 1,
      title: "ATM Card Discovery",
      question: "Your parent shows you their ATM card. What should you do?",
      icon: CreditCard,
      options: [
        { text: "Learn how it works", correct: true, coins: 5 },
        { text: "Ignore it", correct: false, coins: 0 },
        { text: "Play with it", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Learning about money management is important!",
        wrong: "Always show interest in learning about money!"
      }
    },
    {
      id: 2,
      title: "PIN Code Safety",
      question: "Your parent is entering their PIN at the ATM. What should you do?",
      icon: Wallet,
      options: [
        { text: "Look away to give privacy", correct: true, coins: 10 },
        { text: "Try to memorize the PIN", correct: false, coins: 0 },
        { text: "Tell friends about it", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! PIN codes should always be kept private!",
        wrong: "PINs are secret and should never be shared or watched!"
      }
    },
    {
      id: 3,
      title: "Saving Money",
      question: "You have 100 rupees. What's the smartest choice?",
      icon: PiggyBank,
      options: [
        { text: "Save 50 rupees, spend 50", correct: true, coins: 15 },
        { text: "Spend all on toys", correct: false, coins: 0 },
        { text: "Give all to friends", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Saving money helps you buy bigger things later!",
        wrong: "Saving some money is always a smart idea!"
      }
    },
    {
      id: 4,
      title: "Smart Shopping",
      question: "You want to buy a toy that costs 200 rupees but you have 150. What should you do?",
      icon: ShoppingCart,
      options: [
        { text: "Save more money first", correct: true, coins: 20 },
        { text: "Borrow from friends", correct: false, coins: 0 },
        { text: "Demand it from parents", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Smart thinking! Patience and saving helps you achieve your goals!",
        wrong: "Saving up and waiting is better than borrowing!"
      }
    },
    {
      id: 5,
      title: "Money Values",
      question: "Your friend lost their lunch money. What should you do?",
      icon: Coins,
      options: [
        { text: "Share your lunch with them", correct: true, coins: 25 },
        { text: "Ignore them", correct: false, coins: 0 },
        { text: "Laugh at them", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! Helping others is the best use of money!",
        wrong: "Kindness and helping others is more valuable than money!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setAnswered(true);
    
    if (option.correct) {
      setTotalCoins(totalCoins + option.coins);
      showCorrectAnswerFeedback(option.coins, true);
    }
  };

  const handleNext = () => {
    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      navigate("/games/financial-literacy/kids");
    }
  };

  return (
    <GameShell
      title={`Question ${currentLevel} – ${currentLevelData.title}`}
      subtitle={currentLevelData.question}
      coins={totalCoins}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      showConfetti={answered && selectedAnswer?.correct}
      score={totalCoins}
      gameId="finance-kids-88"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        <div className="flex justify-center mb-6">
          <Icon className="w-24 h-24 text-yellow-400 animate-pulse" />
        </div>

        {!answered ? (
          <div className="space-y-4">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform hover:shadow-lg"
              >
                {option.text}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-2xl border-2 mt-4 ${
            selectedAnswer.correct 
              ? 'bg-green-500/20 border-green-400' 
              : 'bg-red-500/20 border-red-400'
          }`}>
            <Trophy className={`mx-auto w-16 h-16 mb-3 ${
              selectedAnswer.correct ? 'text-yellow-400' : 'text-gray-400'
            }`} />
            <h3 className="text-2xl font-bold mb-2">
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins!` : 'Try Better Next Time!'}
            </h3>
            <p className="text-white/90 text-lg">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {currentLevel === 5 && selectedAnswer.correct && (
              <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-400">
                <p className="text-xl font-bold text-yellow-300">
                  🎉 Game Complete! Total Coins: {totalCoins} 🎉
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`w-3 h-3 rounded-full ${
                level.id < currentLevel
                  ? 'bg-green-400'
                  : level.id === currentLevel
                  ? 'bg-yellow-400 animate-pulse'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
};

export default ATMStory;