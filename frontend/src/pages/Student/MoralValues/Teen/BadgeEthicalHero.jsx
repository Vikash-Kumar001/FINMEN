import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeEthicalHero = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ 5 Ethical Dilemmas (Yes/No)
  const ethicalDilemmas = [
    { id: 1, text: "Returned a lost wallet instead of keeping it", emoji: "👛" },
    { id: 2, text: "Told the truth even when it was hard", emoji: "💬" },
    { id: 3, text: "Stood up for someone being treated unfairly", emoji: "🧍‍♂️" },
    { id: 4, text: "Chose fairness over personal gain", emoji: "⚖️" },
    { id: 5, text: "Admitted a mistake instead of hiding it", emoji: "🙌" },
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
    if (Object.keys(answers).length !== ethicalDilemmas.length) {
      alert("Please answer all dilemmas before submitting!");
      return;
    }

    const allYes = ethicalDilemmas.every((d) => answers[d.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      showCorrectAnswerFeedback(1, true);
      setTimeout(() => setShowPopup(true), 6000); // 🎉 Show popup after 6s
    }
  };

  const handleNext = () => {
    navigate("/games/moral-values/teens/friend-lie-story");
  };

  return (
    <GameShell
      title="Badge: Ethical Hero"
      subtitle="Ethical Excellence"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      gameId="moral-teen-100"
      gameType="moral"
      totalLevels={100}
      currentLevel={100}
      showConfetti={isWinner}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-6">
        {/* ✅ Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Ethical Hero Challenge ⚖️
          </h2>

          <p className="text-white/80 mb-6 text-center">
            Answer truthfully — do you act ethically in these situations?
          </p>

          {/* ✅ 5 Dilemmas with Yes/No Buttons */}
          <div className="space-y-4 mb-6">
            {ethicalDilemmas.map((d) => (
              <div
                key={d.id}
                className="border border-white/30 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{d.emoji}</div>
                    <div className="text-white font-medium text-lg">{d.text}</div>
                  </div>
                  <div className="flex gap-4 mt-2 sm:mt-0">
                    <button
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        answers[d.id] === "yes"
                          ? "bg-green-500 text-white"
                          : "bg-white/20 text-white hover:bg-green-600/50"
                      }`}
                      onClick={() => handleAnswer(d.id, "yes")}
                    >
                      Yes
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        answers[d.id] === "no"
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-red-600/50"
                      }`}
                      onClick={() => handleAnswer(d.id, "no")}
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
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Submit Answers
            </button>
          </div>

          {/* ✅ Result Section */}
          {showResult && (
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="text-green-400 text-xl font-bold">
                  🌟 Ethical Excellence Achieved! You’re a True Hero!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Reflect again — ethics means doing right even when it’s hard!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Popup for Badge Unlock */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>Ethical Hero Badge!</strong> ⚖️
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-orange-600 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default BadgeEthicalHero;
