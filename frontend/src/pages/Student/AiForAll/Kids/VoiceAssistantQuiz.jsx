import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VoiceAssistantQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "Is Siri or Alexa an AI?",
      emoji: "🎙️",
      choices: [
        { id: 1, text: "Yes, they are AI 🤖", emoji: "✅", isCorrect: true },
        { id: 2, text: "No, they are not AI ❌", emoji: "❌", isCorrect: false },
      ],
      feedback:
        "Yes! Siri and Alexa are AI voice assistants. They listen, understand, and help us by answering questions, setting reminders, or playing music!",
    },
    {
      text: "Which device usually has Alexa?",
      emoji: "📱",
      choices: [
        { id: 1, text: "Amazon Echo 🟣", emoji: "🟣", isCorrect: true },
        { id: 2, text: "Washing Machine 🧺", emoji: "🧺", isCorrect: false },
      ],
      feedback:
        "Alexa is mostly found in Amazon Echo devices — your smart speaker that can play songs, answer questions, and more!",
    },
    {
      text: "Can voice assistants learn from our commands?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Yes, they improve with use 💡", emoji: "💡", isCorrect: true },
        { id: 2, text: "No, they stay the same always 🚫", emoji: "🚫", isCorrect: false },
      ],
      feedback:
        "Correct! Voice assistants use machine learning to improve their understanding over time based on your voice patterns.",
    },
    {
      text: "Which of these is NOT a voice assistant?",
      emoji: "❓",
      choices: [
        { id: 1, text: "Siri 🍎", emoji: "🍎", isCorrect: false },
        { id: 2, text: "Google Assistant 🔍", emoji: "🔍", isCorrect: false },
        { id: 3, text: "Photoshop 🎨", emoji: "🎨", isCorrect: true },
      ],
      feedback:
        "Right! Photoshop is a design tool, not a voice assistant. Siri and Google Assistant are examples of AI voice helpers.",
    },
    {
      text: "What can voice assistants NOT do yet?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Control smart lights 💡", emoji: "💡", isCorrect: false },
        { id: 2, text: "Cook food 🍳", emoji: "🍳", isCorrect: true },
      ],
      feedback:
        "Exactly! Voice assistants can’t cook food — but they can help you set a timer or tell you a recipe!",
    },
  ];

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = question.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins(totalCoins + 5);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/youtube-recommendation-game");
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
      title="Voice Assistant Quiz"
      subtitle="Discover Voice AI"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={totalCoins}
      gameId="ai-kids-28"
      gameType="ai"
      totalLevels={100}
      currentLevel={28}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                Q{currentQuestion + 1}. {question.text}
              </p>
            </div>

            <div className={`grid grid-cols-${question.choices.length === 3 ? "3" : "2"} gap-4`}>
              {question.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-8 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/10 hover:bg-white/20 border-white/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-2xl text-center">{choice.text}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{coins > 0 ? "🤖" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "🎉 Correct!" : "Think Again..."}
            </h2>

            <div
              className={`rounded-lg p-4 mb-4 ${
                coins > 0 ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">{question.feedback}</p>
            </div>

            {coins > 0 ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 5 Coins! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {coins > 0 && (
              <button
                onClick={handleNextQuestion}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default VoiceAssistantQuiz;
