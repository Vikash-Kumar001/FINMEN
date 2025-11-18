import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrainingHeroBadge = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 10 Training Acts
  const trainingActs = [
    { id: 1, text: "Completed AI Basics Quiz", emoji: "🧠" },
    { id: 2, text: "Played Data Collector Game", emoji: "📊" },
    { id: 3, text: "Finished Feedback Matters Story", emoji: "🤖" },
    { id: 4, text: "Completed AI Mistake Quiz", emoji: "💡" },
    { id: 5, text: "Finished Wrong Labels Puzzle", emoji: "⚠️" },
    { id: 6, text: "Completed Robot Shapes Training", emoji: "🔺" },
    { id: 7, text: "Played WhatsApp Debate Game", emoji: "💬" },
    { id: 8, text: "Finished Bully Story Challenge", emoji: "👊" },
    { id: 9, text: "Played Moral Value Mini Game", emoji: "🌟" },
    { id: 10, text: "Completed Reflection Quiz", emoji: "📝" },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Handle Completed / Not Completed
  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Submit logic
  const handleSubmit = () => {
    if (Object.keys(answers).length !== trainingActs.length) {
      alert("Please mark all training acts before submitting!");
      return;
    }

    const allCompleted = trainingActs.every((act) => answers[act.id] === "yes");
    setIsWinner(allCompleted);
    setShowResult(true);

    if (allCompleted) {
      showCorrectAnswerFeedback(25, true); // total coins for all acts
      setTimeout(() => setShowPopup(true), 2000);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/good-ai-vs-bad-ai-quiz");
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
    setIsWinner(false);
    setShowPopup(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Training Hero Badge 🏆"
      subtitle="Complete all AI training acts"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      gameId="ai-kids-75"
      gameType="ai"
      totalLevels={100}
      currentLevel={75}
      showConfetti={isWinner}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-6">
        {/* ✅ Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Training Hero Challenge 🤖
          </h2>
          <p className="text-white/80 mb-6 text-center">
            Mark each AI training game you have completed:
          </p>

          <div className="space-y-4 mb-6">
            {trainingActs.map((act) => (
              <div
                key={act.id}
                className="border border-white/30 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{act.emoji}</div>
                    <div className="text-white font-medium text-lg">{act.text}</div>
                  </div>
                  <div className="flex gap-4 mt-2 sm:mt-0">
                    <button
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        answers[act.id] === "yes"
                          ? "bg-green-500 text-white"
                          : "bg-white/20 text-white hover:bg-green-600/50"
                      }`}
                      onClick={() => handleAnswer(act.id, "yes")}
                    >
                      Completed
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        answers[act.id] === "no"
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-red-600/50"
                      }`}
                      onClick={() => handleAnswer(act.id, "no")}
                    >
                      Not Yet
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Submit Progress
            </button>
          </div>

          {/* ✅ Result Section */}
          {showResult && (
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="text-green-400 text-xl font-bold">
                  🎉 Excellent! You’ve completed all training games!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Keep going — finish all AI training games to unlock the badge.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Popup for Badge Unlock */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>Training Hero Badge!</strong> 🤖
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-blue-600 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default TrainingHeroBadge;
