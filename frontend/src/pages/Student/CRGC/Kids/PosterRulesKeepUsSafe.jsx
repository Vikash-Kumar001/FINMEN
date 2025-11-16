import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';

const PosterRulesKeepUsSafe = () => {
  const navigate = useNavigate();
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
        title="Poster: Rules Keep Us Safe"
        subtitle="Loading..."
        backPath="/games/civic-responsibility/kids"
      >
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
      title="Poster: Rules Keep Us Safe"
      subtitle="Create Your Poster"
      onNext={handleNext}
      nextEnabled={posterCreated}
      nextButtonText="Back to Games"
      showGameOver={posterCreated}
      score={posterCreated ? 1 : 0}
      gameId="civic-responsibility-kids-76"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={76}
      showConfetti={posterCreated}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Create a Poster: "My Duty = My Safety"
          </h2>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl text-center mb-8">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-3xl font-bold text-white mb-4">My Duty = My Safety</h3>
            <p className="text-white/90">
              Draw or design a poster showing how following rules keeps you and your community safe!
            </p>
          </div>
          
          {!posterCreated ? (
            <button
              onClick={handleCreatePoster}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105"
            >
              🎨 Create My Poster
            </button>
          ) : (
            <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-300 mb-2">Great Job!</h3>
              <p className="text-white/90">You've created an amazing poster!</p>
              <p className="text-yellow-300 font-medium mt-2">Badge Unlocked: Safety Advocate</p>
            </div>
          )}
          
          <div className="mt-6 text-sm text-white/60">
            <p>Tip: Show your poster to friends and family to teach them about civic duties!</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PosterRulesKeepUsSafe;