import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowthHelpersPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showCoinFeedback, setShowCoinFeedback] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      item: "Milk",
      emoji: "🥛",
      matches: [
        { id: "bones", text: "Strong Bones", emoji: "🦴", correct: true },
        { id: "muscles", text: "Muscles", emoji: "💪", correct: false },
        { id: "energy", text: "Energy", emoji: "⚡", correct: false }
      ]
    },
    {
      id: 2,
      item: "Exercise",
      emoji: "🏃",
      matches: [
        { id: "energy", text: "Energy", emoji: "⚡", correct: false },
        { id: "muscles", text: "Muscles", emoji: "💪", correct: true },
        { id: "bones", text: "Bones", emoji: "🦴", correct: false }
      ]
    },
    {
      id: 3,
      item: "Sleep",
      emoji: "🛌",
      matches: [
        { id: "muscles", text: "Muscles", emoji: "💪", correct: false },
        { id: "energy", text: "Energy", emoji: "⚡", correct: true },
        { id: "bones", text: "Bones", emoji: "🦴", correct: false }
      ]
    },
    {
      id: 4,
      item: "Vegetables",
      emoji: "🥕",
      matches: [
        { id: "energy", text: "Energy", emoji: "⚡", correct: false },
        { id: "bones", text: "Bones", emoji: "🦴", correct: false },
        { id: "muscles", text: "Muscles", emoji: "💪", correct: true }
      ]
    },
    {
      id: 5,
      item: "Water",
      emoji: "💧",
      matches: [
        { id: "muscles", text: "Muscles", emoji: "💪", correct: false },
        { id: "bones", text: "Bones", emoji: "🦴", correct: false },
        { id: "energy", text: "Energy", emoji: "⚡", correct: true }
      ]
    }
  ];

  const handleMatch = (matchId) => {
    const currentPuzzleData = puzzles[currentPuzzle];
    const match = currentPuzzleData.matches.find(m => m.id === matchId);
    setSelectedMatch(matchId);

    if (match.correct) {
      showCorrectAnswerFeedback(5, true);
      setShowCoinFeedback(currentPuzzleData.id);
      setTimeout(() => setShowCoinFeedback(null), 1500);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedMatch(null);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/voice-change-story");
  };

  return (
    <GameShell
      title="Growth Helpers Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1}/5: ${puzzles[currentPuzzle].item}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={puzzles.slice(0, currentPuzzle + (selectedMatch ? 1 : 0)).filter((_, index) => {
        if (index < currentPuzzle) return true;
        if (index === currentPuzzle && selectedMatch) {
          const puzzle = puzzles[index];
          const match = puzzle.matches.find(m => m.id === selectedMatch);
          return match?.correct;
        }
        return false;
      }).length * 5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-male-kids-24"
      gameType="health-male"
      totalLevels={30}
      currentLevel={24}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/5: {puzzles[currentPuzzle].item}</span>
            <span className="text-yellow-400 font-bold">Coins: {puzzles.slice(0, currentPuzzle + (selectedMatch ? 1 : 0)).filter((_, index) => {
              if (index < currentPuzzle) return true;
              if (index === currentPuzzle && selectedMatch) {
                const puzzle = puzzles[index];
                const match = puzzle.matches.find(m => m.id === selectedMatch);
                return match?.correct;
              }
              return false;
            }).length * 5}</span>
          </div>

          <p className="text-white text-lg mb-6 text-center">
            Match what helps your body grow!
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative">
              {showCoinFeedback === puzzles[currentPuzzle].id && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-bounce">
                    +5
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl mr-3">{puzzles[currentPuzzle].emoji}</div>
                <div className="text-white text-xl font-bold">{puzzles[currentPuzzle].item}</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {puzzles[currentPuzzle].matches.map((match) => {
                  const isSelected = selectedMatch === match.id;
                  const isCorrect = selectedMatch === match.id && match.correct;
                  const isWrong = selectedMatch === match.id && !match.correct;

                  return (
                    <button
                      key={match.id}
                      onClick={() => handleMatch(match.id)}
                      disabled={selectedMatch !== null}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 relative ${
                        !selectedMatch
                          ? 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                          : isCorrect
                          ? 'bg-green-100/20 border-green-500 text-white'
                          : isWrong
                          ? 'bg-red-100/20 border-red-500 text-white'
                          : 'bg-gray-100/20 border-gray-500 text-white'
                      }`}
                    >
                      {isCorrect && (
                        <div className="absolute -top-2 -right-2 text-2xl">✅</div>
                      )}
                      {isWrong && (
                        <div className="absolute -top-2 -right-2 text-2xl">❌</div>
                      )}
                      <div className="text-2xl mb-1">{match.emoji}</div>
                      <div className="font-medium text-sm">{match.text}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default GrowthHelpersPuzzle;
