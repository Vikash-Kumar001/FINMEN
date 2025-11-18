import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PreventionFirstPoster = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { showAnswerConfetti } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "Prevention is Better Than Cure",
      description: "Taking care of your health prevents problems",
      design: "🛡️",
      message: "Preventing illness is easier than treating it. Wash hands, eat well, and stay active!"
    },
    {
      id: 2,
      title: "Healthy Habits, Happy Heart",
      description: "Daily practices for lifelong wellness",
      design: "❤️",
      message: "Small daily habits like brushing teeth and washing hands lead to big health benefits!"
    },
    {
      id: 3,
      title: "Safety First, Always",
      description: "Protecting yourself keeps you healthy",
      design: "⛑️",
      message: "Wearing helmets, seatbelts, and using sunscreen protects you from injury and disease!"
    },
    {
      id: 4,
      title: "Vaccines Save Lives",
      description: "Immunization protects you and your community",
      design: "💉",
      message: "Vaccines help your body fight diseases before you get sick. They protect you and others!"
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
        title="Poster: Prevention First"
        subtitle="Congratulations!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        gameId="health-female-kids-76"
        gameType="health-female"
        totalLevels={80}
        currentLevel={76}
        showConfetti={true}
        backPath="/games/health-female/kids"
      >
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Great Choice!</h2>
              <p className="text-white/80">
                You've created an amazing poster about prevention!
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
                You've earned your "Prevention First" badge!
              </p>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Poster: Prevention First"
      subtitle="Create your prevention poster"
      backPath="/games/health-female/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create or select a poster that shows "Prevention is Better Than Cure"
            </h2>
            <p className="text-white/80">
              Choose a design that helps others understand the importance of prevention
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

export default PreventionFirstPoster;