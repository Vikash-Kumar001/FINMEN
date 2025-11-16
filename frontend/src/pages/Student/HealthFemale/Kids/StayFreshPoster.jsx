import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StayFreshPoster = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const { showAnswerConfetti } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "Clean Girl, Confident Girl",
      image: "✨",
      description: "Perfect message! Good hygiene leads to confidence and well-being.",
      isCorrect: true
    },
    {
      id: 2,
      title: "Dirty is Cool",
      image: "🧼",
      description: "Good hygiene is important for health and confidence, not something to avoid.",
      isCorrect: false
    },
    {
      id: 3,
      title: "Skip Bathing Day",
      image: "🛁",
      description: "Regular bathing is essential for good hygiene and health.",
      isCorrect: false
    }
  ];

  const handlePosterSelect = (posterId) => {
    const selected = posters.find(p => p.id === posterId);
    setSelectedPoster(selected);
    
    if (selected.isCorrect) {
      setCoins(0); // Badge reward, no coins
      setTimeout(() => {
        setGameFinished(true);
        showAnswerConfetti();
      }, 1500);
    }
  };

  const handleCustomSubmit = () => {
    if (customMessage.trim().length > 0) {
      setCoins(0); // Badge reward, no coins
      setTimeout(() => {
        setGameFinished(true);
        showAnswerConfetti();
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Poster: Stay Fresh Everyday"
      subtitle="Choose or create a positive hygiene message"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-46"
      gameType="health-female"
      totalLevels={50}
      currentLevel={46}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      showAnswerConfetti={false}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create a poster to promote good hygiene habits!
            </h2>
            <p className="text-white/80">
              "Clean Girl, Confident Girl"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {posters.map((poster) => (
              <div
                key={poster.id}
                onClick={() => handlePosterSelect(poster.id)}
                className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
                  selectedPoster && selectedPoster.id === poster.id
                    ? poster.isCorrect
                      ? 'ring-4 ring-green-400 scale-105'
                      : 'ring-4 ring-red-400'
                    : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{poster.image}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{poster.title}</h3>
                  {selectedPoster && selectedPoster.id === poster.id && (
                    <p className={`mt-3 text-sm ${
                      poster.isCorrect ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {poster.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-white font-semibold mb-4 text-center">Or create your own message:</h3>
            <div className="flex flex-col space-y-4">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write your own positive hygiene message..."
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
              <button
                onClick={handleCustomSubmit}
                disabled={customMessage.trim().length === 0}
                className={`py-3 rounded-xl font-bold text-white transition-all ${
                  customMessage.trim().length > 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transform hover:scale-105'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                Create My Poster
              </button>
            </div>
          </div>

          {(selectedPoster && !selectedPoster.isCorrect) && (
            <div className="mt-6 p-4 bg-red-500/20 rounded-xl border border-red-400 text-center">
              <p className="text-red-200">
                That's not the best message. Try again to find or create a positive approach!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default StayFreshPoster;