import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneItemsPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-4";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      item: "Toothbrush",
      emoji: "🪥",
      matches: [
        { id: "hair", text: "Hair", emoji: "💇", correct: false },
        { id: "teeth", text: "Teeth", emoji: "🦷", correct: true },
        { id: "nails", text: "Nails", emoji: "💅", correct: false }
      ]
    },
    {
      id: 2,
      item: "Soap",
      emoji: "🧼",
      matches: [
        { id: "dishes", text: "Dishes", emoji: "🍽️", correct: false },
        { id: "clothes", text: "Clothes", emoji: "👕", correct: false },
        { id: "bath", text: "Bath", emoji: "🛁", correct: true }
      ]
    },
    {
      id: 3,
      item: "Nail Cutter",
      emoji: "✂️",
      matches: [
        { id: "nails", text: "Nails", emoji: "💅", correct: true },
        { id: "hair", text: "Hair", emoji: "💇", correct: false },
        { id: "teeth", text: "Teeth", emoji: "🦷", correct: false }
      ]
    },
    {
      id: 4,
      item: "Towel",
      emoji: "🧺",
      matches: [
        { id: "eat", text: "Eat", emoji: "🍽️", correct: false },
        { id: "dry", text: "Dry Body", emoji: "💨", correct: true },
        { id: "sleep", text: "Sleep", emoji: "😴", correct: false }
      ]
    },
    {
      id: 5,
      item: "Comb",
      emoji: "💇",
      matches: [
        { id: "teeth", text: "Teeth", emoji: "🦷", correct: false },
        { id: "nails", text: "Nails", emoji: "💅", correct: false },
        { id: "hair", text: "Hair", emoji: "💇", correct: true }
      ]
    }
  ];

  const handleMatch = (matchId) => {
    if (currentPuzzle >= puzzles.length) return;

    const currentPuzzleData = puzzles[currentPuzzle];
    const match = currentPuzzleData.matches.find(m => m.id === matchId);
    setSelectedMatch(matchId);
    resetFeedback();

    if (match.correct) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedMatch(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const currentPuzzleData = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Hygiene Items Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Match hygiene items with their uses (${currentPuzzle + 1}/${puzzles.length} completed)`}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="health-male-kids-4"
      gameType="health-male"
      totalLevels={puzzles.length}
      currentLevel={currentPuzzle + 1}
      maxScore={puzzles.length}
      showConfetti={showResult && score === puzzles.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {!showResult && currentPuzzleData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Puzzles: {currentPuzzle + 1}/{puzzles.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{puzzles.length}</span>
              </div>

              <p className="text-white/90 text-center mb-6">
                Match the hygiene item to what it cleans!
              </p>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20 relative">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl mr-3">{currentPuzzleData.emoji}</span>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white text-lg">{currentPuzzleData.item}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentPuzzleData.matches.map((match) => {
                      const isSelected = selectedMatch === match.id;
                      const isCorrect = isSelected && match.correct;
                      const isWrong = isSelected && !match.correct;

                      return (
                        <button
                          key={match.id}
                          onClick={() => handleMatch(match.id)}
                          disabled={selectedMatch !== null}
                          className={`w-full p-4 rounded-xl transition-all border-2 ${
                            !selectedMatch
                              ? 'bg-white/10 hover:bg-white/20 border-white/30 cursor-pointer'
                              : isCorrect
                                ? 'bg-green-500/20 border-green-400 opacity-70 cursor-not-allowed'
                                : isWrong
                                  ? 'bg-red-500/20 border-red-400 opacity-70 cursor-not-allowed'
                                  : 'bg-white/10 border-white/30 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{match.emoji}</span>
                            <div className="text-left flex-1">
                              <div className="font-semibold text-white">{match.text}</div>
                            </div>
                            {isSelected && (
                              <span className={`text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {isCorrect ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default HygieneItemsPuzzle;
