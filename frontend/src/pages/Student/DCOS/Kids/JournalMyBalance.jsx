import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalMyBalance = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      prompt: "Today I played offline for ___ minutes.",
      emoji: "⏰",
    },
    {
      id: 2,
      prompt: "What offline activity did I enjoy the most today?",
      emoji: "⚽",
    },
    {
      id: 3,
      prompt: "How did playing offline make me feel?",
      emoji: "😊",
    },
    {
      id: 4,
      prompt: "One thing I noticed when I was away from screens:",
      emoji: "🌿",
    },
    {
      id: 5,
      prompt: "Tomorrow, I want to spend ___ minutes offline.",
      emoji: "📅",
    },
  ];

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCoins(5);
      showCorrectAnswerFeedback(5, true);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setAnswers(["", "", "", "", ""]);
    setShowResult(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/teens/balance-badge");
  };

  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  return (
    <GameShell
      title="Journal: My Balance"
      subtitle="Reflect on your offline time"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-teens-29"
      gameType="journal"
      totalLevels={100}
      currentLevel={29}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between mb-4 text-sm text-white/70">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{progress}% done</span>
            </div>

            <div className="text-7xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {questions[currentQuestion].prompt}
            </h2>

            <textarea
              rows={4}
              value={answers[currentQuestion]}
              onChange={handleAnswerChange}
              placeholder="Write your thoughts here..."
              className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            ></textarea>

            <button
              onClick={handleNextQuestion}
              disabled={!answers[currentQuestion].trim()}
              className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition ${
                answers[currentQuestion].trim()
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentQuestion < questions.length - 1 ? "Next ➡️" : "Finish Journal 📝"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">🌟 Great Reflection!</h2>
            <p className="text-white/90 text-lg mb-4">
              You completed your “My Balance” journal and reflected on your offline time today.
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Remember — real fun happens offline too! You’re learning to balance your screen time beautifully.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              You earned 5 Coins! 🪙
            </p>
            <button
              onClick={handleTryAgain}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Write Again ✍️
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalMyBalance;
