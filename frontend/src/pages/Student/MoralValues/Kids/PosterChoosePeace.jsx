import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterChoosePeace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const posterSets = [
    [
      { id: 1, message: "Peace is Power", emoji: "🕊️", color: "from-blue-400 to-indigo-400" },
      { id: 2, message: "Spread Love, Not Hate", emoji: "💖", color: "from-pink-400 to-red-400" },
      { id: 3, message: "Together for Peace", emoji: "🤝", color: "from-green-400 to-teal-400" },
      { id: 4, message: "Calm Mind, Kind Heart", emoji: "🧘‍♀️", color: "from-purple-400 to-violet-400" },
      { id: 5, message: "Harmony Brings Happiness", emoji: "🌈", color: "from-yellow-400 to-orange-400" },
    ],
    [
      { id: 1, message: "Be the Reason Someone Smiles", emoji: "😊", color: "from-pink-400 to-purple-400" },
      { id: 2, message: "Kindness is Free", emoji: "🌸", color: "from-green-300 to-lime-400" },
      { id: 3, message: "Choose Calm Over Anger", emoji: "🌿", color: "from-teal-400 to-green-400" },
      { id: 4, message: "Together We Shine", emoji: "✨", color: "from-yellow-400 to-orange-400" },
      { id: 5, message: "Smile More, Stress Less", emoji: "😁", color: "from-blue-400 to-cyan-400" },
    ],
    [
      { id: 1, message: "Words Heal, Not Hurt", emoji: "🗣️", color: "from-indigo-400 to-blue-400" },
      { id: 2, message: "Forgive and Forget", emoji: "🤗", color: "from-pink-300 to-red-300" },
      { id: 3, message: "Be Gentle, Be Kind", emoji: "🪷", color: "from-purple-400 to-fuchsia-400" },
      { id: 4, message: "Peace Begins with You", emoji: "💫", color: "from-teal-300 to-green-400" },
      { id: 5, message: "Hearts Not Hate", emoji: "❤️", color: "from-rose-400 to-pink-500" },
    ],
    [
      { id: 1, message: "Give Love to All", emoji: "💞", color: "from-pink-400 to-red-400" },
      { id: 2, message: "Be a Peacemaker", emoji: "🕊️", color: "from-blue-400 to-indigo-400" },
      { id: 3, message: "Make Peace Your Superpower", emoji: "🦸‍♀️", color: "from-yellow-400 to-orange-400" },
      { id: 4, message: "Calm is Strength", emoji: "🌊", color: "from-cyan-400 to-blue-500" },
      { id: 5, message: "Respect Everyone", emoji: "🤝", color: "from-green-400 to-emerald-400" },
    ],
    [
      { id: 1, message: "Peace Starts at Home", emoji: "🏡", color: "from-green-400 to-lime-400" },
      { id: 2, message: "Friendship Wins Fights", emoji: "🤝", color: "from-blue-400 to-indigo-400" },
      { id: 3, message: "Together We Can Heal", emoji: "🌍", color: "from-teal-400 to-emerald-400" },
      { id: 4, message: "Unity in Diversity", emoji: "🌈", color: "from-yellow-400 to-orange-500" },
      { id: 5, message: "Keep Calm and Love All", emoji: "🧘‍♂️", color: "from-purple-400 to-violet-500" },
    ],
  ];

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(5, true);
      setShowResult(true);
    }
  };

  const handleNextPoster = () => {
    if (currentPosterIndex < posterSets.length - 1) {
      setCurrentPosterIndex((prev) => prev + 1);
      setShowResult(false);
      setSelectedPoster(null);
    } else {
      // All 5 done
      setEarnedBadge(true);
    }
  };

  const handleFinalNext = () => {
    navigate("/student/moral-values/kids/journal-peace");
  };

  const currentSet = posterSets[currentPosterIndex];
  const selectedPosterData = currentSet.find((p) => p.id === selectedPoster);

  return (
    <GameShell
      title="Poster: Choose Peace"
      subtitle="Create Your Peace Posters"
      onNext={earnedBadge ? handleFinalNext : handleNextPoster}
      nextEnabled={showResult}
      showGameOver={earnedBadge}
      score={earnedBadge ? 25 : currentPosterIndex * 5}
      gameId="moral-kids-86"
      gameType="creative"
      totalLevels={100}
      currentLevel={86}
      showConfetti={earnedBadge}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!earnedBadge ? (
          !showResult ? (
            // --- Poster Selection Screen ---
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Poster {currentPosterIndex + 1} of 5 — Choose a Message of Peace
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentSet.map((poster) => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster.id)}
                    className={`border-3 rounded-xl p-6 transition-all bg-gradient-to-br ${poster.color} ${
                      selectedPoster === poster.id ? "ring-4 ring-white scale-105" : ""
                    }`}
                  >
                    <div className="text-5xl mb-3">{poster.emoji}</div>
                    <div className="text-white font-bold text-center">{poster.message}</div>
                  </button>
                ))}
              </div>

              {selectedPoster && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4 text-center">
                    Poster Preview
                  </h3>
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
                Create Poster 🕊️
              </button>
            </div>
          ) : (
            // --- Result & Next Poster Screen ---
            <div className="text-center text-white">
              <p className="text-lg mb-4">
                Poster {currentPosterIndex + 1} Created! 🌟
              </p>
              <button
                onClick={handleNextPoster}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Poster →
              </button>
            </div>
          )
        ) : (
          // --- Final Badge Screen ---
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              🏅 Peace Creator Badge Unlocked!
            </h2>
            <p className="text-white text-center mb-6">
              You’ve completed all 5 peace posters — spreading love and harmony! 💖
            </p>
            <div className="bg-gradient-to-r from-blue-400 to-green-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🕊️</div>
              <p className="text-white text-2xl font-bold">Peace Creator Badge!</p>
              <p className="text-white/80 text-sm mt-2">
                You created a peaceful message for the world!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterChoosePeace;
