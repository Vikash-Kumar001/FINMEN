import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterOfHonesty = () => {
  const navigate = useNavigate();
  const [currentPoster, setCurrentPoster] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🔹 Define 5 different poster sets (5 rounds)
  const posterSets = [
    [
      { id: 1, message: "Honesty is the Best Policy", emoji: "✨", color: "from-blue-400 to-purple-400" },
      { id: 2, message: "Truth Always Wins", emoji: "🏆", color: "from-yellow-400 to-orange-400" },
      { id: 3, message: "Be Honest, Be Trusted", emoji: "🤝", color: "from-pink-400 to-red-400" },
    ],
    [
      { id: 1, message: "Speak the Truth", emoji: "🗣️", color: "from-green-400 to-teal-400" },
      { id: 2, message: "Lies Hurt, Truth Heals", emoji: "💔", color: "from-red-400 to-rose-400" },
      { id: 3, message: "Be Real, Be Honest", emoji: "🌟", color: "from-indigo-400 to-blue-400" },
    ],
    [
      { id: 1, message: "Trust Comes with Truth", emoji: "🤍", color: "from-gray-400 to-slate-400" },
      { id: 2, message: "Honesty Builds Character", emoji: "🏗️", color: "from-yellow-300 to-green-400" },
      { id: 3, message: "Say It True, Say It Kind", emoji: "💬", color: "from-purple-400 to-pink-400" },
    ],
    [
      { id: 1, message: "True Friends are Honest", emoji: "👫", color: "from-pink-400 to-purple-400" },
      { id: 2, message: "Be Honest Everywhere", emoji: "🌍", color: "from-blue-400 to-cyan-400" },
      { id: 3, message: "Truth is Power", emoji: "⚡", color: "from-orange-400 to-yellow-400" },
    ],
    [
      { id: 1, message: "Honesty Lights the Way", emoji: "🕯️", color: "from-amber-400 to-yellow-400" },
      { id: 2, message: "Always Choose Truth", emoji: "💎", color: "from-teal-400 to-emerald-400" },
      { id: 3, message: "Be Honest. Be Proud.", emoji: "🏅", color: "from-indigo-400 to-purple-500" },
    ],
  ];

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      if (currentPoster < posterSets.length - 1) {
        // go to next poster set
        setCurrentPoster(currentPoster + 1);
        setSelectedPoster(null);
      } else {
        // all 5 posters done!
        setEarnedBadge(true);
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/journal-of-truth");
  };

  const currentPosters = posterSets[currentPoster];
  const selectedPosterData = currentPosters?.find((p) => p.id === selectedPoster);

  return (
    <GameShell
      title="Poster of Honesty"
      subtitle="Create 5 Posters about Honesty"
      onNext={handleNext}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && earnedBadge}
      score={earnedBadge ? 5 : currentPoster}
      gameId="moral-kids-6"
      gameType="educational"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showResult && earnedBadge}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Poster {currentPoster + 1} of 5 — Choose Your Message
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentPosters.map((poster) => (
                <button
                  key={poster.id}
                  onClick={() => handlePosterSelect(poster.id)}
                  className={`border-3 rounded-xl p-6 transition-all bg-gradient-to-br ${poster.color} ${
                    selectedPoster === poster.id ? "ring-4 ring-white scale-105" : ""
                  }`}
                >
                  <div className="text-5xl mb-3">{poster.emoji}</div>
                  <div className="text-white font-bold text-center">
                    {poster.message}
                  </div>
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
              {currentPoster < 4 ? "Create Poster! 🎨" : "Finish & Get Badge 🏆"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              🏆 Honesty Poster Badge!
            </h2>
            <p className="text-white text-center mb-6">
              You successfully created 5 honesty posters!
            </p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏅</div>
              <p className="text-white text-2xl font-bold">
                Poster Creator Badge
              </p>
              <p className="text-white/80 text-sm mt-2">
                Creativity + Moral Value 🌟
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterOfHonesty;
