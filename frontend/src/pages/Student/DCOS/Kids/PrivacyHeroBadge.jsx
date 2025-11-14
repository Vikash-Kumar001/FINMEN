import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PrivacyHeroBadge = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🛡️ Privacy Protection Acts
  const privacyActs = [
    { id: 1, text: "Never share your home address online", emoji: "🏠" },
    { id: 2, text: "Keep your passwords secret", emoji: "🔒" },
    { id: 3, text: "Ask parents before sharing photos", emoji: "📸" },
    { id: 4, text: "Turn off location sharing", emoji: "📍" },
    { id: 5, text: "Don’t post personal details in chats", emoji: "💬" },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Handle Yes/No answer
  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Submit logic
  const handleSubmit = () => {
    if (Object.keys(answers).length !== privacyActs.length) {
      alert("Please answer all privacy acts before submitting!");
      return;
    }

    const allYes = privacyActs.every((act) => answers[act.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      showCorrectAnswerFeedback(1, true);
      setTimeout(() => setShowPopup(true), 6000); // Popup after 6 sec
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/digital-footprint-story");
  };

  return (
    <GameShell
      title="Privacy Hero Badge"
      subtitle="Smart Privacy Protection Habits"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      gameId="dcos-kids-60"
      gameType="achievement"
      totalLevels={100}
      currentLevel={60}
      showConfetti={isWinner}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Privacy Hero Challenge: Online Safety Acts
          </h2>

          <p className="text-white/80 mb-6 text-center">
            Answer honestly — are you following these privacy protection habits?
          </p>

          {/* 🧩 Acts List */}
          <div className="space-y-4 mb-6">
            {privacyActs.map((act) => (
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

          {/* ✅ Submit */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Submit Answers
            </button>
          </div>

          {/* ✅ Result Text */}
          {showResult && (
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="text-green-400 text-xl font-bold">
                  🌟 Excellent! You’re a Privacy Hero!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Some privacy habits missing — be careful online!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🏅 Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>Privacy Hero Kid Badge!</strong> 👏
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-purple-600 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default PrivacyHeroBadge;
