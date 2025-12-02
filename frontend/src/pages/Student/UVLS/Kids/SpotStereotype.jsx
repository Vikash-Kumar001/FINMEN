import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SpotStereotype = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-23";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
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
      setCoins(prev => prev + 1);
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
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Spot On!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You spotted correctly in {finalScore} out of {questions.length} levels!
                  You can identify stereotypes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Recognizing stereotypes helps us treat everyone fairly and with respect!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Spot More!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You spotted correctly in {finalScore} out of {questions.length} levels.
                  Keep learning to identify stereotypes!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Stereotypes are unfair assumptions about groups of people. Learn to recognize and challenge them!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpotStereotype;