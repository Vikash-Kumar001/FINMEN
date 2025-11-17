import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AITrainingBadge = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ 5 AI Training Acts (Yes/No)
  const aiTrainingActs = [
    { id: 1, text: "Completed at least one AI learning story", emoji: "📘" },
    { id: 2, text: "Tried identifying good vs bad data in AI", emoji: "🧩" },
    { id: 3, text: "Helped fix a robot’s wrong learning", emoji: "🤖" },
    { id: 4, text: "Understood how AI improves with training", emoji: "📊" },
    { id: 5, text: "Played all AI training mini-games with focus", emoji: "🎮" },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Handle Yes/No Selection
  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Submit Logic
  const handleSubmit = () => {
    if (Object.keys(answers).length !== aiTrainingActs.length) {
      alert("Please answer all questions before submitting!");
      return;
    }

    const allYes = aiTrainingActs.every((act) => answers[act.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      showCorrectAnswerFeedback(20, true);
      setTimeout(() => setShowPopup(true), 6000); // 🎉 popup after 6s
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/teach-numbers-game"); // next level path
  };

  return (
    <GameShell
      title="Badge: AI Training Hero 🏆"
      subtitle="Complete all AI Training Tasks"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      gameId="ai-kids-60"
      gameType="ai"
      totalLevels={100}
      currentLevel={60}
      showConfetti={isWinner}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-6">
        {/* ✅ Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            AI Training Hero Challenge 🧠
          </h2>

          <p className="text-white/80 mb-6 text-center">
            Answer truthfully — have you completed your AI training tasks?
          </p>

          {/* ✅ 5 Acts */}
          <div className="space-y-4 mb-6">
            {aiTrainingActs.map((act) => (
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
                      Yes
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        answers[act.id] === "no"
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-red-600/50"
                      }`}
                      onClick={() => handleAnswer(act.id, "no")}
                    >
                      No
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
              Submit Answers
            </button>
          </div>

          {/* ✅ Result Section */}
          {showResult && (
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="text-green-400 text-xl font-bold">
                  🎉 Excellent! You’re now an AI Training Hero!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Keep training — complete all AI tasks and try again!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Popup for Badge Unlock */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏅</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>AI Training Hero Badge!</strong> 🤖
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

export default AITrainingBadge;
