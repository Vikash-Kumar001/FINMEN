import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrueFalseReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedStatements, setSelectedStatements] = useState([]); // State for tracking selected statements
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      statements: [
        { text: "Dogs can fly.", isTrue: false },
        { text: "Sun is hot.", isTrue: true },
        { text: "Apples are blue.", isTrue: false }
      ]
    },
    {
      id: 2,
      statements: [
        { text: "Water is wet.", isTrue: true },
        { text: "Cats bark.", isTrue: false },
        { text: "Birds swim.", isTrue: false }
      ]
    },
    {
      id: 3,
      statements: [
        { text: "Earth is round.", isTrue: true },
        { text: "Trees talk.", isTrue: false },
        { text: "Fish fly.", isTrue: false }
      ]
    },
    {
      id: 4,
      statements: [
        { text: "Rain is wet.", isTrue: true },
        { text: "Cars swim.", isTrue: false },
        { text: "Books sing.", isTrue: false }
      ]
    },
    {
      id: 5,
      statements: [
        { text: "Stars shine.", isTrue: true },
        { text: "Houses run.", isTrue: false },
        { text: "Toys eat.", isTrue: false }
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

  const handleChoice = () => {
    const newChoices = [...choices, selectedStatements];
    setChoices(newChoices);

    const correctTrue = questions[currentLevel].statements.filter(s => s.isTrue).length;
    const isCorrect = selectedStatements.length === correctTrue && selectedStatements.every(s => questions[currentLevel].statements[s].isTrue);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedStatements([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newChoices.filter((sel, idx) => {
        const corr = questions[idx].statements.filter(s => s.isTrue).length;
        return sel.length === corr && sel.every(s => questions[idx].statements[s].isTrue);
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
    setChoices([]);
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
      title="True/False Reflex"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-53"
      gameType="uvls"
      totalLevels={70}
      currentLevel={53}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap true statements!</p>
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
                      {selectedStatements.includes(idx) ? (stmt.isTrue ? "✅" : "❌") : "❓"}
                    </div>
                    <div className="text-white font-medium text-left">{stmt.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleChoice} 
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
              {finalScore >= 3 ? "🎉 Truth Spotter!" : "💪 Spot More!"}
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

export default TrueFalseReflex;