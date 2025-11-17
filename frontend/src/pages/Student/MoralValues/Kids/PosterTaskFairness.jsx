import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTaskFairness = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [completedPosters, setCompletedPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);

  // 🖌️ Each poster set has 3 creative designs
  const posterSets = [
    [
      { id: 1, message: "Fair Play Always", emoji: "⚖️", color: "from-blue-400 to-cyan-400" },
      { id: 2, message: "Share the Game", emoji: "🤝", color: "from-green-400 to-lime-400" },
      { id: 3, message: "Win with Honesty", emoji: "🏅", color: "from-yellow-400 to-orange-400" },
    ],
    [
      { id: 4, message: "Everyone Deserves a Turn", emoji: "🎲", color: "from-purple-400 to-indigo-400" },
      { id: 5, message: "Teamwork = Fair Play", emoji: "👫", color: "from-pink-400 to-rose-400" },
      { id: 6, message: "Be Honest in Every Game", emoji: "💬", color: "from-amber-400 to-red-400" },
    ],
    [
      { id: 7, message: "Play Right, Not Just Win", emoji: "🏆", color: "from-teal-400 to-emerald-400" },
      { id: 8, message: "Respect Rules", emoji: "📜", color: "from-cyan-400 to-blue-500" },
      { id: 9, message: "No Cheating Zone", emoji: "🚫", color: "from-rose-400 to-red-400" },
    ],
    [
      { id: 10, message: "Treat Others Fairly", emoji: "🤗", color: "from-indigo-400 to-sky-400" },
      { id: 11, message: "Equal Chances for All", emoji: "⚡", color: "from-green-400 to-teal-400" },
      { id: 12, message: "Respect the Referee", emoji: "🧑‍⚖️", color: "from-orange-400 to-amber-400" },
    ],
    [
      { id: 13, message: "Play with Integrity", emoji: "💎", color: "from-blue-400 to-indigo-400" },
      { id: 14, message: "Honesty Wins Hearts", emoji: "❤️", color: "from-pink-400 to-purple-400" },
      { id: 15, message: "Be Fair, Be a Hero", emoji: "🦸", color: "from-yellow-400 to-lime-400" },
    ],
  ];

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      const selectedData = posterSets[currentPosterIndex].find(p => p.id === selectedPoster);
      setCompletedPosters([...completedPosters, selectedData]);
      setSelectedPoster(null);

      if (currentPosterIndex < posterSets.length - 1) {
        setCurrentPosterIndex(currentPosterIndex + 1);
      } else {
        setEarnedBadge(true);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/moral-values/kids/journal-justice");
  };

  const currentSet = posterSets[currentPosterIndex];
  const selectedPosterData = currentSet.find(p => p.id === selectedPoster);

  return (
    <GameShell
      title="Fairness Poster"
      subtitle="Create 5 Posters About Fair Play ⚖️"
      onNext={handleNext}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && earnedBadge}
      score={earnedBadge ? 5 : completedPosters.length}
      gameId="moral-kids-46"
      gameType="educational"
      totalLevels={100}
      currentLevel={46}
      showConfetti={showResult && earnedBadge}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Poster {currentPosterIndex + 1} of 5 – Choose Your Design
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentSet.map(poster => (
                <button
                  key={poster.id}
                  onClick={() => handlePosterSelect(poster.id)}
                  className={`rounded-xl p-6 transition-all bg-gradient-to-br ${poster.color} ${
                    selectedPoster === poster.id ? 'ring-4 ring-white scale-105' : ''
                  }`}
                >
                  <div className="text-4xl mb-2">{poster.emoji}</div>
                  <div className="text-white font-bold text-center">{poster.message}</div>
                </button>
              ))}
            </div>

            {selectedPoster && (
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold mb-4 text-center">Poster Preview</h3>
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              {currentPosterIndex === posterSets.length - 1
                ? "Finish Posters! 🎨"
                : "Create Poster! 🎨"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">🏆 Fair Play Hero Badge!</h2>
            <p className="text-white/80 mb-6">
              You completed all 5 fairness posters! Great work promoting honesty and justice 🌟
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {completedPosters.map((poster, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-6 bg-gradient-to-br ${poster.color} flex flex-col items-center justify-center border-4 border-white`}
                >
                  <div className="text-5xl mb-2">{poster.emoji}</div>
                  <div className="text-white font-bold text-center">{poster.message}</div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-400 to-green-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏅</div>
              <p className="text-white text-2xl font-bold">Fair Play Hero Badge!</p>
              <p className="text-white/80 text-sm mt-2">
                You are a true champion of honesty and fairness 💫
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterTaskFairness;
