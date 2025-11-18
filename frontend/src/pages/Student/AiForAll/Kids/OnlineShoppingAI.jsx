import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OnlineShoppingAI = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const items = [
    {
      id: 1,
      name: "You buy running shoes 👟. What will AI recommend next?",
      options: [
        "Sports socks 🧦",
        "Cooking pan 🍳",
        "Phone charger 🔌",
        "Painting brush 🎨"
      ],
      correct: "Sports socks 🧦",
    },
    {
      id: 2,
      name: "You search for school bags 🎒. What item is AI likely to show?",
      options: [
        "Pencil case ✏️",
        "Garden hose 🌿",
        "Car tires 🚗",
        "TV remote 📺"
      ],
      correct: "Pencil case ✏️",
    },
    {
      id: 3,
      name: "You order a mobile phone 📱. What suggestion makes the most sense?",
      options: [
        "Phone case 📔",
        "Flower pot 🌸",
        "Book 📖",
        "Chair 💺"
      ],
      correct: "Phone case 📔",
    },
    {
      id: 4,
      name: "You add a yoga mat 🧘‍♀️ to your cart. What will AI recommend?",
      options: [
        "Water bottle 💧",
        "Laptop 💻",
        "Cooking oil 🧴",
        "Earphones 🎧"
      ],
      correct: "Water bottle 💧",
    },
    {
      id: 5,
      name: "You browse winter jackets 🧥. What’s the best AI suggestion?",
      options: [
        "Woolen gloves 🧤",
        "Beach slippers 🩴",
        "Sunglasses 🕶️",
        "Raincoat ☔"
      ],
      correct: "Woolen gloves 🧤",
    },
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem((prev) => prev + 1);
      }, 500);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      if (finalScore >= 4) {
        setCoins(5);
      }
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/airport-scanner-story");
  };

  return (
    <GameShell
      title="Online Shopping AI"
      subtitle={`Question ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-kids-40"
      gameType="ai"
      totalLevels={100}
      currentLevel={40}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">🛒</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Choose the most logical AI shopping suggestion!
            </h3>

            <div className="bg-gray-800/50 rounded-xl p-8 mb-6">
              <p className="text-2xl text-white text-center">
                {currentItemData.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentItemData.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="bg-white/20 hover:bg-green-500/40 border border-white/40 rounded-xl p-4 text-white font-semibold text-lg transition-all hover:scale-105"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎉 Smart Shopper!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You chose correctly {score} out of {items.length} times!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 E-commerce AIs recommend related products based on your searches and preferences — making your shopping smarter!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>
            {score < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OnlineShoppingAI;
