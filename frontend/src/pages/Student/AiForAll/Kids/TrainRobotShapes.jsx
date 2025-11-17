import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrainRobotShapes = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, name: "Red Circle", emoji: "🔴", shape: "circle" },
    { id: 2, name: "Blue Triangle", emoji: "🔺", shape: "triangle" },
    { id: 3, name: "Green Circle", emoji: "🟢", shape: "circle" },
    { id: 4, name: "Yellow Triangle", emoji: "🔻", shape: "triangle" },
    { id: 5, name: "Purple Circle", emoji: "🟣", shape: "circle" }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (boxShape) => {
    const isCorrect = boxShape === currentItemData.shape;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(2, false);
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
    navigate("/student/ai-for-all/kids/feedback-matters-story"); // Update with actual next game path
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Train Robot Shapes"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-kids-70"
      gameType="ai"
      totalLevels={100}
      currentLevel={70}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Drag the item to the correct shape box!
            </h3>

            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-xl font-semibold text-center">{currentItemData.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("circle")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">⚪</div>
                <div className="text-white font-bold text-xl">Circle Box</div>
              </button>
              <button
                onClick={() => handleChoice("triangle")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🔺</div>
                <div className="text-white font-bold text-xl">Triangle Box</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🤖 Robot Learned Shapes!" : "💪 Keep Training!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You sorted {score} out of {items.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Robots learn from examples you provide. Sorting shapes helps the robot understand differences between circles and triangles!
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
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainRobotShapes;
