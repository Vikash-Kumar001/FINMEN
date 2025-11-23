import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
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
        { id: "tears", text: "Tears in eyes", emoji: "😭", isCorrect: true },
        { id: "laugh", text: "Laugh", emoji: "😂", isCorrect: false },
        { id: "shout", text: "Shout", emoji: "😠", isCorrect: false }
      ]
    },
    {
      id: 3,
      emotion: "Angry",
      emoji: "😠",
      description: "When you feel mad and want to yell",
      matches: [
        { id: "redface", text: "Red face", emoji: "😡", isCorrect: true },
        { id: "sleep", text: "Sleep", emoji: "😴", isCorrect: false },
        { id: "dance", text: "Dance", emoji: "💃", isCorrect: false }
      ]
    },
    {
      id: 4,
      emotion: "Scared",
      emoji: "😨",
      description: "When you feel afraid of something",
      matches: [
        { id: "hide", text: "Hide face", emoji: "🙈", isCorrect: true },
        { id: "sing", text: "Sing", emoji: "🎵", isCorrect: false },
        { id: "eat", text: "Eat", emoji: "🍎", isCorrect: false }
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

  const handleEmotionSelect = (matchId) => {
    const currentP = puzzles[currentPuzzle];
    const selectedMatch = currentP.matches.find(m => m.id === matchId);
    const isCorrect = selectedMatch.isCorrect;

    if (isCorrect && !matchedPairs.includes(currentPuzzle)) {
      setCoins(prev => prev + 1);
      setMatchedPairs(prev => [...prev, currentPuzzle]);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedEmotion(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/sharing-story");
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
      gameId="health-male-kids-54"
      gameType="health-male"
      totalLevels={60}
      currentLevel={54}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={60} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
            {getCurrentPuzzle().matches.map(match => {
              const isCorrect = match.isCorrect;
              const isMatched = matchedPairs.includes(currentPuzzle);

              return (
                <button
                  key={match.id}
                  onClick={() => handleEmotionSelect(match.id)}
                  disabled={isMatched}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isMatched
                      ? isCorrect
                        ? 'bg-green-100/20 border-green-500 text-white'
                        : 'bg-red-100/20 border-red-500 text-white'
                      : 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`text-3xl mr-4 ${isMatched && isCorrect ? 'opacity-100' : 'opacity-60'}`}>
                        {match.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${isMatched && isCorrect ? 'text-green-300' : 'text-white'}`}>
                          {isMatched && isCorrect ? '✅ ' : isMatched && !isCorrect ? '❌ ' : '☐ '}{match.text}
                        </h3>
                      </div>
                    </div>
                    {isMatched && isCorrect && (
                      <div className="text-2xl">🎉</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🧩</div>
                <h3 className="text-3xl font-bold text-white mb-2">Puzzle Master!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  You matched all emotions perfectly! You understand how feelings show on faces!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">EMOTION PUZZLER</div>
                </div>
                <p className="text-white/80">
                  Great job connecting feelings to their expressions! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default EmotionMatchPuzzle;
