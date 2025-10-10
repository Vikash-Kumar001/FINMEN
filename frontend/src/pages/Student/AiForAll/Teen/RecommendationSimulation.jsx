import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RecommendationSimulation = () => {
  const navigate = useNavigate();
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const interests = [
    { 
      id: 1, 
      name: "Cricket", 
      emoji: "🏏", 
      recommendations: [
        "🎬 Cricket World Cup Highlights",
        "📰 Latest Cricket News",
        "🎮 Cricket 22 Game",
        "📊 Player Statistics",
        "👕 Cricket Merchandise"
      ] 
    },
    { 
      id: 2, 
      name: "Technology", 
      emoji: "💻", 
      recommendations: [
        "🎥 Tech Review Videos",
        "📱 Latest Gadgets",
        "💡 Coding Tutorials",
        "🤖 AI & Robotics News",
        "🎮 Gaming Hardware"
      ] 
    },
    { 
      id: 3, 
      name: "Music", 
      emoji: "🎵", 
      recommendations: [
        "🎧 Playlist: Top Charts",
        "🎸 Guitar Lessons",
        "🎤 Live Concert Videos",
        "📻 Music Podcasts",
        "🎹 Music Production Tools"
      ] 
    }
  ];

  const handleInterest = (intId) => {
    setSelectedInterest(intId);
  };

  const handleSeeRecommendations = () => {
    if (selectedInterest) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowRecommendations(true);
    }
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/teen/ai-everywhere-quiz");
  };

  const selectedInt = interests.find(i => i.id === selectedInterest);

  return (
    <GameShell
      title="Recommendation Simulation"
      subtitle="How AI Recommends"
      onNext={handleFinish}
      nextEnabled={showRecommendations}
      showGameOver={showRecommendations}
      score={coins}
      gameId="ai-teen-19"
      gameType="ai"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showRecommendations}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showRecommendations ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What are you interested in?</h2>
            
            <p className="text-white/80 mb-6 text-center">Select your interest to see AI-powered recommendations:</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => handleInterest(interest.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedInterest === interest.id
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
              disabled={!selectedInterest}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedInterest
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
              Your Personalized Recommendations!
            </h2>
            
            <div className="bg-purple-500/20 rounded-lg p-5 mb-6">
              <p className="text-white/80 text-sm mb-3">
                You selected: {selectedInt.emoji} {selectedInt.name}
              </p>
              <p className="text-white text-lg font-bold mb-4">AI recommends for you:</p>
              <div className="space-y-3">
                {selectedInt.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition">
                    <p className="text-white font-semibold">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm mb-3">
                💡 Recommendation systems are everywhere! Netflix, YouTube, Spotify, Amazon - they all use 
                AI to analyze your preferences and suggest content you'll love. These systems learn from 
                millions of users to make smart predictions!
              </p>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• <strong>Collaborative filtering:</strong> "Users like you also liked..."</li>
                <li>• <strong>Content-based:</strong> "Because you liked X, you might like Y..."</li>
                <li>• <strong>Hybrid systems:</strong> Combining multiple AI techniques!</li>
              </ul>
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

export default RecommendationSimulation;

