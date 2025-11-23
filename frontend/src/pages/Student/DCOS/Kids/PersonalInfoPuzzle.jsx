import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PersonalInfoPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, item: "Your Full Name", emoji: "👤", correctCategory: "Private Info" },
    { id: 2, item: "Home Address", emoji: "🏠", correctCategory: "Private Info" },
    { id: 3, item: "Password", emoji: "🔒", correctCategory: "Private Info" },
    { id: 4, item: "Phone Number", emoji: "📱", correctCategory: "Private Info" },
    { id: 5, item: "School Name", emoji: "🏫", correctCategory: "Private Info" },
    { id: 6, item: "Favorite Color", emoji: "🎨", correctCategory: "Okay to Share" },
    { id: 7, item: "Parent's Credit Card", emoji: "💳", correctCategory: "Private Info" },
    { id: 8, item: "Your Hobby", emoji: "⚽", correctCategory: "Okay to Share" },
    { id: 9, item: "Date of Birth", emoji: "🎂", correctCategory: "Private Info" },
    { id: 10, item: "Favorite Book", emoji: "📚", correctCategory: "Okay to Share" }
  ];

  const categories = ["Private Info", "Okay to Share"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleConfirm = () => {
    if (!selectedCategory) return;

    const item = items[currentMatch];
    const isCorrect = selectedCategory === item.correctCategory;
    
    const newMatches = [...matches, {
      itemId: item.id,
      selected: selectedCategory,
      isCorrect
    }];
    
    setMatches(newMatches);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setSelectedCategory(null);
    
    if (currentMatch < items.length - 1) {
      setTimeout(() => {
        setCurrentMatch(prev => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      const correctCount = newMatches.filter(m => m.isCorrect).length;
      if (correctCount >= 8) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentMatch(0);
    setSelectedCategory(null);
    setMatches([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/game-invite-reflex");
  };

  const correctCount = matches.filter(m => m.isCorrect).length;

  return (
    <GameShell
      title="Personal Info Puzzle"
      score={coins}
      subtitle={`Item ${currentMatch + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 8}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && correctCount >= 8}
      
      gameId="dcos-kids-4"
      gameType="educational"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showResult && correctCount >= 8}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-3 text-center">{items[currentMatch].emoji}</div>
                <p className="text-white text-2xl font-bold text-center">{items[currentMatch].item}</p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Is this private or okay to share?</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      selectedCategory === category
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-white font-bold">{category}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedCategory}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedCategory
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Choice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 8 ? "🎉 Privacy Pro!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {correctCount} out of {items.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Keep your name, address, password, phone, and school PRIVATE online!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 8 ? "You earned 3 Coins! 🪙" : "Get 8 or more correct to earn coins!"}
            </p>
            {correctCount < 8 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PersonalInfoPuzzle;

