import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const KindPoster = () => {
  const navigate = useNavigate();
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const backgrounds = [
    { id: 1, name: "Rainbow", emoji: "🌈", color: "from-pink-400 via-purple-400 to-blue-400" },
    { id: 2, name: "Sunny", emoji: "☀️", color: "from-yellow-300 via-orange-300 to-red-300" },
    { id: 3, name: "Nature", emoji: "🌳", color: "from-green-400 via-teal-400 to-blue-400" },
    { id: 4, name: "Hearts", emoji: "💕", color: "from-pink-300 via-red-300 to-rose-400" }
  ];

  const stickers = [
    { id: 1, emoji: "🤝", label: "Helping Hands" },
    { id: 2, emoji: "💖", label: "Love & Care" },
    { id: 3, emoji: "😊", label: "Happy Face" },
    { id: 4, emoji: "🌟", label: "Shining Star" },
    { id: 5, emoji: "🎈", label: "Celebration" },
    { id: 6, emoji: "🦋", label: "Beautiful" },
    { id: 7, emoji: "🌺", label: "Kindness Flower" },
    { id: 8, emoji: "✨", label: "Sparkle" },
    { id: 9, emoji: "🌸", label: "Cherry Blossom" },
    { id: 10, emoji: "🎨", label: "Art & Creativity" },
    { id: 11, emoji: "🕊️", label: "Peace" },
    { id: 12, emoji: "🙏", label: "Thank You" }
  ];

  const handleBackgroundSelect = (bgId) => {
    setSelectedBackground(bgId);
  };

  const handleStickerToggle = (stickerId) => {
    if (selectedStickers.includes(stickerId)) {
      setSelectedStickers(selectedStickers.filter(id => id !== stickerId));
    } else if (selectedStickers.length < 3) {
      setSelectedStickers([...selectedStickers, stickerId]);
    }
  };

  const handleSavePoster = () => {
    if (selectedBackground && selectedStickers.length === 3) {
      showCorrectAnswerFeedback(3, false);
      setCoins(3); // +3 Coins for creative poster (minimum for progress)
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/kids/mini-journal");
  };

  const selectedBg = backgrounds.find(bg => bg.id === selectedBackground);

  return (
    <GameShell
      title="Kind Poster"
      subtitle="Create Your Kindness Poster"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="uvls-kids-6"
      gameType="uvls"
      totalLevels={10}
      currentLevel={6}
      showConfetti={showResult}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">1. Choose Background</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {backgrounds.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => handleBackgroundSelect(bg.id)}
                    className={`border-3 rounded-xl p-4 transition-all transform hover:scale-105 bg-gradient-to-br ${bg.color} ${
                      selectedBackground === bg.id ? 'ring-4 ring-white' : ''
                    }`}
                  >
                    <div className="text-3xl mb-1">{bg.emoji}</div>
                    <div className="text-white font-bold text-sm">{bg.name}</div>
                  </button>
                ))}
              </div>

              <h3 className="text-white text-xl font-bold mb-4">
                2. Add 3 Kindness Stickers ({selectedStickers.length}/3)
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {stickers.map(sticker => (
                  <button
                    key={sticker.id}
                    onClick={() => handleStickerToggle(sticker.id)}
                    disabled={!selectedStickers.includes(sticker.id) && selectedStickers.length >= 3}
                    className={`border-2 rounded-xl p-3 transition-all transform hover:scale-105 ${
                      selectedStickers.includes(sticker.id)
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${!selectedStickers.includes(sticker.id) && selectedStickers.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-3xl mb-1">{sticker.emoji}</div>
                    <div className="text-white text-xs">{sticker.label}</div>
                  </button>
                ))}
              </div>

              {selectedBackground && selectedStickers.length === 3 && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">3. Preview Your Poster</h3>
                  <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedBg.color} min-h-[200px] flex flex-col items-center justify-center`}>
                    <div className="text-white text-2xl font-bold mb-4">Kindness Matters!</div>
                    <div className="flex gap-6 text-6xl">
                      {selectedStickers.map(stickerId => (
                        <span key={stickerId}>
                          {stickers.find(s => s.id === stickerId)?.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSavePoster}
                disabled={!selectedBackground || selectedStickers.length !== 3}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedBackground && selectedStickers.length === 3
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Save My Poster! 🎨
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Poster Created!</h2>
            <p className="text-white/90 text-xl mb-4">
              Your kindness poster is beautiful!
            </p>
            <div className="mb-6">
              <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedBg.color} min-h-[200px] flex flex-col items-center justify-center`}>
                <div className="text-white text-2xl font-bold mb-4">Kindness Matters!</div>
                <div className="flex gap-6 text-6xl">
                  {selectedStickers.map(stickerId => (
                    <span key={stickerId}>
                      {stickers.find(s => s.id === stickerId)?.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 3 Coins! 🪙
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Display your poster in class!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default KindPoster;

