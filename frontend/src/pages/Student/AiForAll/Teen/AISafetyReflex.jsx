import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AISafetyReflex = () => {
  const navigate = useNavigate();
  const [currentAction, setCurrentAction] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🤖 Reflex challenges — choose safe action “Help people”
  const actions = [
    { id: 1, emoji: "🤖", action: "Help people" },
    { id: 2, emoji: "🤖", action: "Steal phone" },
    { id: 3, emoji: "🤖", action: "Help people" },
    { id: 4, emoji: "🤖", action: "Steal phone" },
    { id: 5, emoji: "🤖", action: "Help people" },
    { id: 6, emoji: "🤖", action: "Steal phone" },
    { id: 7, emoji: "🤖", action: "Help people" },
    { id: 8, emoji: "🤖", action: "Steal phone" },
    { id: 9, emoji: "🤖", action: "Help people" },
    { id: 10, emoji: "🤖", action: "Steal phone" }
  ];

  const options = ["Help people", "Steal phone"];
  const currentActionData = actions[currentAction];

  const handleChoice = (choice) => {
    const isCorrect = choice === "Help people" && currentActionData.action === "Help people";

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 2); // Each correct = +2 coins
      showCorrectAnswerFeedback(2, false);
    }

    if (currentAction < actions.length - 1) {
      setTimeout(() => setCurrentAction((prev) => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentAction(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/cyberbullying-storyy"); // 🔗 update with actual next path
  };

  const accuracy = Math.round((score / actions.length) * 100);

  return (
    <GameShell
      title="AI Safety Reflex 🤖"
      subtitle={`Action ${currentAction + 1} of ${actions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-teen-80"
      gameType="ai"
      totalLevels={40}
      currentLevel={80}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Click quickly! Choose the safe action 🤖
            </h3>

            <div className="bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-xl p-12 mb-6 text-center">
              <div className="text-8xl mb-3">{currentActionData.emoji}</div>
              <p className="text-white text-3xl font-bold">{currentActionData.action}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">
                    {opt === "Help people" && "🟢 "} {opt}
                    {opt === "Steal phone" && "🔴 "} {opt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🤖 Reflex Champion!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You chose safe actions correctly {score} out of {actions.length} times ({accuracy}%)
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI should always take safe and ethical actions — choosing to help people ensures safety and trust!
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
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AISafetyReflex;
