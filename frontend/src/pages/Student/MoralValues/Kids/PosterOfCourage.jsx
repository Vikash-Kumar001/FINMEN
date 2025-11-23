import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterOfCourage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);

  // All 5 poster sets (like 5 questions)
  const posterSets = [
    [
      { id: 1, message: "Courage is Doing Right", emoji: "🦁", color: "from-blue-400 to-purple-400" },
      { id: 2, message: "Be Brave, Stand Tall", emoji: "💪", color: "from-green-400 to-teal-400" },
      { id: 3, message: "Stand for Truth", emoji: "🕊️", color: "from-yellow-400 to-orange-400" },
      { id: 4, message: "Never Give Up", emoji: "🔥", color: "from-red-400 to-pink-400" },
      { id: 5, message: "Do Right, Even if Scared", emoji: "⚡", color: "from-indigo-400 to-blue-500" }
    ],
    [
      { id: 1, message: "Helping Others is Courage", emoji: "🤝", color: "from-teal-400 to-green-400" },
      { id: 2, message: "Face the Storm", emoji: "🌩️", color: "from-gray-400 to-blue-500" },
      { id: 3, message: "Be Honest Always", emoji: "💎", color: "from-cyan-400 to-blue-400" },
      { id: 4, message: "Courage to Speak Up", emoji: "📢", color: "from-pink-400 to-purple-500" },
      { id: 5, message: "Stay Strong", emoji: "🪨", color: "from-orange-400 to-red-400" }
    ],
    [
      { id: 1, message: "Courage is Kindness", emoji: "💖", color: "from-pink-400 to-rose-400" },
      { id: 2, message: "Be Fearless", emoji: "🦅", color: "from-indigo-400 to-purple-400" },
      { id: 3, message: "Keep Moving Forward", emoji: "🚀", color: "from-green-400 to-blue-400" },
      { id: 4, message: "Help the Weak", emoji: "🫶", color: "from-yellow-400 to-orange-400" },
      { id: 5, message: "Face Your Challenges", emoji: "🌄", color: "from-cyan-400 to-blue-400" }
    ],
    [
      { id: 1, message: "Stand Up for Others", emoji: "🧍‍♂️", color: "from-orange-400 to-yellow-400" },
      { id: 2, message: "Speak the Truth", emoji: "🗣️", color: "from-green-400 to-teal-400" },
      { id: 3, message: "Try New Things", emoji: "🎨", color: "from-purple-400 to-blue-400" },
      { id: 4, message: "Never Fear Mistakes", emoji: "🪞", color: "from-pink-400 to-rose-400" },
      { id: 5, message: "Be a Hero in Real Life", emoji: "🦸", color: "from-indigo-400 to-violet-400" }
    ],
    [
      { id: 1, message: "Believe in Yourself", emoji: "🌟", color: "from-yellow-400 to-orange-400" },
      { id: 2, message: "Courage Wins Over Fear", emoji: "🦁", color: "from-blue-400 to-teal-400" },
      { id: 3, message: "Be Kind and Bold", emoji: "💫", color: "from-pink-400 to-red-400" },
      { id: 4, message: "Do Good Without Fear", emoji: "🌈", color: "from-green-400 to-lime-400" },
      { id: 5, message: "Stay Brave Everyday", emoji: "🔥", color: "from-indigo-400 to-purple-400" }
    ]
  ];

  const posters = posterSets[currentPosterIndex];
  const selectedPosterData = posters.find(p => p.id === selectedPoster);

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  // ✅ Fixed: Create Poster button now works and auto-advances to next
  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      setShowResult(true);

      setTimeout(() => {
        if (currentPosterIndex < posterSets.length - 1) {
          setCurrentPosterIndex(currentPosterIndex + 1);
          setSelectedPoster(null);
          setShowResult(false);
        } else {
          setEarnedBadge(true);
          setShowResult(true);
        }
      }, 1000);
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/journal-courage");
  };

  return (
    <GameShell
      title="Poster of Courage"
      subtitle="Create 5 Courage Posters"
      onNext={earnedBadge ? handleNextGame : undefined}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={earnedBadge ? 5 : currentPosterIndex}
      gameId="moral-kids-56"
      gameType="educational"
      totalLevels={100}
      currentLevel={56}
      showConfetti={earnedBadge}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!earnedBadge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Poster {currentPosterIndex + 1} of 5 – Choose Your Message
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {posters.map(poster => (
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
                <h3 className="text-white text-xl font-bold mb-4 text-center">Your Poster Preview</h3>
                <div
                  className={`rounded-xl p-8 bg-gradient-to-br ${selectedPosterData.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
                >
                  <div className="text-6xl mb-4">{selectedPosterData.emoji}</div>
                  <div className="text-white text-3xl font-bold text-center">{selectedPosterData.message}</div>
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
              Create Poster! 🎨
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">🏆 Courage Badge Earned!</h2>
            <p className="text-white/80 text-center mb-6">You created all 5 Courage Posters!</p>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏅</div>
              <p className="text-white text-2xl font-bold">Courage Poster Master!</p>
              <p className="text-white/80 text-sm mt-2">Keep spreading positivity and bravery!</p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterOfCourage;
