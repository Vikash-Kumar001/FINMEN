import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GratitudePoster = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const posters = [
    { id: 1, message: "Always Say Thank You", emoji: "🙏", color: "from-pink-400 to-rose-400" },
    { id: 2, message: "Gratitude is Great", emoji: "💖", color: "from-purple-400 to-pink-400" },
    { id: 3, message: "Be Thankful Every Day", emoji: "✨", color: "from-blue-400 to-cyan-400" },
    { id: 4, message: "Thanks Makes Hearts Happy", emoji: "❤️", color: "from-orange-400 to-red-400" }
  ];

  const handlePosterSelect = (posterId) => {
    setSelectedPoster(posterId);
  };

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      setEarnedBadge(true);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/journal-of-gratitude");
  };

  const selectedPosterData = posters.find(p => p.id === selectedPoster);

  return (
    <GameShell
      title="Gratitude Poster"
      subtitle="Create a Thank You Poster"
      onNext={handleNext}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="moral-kids-16"
      gameType="educational"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showResult && earnedBadge}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Gratitude Message</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {posters.map(poster => (
                <button
                  key={poster.id}
                  onClick={() => handlePosterSelect(poster.id)}
                  className={`border-3 rounded-xl p-6 transition-all bg-gradient-to-br ${poster.color} ${
                    selectedPoster === poster.id ? 'ring-4 ring-white scale-105' : ''
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
                <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedPosterData.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}>
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Create Poster! 🎨
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">🏆 Gratitude Badge!</h2>
            <div className="mb-6">
              <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedPosterData.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}>
                <div className="text-6xl mb-4">{selectedPosterData.emoji}</div>
                <div className="text-white text-3xl font-bold text-center">{selectedPosterData.message}</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏆</div>
              <p className="text-white text-2xl font-bold">Gratitude Poster Badge!</p>
              <p className="text-white/80 text-sm mt-2">You created a thankful poster!</p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GratitudePoster;

