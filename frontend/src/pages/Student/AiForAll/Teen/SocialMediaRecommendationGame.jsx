import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SocialMediaRecommendationGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedLike, setSelectedLike] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const interests = [
    {
      id: 1,
      name: "Football",
      emoji: "⚽",
      recommendations: [
        "🎥 Football Highlights",
        "📸 Best Goals Reel",
        "📰 Latest Football News",
        "🎮 FIFA Game Clips",
        "🏆 Top Matches Replay"
      ]
    },
    {
      id: 2,
      name: "Dance",
      emoji: "💃",
      recommendations: [
        "🎶 Trending Dance Reels",
        "🎥 Dance Tutorials",
        "📸 Best Dance Performances",
        "🎵 Viral Dance Challenges",
        "🎬 Dance Competition Clips"
      ]
    },
    {
      id: 3,
      name: "Cooking",
      emoji: "🍳",
      recommendations: [
        "🍲 Easy Recipes",
        "🎥 Cooking Tips",
        "📸 Delicious Food Reels",
        "👩‍🍳 Chef Techniques",
        "🎬 Cooking Challenges"
      ]
    }
  ];

  const handleLike = (id) => {
    setSelectedLike(id);
  };

  const handleSeeRecommendations = () => {
    if (selectedLike) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowRecommendations(true);
    }
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/face-unlock-simulation"); // Update with actual next game path
  };

  const selectedInterest = interests.find(i => i.id === selectedLike);

  return (
    <GameShell
      title="Social Media Recommendation"
      subtitle="AI Suggests Content You Like"
      onNext={handleNext}
      nextEnabled={showRecommendations}
      showGameOver={showRecommendations}
      score={coins}
      gameId="ai-teen-28"
      gameType="ai"
      totalLevels={30}
      currentLevel={28}
      showConfetti={showRecommendations}
      backPath="/games/ai-for-all/teens"
    
      maxScore={30} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showRecommendations ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">👍</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What do you like?</h2>
            
            <p className="text-white/80 mb-6 text-center">
              Click on a topic you like to see AI-powered recommendations:
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => handleLike(interest.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedLike === interest.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl mb-2">{interest.emoji}</div>
                  <div className="text-white font-semibold">{interest.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSeeRecommendations}
              disabled={!selectedLike}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedLike
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              See AI Suggestions! 🤖
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🤖</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Your AI Recommendations!
            </h2>
            
            <div className="bg-purple-500/20 rounded-lg p-5 mb-6">
              <p className="text-white/80 text-sm mb-3">
                You liked: {selectedInterest.emoji} {selectedInterest.name}
              </p>
              <p className="text-white text-lg font-bold mb-4">AI recommends for you:</p>
              <div className="space-y-3">
                {selectedInterest.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition">
                    <p className="text-white font-semibold">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm mb-3">
                💡 Recommender systems analyze your likes and behavior to show content you'll enjoy.
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

export default SocialMediaRecommendationGame;
