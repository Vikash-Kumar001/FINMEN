import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AirportScannerStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      emoji: "🛫",
      title: "Airport Scanner AI",
      situation:
        "The airport scans bags. AI detects a forbidden knife. Who helps ensure safety?",
      choices: [
        { id: 1, text: "AI Scanner 🛡️", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Random Security Guard 👮", emoji: "👤", isCorrect: false },
        { id: 3, text: "Traveler Himself ✈️", emoji: "🧳", isCorrect: false },
      ],
    },
    {
      id: 2,
      emoji: "🎒",
      title: "AI Luggage Check",
      situation:
        "A bag contains electronics. AI flags it for a manual check. What is AI doing?",
      choices: [
        { id: 1, text: "Guessing randomly 🎯", emoji: "❌", isCorrect: false },
        { id: 2, text: "Learning from patterns 🧠", emoji: "🤖", isCorrect: true },
        { id: 3, text: "Ignoring it 🙈", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "👁️",
      title: "Facial Recognition",
      situation:
        "AI camera identifies a passenger using facial recognition. What’s the benefit?",
      choices: [
        { id: 1, text: "Faster check-in ⚡", emoji: "🚀", isCorrect: true },
        { id: 2, text: "More paperwork 📝", emoji: "📄", isCorrect: false },
        { id: 3, text: "Longer queues 🕒", emoji: "⏳", isCorrect: false },
      ],
    },
    {
      id: 4,
      emoji: "📦",
      title: "Cargo Scanner AI",
      situation:
        "AI detects suspicious shapes in a large cargo box. What happens next?",
      choices: [
        { id: 1, text: "Security team reviews it 🛡️", emoji: "👮‍♂️", isCorrect: true },
        { id: 2, text: "AI ignores the alert 🚫", emoji: "🤷‍♂️", isCorrect: false },
        { id: 3, text: "Cargo gets lost 🪶", emoji: "📦", isCorrect: false },
      ],
    },
    {
      id: 5,
      emoji: "🧳",
      title: "Smart AI Gates",
      situation:
        "AI-powered gates scan boarding passes automatically. What does this improve?",
      choices: [
        { id: 1, text: "Speed and accuracy 🚀", emoji: "⚙️", isCorrect: true },
        { id: 2, text: "Waiting time 🕒", emoji: "⌛", isCorrect: false },
        { id: 3, text: "Confusion for travelers 😵", emoji: "😵", isCorrect: false },
      ],
    },
  ];

  const currentQ = questions[currentQuestion];
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const selected = currentQ.choices.find((c) => c.id === selectedChoice);
    if (selected.isCorrect) {
      showCorrectAnswerFeedback(2, false);
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setSelectedChoice(null);
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    } else {
      if ((score + (selected.isCorrect ? 1 : 0)) >= 4) {
        setCoins(5);
      }
      setScore((prev) => prev + (selected.isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/smart-farming-quiz");
  };

  const selectedChoiceData = currentQ.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Airport Scanner Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-kids-41"
      gameType="ai"
      totalLevels={100}
      currentLevel={41}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentQ.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentQ.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg text-center">{currentQ.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQ.choices.map((choice) => (
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
                    <div className="text-3xl">{choice.emoji}</div>
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
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "✅ Smart Airport Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              You answered {score} out of {questions.length} correctly!
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                💡 AI in airports helps scan, identify, and secure passengers and baggage — faster and safer!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>

            {score < 4 && (
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

export default AirportScannerStory;
