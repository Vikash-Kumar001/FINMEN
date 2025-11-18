import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GratitudePoster = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [createdPosters, setCreatedPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const posterRounds = [
    [
      { id: 1, message: "Always Say Thank You", emoji: "🙏", color: "from-pink-400 to-rose-400" },
      { id: 2, message: "Gratitude is Great", emoji: "💖", color: "from-purple-400 to-pink-400" },
    ],
    [
      { id: 3, message: "Be Thankful Every Day", emoji: "🌞", color: "from-blue-400 to-cyan-400" },
      { id: 4, message: "Kind Words Shine Bright", emoji: "✨", color: "from-orange-400 to-amber-400" },
    ],
    [
      { id: 5, message: "Spread Positivity", emoji: "🌈", color: "from-green-400 to-emerald-400" },
      { id: 6, message: "Thanks Bring Smiles", emoji: "😊", color: "from-yellow-400 to-orange-400" },
    ],
    [
      { id: 7, message: "Share Joy, Show Thanks", emoji: "🎉", color: "from-purple-500 to-indigo-400" },
      { id: 8, message: "Appreciate Small Things", emoji: "🌻", color: "from-lime-400 to-green-400" },
    ],
    [
      { id: 9, message: "Thankful Heart, Happy Life", emoji: "❤️", color: "from-pink-500 to-red-400" },
      { id: 10, message: "Every Thanks Counts", emoji: "🌟", color: "from-teal-400 to-blue-400" },
    ],
  ];

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      const poster = posterRounds[currentRound].find(p => p.id === selectedPoster);
      setCreatedPosters([...createdPosters, poster]);
      setSelectedPoster(null);

      if (currentRound === posterRounds.length - 1) {
        setShowResult(true);
      } else {
        setCurrentRound(currentRound + 1);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/journal-of-gratitude");
  };

  const currentOptions = posterRounds[currentRound];
  const selectedPosterData = currentOptions?.find(p => p.id === selectedPoster);

  return (
    <GameShell
      title="Gratitude Poster Series"
      subtitle="Create 5 Thankful Posters"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={showResult ? 10 : createdPosters.length * 2}
      gameId="moral-kids-16"
      gameType="educational"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showResult}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Poster {currentRound + 1} of 5
            </h2>
            <p className="text-white/70 text-center mb-6">
              Choose a gratitude message for your next poster.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentOptions.map((poster) => (
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
              {currentRound < 4 ? "Create Poster! 🎨" : "Finish All Posters 🏆"}
            </button>

            <p className="text-center text-white/70 mt-4">
              Posters Created: {createdPosters.length}/5
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              🏆 Gratitude Hero Badge Earned!
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {createdPosters.map((poster) => (
                <div
                  key={poster.id}
                  className={`rounded-xl p-6 bg-gradient-to-br ${poster.color} border-4 border-white flex flex-col items-center justify-center`}
                >
                  <div className="text-5xl mb-2">{poster.emoji}</div>
                  <div className="text-white font-bold text-center">
                    {poster.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏅</div>
              <p className="text-white text-2xl font-bold">
                Gratitude Hero Badge!
              </p>
              <p className="text-white/80 text-sm mt-2">
                You created all 5 gratitude posters — wonderful job spreading positivity!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GratitudePoster;
