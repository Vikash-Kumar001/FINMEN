import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PersuasionPuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-50";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      topic: "Convince parents for later curfew.",
      tiles: ["Claim: Need more time with friends", "Evidence: Good grades", "CTA: Extend to 10pm"],
      correctOrder: [0, 1, 2]
    },
    {
      id: 2,
      topic: "Persuade teacher for extension.",
      tiles: ["Claim: Need more time", "Evidence: Busy schedule", "CTA: One day extra"],
      correctOrder: [0, 1, 2]
    },
    {
      id: 3,
      topic: "Sell idea to group.",
      tiles: ["Claim: This plan is best", "Evidence: Pros list", "CTA: Vote yes"],
      correctOrder: [0, 1, 2]
    },
    {
      id: 4,
      topic: "Advocate for school event.",
      tiles: ["Claim: Fun day needed", "Evidence: Student survey", "CTA: Approve budget"],
      correctOrder: [0, 1, 2]
    },
    {
      id: 5,
      topic: "Negotiate chore reduction.",
      tiles: ["Claim: Too many chores", "Evidence: Study time impacted", "CTA: Reduce to 3/week"],
      correctOrder: [0, 1, 2]
    }
  ];

  const handleTileSelect = (index) => {
    if (!selectedSequence.includes(index)) {
      setSelectedSequence([...selectedSequence, index]);
    }
  };

  const handleConfirm = () => {
    if (selectedSequence.length !== 3) return;

    const puzzle = puzzles[currentPuzzle];
    const isCorrect = selectedSequence.every((val, idx) => val === puzzle.correctOrder[idx]);
    
    const newResponses = [...responses, {
      puzzleId: puzzle.id,
      isCorrect
    }];
    
    setResponses(newResponses);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedSequence([]);
    
    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentPuzzle(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const correctCount = responses.filter(r => r.isCorrect).length;

  return (
    <GameShell
      title="Persuasion Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-50"
      gameType="uvls"
      totalLevels={20}
      currentLevel={50}
      showConfetti={showResult && correctCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Topic: {puzzles[currentPuzzle].topic}</p>
              
              <p className="text-white/90 mb-4 text-center">Arrange sequence:</p>
              
              <div className="space-y-3 mb-6">
                {puzzles[currentPuzzle].tiles.map((tile, index) => (
                  <button
                    key={index}
                    onClick={() => handleTileSelect(index)}
                    disabled={selectedSequence.includes(index)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedSequence.includes(index)
                        ? 'bg-gray-500/50'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{tile}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-white mb-4">Current sequence: {selectedSequence.map(i => puzzles[currentPuzzle].tiles[i]).join(" -> ")}</p>
              
              <button
                onClick={handleConfirm}
                disabled={selectedSequence.length !== 3}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedSequence.length === 3
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Arrange
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🎉 Persuasion Builder!" : "💪 More Coherent!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Correct sequences: {correctCount} out of {puzzles.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "Earned 5 Coins!" : "Need 4+ correct."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Encourage ethical persuasion.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PersuasionPuzzle;