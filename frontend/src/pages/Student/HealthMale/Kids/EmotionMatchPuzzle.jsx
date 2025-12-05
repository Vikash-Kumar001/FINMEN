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

  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
    const selectedMatch = currentP.matches.find(m => m.id === matchId);
    const isCorrect = selectedMatch.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
      } else {
        setGameFinished(true);
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
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={puzzles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      backPath="/games/health-male/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getCurrentPuzzle().emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{getCurrentPuzzle().emotion}</h3>
            <p className="text-white/90 mb-6">{getCurrentPuzzle().description}</p>
            <p className="text-white text-lg">Match this feeling to the right expression!</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentPuzzle().matches.map(match => (
              <button
                key={match.id}
                onClick={() => handleMatch(match.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{match.emoji}</div>
                  <div>
                    <h3 className="font-bold text-lg">{match.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default EmotionMatchPuzzle;
