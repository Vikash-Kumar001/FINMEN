import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CyberSpot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-39";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [spots, setSpots] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState([]); // State for tracking selected posts
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      posts: [
        { text: "You're ugly!", isMalicious: true },
        { text: "Nice pic!", isMalicious: false },
        { text: "Loser, go away!", isMalicious: true }
      ]
    },
    {
      id: 2,
      posts: [
        { text: "Fake news about you.", isMalicious: true },
        { text: "Happy birthday!", isMalicious: false },
        { text: "Threatening message.", isMalicious: true }
      ]
    },
    {
      id: 3,
      posts: [
        { text: "Spreading rumors online.", isMalicious: true },
        { text: "Sharing fun meme.", isMalicious: false },
        { text: "Hateful comment.", isMalicious: true }
      ]
    },
    {
      id: 4,
      posts: [
        { text: "Doxing personal info.", isMalicious: true },
        { text: "Compliment on post.", isMalicious: false },
        { text: "Cyber stalking.", isMalicious: true }
      ]
    },
    {
      id: 5,
      posts: [
        { text: "Mean group chat.", isMalicious: true },
        { text: "Friendly invite.", isMalicious: false },
        { text: "Harassing emails.", isMalicious: true }
      ]
    }
  ];

  // Function to toggle post selection
  const togglePostSelection = (index) => {
    setSelectedPosts(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSpot = () => {
    const newSpots = [...spots, selectedPosts];
    setSpots(newSpots);

    const correctSpots = questions[currentLevel].posts.filter(p => p.isMalicious).length;
    const isCorrect = selectedPosts.length === correctSpots && selectedPosts.every(s => questions[currentLevel].posts[s].isMalicious);
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedPosts([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newSpots.filter((sel, idx) => {
        const corr = questions[idx].posts.filter(p => p.isMalicious).length;
        return sel.length === corr && sel.every(s => questions[idx].posts[s].isMalicious);
      }).length;
      setFinalScore(correctLevels);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setSpots([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedPosts([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Cyber Spot"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-39"
      gameType="uvls"
      totalLevels={50}
      currentLevel={39}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap to report malicious posts!</p>
              <div className="space-y-3">
                {getCurrentLevel().posts.map((post, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => togglePostSelection(idx)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedPosts.includes(idx)
                        ? "bg-red-500/30 border-2 border-red-400" // Visual feedback for selected malicious posts
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedPosts.includes(idx) ? "⚠️" : "💻"}
                    </div>
                    <div className="text-white font-medium text-left">{post.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleSpot} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedPosts.length === 0} // Disable if no posts selected
              >
                Submit ({selectedPosts.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Cyber Spotter!" : "💪 Spot More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You spotted correctly in {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 3 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CyberSpot;