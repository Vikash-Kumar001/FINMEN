import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterKindness = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [completedPosters, setCompletedPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const posterSets = [
    [
      { id: 1, message: "Kindness is Cool", emoji: "💖", color: "from-pink-400 to-rose-400" },
      { id: 2, message: "Share Smiles", emoji: "😊", color: "from-green-400 to-lime-400" },
      { id: 3, message: "Help Others", emoji: "🤝", color: "from-blue-400 to-cyan-400" },
    ],
    [
      { id: 4, message: "Spread Love & Joy", emoji: "✨", color: "from-purple-400 to-pink-400" },
      { id: 5, message: "Be Kind Every Day", emoji: "🌈", color: "from-indigo-400 to-sky-400" },
      { id: 6, message: "Give Compliments", emoji: "🌸", color: "from-orange-400 to-red-400" },
    ],
    [
      { id: 7, message: "Helping Hands = Happy Hearts", emoji: "🤲", color: "from-amber-400 to-yellow-400" },
      { id: 8, message: "Respect Everyone", emoji: "🙏", color: "from-teal-400 to-emerald-400" },
      { id: 9, message: "Share Your Toys", emoji: "🧸", color: "from-pink-400 to-fuchsia-400" },
    ],
    [
      { id: 10, message: "Listen with Care", emoji: "👂", color: "from-cyan-400 to-blue-500" },
      { id: 11, message: "Say Thank You", emoji: "💐", color: "from-green-400 to-lime-400" },
      { id: 12, message: "Be Polite", emoji: "😊", color: "from-rose-400 to-orange-400" },
    ],
    [
      { id: 13, message: "Smile Often", emoji: "😁", color: "from-yellow-400 to-orange-400" },
      { id: 14, message: "Forgive Quickly", emoji: "🌿", color: "from-emerald-400 to-teal-400" },
      { id: 15, message: "Be a Good Friend", emoji: "👫", color: "from-blue-400 to-indigo-400" },
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
    navigate("/student/moral-values/kids/journal-kindness");
  };

  const currentSet = posterSets[currentPosterIndex];
  const selectedPosterData = currentSet.find(p => p.id === selectedPoster);

  return (
    <GameShell
      title="Kindness Poster"
      subtitle="Create 5 Posters About Kindness 🌸"
      onNext={handleNext}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && earnedBadge}
      score={earnedBadge ? 5 : completedPosters.length}
      gameId="moral-kids-26"
      gameType="educational"
      totalLevels={100}
      currentLevel={26}
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
            <h2 className="text-3xl font-bold text-white mb-4">🏆 Kindness Hero Badge!</h2>
            <p className="text-white/80 mb-6">
              You completed all 5 kindness posters! Amazing work spreading positivity 💕
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

            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏅</div>
              <p className="text-white text-2xl font-bold">Kindness Hero Badge!</p>
              <p className="text-white/80 text-sm mt-2">
                You are a true ambassador of kindness and love 💛
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterKindness;
