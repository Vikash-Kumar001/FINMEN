import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeachAIEmotions = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const emotions = [
    { id: 1, emoji: "😀", correct: "Happy" },
    { id: 2, emoji: "😢", correct: "Sad" },
    { id: 3, emoji: "😠", correct: "Sad" },
    { id: 4, emoji: "😄", correct: "Happy" },
    { id: 5, emoji: "😔", correct: "Sad" },
  ];

  const currentEmotion = emotions[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentEmotion.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(2, false);
    }

    if (currentItem < emotions.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, 500);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/training-feedback-story"); // Update next game path
  };

  const accuracy = Math.round((score / emotions.length) * 100);

  return (
    <GameShell
      title="Teach AI Emotions"
      subtitle={`Emotion ${currentItem + 1} of ${emotions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 60}
      showGameOver={showResult && accuracy >= 60}
      score={coins}
      gameId="ai-teen-71"
      gameType="ai"
      totalLevels={20}
      currentLevel={71}
      showConfetti={showResult && accuracy >= 60}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Sort the emotion!</h3>
            
            <div className="bg-gradient-to-br from-yellow-500/30 to-pink-500/30 rounded-xl p-16 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentEmotion.emoji}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("Happy")}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">😊</div>
                <div className="text-white font-bold text-xl">Happy</div>
              </button>
              <button
                onClick={() => handleChoice("Sad")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">😢</div>
                <div className="text-white font-bold text-xl">Sad</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 60 ? "🎉 Emotion Teacher!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You sorted {score} out of {emotions.length} emotions correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI can recognize emotions to interact with humans better. You helped the AI learn happy vs sad expressions!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 60 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TeachAIEmotions;
