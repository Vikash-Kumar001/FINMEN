import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrainWithSounds = () => {
  const navigate = useNavigate();
  const [currentSound, setCurrentSound] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const sounds = [
    { id: 1, audio: "Woof", type: "dog", emoji: "🐶" },
    { id: 2, audio: "Meow", type: "cat", emoji: "🐱" },
    { id: 3, audio: "Woof", type: "dog", emoji: "🐕" },
    { id: 4, audio: "Meow", type: "cat", emoji: "😺" },
    { id: 5, audio: "Woof", type: "dog", emoji: "🐩" },
    { id: 6, audio: "Meow", type: "cat", emoji: "🐈" },
    { id: 7, audio: "Woof", type: "dog", emoji: "🦮" },
    { id: 8, audio: "Meow", type: "cat", emoji: "😸" },
    { id: 9, audio: "Woof", type: "dog", emoji: "🐕‍🦺" },
    { id: 10, audio: "Meow", type: "cat", emoji: "🐱" }
  ];

  const currentData = sounds[currentSound];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentData.type;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(2, true);
    }

    if (currentSound < sounds.length - 1) {
      setTimeout(() => {
        setCurrentSound(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentSound(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/overfitting-storyy"); // next game
  };

  const accuracy = Math.round((score / sounds.length) * 100);

  return (
    <GameShell
      title="Train with Sounds"
      subtitle={`Sound ${currentSound + 1} of ${sounds.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-teen-54"
      gameType="ai"
      totalLevels={20}
      currentLevel={54}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Listen and click the correct animal!</h3>
            
            <div className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl p-12 mb-6 flex flex-col items-center justify-center">
              <div className="text-9xl mb-3">{currentData.emoji}</div>
              <p className="text-white text-2xl font-bold mb-2">Sound: {currentData.audio}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("dog")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐶</div>
                <div className="text-white font-bold text-xl">Dog</div>
              </button>
              <button
                onClick={() => handleChoice("cat")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">🐱</div>
                <div className="text-white font-bold text-xl">Cat</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Audio Recognition Expert!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You identified {score} out of {sounds.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Recognizing sounds helps AI understand the environment, just like training voice assistants or smart devices!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainWithSounds;
