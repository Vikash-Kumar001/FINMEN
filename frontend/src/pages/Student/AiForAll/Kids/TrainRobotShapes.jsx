import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TrainRobotShapes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-70");
  const gameId = gameData?.id || "ai-kids-70";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
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
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, isCorrect ? 1000 : 300);
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
    navigate("/student/ai-for-all/kids/feedback-matters-story");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Train Robot Shapes"
      score={coins}
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId={gameId}
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

            <div className="bg-white/10 rounded-lg p-12 mb-6 flex justify-center items-center">
              <div className="text-8xl">{currentItemData.emoji}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("circle")}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">⚪</div>
                <div className="text-white font-bold text-xl">Circle Box</div>
              </button>
              <button
                onClick={() => handleChoice("triangle")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🔺</div>
                <div className="text-white font-bold text-xl">Triangle Box</div>
              </button>
            </div>
            
            <div className="mt-6 bg-blue-500/20 rounded-lg p-4">
              <p className="text-white/90 text-sm text-center">
                💡 By sorting shapes correctly, you're teaching robots to recognize different geometric forms!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Robot Learned Shapes!
                </h2>
                <p className="text-white/90 text-xl mb-4">
                  You sorted {score} out of {items.length} correctly! ({accuracy}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    🌟 Teaching robots requires lots of correctly sorted examples. You're helping robots understand geometry!
                  </p>
                </div>
                <p className="text-white/80">
                  Each correct sort helps robots get better at recognizing shapes.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Keep Practicing!
                </h2>
                <p className="text-white/90 text-xl mb-4">
                  You sorted {score} out of {items.length} correctly. ({accuracy}%)
                </p>
                <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    💡 Robots need thousands of correctly sorted examples to learn properly. Every correct sort counts!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm mt-4">
                  Look carefully at each shape and think about whether it's a circle or triangle before selecting.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainRobotShapes;