import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AITranslatorQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "Is Google Translate an AI?",
      emoji: "🌐",
      choices: [
        { id: 1, text: "Yes, it uses AI 🤖", emoji: "✅", isCorrect: true },
        { id: 2, text: "No, it doesn’t ❌", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Yes! Google Translate uses AI to understand and translate languages automatically.",
    },
    {
      text: "What helps AI translation apps learn new languages?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Reading lots of text data 📖", emoji: "🧠", isCorrect: true },
        { id: 2, text: "Random guessing 🎯", emoji: "🎲", isCorrect: false },
      ],
      explanation:
        "AI learns from huge amounts of text data to understand meaning and grammar.",
    },
    {
      text: "Can AI translators improve over time?",
      emoji: "⏳",
      choices: [
        { id: 1, text: "Yes, they keep learning 🧩", emoji: "🚀", isCorrect: true },
        { id: 2, text: "No, they stay the same ⚙️", emoji: "🛑", isCorrect: false },
      ],
      explanation:
        "Correct! AI translators improve as they get more data and feedback from users.",
    },
    {
      text: "If AI mistranslates something, what should humans do?",
      emoji: "💬",
      choices: [
        { id: 1, text: "Report or correct it 📝", emoji: "✅", isCorrect: true },
        { id: 2, text: "Ignore it 😐", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Right! User feedback helps AI systems improve accuracy and learn better translations.",
    },
    {
      text: "Which of these is NOT an AI translator?",
      emoji: "🚫",
      choices: [
        { id: 1, text: "Google Translate 🌐", emoji: "🤖", isCorrect: false },
        { id: 2, text: "Paper Dictionary 📘", emoji: "📖", isCorrect: true },
      ],
      explanation:
        "Exactly! A paper dictionary isn’t AI — it’s static. AI translators work dynamically using machine learning.",
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    if (!selectedChoice) return;
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      setCoins((prev) => prev + 10);
      showCorrectAnswerFeedback(10, true);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // Game completed
      navigate("/student/ai-for-all/kids/weather-prediction-story"); // next game route
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="AI Translator Quiz"
      subtitle="Discover Language AI"
      score={coins}
      gameId="ai-kids-37"
      gameType="ai"
      totalLevels={100}
      currentLevel={37}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      backPath="/games/ai-for-all/kids"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-2xl text-center font-semibold">{current.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-2 rounded-xl p-8 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/30 hover:bg-white/30"
                  }`}
                >
                  <div className="text-5xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-xl text-center">{choice.text}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">
              {selectedChoiceData?.isCorrect ? "🎉" : "🤔"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "Correct!" : "Think Again..."}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedChoiceData?.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{current.explanation}</p>
            </div>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-6">
                +10 Coins 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {selectedChoiceData?.isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question →
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AITranslatorQuiz;
