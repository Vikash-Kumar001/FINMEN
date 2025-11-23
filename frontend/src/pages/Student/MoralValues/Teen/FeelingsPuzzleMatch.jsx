import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FeelingsPuzzleMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const matches = [
    { id: 1, question: "😊 Smile", options: ["Happy", "Sad", "Angry"], correct: "Happy" },
    { id: 2, question: "😢 Tears", options: ["Excited", "Sad", "Scared"], correct: "Sad" },
    { id: 3, question: "😠 Frown", options: ["Angry", "Calm", "Joyful"], correct: "Angry" },
    { id: 4, question: "😨 Shaking", options: ["Scared", "Proud", "Relaxed"], correct: "Scared" },
    { id: 5, question: "😆 Laughing", options: ["Happy", "Tired", "Confused"], correct: "Happy" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = matches[currentIndex];

  const handleSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleConfirm = () => {
    if (selectedAnswer === currentQuestion.correct) {
      showCorrectAnswerFeedback(1, true);
      setCorrectCount((prev) => prev + 1);
    }
    if (currentIndex < matches.length - 1) {
      setTimeout(() => {
        setSelectedAnswer("");
        setCurrentIndex((prev) => prev + 1);
      }, 800);
    } else {
      setCoins(correctCount + (selectedAnswer === currentQuestion.correct ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer("");
    setCurrentIndex(0);
    setCorrectCount(0);
    setCoins(0);
    setShowResult(false);
  };

  const handleNext = () => {
    navigate("/games/moral-values/teen/roleplay-walk-in-shoes");
  };

  return (
    <GameShell
      title="Puzzle: Feelings Match"
      score={coins}
      subtitle="Understanding Emotions"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && coins > 0}
      
      gameId="moral-teen-24"
      gameType="moral"
      totalLevels={100}
      currentLevel={24}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">💖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Match the Feeling
            </h2>

            <div className="bg-pink-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                {currentQuestion.question} → ?
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedAnswer === option
                      ? "bg-pink-500/60 border-pink-300 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">
                    {option}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedAnswer}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAnswer
                  ? "bg-gradient-to-r from-green-500 to-pink-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-8xl mb-4 text-center">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins >= 3 ? "🌟 Great Job!" : "Keep Practicing!"}
            </h2>

            {coins >= 3 ? (
              <>
                <p className="text-white/80 mb-4">
                  You matched emotions correctly! Understanding feelings helps you
                  express and care for others better. 💕
                </p>
                <p className="text-yellow-400 text-2xl font-bold">
                  You earned {coins} Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <p className="text-white/80 mb-4">
                  Some matches were off, but that’s okay! Try again to master
                  emotions and empathy. 💪
                </p>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FeelingsPuzzleMatch;
