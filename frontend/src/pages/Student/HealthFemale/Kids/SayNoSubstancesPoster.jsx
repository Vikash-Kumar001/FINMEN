import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SayNoSubstancesPoster = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { showAnswerConfetti } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "I Choose Health, Not Drugs",
      description: "Making healthy choices for a bright future",
      design: "💪",
      message: "Saying no to harmful substances is a sign of strength and self-respect!"
    },
    {
      id: 2,
      title: "My Future is Too Bright to Smoke",
      description: "Protecting your dreams and aspirations",
      design: "🌟",
      message: "Your future goals are worth protecting - stay smoke-free and alcohol-free!"
    },
    {
      id: 3,
      title: "Real Cool Says No",
      description: "True confidence comes from healthy choices",
      design: "😎",
      message: "Being cool means making smart decisions that protect your health and wellbeing!"
    },
    {
      id: 4,
      title: "Strong Mind, No Substances",
      description: "Building mental strength through healthy habits",
      design: "🧠",
      message: "A strong, healthy mind is your most powerful asset - protect it from harmful substances!"
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
        title="Poster: Say No to Substances"
        subtitle="Congratulations!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        gameId="health-female-kids-86"
        gameType="health-female"
        totalLevels={90}
        currentLevel={86}
        showConfetti={true}
        backPath="/games/health-female/kids"
      >
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Great Choice!</h2>
              <p className="text-white/80">
                You've created an amazing poster about saying no to harmful substances!
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
                You've earned your "Say No to Substances" badge!
              </p>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Poster: Say No to Substances"
      subtitle="Create your anti-substance poster"
      backPath="/games/health-female/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create or select a poster that shows "I Choose Health, Not Drugs"
            </h2>
            <p className="text-white/80">
              Choose a design that helps others understand the importance of staying away from harmful substances
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

export default SayNoSubstancesPoster;