import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfIntegrity = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      question: "What is Integrity?",
      options: [
        { id: 1, text: "Doing right even when no one is watching", isCorrect: true },
        { id: 2, text: "Doing what's popular", isCorrect: false },
        { id: 3, text: "Following the crowd", isCorrect: false },
      ],
    },
    {
      id: 2,
      question: "If you find a lost wallet, what should you do?",
      options: [
        { id: 1, text: "Keep it quietly", isCorrect: false },
        { id: 2, text: "Return it to the owner or authorities", isCorrect: true },
        { id: 3, text: "Take the money and throw the wallet", isCorrect: false },
      ],
    },
    {
      id: 3,
      question: "Which action shows integrity in exams?",
      options: [
        { id: 1, text: "Helping others cheat", isCorrect: false },
        { id: 2, text: "Cheating if no one notices", isCorrect: false },
        { id: 3, text: "Attempting honestly even if it's hard", isCorrect: true },
      ],
    },
    {
      id: 4,
      question: "Your friend breaks a rule and blames you. You should...",
      options: [
        { id: 1, text: "Stay silent to avoid conflict", isCorrect: false },
        { id: 2, text: "Speak honestly and explain what happened", isCorrect: true },
        { id: 3, text: "Blame someone else", isCorrect: false },
      ],
    },
    {
      id: 5,
      question: "Which quote best represents integrity?",
      options: [
        { id: 1, text: "‘Character is who you are when no one’s watching.’", isCorrect: true },
        { id: 2, text: "‘Winning matters most.’", isCorrect: false },
        { id: 3, text: "‘Do what everyone else is doing.’", isCorrect: false },
      ],
    },
  ];

  const handleMatch = (optionId) => {
    setSelectedMatch(optionId);
  };

  const handleConfirm = () => {
    const selectedOption = questions[currentQuestion].options.find(
      (opt) => opt.id === selectedMatch
    );

    if (selectedOption.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedMatch(null);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedMatch(null);
    setShowResult(false);
    setCoins(0);
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/bribe-simulation");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Puzzle of Integrity"
      subtitle="Understanding what true integrity means"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={showResult && coins > 0}
      score={coins}
      gameId="moral-teen-4"
      gameType="moral"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">💎</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {currentQ.question}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleMatch(opt.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedMatch === opt.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">
                    {opt.text}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedMatch}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedMatch
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentQuestion + 1 === questions.length ? "Finish Quiz" : "Confirm Answer"}
            </button>

            <p className="text-center text-white/70 mt-4">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">💎</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              🎉 Integrity Quiz Complete!
            </h2>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-lg">
                Well done! Integrity is about doing the right thing even when
                nobody's watching. You scored{" "}
                <span className="text-yellow-300 font-bold">{coins}/5</span> 💎
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins * 5} Coins! 🪙
            </p>

            <button
              onClick={handleTryAgain}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfIntegrity;
