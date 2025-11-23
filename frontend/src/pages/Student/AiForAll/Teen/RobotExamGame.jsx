import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotExamGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      title: "Math Only Robot 🧮",
      situation:
        "The robot studied only math before an exam. The test includes science and history. Will it pass?",
      choices: [
        { id: 1, text: "❌ No, it needs all subjects", isCorrect: true },
        { id: 2, text: "✅ Yes, math is enough", isCorrect: false },
      ],
    },
    {
      title: "Retraining the Robot 🤖",
      situation:
        "You retrain the robot with math, science, and history. What happens next?",
      choices: [
        { id: 1, text: "🏆 It performs better!", isCorrect: true },
        { id: 2, text: "😴 It gets confused", isCorrect: false },
      ],
    },
    {
      title: "Diverse Data 📚",
      situation:
        "Why does the robot need data from multiple subjects?",
      choices: [
        { id: 1, text: "💡 To understand patterns in all topics", isCorrect: true },
        { id: 2, text: "🚫 Just for decoration", isCorrect: false },
      ],
    },
    {
      title: "Limited Knowledge 🚧",
      situation:
        "If the robot only learns from one kind of data, what’s the risk?",
      choices: [
        { id: 1, text: "❌ It gives wrong answers in new topics", isCorrect: true },
        { id: 2, text: "✅ It becomes perfect", isCorrect: false },
      ],
    },
    {
      title: "AI Exam Success 🧠",
      situation:
        "What helps AI pass its ‘exam’ in the real world?",
      choices: [
        { id: 1, text: "🌍 Training on large, diverse data", isCorrect: true },
        { id: 2, text: "📘 Repeating one subject", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find(
      (c) => c.id === selectedChoice
    );

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins((prev) => prev + 2);
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
      navigate("/student/ai-for-all/teen/data-cleaning-reflex"); // next game path
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Robot Exam Game"
      subtitle="Importance of Variety in Training"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-robot-exam"
      gameType="ai"
      totalLevels={20}
      currentLevel={66}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {current.situation}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
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
                    <div className="text-4xl">{choice.text.split(" ")[0]}</div>
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
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.text.split(" ")[0]}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Correct!" : "❌ Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData?.text}
            </p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great job! 🎉 AI needs **diverse training data** from multiple
                    sources — just like a student studying all subjects to ace exams! 🧠📘
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +2 Coins Earned! 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Oops! A robot trained on only one subject fails in others. Try again with full data! 📚🤖
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotExamGame;
