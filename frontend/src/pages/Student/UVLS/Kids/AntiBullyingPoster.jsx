import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AntiBullyingPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-36";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [posters, setPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedStickers, setSelectedStickers] = useState([]); // State for tracking selected stickers
  const [posterStickers, setPosterStickers] = useState([]); // State for tracking stickers added to poster
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      template: "Stop Bullying",
      stickers: ["Kind Words", "Report Icon", "Friends Together", "No Teasing"]
    },
    {
      id: 2,
      template: "Be a Friend",
      stickers: ["Hug", "Share", "Listen", "Support"]
    },
    {
      id: 3,
      template: "Safe School",
      stickers: ["Teacher Help", "No Fighting", "Include All", "Positive Vibes"]
    },
    {
      id: 4,
      template: "Online Kindness",
      stickers: ["Block Mean", "Positive Posts", "Report Cyber", "Digital Friends"]
    },
    {
      id: 5,
      template: "Stand Up",
      stickers: ["Bystander Hero", "Say Stop", "Team Up", "Courage"]
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
    if (selectedStickers.length > 0) {
      setPosterStickers(prev => [...prev, ...selectedStickers]);
      setSelectedStickers([]); // Clear selection after adding
    }
  };

  const handlePoster = () => {
    const newPosters = [...posters, posterStickers];
    setPosters(newPosters);

    const isComplete = posterStickers.length >= 3;
    if (isComplete) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setPosterStickers([]); // Reset poster for next level
        setSelectedStickers([]); // Reset selection
      }, isComplete ? 800 : 0);
    } else {
      const completePosters = newPosters.filter(sel => sel.length >= 3).length;
      setFinalScore(completePosters);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPosters([]);
    setCoins(0);
    setFinalScore(0);
    setPosterStickers([]); // Reset poster
    setSelectedStickers([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Anti-Bullying Poster"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-36"
      gameType="uvls"
      totalLevels={50}
      currentLevel={36}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Design {getCurrentLevel().template} poster!</p>
              
              {/* Available stickers to select */}
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Available Stickers:</h3>
                <div className="flex flex-wrap gap-2">
                  {getCurrentLevel().stickers.map(sticker => (
                    <button
                      key={sticker}
                      onClick={() => toggleStickerSelection(sticker)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedStickers.includes(sticker)
                          ? "bg-yellow-500 text-black ring-2 ring-yellow-300"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {sticker} {selectedStickers.includes(sticker) ? "✅" : "🛡️"}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add to poster button */}
              <button 
                onClick={addToPoster}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
                disabled={selectedStickers.length === 0}
              >
                Add to Poster ({selectedStickers.length} selected)
              </button>
              
              {/* Poster area */}
              <div className="mt-4 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-40">
                <h3 className="text-white font-medium mb-2">Your Anti-Bullying Poster:</h3>
                {posterStickers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {posterStickers.map((sticker, index) => (
                      <div key={index} className="bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {sticker} ✨
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70 italic">Add stickers to design your poster...</p>
                )}
              </div>
              
              {/* Complete button */}
              <button 
                onClick={handlePoster} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition"
                disabled={posterStickers.length === 0}
              >
                Complete Poster ({posterStickers.length} stickers)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Poster Creator!" : "💪 Design More!"}
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

export default AntiBullyingPoster;