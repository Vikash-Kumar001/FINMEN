import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InclusionPoster = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const themes = [
    { id: 1, name: "Everyone Belongs", emoji: "🌈", color: "from-red-400 via-yellow-400 to-blue-400" },
    { id: 2, name: "Friendship Circle", emoji: "👥", color: "from-pink-400 via-purple-400 to-indigo-400" },
    { id: 3, name: "Together We're Strong", emoji: "💪", color: "from-green-400 via-teal-400 to-cyan-400" },
    { id: 4, name: "All Are Welcome", emoji: "🏠", color: "from-orange-400 via-amber-400 to-yellow-400" }
  ];

  const stickers = [
    { id: 1, emoji: "👫", label: "Friends Together" },
    { id: 2, emoji: "🤝", label: "Helping Hands" },
    { id: 3, emoji: "❤️", label: "Love & Care" },
    { id: 4, emoji: "🌟", label: "Everyone Shines" },
    { id: 5, emoji: "🎈", label: "Celebration" },
    { id: 6, emoji: "🌍", label: "One World" },
    { id: 7, emoji: "🎨", label: "Different Colors" },
    { id: 8, emoji: "🤗", label: "Warm Hugs" },
    { id: 9, emoji: "👐", label: "Open Arms" },
    { id: 10, emoji: "🌺", label: "Bloom Together" },
    { id: 11, emoji: "🦋", label: "Be Yourself" },
    { id: 12, emoji: "🏆", label: "All Win Together" }
  ];

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
  };

  const handleStickerToggle = (stickerId) => {
    if (selectedStickers.includes(stickerId)) {
      setSelectedStickers(selectedStickers.filter(id => id !== stickerId));
    } else if (selectedStickers.length < 3) {
      setSelectedStickers([...selectedStickers, stickerId]);
    }
  };

  const handleSubmit = () => {
    if (selectedTheme && selectedStickers.length === 3) {
      showCorrectAnswerFeedback(3, false);
      setCoins(3); // +3 Coins for poster (minimum for progress)
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const selectedThemeObj = themes.find(t => t.id === selectedTheme);

  return (
    <GameShell
      title="Inclusion Poster"
      subtitle="Create Your Inclusion Poster"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="uvls-kids-16"
      gameType="uvls"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showResult}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">1. Choose Your Theme</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`border-3 rounded-xl p-4 transition-all transform hover:scale-105 bg-gradient-to-br ${theme.color} ${
                      selectedTheme === theme.id ? 'ring-4 ring-white' : ''
                    }`}
                  >
                    <div className="text-4xl mb-2">{theme.emoji}</div>
                    <div className="text-white font-bold text-sm">{theme.name}</div>
                  </button>
                ))}
              </div>

              <h3 className="text-white text-xl font-bold mb-4">
                2. Add 3 Inclusion Stickers ({selectedStickers.length}/3)
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

              {selectedTheme && selectedStickers.length === 3 && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">3. Preview Your Poster</h3>
                  <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedThemeObj.color} min-h-[200px] flex flex-col items-center justify-center`}>
                    <div className="text-white text-2xl font-bold mb-4">{selectedThemeObj.name}</div>
                    <div className="flex gap-6 text-6xl mb-2">
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
                onClick={handleSubmit}
                disabled={!selectedTheme || selectedStickers.length !== 3}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedTheme && selectedStickers.length === 3
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit Poster! 🎨
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Beautiful Poster!</h2>
            <div className="mb-6">
              <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedThemeObj.color} min-h-[200px] flex flex-col items-center justify-center`}>
                <div className="text-white text-2xl font-bold mb-4">{selectedThemeObj.name}</div>
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
              You earned 3 Coins! 🏆
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Use posters to start class discussions about inclusion!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusionPoster;

