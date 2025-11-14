import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIEthicsBadge = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ 5 AI Ethics Acts
  const aiActs = [
    { id: 1, text: "Used AI tools responsibly", emoji: "🤖" },
    { id: 2, text: "Checked AI facts before sharing", emoji: "🔍" },
    { id: 3, text: "Did not share personal data with AI", emoji: "🔒" },
    { id: 4, text: "Gave credit when using AI help", emoji: "✍️" },
    { id: 5, text: "Encouraged friends to use AI safely", emoji: "💬" },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Handle Yes/No selection
  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Submit logic
  const handleSubmit = () => {
    if (Object.keys(answers).length !== aiActs.length) {
      alert("Please answer all AI acts before submitting!");
      return;
    }

    const allYes = aiActs.every((act) => answers[act.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      showCorrectAnswerFeedback(1, true);
      setTimeout(() => setShowPopup(true), 6000); // show popup after 6s
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/kind-vs-mean-quiz");
  };

  return (
    <GameShell
      title="AI Ethics Badge"
      subtitle="Show Your Responsible AI Habits"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      gameId="dcos-kids-80"
      gameType="educational"
      totalLevels={100}
      currentLevel={80}
      showConfetti={isWinner}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-6">
        {/* ✅ Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            AI Ethics Challenge: Smart AI Habits
          </h2>

          <p className="text-white/80 mb-6 text-center">
            Answer honestly — are you practicing these safe AI habits?
          </p>

          {/* ✅ AI Acts with Yes/No Buttons */}
          <div className="space-y-4 mb-6">
            {aiActs.map((act) => (
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Submit Answers
            </button>
          </div>

          {/* ✅ Result Message */}
          {showResult && (
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="text-green-400 text-xl font-bold">
                  🌟 Excellent! You’re an AI Ethics Hero!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Some habits need improvement — keep learning about safe AI use!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Final Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>AI Ethics Kid Badge!</strong> 🤖✨
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-red-600 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default AIEthicsBadge;
