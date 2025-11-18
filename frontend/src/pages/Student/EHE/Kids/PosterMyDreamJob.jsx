import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterMyDreamJob = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [customJob, setCustomJob] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "Future Doctor",
      image: "🏥",
      description: "I want to help people feel better!",
      color: "from-red-500 to-pink-500"
    },
    {
      id: 2,
      title: "Animal Helper",
      image: "🐶",
      description: "I want to take care of animals!",
      color: "from-green-500 to-teal-500"
    },
    {
      id: 3,
      title: "Sky Explorer",
      image: "✈️",
      description: "I want to fly planes around the world!",
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: 4,
      title: "Tech Creator",
      image: "💻",
      description: "I want to build amazing apps!",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
    setCoins(0); // No coins for this creative activity
    showCorrectAnswerFeedback(0, true);
    setTimeout(() => setGameFinished(true), 1500);
  };

  const handleCustomSubmit = () => {
    if (customJob.trim()) {
      setSelectedPoster("custom");
      setCoins(0); // No coins for this creative activity
      showCorrectAnswerFeedback(0, true);
      setTimeout(() => setGameFinished(true), 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getSelectedPoster = () => {
    if (selectedPoster === "custom") return { title: "My Dream Job", description: customJob };
    return posters.find(p => p.id === selectedPoster);
  };

  return (
    <GameShell
      title="Poster: My Dream Job"
      subtitle={selectedPoster ? "Great choice!" : "Create or select your dream job poster"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-6"
      gameType="ehe"
      totalLevels={10}
      currentLevel={6}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {!selectedPoster ? (
            <>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">
                Create or select a poster: "I want to be a ___."
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {posters.map((poster) => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster.id)}
                    className={`bg-gradient-to-br ${poster.color} hover:from-blue-600 hover:to-indigo-700 rounded-2xl p-6 text-white shadow-lg transform transition-all hover:scale-105`}
                  >
                    <div className="text-5xl mb-4">{poster.image}</div>
                    <h3 className="text-xl font-bold mb-2">{poster.title}</h3>
                    <p className="text-white/90">{poster.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Create Your Own</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={customJob}
                    onChange={(e) => setCustomJob(e.target.value)}
                    placeholder="Enter your dream job..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customJob.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Create Poster
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Your Dream Job Poster</h2>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-white/10 mb-6">
                <div className="text-6xl mb-4">
                  {selectedPoster === "custom" ? "🎯" : getSelectedPoster().image}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {selectedPoster === "custom" ? "My Dream Job" : getSelectedPoster().title}
                </h3>
                <p className="text-xl text-white/90">
                  {selectedPoster === "custom" ? customJob : getSelectedPoster().description}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                <p className="text-green-300 font-bold">
                  🎉 Congratulations! You've created your dream job poster!
                </p>
                <p className="text-green-300 mt-2">
                  Keep working toward your goals!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PosterMyDreamJob;