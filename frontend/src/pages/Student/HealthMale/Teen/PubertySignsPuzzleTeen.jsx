import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertySignsPuzzleTeen = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      sign: "Voice Cracks",
      correctMeaning: "Puberty",
      options: ["Puberty", "Illness", "Allergy"],
      description: "Voice changes during puberty"
    },
    {
      id: 2,
      sign: "Sweating More",
      correctMeaning: "Puberty",
      options: ["Puberty", "Exercise", "Weather"],
      description: "Increased sweating is normal during puberty"
    },
    {
      id: 3,
      sign: "Acne on Face",
      correctMeaning: "Puberty",
      options: ["Puberty", "Dirty Skin", "Bad Food"],
      description: "Acne is common during teen years"
    },
    {
      id: 4,
      sign: "Growing Taller",
      correctMeaning: "Puberty",
      options: ["Puberty", "Good Shoes", "Magic"],
      description: "Growth spurts happen during puberty"
    },
    {
      id: 5,
      sign: "Mood Changes",
      correctMeaning: "Puberty",
      options: ["Puberty", "Bad Friends", "School Stress"],
      description: "Hormones cause mood swings in teens"
    }
  ];

  const handleSignClick = (sign) => {
    if (selectedSign === sign) {
      setSelectedSign(null);
    } else {
      setSelectedSign(sign);
    }
  };

  const handleMeaningClick = (meaning) => {
    if (!selectedSign) return;

    const currentPuzzleData = puzzles[currentPuzzle];
    const isCorrect = currentPuzzleData.correctMeaning === meaning;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setMatchedPairs([...matchedPairs, { puzzle: currentPuzzle, sign: selectedSign, meaning }]);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setChoices([...choices, { puzzle: currentPuzzle, meaning, isCorrect: true }]);

        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedSign(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      setChoices([...choices, { puzzle: currentPuzzle, meaning, isCorrect: false }]);
      setSelectedSign(null);
    }
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];
  const correctMatches = choices.filter(c => c.isCorrect).length;

  const handleNext = () => {
    navigate("/student/health-male/teens/acne-story-teen");
  };

  return (
    <GameShell
      title="Puzzle: Puberty Signs (Teen)"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctMatches * 5}
      gameId="health-male-teen-24"
      gameType="health-male"
      totalLevels={100}
      currentLevel={24}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 24/100</span>
            <span className="text-yellow-400 font-bold">Coins: {correctMatches * 5}</span>
          </div>

          {showSuccess && (
            <div className="text-center mb-4 p-4 bg-green-500/20 rounded-lg">
              <p className="text-green-400 font-bold">Perfect Match! 🎉</p>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-white text-xl font-bold mb-2">
              Match: {getCurrentPuzzle().sign}
            </h3>
            <p className="text-white/80">{getCurrentPuzzle().description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Signs Column */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-center">Puberty Signs</h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleSignClick(getCurrentPuzzle().sign)}
                  className={`w-full p-4 rounded-xl text-center transition-all ${
                    selectedSign === getCurrentPuzzle().sign
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">🔍</div>
                  <div className="font-bold">{getCurrentPuzzle().sign}</div>
                </button>
              </div>
            </div>

            {/* Meanings Column */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-center">What It Means</h4>
              <div className="space-y-3">
                {getCurrentPuzzle().options.map(meaning => (
                  <button
                    key={meaning}
                    onClick={() => handleMeaningClick(meaning)}
                    className="w-full p-4 rounded-xl text-center transition-all bg-gray-600 text-white hover:bg-gray-500"
                  >
                    <div className="text-2xl mb-1">
                      {meaning === "Puberty" ? "🌱" :
                       meaning === "Illness" ? "🤒" :
                       meaning === "Exercise" ? "💪" :
                       meaning === "Weather" ? "🌤️" :
                       meaning === "Dirty Skin" ? "🧼" :
                       meaning === "Bad Food" ? "🍔" :
                       meaning === "Good Shoes" ? "👟" :
                       meaning === "Magic" ? "✨" :
                       meaning === "Bad Friends" ? "👥" :
                       meaning === "School Stress" ? "📚" :
                       meaning === "Allergy" ? "🤧" : "❓"}
                    </div>
                    <div className="font-bold">{meaning}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Click a puberty sign, then click what it means!
            </p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PubertySignsPuzzleTeen;
