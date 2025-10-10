import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RecommendationGame = () => {
  const navigate = useNavigate();
  const [selectedPreference, setSelectedPreference] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const preferences = [
    { id: 1, name: "Cartoons", emoji: "📺", recommendations: ["🎬 Cartoon Movie", "🎨 Drawing Show", "🦸 Superhero Cartoon"] },
    { id: 2, name: "Sports", emoji: "⚽", recommendations: ["🏀 Basketball Game", "⚽ Soccer Match", "🏊 Swimming Competition"] },
    { id: 3, name: "Animals", emoji: "🐾", recommendations: ["🐕 Dog Videos", "🐱 Cat Stories", "🦁 Wildlife Documentary"] }
  ];

  const handlePreference = (prefId) => {
    setSelectedPreference(prefId);
  };

  const handleSeeRecommendations = () => {
    if (selectedPreference) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowRecommendations(true);
    }
  };

  const handleFinish = () => {
    navigate("/games/ai-for-all/kids");
  };

  const selectedPref = preferences.find(p => p.id === selectedPreference);

  return (
    <GameShell
      title="Recommendation Game"
      subtitle="How AI Recommends"
      onNext={handleFinish}
      nextEnabled={showRecommendations}
      showGameOver={showRecommendations}
      score={coins}
      gameId="ai-kids-20"
      gameType="ai"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showRecommendations}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showRecommendations ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What do you like?</h2>
            
            <p className="text-white/80 mb-6 text-center">Choose what you enjoy watching:</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {preferences.map(pref => (
                <button
                  key={pref.id}
                  onClick={() => handlePreference(pref.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedPreference === pref.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{pref.emoji}</div>
                  <div className="text-white font-semibold">{pref.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSeeRecommendations}
              disabled={!selectedPreference}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPreference
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              See AI Recommendations! 🎯
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              AI Recommendations for You!
            </h2>
            
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/80 text-sm mb-3">You liked: {selectedPref.emoji} {selectedPref.name}</p>
              <p className="text-white text-lg font-bold mb-4">AI recommends:</p>
              <div className="space-y-2">
                {selectedPref.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg p-3">
                    <p className="text-white font-semibold">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 YouTube, Netflix, and Spotify use AI to recommend videos and songs you might like 
                based on what you've watched before!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RecommendationGame;

