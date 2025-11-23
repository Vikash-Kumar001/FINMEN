import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RecommendationGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPreference, setSelectedPreference] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback, showAnswerConfetti, flashPoints } = useGameFeedback();

  // 5 questions (categories)
  const questions = [
    {
      id: 1,
      title: "What do you like watching?",
      options: [
        { id: 1, name: "Cartoons", emoji: "📺", recommendations: ["🎬 Cartoon Movie", "🎨 Drawing Show", "🦸 Superhero Cartoon"] },
        { id: 2, name: "Sports", emoji: "⚽", recommendations: ["🏀 Basketball Game", "⚽ Soccer Match", "🏊 Swimming Competition"] },
        { id: 3, name: "Animals", emoji: "🐾", recommendations: ["🐕 Dog Videos", "🐱 Cat Stories", "🦁 Wildlife Documentary"] }
      ]
    },
    {
      id: 2,
      title: "What do you like reading?",
      options: [
        { id: 1, name: "Comics", emoji: "📚", recommendations: ["🦸 Superhero Comics", "😂 Funny Comics", "🎨 Art Books"] },
        { id: 2, name: "Science", emoji: "🔬", recommendations: ["🚀 Space Books", "🧬 Biology Stories", "⚡ Invention Facts"] },
        { id: 3, name: "Adventure", emoji: "🗺️", recommendations: ["🏔️ Travel Tales", "🏝️ Survival Stories", "🗡️ Fantasy Quests"] }
      ]
    },
    {
      id: 3,
      title: "What games do you enjoy?",
      options: [
        { id: 1, name: "Racing", emoji: "🏎️", recommendations: ["🚗 Car Racer", "🏍️ Bike Rush", "🛞 Drift Game"] },
        { id: 2, name: "Puzzle", emoji: "🧩", recommendations: ["🧠 Brain Test", "🔢 Math Challenge", "🎨 Pattern Solver"] },
        { id: 3, name: "Shooting", emoji: "🎯", recommendations: ["🔫 Target Practice", "🪖 Battle Hero", "🛰️ Space Blaster"] }
      ]
    },
    {
      id: 4,
      title: "What music do you like?",
      options: [
        { id: 1, name: "Pop", emoji: "🎤", recommendations: ["🎶 Pop Hits", "🎧 Trending Songs", "💃 Dance Mix"] },
        { id: 2, name: "Classical", emoji: "🎻", recommendations: ["🎼 Calm Tunes", "🎹 Piano Melodies", "🎺 Orchestra Music"] },
        { id: 3, name: "Rock", emoji: "🎸", recommendations: ["🤘 Rock Legends", "🎵 Guitar Jams", "🔥 Power Songs"] }
      ]
    },
    {
      id: 5,
      title: "What do you like learning?",
      options: [
        { id: 1, name: "Coding", emoji: "💻", recommendations: ["🧠 AI Basics", "🌐 Web Projects", "🤖 Robot Coding"] },
        { id: 2, name: "Art", emoji: "🎨", recommendations: ["🖌️ Drawing Tips", "🧵 Craft Tutorials", "🎭 Design Challenges"] },
        { id: 3, name: "History", emoji: "🏺", recommendations: ["🏰 Ancient Stories", "📜 Kings & Queens", "⚔️ Famous Battles"] }
      ]
    }
  ];

  const current = questions[currentQuestion];
  const selectedPref = current?.options.find((p) => p.id === selectedPreference);

  const handlePreference = (id) => {
    setSelectedPreference(id);
  };

  const handleSeeRecommendations = () => {
    if (selectedPreference) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
      setShowRecommendations(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedPreference(null);
      setShowRecommendations(false);
    } else {
      setShowRecommendations(false);
      navigate("/games/ai-for-all/kids/ai-or-not-quiz");
    }
  };

  return (
    <GameShell
      title="Recommendation Game"
      subtitle="How AI Recommends"
      onNext={handleNext}
      nextEnabled={showRecommendations}
      showGameOver={currentQuestion === questions.length - 1 && showRecommendations}
      score={coins}
      gameId="ai-kids-20"
      gameType="ai"
      totalLevels={100}
      currentLevel={20}
      showConfetti={showRecommendations}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showRecommendations ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {current.title}
            </h2>
            <p className="text-white/80 mb-6 text-center">
              Choose your preference below:
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {current.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handlePreference(opt.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedPreference === opt.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{opt.emoji}</div>
                  <div className="text-white font-semibold">{opt.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSeeRecommendations}
              disabled={!selectedPreference}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPreference
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              See AI Recommendations! 🎯
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              AI Recommendations for You!
            </h2>
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white/80 text-sm mb-3">
                You liked: {selectedPref.emoji} {selectedPref.name}
              </p>
              <p className="text-white text-lg font-bold mb-4">AI suggests:</p>
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
                💡 AI platforms like YouTube, Netflix, and Spotify use your
                choices to recommend what you might enjoy next!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
              +5 Coins Earned! 🪙 (Total: {coins})
            </p>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Game ✅"
                : "Next →"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RecommendationGame;
