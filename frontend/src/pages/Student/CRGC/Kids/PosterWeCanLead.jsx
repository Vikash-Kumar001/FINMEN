import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';

const PosterWeCanLead = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [posterCreated, setPosterCreated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreatePoster = () => {
    setPosterCreated(true);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  if (!gameStarted) {
    return (
      <GameShell
        title="Poster: We Can Lead"
        subtitle="Loading..."
        backPath="/games/civic-responsibility/kids"
      
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-white">Getting your poster ready...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Poster: We Can Lead"
      subtitle="Create Your Poster"
      onNext={handleNext}
      nextEnabled={posterCreated}
      nextButtonText="Back to Games"
      showGameOver={posterCreated}
      score={posterCreated ? 1 : 0}
      gameId="civic-responsibility-kids-96"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={96}
      showConfetti={posterCreated}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Create a Poster: "Even Kids Can Lead Change"
          </h2>
          
          <div className="bg-gradient-to-br from-green-500 to-teal-600 p-8 rounded-2xl text-center mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-3xl font-bold text-white mb-4">Even Kids Can Lead Change</h3>
            <p className="text-white/90">
              Draw or design a poster showing how children can be leaders in their communities and create positive change!
            </p>
          </div>
          
          {!posterCreated ? (
            <button
              onClick={handleCreatePoster}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105"
            >
              🎨 Create My Poster
            </button>
          ) : (
            <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-300 mb-2">Great Job!</h3>
              <p className="text-white/90">You've created an amazing poster!</p>
              <p className="text-yellow-300 font-medium mt-2">Badge Unlocked: Leadership Artist</p>
            </div>
          )}
          
          <div className="mt-6 text-sm text-white/60">
            <p>Tip: Show your poster to friends and family to inspire them about youth leadership!</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PosterWeCanLead;