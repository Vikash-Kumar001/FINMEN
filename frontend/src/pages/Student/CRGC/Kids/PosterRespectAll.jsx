import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterRespectAll = () => {
  const navigate = useNavigate();
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const icons = [
    { id: 1, emoji: "🗣️", name: "Voice" },
    { id: 2, emoji: "👂", name: "Listen" },
    { id: 3, emoji: "🤝", name: "Unity" },
    { id: 4, emoji: "🌈", name: "Diversity" },
    { id: 5, emoji: "💪", name: "Strength" },
    { id: 6, emoji: "⭐", name: "Value" }
  ];

  const backgrounds = [
    { id: 1, name: "Rainbow", gradient: "from-red-400 via-yellow-400 to-green-400" },
    { id: 2, name: "Unity", gradient: "from-blue-500 to-purple-500" },
    { id: 3, name: "Harmony", gradient: "from-pink-400 to-orange-400" },
    { id: 4, name: "Peace", gradient: "from-cyan-400 to-blue-500" }
  ];

  const handleToggleIcon = (iconId) => {
    if (selectedIcons.includes(iconId)) {
      setSelectedIcons(selectedIcons.filter(id => id !== iconId));
    } else if (selectedIcons.length < 3) {
      setSelectedIcons([...selectedIcons, iconId]);
    }
  };

  const handleCreatePoster = () => {
    if (selectedIcons.length >= 3 && selectedBackground) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
      setShowPoster(true);
    }
  };

  const handleNext = () => {
    navigate("/student/civic-responsibility/kids/journal-of-respect");
  };

  const bg = backgrounds.find(b => b.id === selectedBackground);
  const chosenIcons = icons.filter(i => selectedIcons.includes(i.id));

  return (
    <GameShell
      title="Poster: Respect All"
      subtitle="Express Respect"
      onNext={handleNext}
      nextEnabled={showPoster}
      showGameOver={showPoster}
      score={coins}
      gameId="crgc-kids-16"
      gameType="crgc"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showPoster}
      backPath="/games/civic-responsibility/kids"
    >
      <div className="space-y-8">
        {!showPoster ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Create Your Respect Poster!</h3>
            
            <div className="mb-6">
              <h4 className="text-white font-bold mb-3">Choose 3 Icons:</h4>
              <div className="grid grid-cols-3 gap-3">
                {icons.map(icon => (
                  <button
                    key={icon.id}
                    onClick={() => handleToggleIcon(icon.id)}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      selectedIcons.includes(icon.id)
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-4xl mb-1">{icon.emoji}</div>
                    <div className="text-white text-xs font-semibold">{icon.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-white/70 text-sm mt-2 text-center">
                Selected: {selectedIcons.length}/3
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
              disabled={selectedIcons.length < 3 || !selectedBackground}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedIcons.length >= 3 && selectedBackground
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Create Poster! 🎨
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Respect Poster!</h2>
            
            <div className={`bg-gradient-to-br ${bg.gradient} rounded-2xl p-8 mb-6 text-center`}>
              <div className="flex justify-center gap-4 mb-6">
                {chosenIcons.map(icon => (
                  <div key={icon.id} className="text-7xl">{icon.emoji}</div>
                ))}
              </div>
              <h2 className="text-white text-4xl font-black mb-2">Every Voice</h2>
              <h1 className="text-white text-5xl font-black">MATTERS!</h1>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                🌟 Beautiful! Remember, everyone deserves respect and to be heard. Every voice matters!
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

export default PosterRespectAll;

