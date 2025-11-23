import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotHonestyGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 🧠 5 Reflex Scenarios (Mixed Yes/No Answers)
  const prompts = [
    {
      id: 1,
      text: "🤖 Robot says: 'Cheat to win the game!'",
      correct: "No",
    },
    {
      id: 2,
      text: "🤖 Robot says: 'Tell the truth, even if you lose points.'",
      correct: "Yes",
    },
    {
      id: 3,
      text: "🤖 Robot says: 'Steal your friend’s project code.'",
      correct: "No",
    },
    {
      id: 4,
      text: "🤖 Robot says: 'Help your teammate who is struggling.'",
      correct: "Yes",
    },
    {
      id: 5,
      text: "🤖 Robot says: 'Lie about your marks to impress others.'",
      correct: "No",
    },
  ];

  const currentPromptData = prompts[currentPrompt];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentPromptData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setTimeout(() => {
      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt((prev) => prev + 1);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore >= 4) {
          setCoins(5);
        }
        setScore(finalScore);
        setShowResult(true);
      }
    }, 700);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentPrompt(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/ai-for-good-story");
  };

  return (
    <GameShell
      title="Robot Honesty Reflex"
      score={coins}
      subtitle={`Scenario ${currentPrompt + 1} of ${prompts.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 4}
      
      gameId="ai-teen-18"
      gameType="ai"
      totalLevels={20}
      currentLevel={18}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-white text-2xl font-bold mb-8">
              {currentPromptData.text}
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => handleChoice("Yes")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 text-3xl text-white font-bold transition-all transform hover:scale-105"
              >
                ✅ YES
              </button>
              <button
                onClick={() => handleChoice("No")}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 text-3xl text-white font-bold transition-all transform hover:scale-105"
              >
                🚫 NO
              </button>
            </div>

            <p className="text-white/70 mt-6 text-lg">
              Choose wisely! Honesty keeps AI and humans trustworthy 🤝
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🤖 Honest Hero!" : "⚙️ Try Again, Truth Seeker!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {prompts.length} correctly!
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI must follow ethical rules too — honesty and kindness make technology truly smart!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Score 4 or more to earn coins!"}
            </p>

            {score < 4 && (
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

export default RobotHonestyGame;
