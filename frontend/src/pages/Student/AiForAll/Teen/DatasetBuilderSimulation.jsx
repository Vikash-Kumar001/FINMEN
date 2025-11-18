import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DatasetBuilderSimulation = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback, showAnswerConfetti, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      question: "To train an AI to recognize fruits 🍎🍌🍇, what should you collect?",
      options: ["📸 Images", "🔊 Sounds", "📝 Words"],
      correct: "📸 Images",
    },
    {
      id: 2,
      question: "You want AI to understand animal noises 🐶🐱🐘. What do you collect?",
      options: ["🔊 Sounds", "📸 Images", "💬 Texts"],
      correct: "🔊 Sounds",
    },
    {
      id: 3,
      question: "To teach AI different languages 🌍, what data helps most?",
      options: ["📸 Pictures", "🗣️ Words", "🎵 Music"],
      correct: "🗣️ Words",
    },
    {
      id: 4,
      question: "AI learning traffic signs 🚦 needs what type of dataset?",
      options: ["📸 Images", "🔊 Sounds", "🗣️ Words"],
      correct: "📸 Images",
    },
    {
      id: 5,
      question: "If AI must identify birds by their songs 🐦🎶, what data do you need?",
      options: ["🔊 Sounds", "📸 Photos", "📖 Descriptions"],
      correct: "🔊 Sounds",
    },
  ];

  const currentQ = questions[currentQuestion];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    const isCorrect = selectedAnswer === currentQ.correct;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(2, false);
    }

    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      if (finalScore >= 3) setCoins(10);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/bias-in-data-quiz");
  };

  return (
    <GameShell
      title="Dataset Builder Simulation"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
      showGameOver={showResult && score >= 3}
      score={coins}
      gameId="ai-teen-20"
      gameType="simulation"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">📂</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedAnswer === option
                      ? "bg-green-500/50 border-green-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-4xl font-bold text-white">{option}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedAnswer}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAnswer
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer ✅
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">📊</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 3 ? "🎉 Dataset Complete!" : "💪 Keep Building!"}
            </h2>

            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {questions.length} correctly!
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm mb-3">
                💡 Datasets are the building blocks of AI. 
                They include <strong>images, sounds, and text</strong> that teach AI how to see, hear, and understand.
              </p>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• 🧠 More data → smarter AI!</li>
                <li>• 📸 Images teach recognition.</li>
                <li>• 🔊 Sounds train voice systems.</li>
                <li>• 💬 Text helps language AI learn meaning.</li>
              </ul>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 3
                ? "You earned 10 Coins! 🪙"
                : "Get 3 or more correct to earn coins!"}
            </p>

            {score < 3 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again 🔁
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DatasetBuilderSimulation;
