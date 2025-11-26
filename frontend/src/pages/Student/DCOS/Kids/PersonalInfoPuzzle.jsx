import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PersonalInfoPuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-4";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, item: "Your Full Name", emoji: "👤", correctCategory: "Private Info" },
    { id: 2, item: "Home Address", emoji: "🏠", correctCategory: "Private Info" },
    { id: 3, item: "Password", emoji: "🔒", correctCategory: "Private Info" },
    { id: 4, item: "Favorite Color", emoji: "🎨", correctCategory: "Okay to Share" },
    { id: 5, item: "Phone Number", emoji: "📱", correctCategory: "Private Info" }
  ];

  const categories = ["Private Info", "Okay to Share"];

  const handleCategorySelect = (category) => {
    if (answered) return;
    setSelectedCategory(category);
  };

  const handleConfirm = () => {
    if (!selectedCategory || answered) return;

    setAnswered(true);
    const item = items[currentMatch];
    const isCorrect = selectedCategory === item.correctCategory;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastItem = currentMatch === items.length - 1;
    
    setTimeout(() => {
      if (isLastItem) {
        setShowResult(true);
      } else {
        setCurrentMatch(prev => prev + 1);
        setSelectedCategory(null);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentMatch(0);
    setSelectedCategory(null);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentItem = items[currentMatch];

  return (
    <GameShell
      title="Personal Info Puzzle"
      score={score}
      subtitle={!showResult ? `Item ${currentMatch + 1} of ${items.length}: Match items to Private or Okay to Share!` : "Puzzle Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={items.length}
      currentLevel={currentMatch + 1}
      maxScore={items.length}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentItem ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Item {currentMatch + 1}/{items.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{items.length}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-3 text-center">{currentItem.emoji}</div>
                <p className="text-white text-2xl font-bold text-center">{currentItem.item}</p>
              </div>
              
              <p className="text-white/90 mb-4 text-center text-lg font-semibold">Is this private or okay to share?</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    disabled={answered}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      selectedCategory === category
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-white font-bold text-lg">{category}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedCategory || answered}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedCategory && !answered
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Choice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Privacy Pro!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {items.length} correctly!
                  Great job protecting your privacy!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Keep your name, address, password, phone, and school PRIVATE online!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {items.length} correctly.
                  Remember to keep personal information private!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Keep your name, address, password, phone, and school PRIVATE online!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PersonalInfoPuzzle;

