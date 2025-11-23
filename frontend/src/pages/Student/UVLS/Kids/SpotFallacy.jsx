import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpotFallacy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [spots, setSpots] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedReasonings, setSelectedReasonings] = useState([]); // State for tracking selected reasonings
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      reasonings: [
        { text: "Birds fly, so cats fly.", isWrong: true },
        { text: "Eat veggies to grow.", isWrong: false },
        { text: "Toys live at night.", isWrong: true }
      ]
    },
    {
      id: 2,
      reasonings: [
        { text: "Rain makes puddles.", isWrong: false },
        { text: "Sun is cheese.", isWrong: true },
        { text: "Dogs talk English.", isWrong: true }
      ]
    },
    {
      id: 3,
      reasonings: [
        { text: "Study to learn.", isWrong: false },
        { text: "Moon is banana.", isWrong: true },
        { text: "Cars eat food.", isWrong: true }
      ]
    },
    {
      id: 4,
      reasonings: [
        { text: "Sleep to rest.", isWrong: false },
        { text: "Trees dance.", isWrong: true },
        { text: "Books fly.", isWrong: true }
      ]
    },
    {
      id: 5,
      reasonings: [
        { text: "Play to have fun.", isWrong: false },
        { text: "Houses swim.", isWrong: true },
        { text: "Clouds are candy.", isWrong: true }
      ]
    }
  ];

  // Function to toggle reasoning selection
  const toggleReasoningSelection = (index) => {
    setSelectedReasonings(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSpot = () => {
    const newSpots = [...spots, selectedReasonings];
    setSpots(newSpots);

    const correctWrong = questions[currentLevel].reasonings.filter(r => r.isWrong).length;
    const isCorrect = selectedReasonings.length === correctWrong && selectedReasonings.every(s => questions[currentLevel].reasonings[s].isWrong);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedReasonings([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newSpots.filter((sel, idx) => {
        const corr = questions[idx].reasonings.filter(r => r.isWrong).length;
        return sel.length === corr && sel.every(s => questions[idx].reasonings[s].isWrong);
      }).length;
      setFinalScore(correctLevels);
      if (correctLevels >= 3) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setSpots([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedReasonings([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Spot Fallacy"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-59"
      gameType="uvls"
      totalLevels={70}
      currentLevel={59}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap wrong reasoning!</p>
              <div className="space-y-3">
                {getCurrentLevel().reasonings.map((reas, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleReasoningSelection(idx)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedReasonings.includes(idx)
                        ? "bg-red-500/30 border-2 border-red-400" // Visual feedback for selected
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedReasonings.includes(idx) ? "❌" : "🤪"}
                    </div>
                    <div className="text-white font-medium text-left">{reas.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleSpot} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedReasonings.length === 0} // Disable if no reasonings selected
              >
                Submit ({selectedReasonings.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Fallacy Spotter!" : "💪 Spot More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You spotted correctly in {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 3 Coins! 🪙" : "Try again!"}
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

export default SpotFallacy;