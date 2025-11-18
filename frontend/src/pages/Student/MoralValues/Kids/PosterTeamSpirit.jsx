import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTeamSpirit = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentRound, setCurrentRound] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);

  // 👇 Each round has 5 poster options
  const posterRounds = [
    [
      { id: 1, message: "Together We Win", emoji: "🤝", color: "from-blue-400 to-purple-400" },
      { id: 2, message: "Stronger Together", emoji: "⚡", color: "from-yellow-400 to-orange-400" },
      { id: 3, message: "Helping Each Other", emoji: "🤗", color: "from-pink-400 to-rose-400" },
      { id: 4, message: "Share the Effort", emoji: "🫱🏽‍🫲🏻", color: "from-indigo-400 to-blue-500" },
      { id: 5, message: "Unity is Strength", emoji: "🧩", color: "from-purple-400 to-pink-400" },
    ],
    [
      { id: 6, message: "Teamwork Makes Dreams Work", emoji: "💪", color: "from-green-400 to-teal-400" },
      { id: 7, message: "Together We Shine", emoji: "🌟", color: "from-amber-400 to-orange-500" },
      { id: 8, message: "One Goal, One Team", emoji: "🎯", color: "from-cyan-400 to-blue-400" },
      { id: 9, message: "Win as a Team", emoji: "🏆", color: "from-green-500 to-lime-400" },
      { id: 10, message: "All for One, One for All", emoji: "💫", color: "from-pink-500 to-red-400" },
    ],
    [
      { id: 11, message: "We Rise by Lifting Others", emoji: "🌅", color: "from-blue-500 to-indigo-400" },
      { id: 12, message: "Share the Load, Win Together", emoji: "🪶", color: "from-orange-400 to-pink-400" },
      { id: 13, message: "Help. Share. Succeed.", emoji: "🤲", color: "from-green-400 to-emerald-400" },
      { id: 14, message: "Collaborate & Celebrate", emoji: "🎉", color: "from-purple-400 to-violet-400" },
      { id: 15, message: "Kindness Connects Us", emoji: "💖", color: "from-rose-400 to-red-400" },
    ],
    [
      { id: 16, message: "Together We Can", emoji: "🚀", color: "from-indigo-400 to-sky-400" },
      { id: 17, message: "No One Left Behind", emoji: "🫂", color: "from-green-400 to-lime-400" },
      { id: 18, message: "Unity Beats Odds", emoji: "💪", color: "from-amber-400 to-orange-500" },
      { id: 19, message: "Support Each Step", emoji: "🦶", color: "from-teal-400 to-blue-400" },
      { id: 20, message: "Grow Together", emoji: "🌱", color: "from-emerald-400 to-green-500" },
    ],
    [
      { id: 21, message: "Team Before Self", emoji: "🤜🤛", color: "from-yellow-400 to-orange-500" },
      { id: 22, message: "Dream. Build. Win.", emoji: "🏗️", color: "from-cyan-400 to-blue-400" },
      { id: 23, message: "We Make It Happen", emoji: "🔥", color: "from-pink-400 to-red-400" },
      { id: 24, message: "Power of We", emoji: "🌈", color: "from-purple-400 to-indigo-500" },
      { id: 25, message: "Hands Together, Hearts One", emoji: "💞", color: "from-green-400 to-teal-400" },
    ],
  ];

  const currentPosters = posterRounds[currentRound];
  const selectedPosterData = currentPosters?.find((p) => p.id === selectedPoster);

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (!selectedPoster) return;
    showCorrectAnswerFeedback(1, true);

    if (currentRound < posterRounds.length - 1) {
      setTimeout(() => {
        setSelectedPoster(null);
        setCurrentRound((prev) => prev + 1);
      }, 800);
    } else {
      setEarnedBadge(true);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/journal-teamwork");
  };

  return (
    <GameShell
      title="Poster: Team Spirit"
      subtitle="Create 5 Inspiring Team Posters!"
      onNext={handleNext}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && earnedBadge}
      score={earnedBadge ? 5 : currentRound}
      gameId="moral-kids-66"
      gameType="educational"
      totalLevels={100}
      currentLevel={66}
      showConfetti={showResult && earnedBadge}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Poster {currentRound + 1} of 5 — Choose Your Team Spirit Message
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {currentPosters.map((poster) => (
                <button
                  key={poster.id}
                  onClick={() => handlePosterSelect(poster.id)}
                  className={`rounded-xl p-6 transition-all bg-gradient-to-br ${poster.color} ${
                    selectedPoster === poster.id ? "ring-4 ring-white scale-105" : ""
                  }`}
                >
                  <div className="text-4xl mb-3">{poster.emoji}</div>
                  <div className="text-white font-bold text-center">{poster.message}</div>
                </button>
              ))}
            </div>

            {selectedPoster && (
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold mb-4 text-center">Your Poster Preview</h3>
                <div
                  className={`rounded-xl p-8 bg-gradient-to-br ${selectedPosterData.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
                >
                  <div className="text-6xl mb-4">{selectedPosterData.emoji}</div>
                  <div className="text-white text-3xl font-bold text-center">
                    {selectedPosterData.message}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={!selectedPoster}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPoster
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentRound < 4 ? "Next Poster 🎨" : "Finish & Earn Badge 🏅"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">🏆 Team Spirit Badge!</h2>
            <div className="mb-6">
              <div
                className={`rounded-xl p-8 bg-gradient-to-br ${selectedPosterData?.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
              >
                <div className="text-6xl mb-4">{selectedPosterData?.emoji}</div>
                <div className="text-white text-3xl font-bold text-center">
                  {selectedPosterData?.message}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏆</div>
              <p className="text-white text-2xl font-bold">Team Spirit Poster Badge!</p>
              <p className="text-white/80 text-sm mt-2">
                You created all 5 posters celebrating teamwork!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterTeamSpirit;
