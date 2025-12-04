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

  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showCoinFeedback, setShowCoinFeedback] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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

    if (match.correct) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setShowCoinFeedback(currentPuzzleData.id);
      setTimeout(() => setShowCoinFeedback(null), 1500);
    }

    // Move to next puzzle or finish game
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
    navigate("/games/health-male/kids");
  };

  const currentPuzzleData = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Hygiene Items Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Puzzle ${currentPuzzle + 1}/5: ${currentPuzzleData?.item}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-4"
      gameType="health-male"
      totalLevels={10}
      currentLevel={4}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}

      maxScore={puzzles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-end items-center mb-4">
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6 text-center">
            Match the hygiene item to what it cleans!
          </p>

          {currentPuzzleData && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative">
                {showCoinFeedback === currentPuzzleData.id && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-bounce">
                      +1
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center mb-4">
                  <div className="text-4xl mr-3">{currentPuzzleData.emoji}</div>
                  <div className="text-white text-xl font-bold">{currentPuzzleData.item}</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {currentPuzzleData.matches.map((match) => {
                    const isCorrect = selectedMatch === match.id && match.correct;
                    const isWrong = selectedMatch === match.id && !match.correct;

                    return (
                      <button
                        key={match.id}
                        onClick={() => handleMatch(match.id)}
                        disabled={selectedMatch !== null}
                        className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 relative ${!selectedMatch
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
          )}

          {gameFinished && (
            <div className="text-center space-y-4 mt-6">
              <div className="text-green-400">
                <div className="text-6xl mb-2">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">Puzzle Master!</h3>
                <p className="text-white/90">You matched all hygiene items correctly!</p>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-yellow-500 text-2xl">+{coins} Coins</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HygieneItemsPuzzle;
