import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BATNAPuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-82";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedBATNA, setSelectedBATNA] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      negotiation: "Buy used car.",
      emoji: "🚗",
      batnas: [
        { id: 1, text: "Buy from another seller", correct: true },
        { id: 2, text: "Accept high price", correct: false },
        { id: 3, text: "Walk away no car", correct: true },
        { id: 4, text: "Steal car", correct: false }
      ]
    },
    {
      id: 2,
      negotiation: "Rent apartment.",
      emoji: "🏠",
      batnas: [
        { id: 1, text: "Find cheaper place", correct: true },
        { id: 2, text: "Pay over budget", correct: false },
        { id: 3, text: "Live with family", correct: true },
        { id: 4, text: "Homeless", correct: false }
      ]
    },
    {
      id: 3,
      negotiation: "Job salary.",
      emoji: "💼",
      batnas: [
        { id: 1, text: "Another job offer", correct: true },
        { id: 2, text: "Accept low pay", correct: false },
        { id: 3, text: "Stay unemployed", correct: true },
        { id: 4, text: "Beg for raise", correct: false }
      ]
    },
    {
      id: 4,
      negotiation: "Group project time.",
      emoji: "⏰",
      batnas: [
        { id: 1, text: "Work alone", correct: true },
        { id: 2, text: "Miss deadline", correct: false },
        { id: 3, text: "Extend time self", correct: true },
        { id: 4, text: "Quit group", correct: false }
      ]
    },
    {
      id: 5,
      negotiation: "Buy phone.",
      emoji: "📱",
      batnas: [
        { id: 1, text: "Different model", correct: true },
        { id: 2, text: "Pay full price", correct: false },
        { id: 3, text: "No phone", correct: true },
        { id: 4, text: "Steal phone", correct: false }
      ]
    }
  ];

  const handleBATNASelect = (batnaId) => {
    setSelectedBATNA(batnaId);
  };

  const handleConfirm = () => {
    if (!selectedBATNA) return;

    const puzzle = puzzles[currentPuzzle];
    const batna = puzzle.batnas.find(b => b.id === selectedBATNA);
    
    const isCorrect = batna.correct;
    
    const newResponses = [...responses, {
      puzzleId: puzzle.id,
      batnaId: selectedBATNA,
      isCorrect,
      batna: batna.text
    }];
    
    setResponses(newResponses);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedBATNA(null);
    
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
      title="BATNA Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-82"
      gameType="uvls"
      totalLevels={20}
      currentLevel={82}
      showConfetti={showResult && correctCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{puzzles[currentPuzzle].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Negotiation: {puzzles[currentPuzzle].negotiation}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Identify BATNA:</p>
              
              <div className="space-y-3 mb-6">
                {puzzles[currentPuzzle].batnas.map(batna => (
                  <button
                    key={batna.id}
                    onClick={() => handleBATNASelect(batna.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedBATNA === batna.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{batna.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedBATNA}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedBATNA
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Select
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🎉 BATNA Expert!" : "💪 More Correct!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Correct BATNAs: {correctCount} out of {puzzles.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "Earned 5 Coins!" : "Need 4+ correct."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Practice with simple roleplays.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BATNAPuzzle;