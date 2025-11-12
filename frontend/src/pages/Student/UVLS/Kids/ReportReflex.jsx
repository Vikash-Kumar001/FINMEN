import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReportReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [reports, setReports] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedContexts, setSelectedContexts] = useState([]); // State for tracking selected contexts
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      contexts: [
        { text: "Pushing someone down.", isBullying: true },
        { text: "Sharing a toy.", isBullying: false },
        { text: "Name-calling repeatedly.", isBullying: true }
      ]
    },
    {
      id: 2,
      contexts: [
        { text: "Hiding someone's things.", isBullying: true },
        { text: "High-five after game.", isBullying: false },
        { text: "Spreading rumors.", isBullying: true }
      ]
    },
    {
      id: 3,
      contexts: [
        { text: "Excluding from group on purpose.", isBullying: true },
        { text: "Helping with homework.", isBullying: false },
        { text: "Mocking appearance.", isBullying: true }
      ]
    },
    {
      id: 4,
      contexts: [
        { text: "Threatening harm.", isBullying: true },
        { text: "Complimenting.", isBullying: false },
        { text: "Stealing lunch.", isBullying: true }
      ]
    },
    {
      id: 5,
      contexts: [
        { text: "Cyber harassment.", isBullying: true },
        { text: "Friendly chat.", isBullying: false },
        { text: "Physical fight.", isBullying: true }
      ]
    }
  ];

  // Function to toggle context selection
  const toggleContextSelection = (index) => {
    setSelectedContexts(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleReport = () => {
    const newReports = [...reports, selectedContexts];
    setReports(newReports);

    const correctReports = questions[currentLevel].contexts.filter(c => c.isBullying).length;
    const isCorrect = selectedContexts.length === correctReports && selectedContexts.every(s => questions[currentLevel].contexts[s].isBullying);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedContexts([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newReports.filter((sel, idx) => {
        const corr = questions[idx].contexts.filter(c => c.isBullying).length;
        return sel.length === corr && sel.every(s => questions[idx].contexts[s].isBullying);
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
    setReports([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedContexts([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Report Reflex"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-33"
      gameType="uvls"
      totalLevels={50}
      currentLevel={33}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap the report icon for bullying!</p>
              <div className="space-y-3">
                {getCurrentLevel().contexts.map((ctx, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleContextSelection(idx)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedContexts.includes(idx)
                        ? "bg-red-500/30 border-2 border-red-400" // Visual feedback for selected bullying contexts
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedContexts.includes(idx) ? "🚨" : "📝"}
                    </div>
                    <div className="text-white font-medium text-left">{ctx.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleReport} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedContexts.length === 0} // Disable if no contexts selected
              >
                Submit ({selectedContexts.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Report Pro!" : "💪 Report More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You reported correctly in {finalScore} levels!
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

export default ReportReflex;