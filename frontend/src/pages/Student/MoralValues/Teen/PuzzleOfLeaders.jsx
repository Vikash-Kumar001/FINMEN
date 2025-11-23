import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfLeaders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const matches = [
    { id: 1, leader: "Mahatma Gandhi", correctValue: "Non-violence and truth" },
    { id: 2, leader: "Mother Teresa", correctValue: "Service and compassion" },
    { id: 3, leader: "Dr. A.P.J. Abdul Kalam", correctValue: "Vision and hard work" },
    { id: 4, leader: "Nelson Mandela", correctValue: "Forgiveness and equality" },
    { id: 5, leader: "Martin Luther King Jr.", correctValue: "Peace and justice" },
  ];

  const options = [
    "Non-violence and truth",
    "Service and compassion",
    "Vision and hard work",
    "Forgiveness and equality",
    "Peace and justice",
  ];

  const handleAnswer = (option) => {
    const current = matches[currentIndex];
    if (option === current.correctValue) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // move to next question or show result
    if (currentIndex + 1 < matches.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/community-story");
  };

  return (
    <GameShell
      title="Puzzle of Leaders"
      subtitle="Match Great Leaders with Their Core Values"
      onNext={handleNext}
      nextEnabled={showResult && score === matches.length}
      showGameOver={showResult && score === matches.length}
      score={score}
      gameId="moral-teen-74"
      gameType="moral"
      totalLevels={100}
      currentLevel={74}
      showConfetti={showResult && score === matches.length}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center transition-all duration-500 max-w-xl mx-auto">
            <div className="text-7xl mb-4">👑</div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {matches[currentIndex].leader}
            </h2>
            <p className="text-white/70 mb-6">
              Choose the core value that best matches this leader:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="bg-blue-500/20 hover:bg-blue-500/40 text-white rounded-xl px-4 py-3 font-semibold transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>

            <p className="text-white/50 mt-6 text-sm">
              Question {currentIndex + 1} of {matches.length}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {score === matches.length ? "🌟 Brilliant!" : "Good Effort!"}
            </h2>

            {score === matches.length ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Excellent! You matched all great leaders with their values perfectly. True leadership shines through peace, service, forgiveness, and vision.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Nice try! Review each leader’s guiding principle — then try again to master them all!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfLeaders;
