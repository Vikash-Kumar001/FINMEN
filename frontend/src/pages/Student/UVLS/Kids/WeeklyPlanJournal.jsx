import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WeeklyPlanJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [plans, setPlans] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [entry, setEntry] = useState("");
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      prompt: "3 points for week: study, play, rest."
    },
    {
      id: 2,
      prompt: "Plan: homework, fun, sleep."
    },
    {
      id: 3,
      prompt: "Weekly: chore, friend, hobby."
    },
    {
      id: 4,
      prompt: "Points: exercise, read, family."
    },
    {
      id: 5,
      prompt: "Plan: goal, task, relax."
    }
  ];

  const handlePlan = () => {
    const newPlans = [...plans, entry];
    setPlans(newPlans);

    const isValid = entry.trim().length > 0;
    if (isValid) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setEntry(""); // Reset entry for next level
      }, isValid ? 800 : 0);
    } else {
      const validPlans = newPlans.filter(p => p.trim().length > 0).length;
      setFinalScore(validPlans);
      if (validPlans >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPlans([]);
    setCoins(0);
    setFinalScore(0);
    setEntry("");
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Weekly Plan Journal"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-97"
      gameType="uvls"
      totalLevels={100}
      currentLevel={97}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">{getCurrentLevel().prompt}</p>
              <textarea 
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your plan..." 
                className="w-full p-2 rounded h-20 bg-white/20 text-white placeholder-white/50"
              ></textarea>
              <button 
                onClick={handlePlan}
                disabled={!entry.trim()}
                className={`mt-2 px-6 py-2 rounded-full font-semibold transition ${
                  entry.trim() 
                    ? "bg-purple-500 text-white hover:opacity-90" 
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Weekly Planner!" : "💪 Plan More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You planned {finalScore} weeks!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WeeklyPlanJournal;