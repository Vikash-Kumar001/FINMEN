import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AiBasicsBadge = () => {
  const navigate = useNavigate();
  const [completedGames, setCompletedGames] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const totalGames = 10;

  const handleCompleteGame = () => {
    const newCompleted = completedGames + 1;
    setCompletedGames(newCompleted);

    if (newCompleted >= totalGames) {
      setCoins(20);
      setShowBadge(true);
      showCorrectAnswerFeedback(20, true);
    } else {
      flashPoints(1); // Small feedback for each completed game
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teens/smart-maps-story"); // Update next game path
  };

  const handleReset = () => {
    setCompletedGames(0);
    setCoins(0);
    setShowBadge(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="AI Basics Badge 🏆"
      subtitle={`Completed ${completedGames} of ${totalGames} AI basics games`}
      onNext={handleNext}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="ai-teen-25"
      gameType="achievement"
      totalLevels={20}
      currentLevel={25}
      showConfetti={showBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8 text-center">
        {!showBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-2xl font-bold mb-4">
              Complete {totalGames} AI basics games to unlock your badge! 🎮
            </h3>
            <p className="text-white/90 mb-6">
              You have completed {completedGames} out of {totalGames} ✅
            </p>
            <button
              onClick={handleCompleteGame}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Complete a Game 🎯
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Congratulations! 🎉
            </h2>
            <p className="text-white text-xl mb-4">
              You completed {totalGames} AI basics games and unlocked the badge:
            </p>
            <div className="bg-yellow-400/30 rounded-lg p-4 mb-4 flex items-center justify-center gap-2">
              <span className="text-3xl">🤖</span>
              <p className="text-black font-bold text-2xl">AI Beginner</p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 20 Coins! 🪙
            </p>
            <button
              onClick={handleReset}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Reset Badge Progress 🔄
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AiBasicsBadge;
