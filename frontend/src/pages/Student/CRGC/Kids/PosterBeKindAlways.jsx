import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterBeKindAlways = () => {
  const navigate = useNavigate();
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const stickers = [
    { id: 1, emoji: "💖", name: "Heart" },
    { id: 2, emoji: "🤝", name: "Handshake" },
    { id: 3, emoji: "😊", name: "Smile" },
    { id: 4, emoji: "🌟", name: "Star" },
    { id: 5, emoji: "🦸", name: "Superhero" },
    { id: 6, emoji: "🌈", name: "Rainbow" }
  ];

  const backgrounds = [
    { id: 1, name: "Sky Blue", gradient: "from-blue-400 to-cyan-300" },
    { id: 2, name: "Pink Dreams", gradient: "from-pink-400 to-purple-400" },
    { id: 3, name: "Sunshine", gradient: "from-yellow-400 to-orange-400" },
    { id: 4, name: "Nature", gradient: "from-green-400 to-emerald-500" }
  ];

  const handleToggleSticker = (stickerId) => {
    if (selectedStickers.includes(stickerId)) {
      setSelectedStickers(selectedStickers.filter(id => id !== stickerId));
    } else if (selectedStickers.length < 3) {
      setSelectedStickers([...selectedStickers, stickerId]);
    }
  };

  const handleCreatePoster = () => {
    if (selectedStickers.length >= 3 && selectedBackground) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowPoster(true);
    }
  };

  const handleNext = () => {
    navigate("/student/civic-responsibility/kids/journal-of-empathy");
  };

  const bg = backgrounds.find(b => b.id === selectedBackground);
  const chosenStickers = stickers.filter(s => selectedStickers.includes(s.id));

  return (
    <GameShell
      title="Poster: Be Kind Always"
      subtitle="Express Kindness"
      onNext={handleNext}
      nextEnabled={showPoster}
      showGameOver={showPoster}
      score={coins}
      gameId="crgc-kids-6"
      gameType="crgc"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showPoster}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        {!showPoster ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Create Your Kindness Poster!</h3>
            
            <div className="mb-6">
              <h4 className="text-white font-bold mb-3">Choose 3 Stickers:</h4>
              <div className="grid grid-cols-3 gap-3">
                {stickers.map(sticker => (
                  <button
                    key={sticker.id}
                    onClick={() => handleToggleSticker(sticker.id)}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      selectedStickers.includes(sticker.id)
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-4xl mb-1">{sticker.emoji}</div>
                    <div className="text-white text-xs font-semibold">{sticker.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-white/70 text-sm mt-2 text-center">
                Selected: {selectedStickers.length}/3
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-bold mb-3">Choose Background:</h4>
              <div className="grid grid-cols-4 gap-3">
                {backgrounds.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={`h-16 rounded-xl bg-gradient-to-br ${bg.gradient} transition-all ${
                      selectedBackground === bg.id
                        ? 'ring-4 ring-white scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className="text-white text-xs font-bold">{bg.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreatePoster}
              disabled={selectedStickers.length < 3 || !selectedBackground}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedStickers.length >= 3 && selectedBackground
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Create Poster! 🎨
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Kindness Poster!</h2>
            
            <div className={`bg-gradient-to-br ${bg.gradient} rounded-2xl p-8 mb-6 text-center`}>
              <div className="flex justify-center gap-4 mb-6">
                {chosenStickers.map(sticker => (
                  <div key={sticker.id} className="text-7xl">{sticker.emoji}</div>
                ))}
              </div>
              <h2 className="text-white text-4xl font-black mb-2">Kindness is My</h2>
              <h1 className="text-white text-5xl font-black">SUPERPOWER!</h1>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                🌟 Amazing poster! Remember, kindness is a superpower that makes the world better!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned a Badge! 🏆
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterBeKindAlways;

