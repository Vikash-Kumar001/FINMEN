import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizDiscipline = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which shows discipline in submitting assignments?",
      emoji: "📝",
      choices: [
        { id: 1, text: "Submit late", emoji: "😅", isCorrect: false },
        { id: 2, text: "Submit early", emoji: "✅", isCorrect: true },
      ],
    },
    {
      id: 2,
      text: "How should you manage daily tasks?",
      emoji: "📅",
      choices: [
        { id: 1, text: "Procrastinate and rush at the end", emoji: "⏳", isCorrect: false },
        { id: 2, text: "Plan and complete on time", emoji: "📌", isCorrect: true },
      ],
    },
    {
      id: 3,
      text: "Which habit shows discipline at work?",
      emoji: "💼",
      choices: [
        { id: 1, text: "Arrive late regularly", emoji: "😴", isCorrect: false },
        { id: 2, text: "Arrive on time consistently", emoji: "⏰", isCorrect: true },
      ],
    },
    {
      id: 4,
      text: "In studies, disciplined students...",
      emoji: "📚",
      choices: [
        { id: 1, text: "Cram at last minute", emoji: "😬", isCorrect: false },
        { id: 2, text: "Revise regularly", emoji: "🎯", isCorrect: true },
      ],
    },
    {
      id: 5,
      text: "Regarding responsibilities, discipline means...",
      emoji: "⚖️",
      choices: [
        { id: 1, text: "Ignore deadlines", emoji: "🚫", isCorrect: false },
        { id: 2, text: "Meet deadlines consistently", emoji: "🏆", isCorrect: true },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion.choices.find(
    (c) => c.id === selectedChoice
  );

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/reflex-time-management");
    }
  };

  return (
    <GameShell
      title="Quiz of Discipline"
      subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
      score={coins}
      gameId="moral-teen-32"
      gameType="moral"
      totalLevels={100}
      currentLevel={32}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
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
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.text}
            </p>

            {selectedChoiceData.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  You earned 3 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Submitting late or ignoring deadlines shows lack of discipline.
                    Stay consistent and punctual!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizDiscipline;
