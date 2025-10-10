import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterMyDreamJob = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const jobs = [
    { id: 1, name: "Doctor", emoji: "👨‍⚕️" },
    { id: 2, name: "Teacher", emoji: "👩‍🏫" },
    { id: 3, name: "Pilot", emoji: "👨‍✈️" },
    { id: 4, name: "Chef", emoji: "👨‍🍳" },
    { id: 5, name: "Astronaut", emoji: "👨‍🚀" },
    { id: 6, name: "Artist", emoji: "👨‍🎨" }
  ];

  const backgrounds = [
    { id: 1, name: "Stars", gradient: "from-purple-600 to-blue-600" },
    { id: 2, name: "Sunset", gradient: "from-orange-500 to-pink-500" },
    { id: 3, name: "Ocean", gradient: "from-cyan-500 to-blue-700" },
    { id: 4, name: "Forest", gradient: "from-green-600 to-emerald-700" }
  ];

  const handleCreatePoster = () => {
    if (selectedJob && selectedBackground) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowPoster(true);
    }
  };

  const handleNext = () => {
    navigate("/student/ehe/kids/journal-of-jobs");
  };

  const job = jobs.find(j => j.id === selectedJob);
  const bg = backgrounds.find(b => b.id === selectedBackground);

  return (
    <GameShell
      title="Poster: My Dream Job"
      subtitle="Express Your Dreams"
      onNext={handleNext}
      nextEnabled={showPoster}
      showGameOver={showPoster}
      score={coins}
      gameId="ehe-kids-6"
      gameType="educational"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showPoster}
      backPath="/games/entrepreneurship/kids"
    >
      <div className="space-y-8">
        {!showPoster ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Create Your Dream Job Poster!</h3>
            
            <div className="mb-6">
              <h4 className="text-white font-bold mb-3">Choose Your Dream Job:</h4>
              <div className="grid grid-cols-3 gap-3">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job.id)}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      selectedJob === job.id
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-4xl mb-1">{job.emoji}</div>
                    <div className="text-white text-sm font-semibold">{job.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-bold mb-3">Choose Background:</h4>
              <div className="grid grid-cols-4 gap-3">
                {backgrounds.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={`h-16 rounded-xl bg-gradient-to-br ${bg.gradient} transition-all ${
                      selectedBackground === bg.id
                        ? 'ring-4 ring-white scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className="text-white text-xs font-bold">{bg.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreatePoster}
              disabled={!selectedJob || !selectedBackground}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedJob && selectedBackground
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Create My Poster! 🎨
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Dream Job Poster!</h2>
            
            <div className={`bg-gradient-to-br ${bg.gradient} rounded-2xl p-8 mb-6 text-center`}>
              <div className="text-9xl mb-4">{job.emoji}</div>
              <h3 className="text-white text-4xl font-bold mb-2">I want to be a</h3>
              <h2 className="text-white text-5xl font-black">{job.name}</h2>
              <p className="text-white/90 mt-4 text-xl">⭐ Dream Big! ⭐</p>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                🎉 Amazing poster! Keep dreaming big and working hard to achieve your goals!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned a Badge! 🏆
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterMyDreamJob;

