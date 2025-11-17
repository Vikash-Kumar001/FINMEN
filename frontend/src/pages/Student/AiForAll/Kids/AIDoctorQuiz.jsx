import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIDoctorQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🩺 5-question AI Doctor quiz
  const questions = [
    {
      id: 1,
      question: "Can AI detect cancer in X-rays?",
      correct: "Yes ✅",
    },
    {
      id: 2,
      question: "Can AI help doctors schedule patient appointments?",
      correct: "Yes ✅",
    },
    {
      id: 3,
      question: "Does AI perform real surgeries by itself without doctors?",
      correct: "No ❌",
    },
    {
      id: 4,
      question: "Can AI remind patients to take medicines on time?",
      correct: "Yes ✅",
    },
    {
      id: 5,
      question: "Can AI help in predicting heart problems early?",
      correct: "Yes ✅",
    },
  ];

  const options = ["Yes ✅", "No ❌"];
  const currentQ = questions[currentQuestion];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentQ.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(2, false);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 400);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      if (finalScore >= 3) setCoins(10);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/smart-home-lights-game");
  };

  return (
    <GameShell
      title="AI Doctor Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={showResult && coins > 0}
      score={coins}
      gameId="ai-kids-48"
      gameType="ai"
      totalLevels={100}
      currentLevel={48}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">🩺</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">AI Doctor Quiz</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl text-center font-semibold">
                {currentQ.question}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(opt)}
                  className="bg-purple-500/30 hover:bg-purple-500/50 border-2 border-purple-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <span className="text-white text-xl font-semibold">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score >= 3 ? "🏥 AI Health Hero!" : "❌ Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You answered {score} out of {questions.length} correctly.
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI helps doctors detect diseases, manage patients, and improve healthcare safely.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              {score >= 3 ? "You earned 10 Coins! 🪙" : "Get at least 3 correct to earn coins!"}
            </p>
            {score < 3 && (
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

export default AIDoctorQuiz;
