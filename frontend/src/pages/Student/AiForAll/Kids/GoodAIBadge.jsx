import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoodAIBadge = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 10 Good AI Acts
  const goodAIActs = [
    { id: 1, text: "Helped someone using AI safely", emoji: "🤝" },
    { id: 2, text: "Used AI for learning new skills", emoji: "📚" },
    { id: 3, text: "Respected privacy while using AI", emoji: "🔒" },
    { id: 4, text: "Checked AI outputs before trusting them", emoji: "🧐" },
    { id: 5, text: "Encouraged others to use AI responsibly", emoji: "💡" },
    { id: 6, text: "Played AI games with safe choices", emoji: "🎮" },
    { id: 7, text: "Shared knowledge about AI positively", emoji: "📢" },
    { id: 8, text: "Followed rules while interacting with AI", emoji: "⚖️" },
    { id: 9, text: "Promoted fairness in AI usage", emoji: "🤝" },
    { id: 10, text: "Explored creative AI safely", emoji: "🎨" },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [coins, setCoins] = useState(0);

  // ✅ Handle Yes/No Selection
  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Submit Logic
  const handleSubmit = () => {
    if (Object.keys(answers).length !== goodAIActs.length) {
      alert("Please answer all activities before submitting!");
      return;
    }

    const allYes = goodAIActs.every((act) => answers[act.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      setCoins(20);
      showCorrectAnswerFeedback(20, true);
      setTimeout(() => setShowPopup(true), 2000);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/future-imagination-journal"); // Update next path
  };

  return (
    <GameShell
      title="Badge: Good AI 🏆"
      subtitle="Safe & Responsible AI User"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      score={coins}
      gameId="ai-kids-98"
      gameType="achievement"
      totalLevels={100}
      currentLevel={98}
      showConfetti={isWinner}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Complete Good AI Activities
          </h2>
          <p className="text-white/80 mb-6 text-center">
            Answer Yes if you completed the activity safely.
          </p>

          {/* ✅ Activities */}
          <div className="space-y-4 mb-6">
            {goodAIActs.map((act) => (
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
              Submit Activities
            </button>
          </div>

          {/* ✅ Result */}
          {showResult && (
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="text-green-400 text-xl font-bold">
                  🎉 Awesome! You’ve completed all Good AI activities!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Some activities are incomplete or unsafe. Try again!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Badge Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>Good AI Badge!</strong> 🤖
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 20 Coins! 🪙
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

export default GoodAIBadge;
