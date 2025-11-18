import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproductiveMatchPuzzleTeen = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      organ: "Testes",
      correctFunction: "Sperm",
      options: ["Sperm", "Urine", "Blood"],
      description: "Testes produce sperm for reproduction"
    },
    {
      id: 2,
      organ: "Penis",
      correctFunction: "Transfer",
      options: ["Transfer", "Produce", "Store"],
      description: "Penis transfers sperm during reproduction"
    },
    {
      id: 3,
      organ: "Hormones",
      correctFunction: "Changes",
      options: ["Changes", "Storage", "Movement"],
      description: "Hormones cause puberty changes in teens"
    },
    {
      id: 4,
      organ: "Scrotum",
      correctFunction: "Protection",
      options: ["Protection", "Production", "Transfer"],
      description: "Scrotum protects the testes"
    },
    {
      id: 5,
      organ: "Prostate",
      correctFunction: "Fluid",
      options: ["Fluid", "Storage", "Movement"],
      description: "Prostate produces fluid for sperm"
    }
  ];

  const handleOrganClick = (organ) => {
    if (selectedOrgan === organ) {
      setSelectedOrgan(null);
    } else {
      setSelectedOrgan(organ);
    }
  };

  const handleFunctionClick = (func) => {
    if (!selectedOrgan) return;

    const currentPuzzleData = puzzles[currentPuzzle];
    const isCorrect = currentPuzzleData.correctFunction === func;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setMatchedPairs([...matchedPairs, { puzzle: currentPuzzle, organ: selectedOrgan, func }]);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setChoices([...choices, { puzzle: currentPuzzle, func, isCorrect: true }]);

        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedOrgan(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      setChoices([...choices, { puzzle: currentPuzzle, func, isCorrect: false }]);
      setSelectedOrgan(null);
    }
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];
  const correctMatches = choices.filter(c => c.isCorrect).length;

  const handleNext = () => {
    navigate("/student/health-male/teens/nocturnal-emission-story-teen");
  };

  return (
    <GameShell
      title="Puzzle: Reproductive Match (Teen)"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctMatches * 5}
      gameId="health-male-teen-34"
      gameType="health-male"
      totalLevels={100}
      currentLevel={34}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 34/100</span>
            <span className="text-yellow-400 font-bold">Coins: {correctMatches * 5}</span>
          </div>

          {showSuccess && (
            <div className="text-center mb-4 p-4 bg-green-500/20 rounded-lg">
              <p className="text-green-400 font-bold">Perfect Match! 🎉</p>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-white text-xl font-bold mb-2">
              Match: {getCurrentPuzzle().organ}
            </h3>
            <p className="text-white/80">{getCurrentPuzzle().description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organs Column */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-center">Reproductive Parts</h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleOrganClick(getCurrentPuzzle().organ)}
                  className={`w-full p-4 rounded-xl text-center transition-all ${
                    selectedOrgan === getCurrentPuzzle().organ
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">🫐</div>
                  <div className="font-bold">{getCurrentPuzzle().organ}</div>
                </button>
              </div>
            </div>

            {/* Functions Column */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-center">What It Does</h4>
              <div className="space-y-3">
                {getCurrentPuzzle().options.map(func => (
                  <button
                    key={func}
                    onClick={() => handleFunctionClick(func)}
                    className="w-full p-4 rounded-xl text-center transition-all bg-gray-600 text-white hover:bg-gray-500"
                  >
                    <div className="text-2xl mb-1">
                      {func === "Sperm" ? "🫧" :
                       func === "Transfer" ? "🔄" :
                       func === "Changes" ? "🔄" :
                       func === "Protection" ? "🛡️" :
                       func === "Fluid" ? "💧" :
                       func === "Urine" ? "💧" :
                       func === "Blood" ? "🩸" :
                       func === "Produce" ? "🏭" :
                       func === "Store" ? "📦" :
                       func === "Movement" ? "🏃" : "❓"}
                    </div>
                    <div className="font-bold">{func}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Click a reproductive part, then click what it does!
            </p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReproductiveMatchPuzzleTeen;
