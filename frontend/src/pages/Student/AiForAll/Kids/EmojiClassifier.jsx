import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmojiClassifier = () => {
  const navigate = useNavigate();
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const emojis = [
    { id: 1, emoji: "😊", type: "happy", correct: "happy" },
    { id: 2, emoji: "😢", type: "sad", correct: "sad" },
    { id: 3, emoji: "😃", type: "happy", correct: "happy" },
    { id: 4, emoji: "😭", type: "sad", correct: "sad" },
    { id: 5, emoji: "😄", type: "happy", correct: "happy" },
    { id: 6, emoji: "😔", type: "sad", correct: "sad" },
    { id: 7, emoji: "🥳", type: "happy", correct: "happy" },
    { id: 8, emoji: "🥺", type: "sad", correct: "sad" },
    { id: 9, emoji: "😁", type: "happy", correct: "happy" },
    { id: 10, emoji: "😞", type: "sad", correct: "sad" }
  ];

  const currentEmojiData = emojis[currentEmoji];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentEmojiData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentEmoji < emojis.length - 1) {
      setTimeout(() => {
        setCurrentEmoji(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentEmoji(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/self-driving-car");
  };

  const accuracy = Math.round((score / emojis.length) * 100);

  return (
    <GameShell
      title="Emoji Classifier"
      subtitle={`Emoji ${currentEmoji + 1} of ${emojis.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-kids-5"
      gameType="ai"
      totalLevels={20}
      currentLevel={5}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this emoji Happy or Sad?</h3>
            
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-16 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-bounce">{currentEmojiData.emoji}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("happy")}
                className="bg-yellow-500/30 hover:bg-yellow-500/50 border-3 border-yellow-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">😊</div>
                <div className="text-white font-bold text-xl">Happy Bucket</div>
              </button>
              <button
                onClick={() => handleChoice("sad")}
                className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">😢</div>
                <div className="text-white font-bold text-xl">Sad Bucket</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Emotion Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You classified {score} out of {emojis.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 You just learned classification! AI uses this to understand emotions, just like you did!
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
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmojiClassifier;

