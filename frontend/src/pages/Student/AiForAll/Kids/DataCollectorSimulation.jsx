import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DataCollectorSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🧠 5 questions — all based on “Data Collection for AI”
  const questions = [
    {
      id: 1,
      emoji: "🖼️",
      title: "Image Collector",
      situation: "You are collecting photos for an AI to identify fruits. Which image should you choose?",
      choices: [
        { id: 1, text: "A clear photo of an apple", emoji: "🍎", isCorrect: true },
        { id: 2, text: "A blurry image", emoji: "🌫️", isCorrect: false },
        { id: 3, text: "A cartoon of a banana", emoji: "🍌", isCorrect: false },
      ],
      feedback: "Great! Clear, real images help AI models learn objects correctly.",
    },
    {
      id: 2,
      emoji: "🎵",
      title: "Sound Recorder",
      situation: "AI is learning animal sounds. Which data is correct?",
      choices: [
        { id: 1, text: "A recording of a cat’s meow", emoji: "🐱", isCorrect: true },
        { id: 2, text: "A random background noise", emoji: "📢", isCorrect: false },
        { id: 3, text: "A person saying 'meow'", emoji: "🗣️", isCorrect: false },
      ],
      feedback: "Right! Authentic sound data helps AI recognize real patterns.",
    },
    {
      id: 3,
      emoji: "📄",
      title: "Text Collector",
      situation: "You are training an AI chatbot. Which text should you collect?",
      choices: [
        { id: 1, text: "Polite and correct sentences", emoji: "💬", isCorrect: true },
        { id: 2, text: "Spam messages", emoji: "🚫", isCorrect: false },
        { id: 3, text: "Broken text with symbols", emoji: "❌", isCorrect: false },
      ],
      feedback: "Exactly! Clean, polite text data improves chatbot behavior.",
    },
    {
      id: 4,
      emoji: "📸",
      title: "Diversity Matters",
      situation: "To make AI fair, what kind of images should be collected?",
      choices: [
        { id: 1, text: "Images from many people and places", emoji: "🌍", isCorrect: true },
        { id: 2, text: "Only from one country", emoji: "🇮🇳", isCorrect: false },
        { id: 3, text: "Only of famous people", emoji: "⭐", isCorrect: false },
      ],
      feedback: "Perfect! Diverse datasets help AI be unbiased and fair.",
    },
    {
      id: 5,
      emoji: "💾",
      title: "Data Safety",
      situation: "Before uploading data, what must you do?",
      choices: [
        { id: 1, text: "Remove personal details", emoji: "🔒", isCorrect: true },
        { id: 2, text: "Share full contact info", emoji: "📱", isCorrect: false },
        { id: 3, text: "Post on social media", emoji: "📢", isCorrect: false },
      ],
      feedback: "Excellent! Data privacy is vital when collecting information for AI.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setTotalCoins((prev) => prev + 10);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/training-hero-badge");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="Data Collector Simulation"
      score={coins}
      subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && currentQuestionIndex === questions.length - 1 && coins > 0}
      
      gameId="ai-kids-data-collector-74"
      gameType="ai"
      totalLevels={100}
      currentLevel={74}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentQuestion.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.situation}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✅ Correct Data!" : "❌ Not the Right Data!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentQuestion.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question ➡️"
                    : "Finish Simulation ✅"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Remember: Data should be accurate, diverse, and clean before training AI!
                  </p>
                </div>
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

export default DataCollectorSimulation;
