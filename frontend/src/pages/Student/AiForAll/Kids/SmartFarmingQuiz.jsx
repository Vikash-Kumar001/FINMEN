import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartFarmingQuiz = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const quizQuestions = [
    {
      text: "Does AI help farmers with crop prediction?",
      emoji: "🌾",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ],
      explanation: "Yes! AI analyzes weather, soil, and crop data to help farmers predict yields and improve farming decisions."
    },
    {
      text: "Can AI detect plant diseases early?",
      emoji: "🌱",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ],
      explanation: "AI systems can identify early signs of diseases through images of crops, allowing farmers to take preventive actions."
    },
    {
      text: "Does AI help optimize water usage in farming?",
      emoji: "💧",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ],
      explanation: "AI can monitor soil moisture and irrigation needs, helping farmers save water while improving crop growth."
    },
    {
      text: "Can AI robots harvest crops automatically?",
      emoji: "🤖",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ],
      explanation: "Yes, AI-powered robots can pick fruits and vegetables efficiently, reducing manual labor and increasing productivity."
    },
    {
      text: "Does AI provide fertilizer recommendations?",
      emoji: "🧪",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false }
      ],
      explanation: "AI can suggest the right type and amount of fertilizer based on soil analysis and crop requirements."
    }
  ];

  const currentQuestion = quizQuestions[currentIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    const isCorrect = choice.isCorrect;

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
      navigate("/student/ai-for-all/kids/ai-artist-game");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const totalCoins = coins;
  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Smart Farming Quiz"
      subtitle="AI in Agriculture"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={currentIndex === quizQuestions.length - 1 && showFeedback}
      score={totalCoins}
      gameId="ai-kids-smartfarming-42"
      gameType="ai"
      totalLevels={100}
      currentLevel={42}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          // ---- Question View ----
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-green-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
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
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-green-500/20 border-green-400 hover:bg-green-500/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-3xl">{choice.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          // ---- Feedback View ----
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌟" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Well Done!" : "Not Quite..."}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{currentQuestion.explanation}</p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-6">
                +5 Coins Earned! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {/* ✅ Added Next Question Button */}
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentIndex === quizQuestions.length - 1
                ? "Finish Quiz 🎉"
                : "Next Question ➡️"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartFarmingQuiz;
