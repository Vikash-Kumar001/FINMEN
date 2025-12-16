import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmotionMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-54";
  const gameData = getGameDataById(gameId);

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
      emotion: "Happy",
      emoji: "😊",
      description: "When you feel good and smile a lot",
      matches: [
        { id: "smile", text: "Big smile", emoji: "😄", isCorrect: true },
        { id: "frown", text: "Frown", emoji: "😞", isCorrect: false },
        { id: "cry", text: "Cry", emoji: "😢", isCorrect: false }
      ]
    },
    {
      id: 2,
      emotion: "Sad",
      emoji: "😢",
      description: "When you feel down or want to cry",
      matches: [
        { id: "laugh", text: "Laugh", emoji: "😂", isCorrect: false },
        { id: "shout", text: "Shout", emoji: "😠", isCorrect: false },
        { id: "tears", text: "Tears in eyes", emoji: "😭", isCorrect: true },
      ]
    },
    {
      id: 3,
      emotion: "Angry",
      emoji: "😠",
      description: "When you feel mad and want to yell",
      matches: [
        { id: "sleep", text: "Sleep", emoji: "😴", isCorrect: false },
        { id: "redface", text: "Red face", emoji: "😡", isCorrect: true },
        { id: "dance", text: "Dance", emoji: "💃", isCorrect: false }
      ]
    },
    {
      id: 4,
      emotion: "Scared",
      emoji: "😨",
      description: "When you feel afraid of something",
      matches: [
        { id: "sing", text: "Sing", emoji: "🎵", isCorrect: false },
        { id: "eat", text: "Eat", emoji: "🍎", isCorrect: false },
        { id: "hide", text: "Hide face", emoji: "🙈", isCorrect: true }
      ]
    },
    {
      id: 5,
      emotion: "Excited",
      emoji: "🤩",
      description: "When you feel super happy and full of energy",
      matches: [
        { id: "jump", text: "Jump around", emoji: "🦘", isCorrect: true },
        { id: "sit", text: "Sit quietly", emoji: "🪑", isCorrect: false },
        { id: "sleep", text: "Sleep", emoji: "😴", isCorrect: false }
      ]
    }
  ];

  const handleMatch = (matchId) => {
    const currentP = puzzles[currentPuzzle];
    const match = currentP.matches.find(m => m.id === matchId);
    setSelectedMatch(matchId);
    resetFeedback();

    if (match.isCorrect) {
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

  const getCurrentPuzzle = () => puzzles[currentPuzzle];

  return (
    <GameShell
      title="Emotion Match Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Match emotions with their expressions (${currentPuzzle + 1}/${puzzles.length} completed)`}
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

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{getCurrentPuzzle().emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{getCurrentPuzzle().emotion}</h3>
                <p className="text-white/90 mb-6">{getCurrentPuzzle().description}</p>
                <p className="text-white/90 text-center">Match this feeling to the right expression!</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {getCurrentPuzzle().matches.map(match => {
                  const isSelected = selectedMatch === match.id;
                  const isCorrect = isSelected && match.isCorrect;
                  const isWrong = isSelected && !match.isCorrect;

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
        ) : null}
      </div>
    </GameShell>
  );
};

export default EmotionMatchPuzzle;
