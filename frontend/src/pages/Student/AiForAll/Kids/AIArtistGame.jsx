import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIArtistGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const quizQuestions = [
    {
      text: "Can AI help you draw creative pictures from your ideas?",
      emoji: "🎨",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Yes! AI can turn your words into amazing pictures, just like DALL·E or other art generators.",
    },
    {
      text: "Can AI draw a flying cat if you tell it to?",
      emoji: "🐱✨",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Yes! AI can imagine and draw creative scenes from your text prompts — even flying cats!",
    },
    {
      text: "Does AI use data from artists to learn how to draw?",
      emoji: "🧠🖌️",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "AI learns from many artworks and styles to understand colors, shapes, and how to draw objects.",
    },
    {
      text: "Can AI draw emotions, like a happy or sad face?",
      emoji: "😊😢",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Yes! AI can capture emotions and expressions when asked, just like an artist does.",
    },
    {
      text: "Can humans and AI work together to make art?",
      emoji: "🤝🎨",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Of course! Many artists use AI tools to enhance creativity — AI helps, but you imagine!",
    },
  ];

  const currentQuestion = quizQuestions[currentIndex];

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    const isCorrect = choice?.isCorrect;

    if (isCorrect) {
      setCoins((prev) => prev + 5);
      showCorrectAnswerFeedback(5, true);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/music-ai-story");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const selectedChoiceData = currentQuestion.choices.find(
    (c) => c.id === selectedChoice
  );

  return (
    <GameShell
      title="AI Artist Game 🎨"
      subtitle="Learn how AI creates art from imagination!"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={currentIndex === quizQuestions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-kids-artist-43"
      gameType="ai"
      totalLevels={100}
      currentLevel={43}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          // Question Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-9xl mb-6">{currentQuestion.emoji}</div>
            <div className="bg-purple-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-pink-500/50 border-pink-400 ring-2 ring-white"
                      : "bg-purple-500/20 border-purple-400 hover:bg-purple-500/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-3xl">
                    {choice.text}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          // Feedback Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">
              {selectedChoiceData?.isCorrect ? "🌟" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Great Job!" : "Oops!"}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <p className="text-white">{currentQuestion.explanation}</p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold mb-6">
                +5 Coins Earned! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔄
              </button>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentIndex === quizQuestions.length - 1
                ? "Finish Game 🎉"
                : "Next Question ➡️"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIArtistGame;
