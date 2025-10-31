import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartPoster = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [posters, setPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      fields: ["Specific", "Measurable", "Doable"]
    },
    {
      id: 2,
      fields: ["Clear goal", "Track progress", "Achievable"]
    },
    {
      id: 3,
      fields: ["What to do", "How much", "When done"]
    },
    {
      id: 4,
      fields: ["Simple aim", "Count it", "Possible"]
    },
    {
      id: 5,
      fields: ["Exact target", "Measure success", "Realistic"]
    }
  ];

  const handlePoster = () => {
    const inputs = document.querySelectorAll('.smart-input');
    const filledFields = Array.from(inputs).map(input => input.value).filter(value => value.trim() !== '');
    
    const newPosters = [...posters, filledFields];
    setPosters(newPosters);

    const isComplete = filledFields.length >= 3;
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isComplete ? 800 : 0);
    } else {
      const completePosters = newPosters.filter(sel => sel.length >= 3).length;
      setFinalScore(completePosters);
      if (completePosters >= 3) {
        setCoins(5); // Badge
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPosters([]);
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
      title="SMART Poster"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-96"
      gameType="uvls"
      totalLevels={100}
      currentLevel={96}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Fill SMART fields!</p>
              <div className="space-y-3">
                {getCurrentLevel().fields.map((field, index) => (
                  <input key={index} placeholder={field} className="w-full p-2 rounded smart-input" />
                ))}
              </div>
              <button onClick={handlePoster} className="mt-4 bg-purple-500 text-white p-2 rounded">Complete</button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 SMART Artist!" : "💪 Fill More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed {finalScore} posters!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned a Badge! 🏅" : "Try again!"}
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

export default SmartPoster;