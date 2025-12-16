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
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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

  return (
    <GameShell
      title="Body Match Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Match organs with their functions (${currentPuzzle + 1}/${puzzles.length} completed)`}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
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
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Puzzles: {currentPuzzle + 1}/{puzzles.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{puzzles.length}</span>
              </div>
              
              <p className="text-white/90 text-center mb-6">
                Match the organ to what it does!
              </p>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20 relative">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl mr-3">{puzzles[currentPuzzle].emoji}</span>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white text-lg">{puzzles[currentPuzzle].item}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {puzzles[currentPuzzle].matches.map((match) => {
                      const isSelected = selectedMatch === match.id;
                      const isCorrect = selectedMatch === match.id && match.correct;
                      const isWrong = selectedMatch === match.id && !match.correct;

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

export default BodyMatchPuzzle;
