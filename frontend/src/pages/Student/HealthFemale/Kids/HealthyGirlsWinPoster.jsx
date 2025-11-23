import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyGirlsWinPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { showAnswerConfetti } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "Good Habits Build Strong Girls",
      description: "Healthy choices create a bright future",
      design: "💪",
      message: "Building strong habits today creates confident, healthy girls for tomorrow!"
    },
    {
      id: 2,
      title: "Healthy Habits, Happy Hearts",
      description: "Taking care of yourself brings joy",
      design: "❤️",
      message: "When you take care of your body and mind, you feel happier and more confident!"
    },
    {
      id: 3,
      title: "Smart Girls Choose Wellness",
      description: "Making healthy decisions shows strength",
      design: "🧠",
      message: "Smart girls know that taking care of their health is a sign of strength and self-respect!"
    },
    {
      id: 4,
      title: "Balance is Beautiful",
      description: "Healthy habits create harmony in life",
      design: "⚖️",
      message: "Balancing school, fun, rest, and healthy habits makes life more beautiful and fulfilling!"
    }
  ];

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
    setTimeout(() => {
      setGameFinished(true);
      showAnswerConfetti();
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getSelectedPoster = () => posters.find(p => p.id === selectedPoster);

  if (gameFinished) {
    return (
      <GameShell
        title="Poster: Healthy Girls Win"
        subtitle="Congratulations!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        gameId="health-female-kids-96"
        gameType="health-female"
        totalLevels={100}
        currentLevel={96}
        showConfetti={true}
        backPath="/games/health-female/kids"
      
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Great Choice!</h2>
              <p className="text-white/80">
                You've created an amazing poster about healthy habits!
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">{getSelectedPoster().design}</div>
                <h3 className="text-xl font-bold text-white mb-2">{getSelectedPoster().title}</h3>
                <p className="text-white/80">{getSelectedPoster().message}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-yellow-400 font-bold text-lg">
                You've earned your "Healthy Girls Win" badge!
              </p>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Poster: Healthy Girls Win"
      subtitle="Create your healthy habits poster"
      backPath="/games/health-female/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create or select a poster that shows "Good Habits Build Strong Girls"
            </h2>
            <p className="text-white/80">
              Choose a design that helps others understand the importance of healthy daily habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posters.map(poster => (
              <div 
                key={poster.id}
                onClick={() => handlePosterSelect(poster.id)}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/20 cursor-pointer transition-all transform hover:scale-105 hover:from-blue-500/30 hover:to-purple-500/30"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">{poster.design}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{poster.title}</h3>
                  <p className="text-white/80 text-sm mb-3">{poster.description}</p>
                  <p className="text-white/70 text-xs italic">"{poster.message}"</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-white/10 rounded-full px-4 py-2">
              <p className="text-white/80 text-sm">
                Click on any poster to select it and earn your badge!
              </p>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default HealthyGirlsWinPoster;