import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIExplorerHeroBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback, flashPoints, resetFeedback } = useGameFeedback();

  // ✅ 5 AI Explorer Acts (Yes/No style)
  const explorerActs = [
    { id: 1, text: "Completed the AI Basics Badge", emoji: "🧠" },
    { id: 2, text: "Played all safe AI games", emoji: "🎮" },
    { id: 3, text: "Answered AI Ethics questions correctly", emoji: "⚖️" },
    { id: 4, text: "Completed Future Imagination Journal", emoji: "✍️" },
    { id: 5, text: "Understood AI's role in daily life", emoji: "📱" },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [coins, setCoins] = useState(0);

  // ✅ Handle Yes/No selection
  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Submit Logic
  const handleSubmit = () => {
    if (Object.keys(answers).length !== explorerActs.length) {
      alert("Please complete all AI Explorer acts!");
      return;
    }

    const allYes = explorerActs.every((act) => answers[act.id] === "yes");
    setIsWinner(allYes);
    setShowResult(true);

    if (allYes) {
      setCoins(25); // Reward coins
      showCorrectAnswerFeedback(25, true);
      setTimeout(() => setShowPopup(true), 2000); // Show popup
    } else {
      flashPoints(0); // Optional feedback for incomplete acts
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/congratulations"); // Update with next path
  };

  const handleTryAgain = () => {
    setAnswers({});
    setShowResult(false);
    setIsWinner(false);
    setCoins(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="AI Explorer Hero Badge 🏆"
      subtitle="Complete all explorer acts to earn your hero badge!"
      onNext={handleNext}
      nextEnabled={isWinner}
      showGameOver={showResult}
      score={coins}
      gameId="ai-kids-100"
      gameType="achievement"
      totalLevels={100}
      currentLevel={100}
      showConfetti={isWinner}
      flashPoints={flashPoints}
      backPath="/games/ai-for-all/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-6 text-center">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              AI Explorer Hero Challenge 🚀
            </h2>
            <p className="text-white/80 mb-6">
              Answer truthfully — have you completed these AI explorer acts?
            </p>

            {/* ✅ Explorer Acts */}
            <div className="space-y-4 mb-6">
              {explorerActs.map((act) => (
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

            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Submit Answers
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            {isWinner ? (
              <>
                <div className="text-8xl mb-4">🏅</div>
                <h2 className="text-3xl font-bold text-white mb-4">Congratulations! 🎉</h2>
                <p className="text-white text-xl mb-4">
                  You completed all AI Explorer acts and unlocked the badge:
                </p>
                <div className="bg-yellow-400/30 rounded-lg p-4 mb-4 flex items-center justify-center gap-2">
                  <span className="text-3xl">🤖</span>
                  <p className="text-black font-bold text-2xl">AI Explorer Hero</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-4">
                  You earned {coins} Coins! 🪙
                </p>
              </>
            ) : (
              <div className="text-red-400 text-lg font-semibold">
                ⚠️ Some acts are incomplete. Try again to earn your badge!
              </div>
            )}
            <button
              onClick={handleTryAgain}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Try Again 🔄
            </button>
          </div>
        )}
      </div>

      {/* ✅ Popup for Badge Unlock */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Hero Badge Unlocked!</h3>
            <p className="text-lg mb-6">You are now an <strong>AI Explorer Hero!</strong></p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-blue-600 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default AIExplorerHeroBadge;
