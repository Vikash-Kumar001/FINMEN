import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrainingFeedbackStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      title: "Robot Misses Task 🤖",
      emoji: "🤖",
      situation: "The robot made mistakes while stacking blocks. What should the teen do?",
      choices: [
        { id: 1, text: "Give Feedback 📝", isCorrect: true },
        { id: 2, text: "Ignore Errors ❌", isCorrect: false },
      ],
    },
    {
      title: "Robot Learns Slowly 🐢",
      emoji: "🐢",
      situation: "Even after trying, the robot repeats the same mistakes. Why?",
      choices: [
        { id: 1, text: "Needs Teacher Correction 👨‍🏫", isCorrect: true },
        { id: 2, text: "Robot is Lazy 😴", isCorrect: false },
      ],
    },
    {
      title: "Provide Guidance 📚",
      emoji: "📚",
      situation: "Teen gives step-by-step instructions. Outcome?",
      choices: [
        { id: 1, text: "Robot improves faster ⚡", isCorrect: true },
        { id: 2, text: "Robot ignores instructions ❌", isCorrect: false },
      ],
    },
    {
      title: "Positive Reinforcement 🌟",
      emoji: "🌟",
      situation: "Robot completes task correctly. Teen rewards robot. Lesson?",
      choices: [
        { id: 1, text: "Feedback + Reward = Better Learning 🏆", isCorrect: true },
        { id: 2, text: "Rewards don’t matter ❌", isCorrect: false },
      ],
    },
    {
      title: "Lesson Learned 🎓",
      emoji: "🎓",
      situation: "Teen realizes that feedback helps AI improve. Outcome?",
      choices: [
        { id: 1, text: "Retraining with guidance is key ✅", isCorrect: true },
        { id: 2, text: "Let AI learn alone ❌", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins((prev) => prev + 10);
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
      navigate("/student/ai-for-all/teen/human-vs-ai-errors-quiz"); // update next game path
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
      title="Training Feedback Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-training-feedback"
      gameType="ai"
      totalLevels={20}
      currentLevel={56}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
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
                    <div className="text-4xl">{choice.text.split(" ")[1]}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.text.split(" ")[1]}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Feedback Given!" : "❌ Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Feedback helps AI learn and improve quickly. 🌟🤖
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +10 Coins Earned! 🪙
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
                    AI cannot improve without feedback. Try again! 📝
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

export default TrainingFeedbackStory;
