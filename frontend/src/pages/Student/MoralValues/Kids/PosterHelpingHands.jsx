import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterHelpingHands = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPosterSet, setCurrentPosterSet] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🖼️ 5 Poster Sets — each with 5 options
  const posterSets = [
    [
      { id: 1, message: "Helping is Happiness", emoji: "🤝", color: "from-blue-400 to-purple-400" },
      { id: 2, message: "Be Kind Every Time", emoji: "💞", color: "from-green-400 to-teal-400" },
      { id: 3, message: "Care, Share, Smile", emoji: "😊", color: "from-pink-400 to-red-400" },
      { id: 4, message: "One Help Can Change a Day", emoji: "🌟", color: "from-yellow-400 to-orange-400" },
      { id: 5, message: "Together We Shine", emoji: "✨", color: "from-indigo-400 to-blue-500" },
    ],
    [
      { id: 1, message: "Lend a Hand, Spread Joy", emoji: "💖", color: "from-teal-400 to-green-400" },
      { id: 2, message: "Help Others, Heal Yourself", emoji: "🩵", color: "from-purple-400 to-pink-400" },
      { id: 3, message: "Teamwork Makes Miracles", emoji: "🤗", color: "from-orange-400 to-red-400" },
      { id: 4, message: "Be the Light for Others", emoji: "💡", color: "from-blue-400 to-cyan-400" },
      { id: 5, message: "Kind Hands, Happy Hearts", emoji: "💚", color: "from-yellow-400 to-green-500" },
    ],
    [
      { id: 1, message: "Together We Can Do More", emoji: "🤲", color: "from-blue-500 to-indigo-500" },
      { id: 2, message: "Kindness is Power", emoji: "⚡", color: "from-pink-400 to-violet-400" },
      { id: 3, message: "Little Help, Big Change", emoji: "🌈", color: "from-orange-400 to-yellow-400" },
      { id: 4, message: "Be a Helping Star", emoji: "⭐", color: "from-teal-400 to-sky-400" },
      { id: 5, message: "Hands that Help, Hearts that Love", emoji: "💞", color: "from-green-400 to-lime-400" },
    ],
    [
      { id: 1, message: "Help is the Best Gift", emoji: "🎁", color: "from-red-400 to-pink-500" },
      { id: 2, message: "Support Makes Us Stronger", emoji: "💪", color: "from-blue-400 to-sky-400" },
      { id: 3, message: "Caring Builds Community", emoji: "🏡", color: "from-teal-400 to-green-400" },
      { id: 4, message: "Together We Rise", emoji: "🌅", color: "from-purple-400 to-pink-400" },
      { id: 5, message: "Love Grows by Giving", emoji: "🌸", color: "from-yellow-400 to-orange-400" },
    ],
    [
      { id: 1, message: "Be Someone’s Sunshine", emoji: "🌞", color: "from-orange-400 to-yellow-400" },
      { id: 2, message: "Spread Love Everywhere", emoji: "💐", color: "from-pink-400 to-rose-400" },
      { id: 3, message: "Your Help Counts!", emoji: "👐", color: "from-green-400 to-emerald-400" },
      { id: 4, message: "Make the World Brighter", emoji: "🌍", color: "from-blue-400 to-indigo-400" },
      { id: 5, message: "Helping Hands, Happy Lands", emoji: "🎨", color: "from-purple-400 to-blue-400" },
    ],
  ];

  const currentSet = posterSets[currentPosterSet];
  const selectedPosterData = currentSet.find((p) => p.id === selectedPoster);

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      setShowResult(true);
      if (currentPosterSet === posterSets.length - 1) {
        setEarnedBadge(true);
      }
    }
  };

  const handleNextPoster = () => {
    if (currentPosterSet < posterSets.length - 1) {
      setCurrentPosterSet(currentPosterSet + 1);
      setSelectedPoster(null);
      setShowResult(false);
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/journal-service");
  };

  return (
    <GameShell
      title="Poster: Helping Hands"
      subtitle={`Create Poster ${currentPosterSet + 1} of ${posterSets.length}`}
      onNext={earnedBadge ? handleNextGame : undefined}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={earnedBadge ? 5 : currentPosterSet + 1}
      gameId="moral-kids-76"
      gameType="educational"
      totalLevels={100}
      currentLevel={76}
      showConfetti={earnedBadge}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Choose a Message for Poster {currentPosterSet + 1}
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

            <button
              onClick={handleCreate}
              disabled={!selectedPoster}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPoster
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Create Poster! 🎨
            </button>
          </div>
        ) : !earnedBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">✨ Great Job!</h2>
            <div
              className={`rounded-xl p-8 bg-gradient-to-br ${selectedPosterData.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
            >
              <div className="text-6xl mb-4">{selectedPosterData.emoji}</div>
              <div className="text-white text-3xl font-bold">{selectedPosterData.message}</div>
            </div>

            <button
              onClick={handleNextPoster}
              className="mt-6 py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-xl hover:scale-105 transition"
            >
              Next Poster ➡️
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">🏆 Helping Hands Badge Earned!</h2>
            <div className="text-6xl mb-4">🎖️</div>
            <p className="text-white text-xl mb-2">
              You completed all posters promoting kindness & teamwork!
            </p>
            <p className="text-white/80">Click “Next” to continue your journey.</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterHelpingHands;
