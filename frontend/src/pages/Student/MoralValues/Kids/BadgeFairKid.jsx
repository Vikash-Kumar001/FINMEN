import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeFairKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ Fairness Acts (Yes/No)
  const fairActs = [
    { id: 1, text: "Shared your toy with a friend", emoji: "🧸" },
    { id: 2, text: "Waited patiently for your turn", emoji: "⏳" },
    { id: 3, text: "Included everyone in a game", emoji: "🏀" },
    { id: 4, text: "Returned something you borrowed", emoji: "📚" },
    { id: 5, text: "Gave someone the first chance", emoji: "🎯" },
  ];

  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Handle Yes/No Answer
  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));

    // Move to next question automatically
    if (currentIndex < fairActs.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
    } else {
      // All answered
      handleSubmit({ ...answers, [id]: value });
    }
  };

  // ✅ Final Submit Logic
  const handleSubmit = (finalAnswers) => {
    const allYes = fairActs.every((act) => finalAnswers[act.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      showCorrectAnswerFeedback(1, true);
      setTimeout(() => setShowPopup(true), 6000);
    }
  };

  const handleNext = () => {
    navigate("/games/moral-values/kids/dark-room-story");
  };

  return (
    <GameShell
      title="Badge: Fair Kid"
      subtitle="Fairness Achievement"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      gameId="moral-kids-50"
      gameType="educational"
      totalLevels={100}
      currentLevel={50}
      showConfetti={isWinner}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-6">
        {/* ✅ Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Fair Kid Challenge: Play & Share Fairly ⚖️
          </h2>

          <p className="text-white/80 mb-6 text-center">
            Be fair in every action — answer honestly!
          </p>

          {/* ✅ Show current question */}
          {!showResult && (
            <div className="border border-white/30 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition text-center">
              <div className="text-4xl mb-4">{fairActs[currentIndex].emoji}</div>
              <div className="text-white font-semibold text-xl mb-6">
                {fairActs[currentIndex].text}
              </div>

              <div className="flex justify-center gap-6">
                <button
                  className={`px-6 py-3 rounded-xl font-bold text-white transition ${
                    answers[fairActs[currentIndex].id] === "yes"
                      ? "bg-green-500"
                      : "bg-white/20 hover:bg-green-600/50"
                  }`}
                  onClick={() =>
                    handleAnswer(fairActs[currentIndex].id, "yes")
                  }
                >
                  Yes
                </button>
                <button
                  className={`px-6 py-3 rounded-xl font-bold text-white transition ${
                    answers[fairActs[currentIndex].id] === "no"
                      ? "bg-red-500"
                      : "bg-white/20 hover:bg-red-600/50"
                  }`}
                  onClick={() =>
                    handleAnswer(fairActs[currentIndex].id, "no")
                  }
                >
                  No
                </button>
              </div>

              <p className="text-white/70 text-sm mt-4">
                Question {currentIndex + 1} of {fairActs.length}
              </p>
            </div>
          )}

          {/* ✅ Result Section */}
          {showResult && (
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="text-green-400 text-xl font-bold">
                  ⚖️ Fair and Kind! You are a Fair Kid!
                </div>
              ) : (
                <div className="text-red-400 text-lg font-semibold">
                  ⚠️ Try again — fairness means sharing and waiting your turn!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Popup for Badge Unlock */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg mb-6">
              You’ve earned the <strong>Fair Kid Badge!</strong> ⚖️
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

export default BadgeFairKid;
