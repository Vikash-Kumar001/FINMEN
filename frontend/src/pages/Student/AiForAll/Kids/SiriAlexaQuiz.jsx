import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SiriAlexaQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // ✅ 5 Questions in same flow
  const questions = [
    {
      text: "Is Alexa an AI?",
      emoji: "🔊",
      choices: [
        { id: 1, text: "Yes", emoji: "✓", isCorrect: true },
        { id: 2, text: "No", emoji: "✗", isCorrect: false },
      ],
      correctMsg:
        "Yes! Alexa, Siri, and Google Assistant are all AI — they understand your voice and help you with tasks!",
      wrongMsg:
        "Alexa IS an AI! Voice assistants like Siri and Alexa use AI to understand and respond to you.",
    },
    {
      text: "What can Siri do using AI?",
      emoji: "📱",
      choices: [
        { id: 1, text: "Set alarms and reminders", emoji: "⏰", isCorrect: true },
        { id: 2, text: "Cook food", emoji: "🍳", isCorrect: false },
      ],
      correctMsg:
        "Correct! Siri uses AI to understand commands like setting alarms or reminders.",
      wrongMsg:
        "Not quite! Siri can’t cook — but she can set alarms, call people, and answer questions using AI.",
    },
    {
      text: "Does Alexa learn from your voice patterns?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Yes, to improve answers", emoji: "💡", isCorrect: true },
        { id: 2, text: "No, it never learns", emoji: "🚫", isCorrect: false },
      ],
      correctMsg:
        "Exactly! Alexa learns from your speech patterns to understand you better over time.",
      wrongMsg:
        "Actually, Alexa uses machine learning to recognize and improve its understanding of your voice.",
    },
    {
      text: "Which of these is NOT an AI assistant?",
      emoji: "🤔",
      choices: [
        { id: 1, text: "Google Assistant", emoji: "🎙️", isCorrect: false },
        { id: 2, text: "Refrigerator", emoji: "🧊", isCorrect: true },
      ],
      correctMsg:
        "Right! A refrigerator isn’t an AI assistant — Google Assistant, Siri, and Alexa are!",
      wrongMsg:
        "Oops! A refrigerator is not an AI — AI assistants like Google Assistant and Alexa can talk and respond!",
    },
    {
      text: "How do Siri and Alexa help us daily?",
      emoji: "💬",
      choices: [
        { id: 1, text: "By answering questions and reminders", emoji: "🧠", isCorrect: true },
        { id: 2, text: "By playing video games for us", emoji: "🎮", isCorrect: false },
      ],
      correctMsg:
        "Perfect! They assist with reminders, answers, and tasks using speech recognition AI.",
      wrongMsg:
        "Not really! Siri and Alexa help by listening, answering, and reminding — not gaming.",
    },
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setTotalCoins((prev) => prev + 5);
    } else {
      setCoins(0);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      setCoins(0);
      resetFeedback();
    } else {
      // Move to next game after last question
      navigate("/student/ai-for-all/kids/ai-in-games");
    }
  };

  return (
    <GameShell
      title="Siri/Alexa Quiz"
      subtitle="AI Assistants"
      score={totalCoins}
      gameId="ai-kids-10"
      gameType="ai"
      totalLevels={100}
      currentLevel={10}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-white/70 mb-3 text-sm">
              Question {currentQuestion + 1} / {questions.length}
            </div>
            <div className="text-9xl mb-6">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl font-semibold">{current.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`border-3 rounded-xl p-10 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">{coins > 0 ? "🌟" : "❌"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins > 0 ? "Correct!" : "Oops!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 italic">{selectedChoiceData.text}</p>

            <div
              className={`rounded-lg p-4 mb-4 ${
                coins > 0 ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <p className="text-white text-center">
                {coins > 0 ? current.correctMsg : current.wrongMsg}
              </p>
            </div>

            {coins > 0 && (
              <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                +5 Coins 🪙
              </p>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < questions.length - 1
                ? "Next Question →"
                : "Finish Quiz 🎉"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SiriAlexaQuiz;
