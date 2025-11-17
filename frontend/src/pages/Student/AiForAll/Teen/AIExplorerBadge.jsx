import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIExplorerBadge = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const dailyGames = [
    { id: 1, title: "Recommendation Simulation 🎯" },
    { id: 2, title: "Smart Home Simulation 🏠" },
    { id: 3, title: "Online Safety Quiz 🔐" },
    { id: 4, title: "Cybersecurity AI Quiz 🛡️" },
    { id: 5, title: "AI in Games Story 🎮" }
  ];

  const [completedGames, setCompletedGames] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleCompleteGame = (gameId) => {
    if (!completedGames.includes(gameId)) {
      setCompletedGames(prev => [...prev, gameId]);
      showCorrectAnswerFeedback(4, true); // Each game counts as partial progress
    }

    if (completedGames.length + 1 === dailyGames.length) {
      // All games completed
      setCoins(20);
      setShowBadge(true);
    }
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/teen/data-labeling-gamee"); // next game
  };

  return (
    <GameShell
      title="AI Explorer Badge 🏅"
      subtitle="Complete Daily AI Games"
      onNext={handleFinish}
      nextEnabled={showBadge}
      showGameOver={showBadge}
      score={coins}
      gameId="ai-teen-51"
      gameType="ai"
      totalLevels={20}
      currentLevel={51}
      showConfetti={showBadge}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Daily AI Games
            </h2>

            <div className="space-y-4">
              {dailyGames.map(game => (
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
              Complete all daily AI games to earn the <strong>AI Explorer Badge 🏅</strong>!
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-9xl mb-6">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
            <p className="text-white/90 text-lg mb-4">
              You completed all 5 daily AI games and earned the <strong>AI Explorer Badge</strong>!
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                💡 This badge recognizes your AI literacy and consistent learning. Keep exploring AI every day! 🚀
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold mb-6">
              +20 Coins Earned! 🪙
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

export default AIExplorerBadge;
