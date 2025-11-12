import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EqualityPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [posters, setPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedStickers, setSelectedStickers] = useState([]); // State for tracking selected stickers
  const [posterStickers, setPosterStickers] = useState([]); // State for stickers added to poster
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      template: "Equal Play",
      stickers: ["Boy playing", "Girl playing", "Together", "Fair"]
    },
    {
      id: 2,
      template: "Equal Jobs",
      stickers: ["Doctor boy", "Doctor girl", "Engineer boy", "Engineer girl"]
    },
    {
      id: 3,
      template: "Equal School",
      stickers: ["Books for all", "Classroom mix", "Learning together"]
    },
    {
      id: 4,
      template: "Equal Dreams",
      stickers: ["Pilot girl", "Chef boy", "Artist all"]
    },
    {
      id: 5,
      template: "Equal Rights",
      stickers: ["Play", "Learn", "Safe", "Love"]
    }
  ];

  // Function to toggle sticker selection
  const toggleStickerSelection = (sticker) => {
    setSelectedStickers(prev => {
      if (prev.includes(sticker)) {
        return prev.filter(s => s !== sticker);
      } else {
        return [...prev, sticker];
      }
    });
  };

  // Function to add selected stickers to poster
  const addToPoster = () => {
    setPosterStickers(prev => [...prev, ...selectedStickers]);
    setSelectedStickers([]); // Clear selection after adding
  };

  const handlePoster = () => {
    const allStickers = [...posterStickers, ...selectedStickers];
    const newPosters = [...posters, allStickers];
    setPosters(newPosters);

    const isComplete = allStickers.length >= 3; // Arbitrary criteria for completeness
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedStickers([]); // Reset selection for next level
        setPosterStickers([]); // Reset poster for next level
      }, isComplete ? 800 : 0);
    } else {
      const completePosters = newPosters.filter(sel => sel.length >= 3).length;
      setFinalScore(completePosters);
      if (completePosters >= 3) {
        setCoins(5); // Badge equivalent as coins
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPosters([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedStickers([]); // Reset selection
    setPosterStickers([]); // Reset poster
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Equality Poster"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-26"
      gameType="uvls"
      totalLevels={30}
      currentLevel={26}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Build poster for {getCurrentLevel().template}!</p>
              
              {/* Available stickers */}
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Stickers:</h3>
                <div className="flex flex-wrap gap-3">
                  {getCurrentLevel().stickers.map(sticker => (
                    <button
                      key={sticker}
                      onClick={() => toggleStickerSelection(sticker)}
                      className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                        selectedStickers.includes(sticker)
                          ? "bg-green-500 border-2 border-green-300" // Visual feedback for selected
                          : "bg-yellow-500 hover:bg-yellow-400 border-2 border-yellow-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{sticker}</span>
                        <span>🖼️</span>
                        {selectedStickers.includes(sticker) && <span className="text-lg">✅</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add to poster button */}
              <button
                onClick={addToPoster}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                disabled={selectedStickers.length === 0}
              >
                Add to Poster ({selectedStickers.length} selected)
              </button>
              
              {/* Poster area */}
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-2">Your Poster:</h3>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 min-h-40 rounded-xl p-4 border-4 border-white/30 backdrop-blur-sm">
                  <div className="flex flex-wrap gap-3">
                    {posterStickers.map((sticker, index) => (
                      <div key={index} className="bg-white/90 text-purple-900 px-3 py-2 rounded-lg font-medium">
                        {sticker} 🎨
                      </div>
                    ))}
                    {posterStickers.length === 0 && (
                      <div className="text-white/80 italic self-center">
                        Add stickers to create your equality poster!
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handlePoster} 
                className="mt-6 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Complete Poster ({posterStickers.length + selectedStickers.length} stickers)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Poster Master!" : "💪 Build More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed {finalScore} posters!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned a Badge! 🏅" : "Try again!"}
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

export default EqualityPoster;