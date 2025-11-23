import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FootprintBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ 5 Safe Posting Habits
  const postingActs = [
    { id: 1, text: "Post only kind and positive messages", emoji: "💬" },
    { id: 2, text: "Think before sharing a photo", emoji: "📸" },
    { id: 3, text: "Avoid posting personal details", emoji: "🛑" },
    { id: 4, text: "Ask permission before tagging others", emoji: "👥" },
    { id: 5, text: "Report unsafe or rude posts", emoji: "🚨" },
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
    if (Object.keys(answers).length !== postingActs.length) {
      alert("Please answer all posting habits before submitting!");
      return;
    }

    const allYes = postingActs.every((act) => answers[act.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      showCorrectAnswerFeedback(1, true);
      setTimeout(() => setShowPopup(true), 6000);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/smart-robot-story");
  };

  return (
    <GameShell
      title="Footprint Badge"
      subtitle="Smart Posting Habits"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      gameId="dcos-kids-70"
      gameType="educational"
      totalLevels={100}
      currentLevel={70}
      showConfetti={isWinner}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-6">
        {/* ✅ Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Footprint Challenge: Safe Posting Acts
          </h2>

          <p className="text-white/80 mb-6 text-center">
            Are you being a smart and kind digital citizen online?
          </p>

          {/* ✅ Posting Acts with Yes/No Buttons */}
          <div className="space-y-4 mb-6">
            {postingActs.map((act) => (
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
                  🌟 Great job! You’re a Smart Poster!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Some habits are missing — review your digital footprint!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Final Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏅</div>
            <h3 className="text-3xl font-bold mb-2">Smart Poster Badge!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>Digital Footprint Hero Badge!</strong> 👏
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-purple-700 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default FootprintBadge;
