import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotHelperOrVillain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // Game scenarios
  const actions = [
    { id: 1, emoji: "🤖", situation: "An old man drops his stick.", good: "Help old man", bad: "Steal phone", correct: "Help old man" },
    { id: 2, emoji: "🤖", situation: "Robot sees a lost wallet.", good: "Return it", bad: "Keep it", correct: "Return it" },
    { id: 3, emoji: "🤖", situation: "Kid falls down.", good: "Help kid", bad: "Laugh", correct: "Help kid" },
    { id: 4, emoji: "🤖", situation: "Robot finds a phone on road.", good: "Give to owner", bad: "Steal phone", correct: "Give to owner" },
    { id: 5, emoji: "🤖", situation: "Someone needs directions.", good: "Guide them", bad: "Ignore", correct: "Guide them" },
  ];

  const currentAction = actions[currentScenario];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentAction.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 2);
      showCorrectAnswerFeedback(2, false);
    }

    if (currentScenario < actions.length - 1) {
      setTimeout(() => {
        setCurrentScenario((prev) => prev + 1);
      }, 400);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-and-jobs-story");
  };

  const accuracy = Math.round((score / actions.length) * 100);

  return (
    <GameShell
      title="Robot Helper or Villain"
      score={coins}
      subtitle={`Scenario ${currentScenario + 1} of ${actions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-81"
      gameType="ai"
      totalLevels={100}
      currentLevel={81}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Choose the Right Action!
            </h3>

            <div className="bg-white/10 rounded-lg p-6 mb-6 text-center">
              <div className="text-8xl mb-4 animate-pulse">{currentAction.emoji}</div>
              <p className="text-white text-xl font-semibold">
                {currentAction.situation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(currentAction.good)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">🤝</div>
                <div className="text-white font-bold text-xl">{currentAction.good}</div>
              </button>

              <button
                onClick={() => handleChoice(currentAction.bad)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-2">💣</div>
                <div className="text-white font-bold text-xl">{currentAction.bad}</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🤖 You're a Kind Robot!" : "⚡ Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You chose kindness {score} out of {actions.length} times! ({accuracy}%)
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Great job! You learned how AI can be guided to make moral, helpful decisions.
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

export default RobotHelperOrVillain;
