import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrainingHeroBadgee = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const trainingGames = [
    { id: 1, title: "Overfitting Story 🌈" },
    { id: 2, title: "Balanced Data Story 🌃" },
    { id: 3, title: "AI Mistake Reflex ⚡" },
    { id: 4, title: "Human vs AI Errors Quiz 👥" },
    { id: 5, title: "AI Everywhere Quiz 🌐" },
    { id: 6, title: "Cyber Safety Reflex 🛡️" },
    { id: 7, title: "Recommendation Simulation 🎯" },
    { id: 8, title: "Smart Home Simulation 🏠" },
    { id: 9, title: "Online Safety Quiz 🔐" },
    { id: 10, title: "AI in Games Story 🎮" }
  ];

  const [completedGames, setCompletedGames] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleCompleteGame = (gameId) => {
    if (!completedGames.includes(gameId)) {
      setCompletedGames(prev => [...prev, gameId]);
      showCorrectAnswerFeedback(3, true); // partial progress feedback
    }

    if (completedGames.length + 1 === trainingGames.length) {
      // All games completed
      setCoins(25);
      setShowBadge(true);
    }
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/teen/good-ai-vs-bad-ai-quiz"); // update with actual next game path
  };

  return (
    <GameShell
      title="Training Hero Badge 🏅"
      subtitle="Complete Training & Bias Games"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="ai-teen-52"
      gameType="ai"
      totalLevels={20}
      currentLevel={52}
      showConfetti={showBadge}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Training & Bias Games
            </h2>

            <div className="space-y-4">
              {trainingGames.map(game => (
                <button
                  key={game.id}
                  onClick={() => handleCompleteGame(game.id)}
                  disabled={completedGames.includes(game.id)}
                  className={`w-full p-4 rounded-xl text-white font-semibold transition ${
                    completedGames.includes(game.id)
                      ? "bg-green-500/50 cursor-not-allowed"
                      : "bg-blue-500/30 hover:bg-blue-500/50"
                  }`}
                >
                  {completedGames.includes(game.id) ? "✅ " : "🔹 "} {game.title}
                </button>
              ))}
            </div>

            <p className="text-white/80 mt-6 text-center">
              Complete all 10 training and bias games to earn the <strong>AI Teacher Badge 🏅</strong>!
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-9xl mb-6">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
            <p className="text-white/90 text-lg mb-4">
              You completed all 10 training and bias games and earned the <strong>AI Teacher Badge</strong>!
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                💡 This badge recognizes your AI literacy and consistent learning. Keep training AI every day! 🚀
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold mb-6">
              +25 Coins Earned! 🪙
            </p>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 transition"
            >
              Finish & Continue ➡️
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainingHeroBadgee;
