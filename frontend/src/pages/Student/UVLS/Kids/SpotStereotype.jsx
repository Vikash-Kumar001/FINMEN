import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpotStereotype = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [spots, setSpots] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedStatements, setSelectedStatements] = useState([]); // State for tracking selected statements
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      statements: [
        { text: "Girls can't play football.", isStereotype: true },
        { text: "Everyone likes ice cream.", isStereotype: false },
        { text: "Boys don't cry.", isStereotype: true }
      ]
    },
    {
      id: 2,
      statements: [
        { text: "Moms cook, dads work.", isStereotype: true },
        { text: "Kids go to school.", isStereotype: false },
        { text: "Girls wear pink.", isStereotype: true }
      ]
    },
    {
      id: 3,
      statements: [
        { text: "Boys are strong, girls are weak.", isStereotype: true },
        { text: "Friends help each other.", isStereotype: false },
        { text: "Nurses are women.", isStereotype: true }
      ]
    },
    {
      id: 4,
      statements: [
        { text: "Doctors are men.", isStereotype: true },
        { text: "We all need food.", isStereotype: false },
        { text: "Girls like dolls, boys like cars.", isStereotype: true }
      ]
    },
    {
      id: 5,
      statements: [
        { text: "Teachers are women.", isStereotype: true },
        { text: "Playtime is fun.", isStereotype: false },
        { text: "Boys can't dance.", isStereotype: true }
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

  const handleSpot = () => {
    const newSpots = [...spots, selectedStatements];
    setSpots(newSpots);

    const correctSpots = questions[currentLevel].statements.filter(s => s.isStereotype).length;
    const isCorrect = selectedStatements.length === correctSpots && selectedStatements.every(s => questions[currentLevel].statements[s].isStereotype);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedStatements([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newSpots.filter((sel, idx) => {
        const corr = questions[idx].statements.filter(s => s.isStereotype).length;
        return sel.length === corr && sel.every(s => questions[idx].statements[s].isStereotype);
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
    setSelectedStatements([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Spot Stereotype"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-23"
      gameType="uvls"
      totalLevels={30}
      currentLevel={23}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap the stereotype statements!</p>
              <div className="space-y-3">
                {getCurrentLevel().statements.map((stmt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleStatementSelection(idx)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedStatements.includes(idx)
                        ? "bg-red-500/30 border-2 border-red-400" // Visual feedback for selected stereotype statements
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedStatements.includes(idx) ? "🔍✅" : "🔍"}
                    </div>
                    <div className="text-white font-medium text-left">{stmt.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleSpot} 
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
              {finalScore >= 3 ? "🎉 Spot On!" : "💪 Spot More!"}
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

export default SpotStereotype;