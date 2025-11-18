import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTaskRightChoice = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 5 Rounds of Poster Sets
  const posterRounds = [
    {
      title: "Right Choice Posters",
      posters: [
        { id: 1, message: "Always Choose Right", emoji: "✅", color: "from-blue-400 to-purple-400" },
        { id: 2, message: "Make the Right Decisions", emoji: "🎯", color: "from-green-400 to-teal-400" },
        { id: 3, message: "Good Choices Lead to Success", emoji: "🌟", color: "from-pink-400 to-red-400" },
        { id: 4, message: "Right Actions, Bright Future", emoji: "💡", color: "from-yellow-400 to-orange-400" },
        { id: 5, message: "Choose Wisely Every Time", emoji: "🧭", color: "from-indigo-400 to-blue-500" }
      ],
      feedback: "Making the right choices builds honesty, trust, and respect.",
    },
    {
      title: "Kindness Posters",
      posters: [
        { id: 1, message: "Spread Kindness Everywhere", emoji: "💖", color: "from-pink-400 to-rose-400" },
        { id: 2, message: "Be Kind, Be Brave", emoji: "🦋", color: "from-blue-400 to-cyan-400" },
        { id: 3, message: "Kind Words Cost Nothing", emoji: "💬", color: "from-green-400 to-teal-400" },
        { id: 4, message: "Kindness is Strength", emoji: "💪", color: "from-purple-400 to-indigo-400" },
        { id: 5, message: "Do Good, Feel Good", emoji: "🌈", color: "from-orange-400 to-yellow-400" }
      ],
      feedback: "Small acts of kindness make the biggest difference!",
    },
    {
      title: "Honesty Posters",
      posters: [
        { id: 1, message: "Honesty Shines Bright", emoji: "✨", color: "from-yellow-400 to-orange-400" },
        { id: 2, message: "Tell the Truth, Always", emoji: "📖", color: "from-green-400 to-teal-400" },
        { id: 3, message: "Honesty is the Best Policy", emoji: "🔑", color: "from-blue-400 to-indigo-400" },
        { id: 4, message: "Be True, Be You", emoji: "🫶", color: "from-pink-400 to-purple-400" },
        { id: 5, message: "Truth Builds Trust", emoji: "🤝", color: "from-indigo-400 to-blue-500" }
      ],
      feedback: "Honesty builds trust and makes every friendship stronger.",
    },
    {
      title: "Helping Posters",
      posters: [
        { id: 1, message: "Helping Hands, Happy Hearts", emoji: "🤲", color: "from-green-400 to-lime-400" },
        { id: 2, message: "Be the Reason Someone Smiles", emoji: "😊", color: "from-blue-400 to-sky-400" },
        { id: 3, message: "Together We Can", emoji: "🤝", color: "from-purple-400 to-pink-400" },
        { id: 4, message: "Helping is Caring", emoji: "🌷", color: "from-yellow-400 to-orange-400" },
        { id: 5, message: "Share, Help, Inspire", emoji: "✨", color: "from-teal-400 to-blue-500" }
      ],
      feedback: "Helping others spreads joy and builds strong communities.",
    },
    {
      title: "Respect Posters",
      posters: [
        { id: 1, message: "Respect Everyone, Always", emoji: "🙏", color: "from-purple-400 to-indigo-400" },
        { id: 2, message: "Respect is Power", emoji: "💪", color: "from-blue-400 to-cyan-400" },
        { id: 3, message: "Give Respect, Get Respect", emoji: "🤝", color: "from-yellow-400 to-orange-400" },
        { id: 4, message: "Respect Nature, Respect Life", emoji: "🌍", color: "from-green-400 to-teal-400" },
        { id: 5, message: "Respect Starts With You", emoji: "💫", color: "from-pink-400 to-red-400" }
      ],
      feedback: "Respecting others brings peace, friendship, and unity.",
    },
  ];

  const currentSet = posterRounds[currentRound];
  const selectedPosterData = currentSet.posters.find(p => p.id === selectedPoster);

  const handlePosterSelect = (posterId) => setSelectedPoster(posterId);

  const handleCreate = () => {
    if (selectedPoster) {
      showCorrectAnswerFeedback(1, true);
      setEarnedBadge(true);
      setShowResult(true);
    }
  };

  const handleNextRound = () => {
    if (currentRound < posterRounds.length - 1) {
      setSelectedPoster(null);
      setShowResult(false);
      setEarnedBadge(false);
      setCurrentRound(currentRound + 1);
    } else {
      navigate("/student/moral-values/kids/journal-decisions");
    }
  };

  return (
    <GameShell
      title="Poster Task: Right Choice"
      subtitle="Create Meaningful Moral Posters"
      onNext={handleNextRound}
      nextEnabled={showResult && earnedBadge}
      showGameOver={showResult && currentRound === posterRounds.length - 1}
      score={earnedBadge ? (currentRound + 1) * 3 : currentRound * 3}
      gameId="moral-kids-96"
      gameType="educational"
      totalLevels={100}
      currentLevel={96}
      showConfetti={showResult && earnedBadge}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {currentSet.title}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentSet.posters.map(poster => (
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
              Create Poster! 🎨
            </button>

            <div className="mt-4 text-center text-white/70 text-sm">
              Poster {currentRound + 1} of {posterRounds.length}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              🏆 Poster Badge Earned!
            </h2>

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
              <div className="text-5xl mb-2">🏅</div>
              <p className="text-white text-2xl font-bold">
                {currentSet.title} Badge!
              </p>
              <p className="text-white/80 text-sm mt-2">
                {currentSet.feedback}
              </p>
            </div>

            <button
              onClick={handleNextRound}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentRound < posterRounds.length - 1
                ? "Next Poster ➡️"
                : "Finish Game 🎯"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterTaskRightChoice;
