import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyPlatePoster = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const { showAnswerConfetti } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "Half & Half Plate",
      image: "🍽️",
      description: "Perfect balance! Half fruits & veggies, half grains & proteins.",
      isCorrect: true
    },
    {
      id: 2,
      title: "All Sweets Plate",
      image: "🍰",
      description: "Too much sugar! This won't give you the nutrients you need.",
      isCorrect: false
    },
    {
      id: 3,
      title: "All Junk Plate",
      image: "🍟",
      description: "Empty calories! This doesn't provide balanced nutrition.",
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Poster: My Healthy Plate"
      subtitle="Choose the best healthy plate poster"
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-16"
      gameType="health-female"
      totalLevels={20}
      currentLevel={16}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      showAnswerConfetti={false}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create a poster to show what you've learned about healthy eating!
            </h2>
            <p className="text-white/80">
              "Half Fruits & Veggies, Half Grains & Proteins"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {selectedPoster && !selectedPoster.isCorrect && (
            <div className="mt-6 p-4 bg-red-500/20 rounded-xl border border-red-400 text-center">
              <p className="text-red-200">
                That's not the best choice. Try again to find the healthy plate!
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HealthyPlatePoster;