import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIDoctorSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentCase, setCurrentCase] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const cases = [
    { id: 1, symptom: "🤒 Fever and cough", correct: "Flu" },
    { id: 2, symptom: "🤢 Stomach ache", correct: "Food Poisoning" },
    { id: 3, symptom: "🤧 Sneezing and runny nose", correct: "Cold" },
    { id: 4, symptom: "🤕 Headache and dizziness", correct: "Migraine" }
  ];

  const suggestions = ["Flu", "Cold", "Food Poisoning", "Migraine"];

  const currentCaseData = cases[currentCase];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentCaseData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentCase < cases.length - 1) {
      setTimeout(() => {
        setCurrentCase(prev => prev + 1);
      }, 300);
    } else {
      if ((score + (isCorrect ? 1 : 0)) >= 3) {
        setCoins(10);
      }
      setScore(prev => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentCase(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/robot-vacuum-game"); // update with next route
  };

  return (
    <GameShell
      title="AI Doctor Simulation"
      score={coins}
      subtitle={`Case ${currentCase + 1} of ${cases.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 3}
      
      gameId="ai-kids-35"
      gameType="ai"
      totalLevels={100}
      currentLevel={35}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">{currentCaseData.symptom}</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Identify the disease!</h3>

            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((sugg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(sugg)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">{sugg}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score >= 3 ? "🩺 Excellent Diagnosis!" : "💪 Keep Trying!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You correctly diagnosed {score} out of {cases.length} cases.
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI doctors can analyze symptoms and suggest possible diseases quickly, helping real doctors make better decisions.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              {score >= 3 ? "You earned 10 Coins! 🪙" : "Get at least 3 correct to earn coins!"}
            </p>
            {score < 3 && (
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

export default AIDoctorSimulation;
