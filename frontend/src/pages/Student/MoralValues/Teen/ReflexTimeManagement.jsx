import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexTimeManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const rounds = [
    { id: 1, action: "Plan Study", correct: true, emoji: "📖" },
    { id: 2, action: "Last-minute Panic", correct: false, emoji: "😱" },
    { id: 3, action: "Organize Notes", correct: true, emoji: "🗂️" },
    { id: 4, action: "Procrastinate", correct: false, emoji: "🛋️" },
    { id: 5, action: "Set Timetable", correct: true, emoji: "⏰" }
  ];

  const currentRoundData = rounds[currentRound];

  useEffect(() => {
    setButtonDisabled(false);
  }, [currentRound]);

  const handleTap = (isCorrect) => {
    if (buttonDisabled) return;

    setButtonDisabled(true);

    if (isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setScore(prev => prev + 3);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound(prev => prev + 1);
      setShowFeedback(false);
    } else {
      navigate("/student/moral-values/teen/puzzle-self-control");
    }
  };

  return (
    <GameShell
      title="Reflex: Time Management"
      subtitle={`Round ${currentRound + 1} of ${rounds.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentRound === rounds.length - 1}
      score={score}
      gameId="moral-teen-33"
      gameType="moral"
      totalLevels={100}
      currentLevel={33}
      showConfetti={showFeedback && currentRoundData.correct}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-6">{currentRoundData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Tap quickly for: {currentRoundData.action}
            </h2>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleTap(true)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white font-bold text-lg hover:opacity-90 transition"
              >
                ✅ Correct Action
              </button>
              <button
                onClick={() => handleTap(false)}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-bold text-lg hover:opacity-90 transition"
              >
                ❌ Wrong Action
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">{currentRoundData.correct ? "✅" : "⚠️"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentRoundData.correct ? "Well Done!" : "Oops!"}
            </h2>
            <p className="text-white/80 text-lg mb-6">
              {currentRoundData.correct
                ? `You chose the disciplined action: ${currentRoundData.action}!`
                : `Choosing ${currentRoundData.action} was not ideal. Remember, disciplined planning helps you succeed.`}
            </p>

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentRound < rounds.length - 1 ? "Next Round" : "Finish Game"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTimeManagement;
