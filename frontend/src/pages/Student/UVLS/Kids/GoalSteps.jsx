import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoalSteps = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [steps, setSteps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      goal: "Read 10 books.",
      monthly: [
        { id: "a", text: "1 book/month", emoji: "📖", isGood: true },
        { id: "b", text: "10 at once", emoji: "😵", isGood: false },
        { id: "c", text: "No reading", emoji: "🚫", isGood: false }
      ]
    },
    {
      id: 2,
      goal: "Save 20 coins.",
      monthly: [
        { id: "a", text: "2 coins/month", emoji: "🪙", isGood: true },
        { id: "b", text: "Spend all", emoji: "💸", isGood: false },
        { id: "c", text: "20 one day", emoji: "😰", isGood: false }
      ]
    },
    {
      id: 3,
      goal: "Learn bike.",
      monthly: [
        { id: "a", text: "Practice weekly", emoji: "🚲", isGood: true },
        { id: "b", text: "Never try", emoji: "😔", isGood: false },
        { id: "c", text: "One long day", emoji: "🏃", isGood: false }
      ]
    },
    {
      id: 4,
      goal: "Plant garden.",
      monthly: [
        { id: "a", text: "Seed then water", emoji: "🌱", isGood: true },
        { id: "b", text: "Forget water", emoji: "🥀", isGood: false },
        { id: "c", text: "All at end", emoji: "😩", isGood: false }
      ]
    },
    {
      id: 5,
      goal: "Draw 5 pictures.",
      monthly: [
        { id: "a", text: "1 per week", emoji: "🎨", isGood: true },
        { id: "b", text: "5 last day", emoji: "😓", isGood: false },
        { id: "c", text: "No draw", emoji: "🚫", isGood: false }
      ]
    }
  ];

  const handleStep = (selected) => {
    const newSteps = [...steps, selected];
    setSteps(newSteps);

    const isGood = questions[currentLevel].monthly.find(opt => opt.id === selected)?.isGood;
    if (isGood) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isGood ? 800 : 0);
    } else {
      const goodSteps = newSteps.filter((sel, idx) => questions[idx].monthly.find(opt => opt.id === sel)?.isGood).length;
      setFinalScore(goodSteps);
      if (goodSteps >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setSteps([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Goal Steps"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-95"
      gameType="uvls"
      totalLevels={100}
      currentLevel={95}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4 font-semibold">
                Break {getCurrentLevel().goal}
              </p>
              <div className="space-y-3">
                {getCurrentLevel().monthly.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleStep(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 flex items-center gap-3"
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-white font-medium text-left">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Goal Breaker!" : "💪 Break Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You broke goals well {finalScore} times!
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

export default GoalSteps;