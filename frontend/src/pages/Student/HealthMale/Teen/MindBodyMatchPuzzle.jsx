import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MindBodyMatchPuzzle = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const puzzles = [
    {
      id: 1,
      item: "Exercise",
      emoji: "🏃",
      matches: [
        { id: "energy", text: "Energy", emoji: "⚡", correct: true },
        { id: "relax", text: "Relax", emoji: "😌", correct: false },
        { id: "calm", text: "Calm", emoji: "🧘", correct: false }
      ]
    },
    {
      id: 2,
      item: "Sleep",
      emoji: "😴",
      matches: [
        { id: "energy", text: "Energy", emoji: "⚡", correct: false },
        { id: "relax", text: "Relax", emoji: "😌", correct: true },
        { id: "stress", text: "Stress", emoji: "😟", correct: false }
      ]
    },
    {
      id: 3,
      item: "Deep Breath",
      emoji: "🫁",
      matches: [
        { id: "energy", text: "Energy", emoji: "⚡", correct: false },
        { id: "relax", text: "Relax", emoji: "😌", correct: false },
        { id: "calm", text: "Calm", emoji: "🧘", correct: true }
      ]
    },
    {
      id: 4,
      item: "Meditation",
      emoji: "🧘",
      matches: [
        { id: "energy", text: "Energy", emoji: "⚡", correct: false },
        { id: "stress", text: "Stress Relief", emoji: "😌", correct: true },
        { id: "calm", text: "Calm", emoji: "🧘", correct: false }
      ]
    },
    {
      id: 5,
      item: "Healthy Food",
      emoji: "🥗",
      matches: [
        { id: "relax", text: "Relax", emoji: "😌", correct: false },
        { id: "stress", text: "Stress", emoji: "😟", correct: false },
        { id: "energy", text: "Energy", emoji: "⚡", correct: true }
      ]
    }
  ];

  const handleMatch = (matchId) => {
    const currentPuzzleData = puzzles[currentPuzzle];
    const match = currentPuzzleData.matches.find(m => m.id === matchId);
    setSelectedMatch(matchId);
    resetFeedback();

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
    navigate("/student/health-male/teens/body-image-story");
  };

  return (
    <GameShell
      title="Puzzle: Mind-Body Match"
      subtitle={`Puzzle ${currentPuzzle + 1}/5: ${puzzles[currentPuzzle].item}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-54"
      gameType="health-male"
      totalLevels={puzzles.length}
      currentLevel={currentPuzzle + 1}
      maxScore={puzzles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished && coins >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Puzzle {currentPuzzle + 1}/5: {puzzles[currentPuzzle].item}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>

            <p className="text-white text-lg mb-6 text-center">
              Match the activity to its main benefit!
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Puzzle Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {coins} out of {puzzles.length}!
            </p>
            <p className="text-white/80 mb-8">
              Connecting your mind and body is key to managing stress.
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MindBodyMatchPuzzle;
