import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmpathicTap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-69";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [taps, setTaps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedStatements, setSelectedStatements] = useState([]); // State for tracking selected statements
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      statements: [
        { text: "I understand.", isValidating: true },
        { text: "Stop crying!", isValidating: false },
        { text: "That sounds hard.", isValidating: true }
      ]
    },
    {
      id: 2,
      statements: [
        { text: "I'm here for you.", isValidating: true },
        { text: "Get over it.", isValidating: false },
        { text: "I feel the same.", isValidating: true }
      ]
    },
    {
      id: 3,
      statements: [
        { text: "You're right to feel that.", isValidating: true },
        { text: "Wrong feeling.", isValidating: false },
        { text: "Tell me more.", isValidating: true }
      ]
    },
    {
      id: 4,
      statements: [
        { text: "That's tough.", isValidating: true },
        { text: "Not my problem.", isValidating: false },
        { text: "I care.", isValidating: true }
      ]
    },
    {
      id: 5,
      statements: [
        { text: "You're not alone.", isValidating: true },
        { text: "Go away.", isValidating: false },
        { text: "Let's talk.", isValidating: true }
      ]
    }
  ];

  // Function to toggle statement selection
  const toggleStatementSelection = (index) => {
    setSelectedStatements(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleTap = () => {
    const newTaps = [...taps, selectedStatements];
    setTaps(newTaps);

    const correctValid = questions[currentLevel].statements.filter(s => s.isValidating).length;
    const isCorrect = selectedStatements.length === correctValid && selectedStatements.every(s => questions[currentLevel].statements[s].isValidating);
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedStatements([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newTaps.filter((sel, idx) => {
        const corr = questions[idx].statements.filter(s => s.isValidating).length;
        return sel.length === corr && sel.every(s => questions[idx].statements[s].isValidating);
      }).length;
      setFinalScore(correctLevels);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setTaps([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedStatements([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Empathic Tap"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-69"
      gameType="uvls"
      totalLevels={70}
      currentLevel={69}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap validating statements!</p>
              <div className="space-y-3">
                {getCurrentLevel().statements.map((stmt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleStatementSelection(idx)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedStatements.includes(idx)
                        ? "bg-green-500/30 border-2 border-green-400" // Visual feedback for selected
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedStatements.includes(idx) ? "✅" : "❤️"}
                    </div>
                    <div className="text-white font-medium text-left">{stmt.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleTap} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedStatements.length === 0} // Disable if no statements selected
              >
                Submit ({selectedStatements.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Empath Tapper!" : "💪 Tap More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You tapped correctly in {finalScore} levels!
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

export default EmpathicTap;