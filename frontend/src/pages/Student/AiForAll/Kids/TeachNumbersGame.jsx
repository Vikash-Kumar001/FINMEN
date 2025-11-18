import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeachNumbersGame = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, symbol: "1️⃣", correct: 1 },
    { id: 2, symbol: "2️⃣", correct: 2 },
    { id: 3, symbol: "3️⃣", correct: 3 },
    { id: 4, symbol: "1️⃣", correct: 1 },
    { id: 5, symbol: "2️⃣", correct: 2 },
    { id: 6, symbol: "3️⃣", correct: 3 },
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 5);
      showCorrectAnswerFeedback(5, false);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, 300);
    } else {
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
    navigate("/student/ai-for-all/kids/robot-confusion-story"); // update your next path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Teach Numbers Game 🔢"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-kids-61"
      gameType="ai"
      totalLevels={100}
      currentLevel={61}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Label the number!
            </h3>

            <div className="bg-white/10 rounded-lg p-12 mb-6 flex justify-center items-center text-8xl">
              {currentItemData.symbol}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleChoice(num)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105 text-center"
                >
                  <div className="text-5xl mb-2">
                    {num === 1 ? "1️⃣" : num === 2 ? "2️⃣" : "3️⃣"}
                  </div>
                  <div className="text-white font-bold text-xl">{num}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Great Counting!" : "🔁 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You labeled {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                🤖 Robots learn counting when you label numbers correctly!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔄
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TeachNumbersGame;
