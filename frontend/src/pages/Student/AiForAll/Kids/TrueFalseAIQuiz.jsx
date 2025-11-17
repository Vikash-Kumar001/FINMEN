import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrueFalseAIQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 True/False Questions
  const questions = [
    {
      text: "AI means Artificial Intelligence.",
      emoji: "🤖",
      correct: "true",
    },
    {
      text: "Robots and AI are exactly the same thing.",
      emoji: "🦾",
      correct: "false",
    },
    {
      text: "AI can help doctors find diseases early.",
      emoji: "🏥",
      correct: "true",
    },
    {
      text: "AI never makes mistakes.",
      emoji: "🚫",
      correct: "false",
    },
    {
      text: "AI can learn from data and experience.",
      emoji: "📊",
      correct: "true",
    },
  ];

  const question = questions[currentQuestion];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
  };

  const handleConfirm = () => {
    const isCorrect = selectedChoice === question.correct;

    if (isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // ✅ All questions done → move to next game
      navigate("/student/ai-for-all/kids/emoji-classifier");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="True or False AI Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={() => navigate("/student/ai-for-all/kids/emoji-classifier")}
      nextEnabled={showFeedback && currentQuestion === questions.length - 1}
      showGameOver={showFeedback && currentQuestion === questions.length - 1}
      score={coins}
      gameId="ai-kids-4"
      gameType="ai"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{question.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-8">
              <p className="text-white text-2xl leading-relaxed text-center font-semibold">
                {question.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice("true")}
                className={`border-3 rounded-xl p-8 transition-all ${
                  selectedChoice === "true"
                    ? "bg-green-500/50 border-green-400 ring-2 ring-white"
                    : "bg-green-500/20 border-green-400 hover:bg-green-500/30"
                }`}
              >
                <div className="text-5xl mb-2">✓</div>
                <div className="text-white font-bold text-2xl">TRUE</div>
              </button>
              <button
                onClick={() => handleChoice("false")}
                className={`border-3 rounded-xl p-8 transition-all ${
                  selectedChoice === "false"
                    ? "bg-red-500/50 border-red-400 ring-2 ring-white"
                    : "bg-red-500/20 border-red-400 hover:bg-red-500/30"
                }`}
              >
                <div className="text-5xl mb-2">✗</div>
                <div className="text-white font-bold text-2xl">FALSE</div>
              </button>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">
              {selectedChoice === question.correct ? "✨" : "❌"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoice === question.correct ? "Perfect!" : "Not Quite..."}
            </h2>

            {selectedChoice === question.correct ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Correct! Great job understanding AI concepts. 🌟
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-6">
                  +5 Coins! 🪙 Total: {coins}
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! That’s not right — remember, {question.correct === "true"
                      ? "this statement is TRUE."
                      : "this statement is FALSE."}
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-center gap-4 mt-6">
              {selectedChoice !== question.correct ? (
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question →" : "Finish Quiz 🎉"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrueFalseAIQuiz;
