import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterDiscipline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // Array of 5 poster sets (each with 5 options)
  const posterSets = [
    [
      { id: 1, message: "Discipline Builds Success", emoji: "🏗️", color: "from-blue-400 to-cyan-400" },
      { id: 2, message: "Stay Focused, Stay Strong", emoji: "🎯", color: "from-green-400 to-emerald-400" },
      { id: 3, message: "Small Steps Every Day", emoji: "👣", color: "from-indigo-400 to-purple-400" },
      { id: 4, message: "Work Hard, Shine Bright", emoji: "💪", color: "from-orange-400 to-amber-400" },
      { id: 5, message: "Discipline Today, Success Tomorrow", emoji: "🌅", color: "from-pink-400 to-rose-400" },
    ],
    [
      { id: 1, message: "Follow Rules with Pride", emoji: "📘", color: "from-sky-400 to-indigo-400" },
      { id: 2, message: "Self-Control = Strength", emoji: "🧘", color: "from-teal-400 to-cyan-400" },
      { id: 3, message: "Be Consistent Always", emoji: "🔁", color: "from-amber-400 to-orange-400" },
      { id: 4, message: "Routine Brings Power", emoji: "⏰", color: "from-fuchsia-400 to-pink-400" },
      { id: 5, message: "Discipline Defines Character", emoji: "🛡️", color: "from-lime-400 to-green-400" },
    ],
    [
      { id: 1, message: "Focus Beats Talent", emoji: "🔥", color: "from-rose-400 to-red-400" },
      { id: 2, message: "Keep Promises Always", emoji: "🤝", color: "from-violet-400 to-indigo-400" },
      { id: 3, message: "Never Give Up Early", emoji: "🏃‍♀️", color: "from-yellow-400 to-amber-400" },
      { id: 4, message: "Time + Effort = Success", emoji: "⏳", color: "from-green-400 to-emerald-400" },
      { id: 5, message: "Stay Grounded, Aim High", emoji: "🌳", color: "from-cyan-400 to-blue-400" },
    ],
    [
      { id: 1, message: "Discipline Starts at Home", emoji: "🏡", color: "from-blue-400 to-indigo-400" },
      { id: 2, message: "Work First, Play Later", emoji: "🎓", color: "from-orange-400 to-yellow-400" },
      { id: 3, message: "Habits Shape Destiny", emoji: "🧠", color: "from-pink-400 to-purple-400" },
      { id: 4, message: "Strong Mind, Strong Will", emoji: "🦁", color: "from-lime-400 to-green-400" },
      { id: 5, message: "Discipline = Freedom", emoji: "🕊️", color: "from-sky-400 to-cyan-400" },
    ],
    [
      { id: 1, message: "Be Your Own Leader", emoji: "👑", color: "from-violet-400 to-fuchsia-400" },
      { id: 2, message: "Stay True to Goals", emoji: "🎯", color: "from-green-400 to-emerald-400" },
      { id: 3, message: "Finish What You Start", emoji: "🏁", color: "from-orange-400 to-amber-400" },
      { id: 4, message: "Discipline is Power", emoji: "⚡", color: "from-blue-400 to-cyan-400" },
      { id: 5, message: "Control Brings Success", emoji: "🎓", color: "from-red-400 to-rose-400" },
    ],
  ];

  const currentPosterSet = posterSets[currentPosterIndex];
  const selectedPosterData = currentPosterSet?.find(p => p.id === selectedPoster);

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      if (currentPosterIndex < posterSets.length - 1) {
        // Move to next poster
        setTimeout(() => {
          setSelectedPoster(null);
          setCurrentPosterIndex(prev => prev + 1);
        }, 1000);
      } else {
        // All posters completed
        setEarnedBadge(true);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/journal-duty");
  };

  return (
    <GameShell
      title="Discipline Poster"
      subtitle="Create a Motivation Poster"
      onNext={handleNext}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="moral-kids-36"
      gameType="creative"
      totalLevels={100}
      currentLevel={36}
      showConfetti={showResult && earnedBadge}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Choose Your Discipline Poster {currentPosterIndex + 1} of 5
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentPosterSet.map((poster) => (
                <button
                  key={poster.id}
                  onClick={() => handlePosterSelect(poster.id)}
                  className={`border-3 rounded-xl p-6 transition-all bg-gradient-to-br ${poster.color} ${
                    selectedPoster === poster.id ? "ring-4 ring-white scale-105" : ""
                  }`}
                >
                  <div className="text-5xl mb-3">{poster.emoji}</div>
                  <div className="text-white font-bold text-center text-lg">
                    {poster.message}
                  </div>
                </button>
              ))}
            </div>

            {selectedPoster && (
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold mb-4 text-center">
                  Your Poster Preview
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
              {currentPosterIndex < posterSets.length - 1
                ? "Create Poster 🎨"
                : "Finish All Posters 🏆"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">🏅 Discipline Badge!</h2>
            <div className="mb-6">
              <div
                className={`rounded-xl p-8 bg-gradient-to-br ${selectedPosterData.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
              >
                <div className="text-6xl mb-4">{selectedPosterData.emoji}</div>
                <div className="text-white text-3xl font-bold text-center">
                  {selectedPosterData.message}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏆</div>
              <p className="text-white text-2xl font-bold">Discipline Poster Badge!</p>
              <p className="text-white/80 text-sm mt-2">
                You created 5 motivational posters about discipline and success!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterDiscipline;
