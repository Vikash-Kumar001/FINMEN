import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BodyMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-34";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      item: "Heart",
      emoji: "❤️",
      matches: [
        { id: "blood", text: "Pumps Blood", emoji: "💉", correct: true },
        { id: "oxygen", text: "Breathes", emoji: "💨", correct: false },
        { id: "food", text: "Digests", emoji: "🍎", correct: false }
      ]
    },
    {
      id: 2,
      item: "Lungs",
      emoji: "🫁",
      matches: [
        { id: "food", text: "Digests", emoji: "🍎", correct: false },
        { id: "oxygen", text: "Breathes Oxygen", emoji: "💨", correct: true },
        { id: "blood", text: "Pumps", emoji: "💉", correct: false }
      ]
    },
    {
      id: 3,
      item: "Stomach",
      emoji: "🫄",
      matches: [
        { id: "oxygen", text: "Breathes", emoji: "💨", correct: false },
        { id: "food", text: "Digests Food", emoji: "🍎", correct: true },
        { id: "blood", text: "Pumps", emoji: "💉", correct: false }
      ]
    },
    {
      id: 4,
      item: "Brain",
      emoji: "🧠",
      matches: [
        { id: "blood", text: "Pumps", emoji: "💉", correct: false },
        { id: "food", text: "Digests", emoji: "🍎", correct: false },
        { id: "oxygen", text: "Thinks", emoji: "🤔", correct: true }
      ]
    },
    {
      id: 5,
      item: "All Organs",
      emoji: "🫀",
      matches: [
        { id: "food", text: "Work Separately", emoji: "🔄", correct: false },
        { id: "blood", text: "Work Together", emoji: "🤝", correct: true },
        { id: "oxygen", text: "Fight Each Other", emoji: "⚔️", correct: false }
      ]
    }
  ];

  const handleMatch = (matchId) => {
    const currentPuzzleData = puzzles[currentPuzzle];
    const match = currentPuzzleData.matches.find(m => m.id === matchId);
    setSelectedMatch(matchId);

    if (match.correct) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
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
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Body Match Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1}/5: ${puzzles[currentPuzzle].item}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={34}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/5: {puzzles[currentPuzzle].item}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6 text-center">
            Match the organ to what it does!
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative">
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
        </div>
      </div>
    </GameShell>
  );
};

export default BodyMatchPuzzle;
