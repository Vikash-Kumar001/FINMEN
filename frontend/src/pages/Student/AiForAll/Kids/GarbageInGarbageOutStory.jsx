import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GarbageInGarbageOutStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      title: "Garbage In, Garbage Out",
      emoji: "🤖",
      situation:
        "The robot learned from wrong labels and is now failing its tasks. What should you do?",
      choices: [
        { id: 1, text: "Fix the data and correct labels", emoji: "🛠️", isCorrect: true },
        { id: 2, text: "Let it continue using wrong data", emoji: "😐", isCorrect: false },
        { id: 3, text: "Turn the robot off permanently", emoji: "⏻", isCorrect: false }
      ],
      explanation:
        "AI learns from data. If data is wrong, AI’s output will be wrong too! Always correct the labels."
    },
    {
      title: "Messy Photos",
      emoji: "📸",
      situation:
        "AI was trained on blurry and incomplete images. Now it can't recognize objects. What’s your move?",
      choices: [
        { id: 1, text: "Collect clear and complete images", emoji: "🖼️", isCorrect: true },
        { id: 2, text: "Use blurry ones anyway", emoji: "😶", isCorrect: false },
        { id: 3, text: "Stop using images", emoji: "🚫", isCorrect: false }
      ],
      explanation:
        "Better quality data = better AI results. Blurry data confuses the model!"
    },
    {
      title: "Wrong Numbers",
      emoji: "🔢",
      situation:
        "The AI gets data with missing and false numbers. What’s the best fix?",
      choices: [
        { id: 1, text: "Clean and verify all data", emoji: "🧹", isCorrect: true },
        { id: 2, text: "Ignore errors", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Guess random values", emoji: "🎲", isCorrect: false }
      ],
      explanation:
        "Always clean data before training AI. Bad data = bad predictions."
    },
    {
      title: "Mixed Emotions",
      emoji: "😊😠",
      situation:
        "AI trained on angry comments only and now mislabels positive ones as negative. What’s the fix?",
      choices: [
        { id: 1, text: "Add balanced happy + sad comments", emoji: "⚖️", isCorrect: true },
        { id: 2, text: "Keep angry comments only", emoji: "😡", isCorrect: false },
        { id: 3, text: "Stop emotion analysis", emoji: "🚫", isCorrect: false }
      ],
      explanation:
        "Balanced data helps AI understand all emotions. Too much bias = wrong predictions!"
    },
    {
      title: "Robot Chef",
      emoji: "👩‍🍳🤖",
      situation:
        "A cooking AI learned from wrong recipes. It now adds salt instead of sugar! What should you do?",
      choices: [
        { id: 1, text: "Train again with correct recipes", emoji: "📚", isCorrect: true },
        { id: 2, text: "Let it serve salty desserts", emoji: "🍰🧂", isCorrect: false },
        { id: 3, text: "Delete all recipes", emoji: "🗑️", isCorrect: false }
      ],
      explanation:
        "Garbage in = Garbage out! Correct data helps AI cook perfectly next time!"
    }
  ];

  const currentStory = stories[currentIndex];
  const isLast = currentIndex === stories.length - 1;

  const handleChoice = (id) => {
    setSelectedChoice(id);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setTotalScore((prev) => prev + 10);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    }
  };

  const handleTryAgain = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setTotalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-training-badge");
  };

  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Garbage In, Garbage Out Story"
      score={coins}
      subtitle="Bad Data = Bad AI"
      onNext={handleNext}
      nextEnabled={isLast && showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={isLast && showFeedback}
      
      gameId="ai-kids-59"
      gameType="ai"
      totalLevels={100}
      currentLevel={59}
      showConfetti={isLast && showFeedback && totalScore >= 30}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg text-center">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">
              What should you do?
            </h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✅ Correct!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{currentStory.explanation}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold mb-4">
                You earned 10 Coins! 🪙
              </p>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Wrong choice! Always check and clean data before training AI.
                </p>
              </div>
            )}

            {!isLast ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question →
              </button>
            ) : (
              <>
                <p className="text-white text-xl mb-4">
                  🎯 Final Score: {totalScore} Coins
                </p>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Continue
                </button>
                <button
                  onClick={handleTryAgain}
                  className="mt-3 w-full bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition"
                >
                  Play Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GarbageInGarbageOutStory;
