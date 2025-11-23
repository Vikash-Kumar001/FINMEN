import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionSmartBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins] = useState(0);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: 0, total: 0 });
  const { showAnswerConfetti } = useGameFeedback();

  const foodItems = [
    { id: 1, name: "Apple", emoji: "🍎", isHealthy: true },
    { id: 2, name: "Broccoli", emoji: "🥦", isHealthy: true },
    { id: 3, name: "Chips", emoji: "薯", isHealthy: false },
    { id: 4, name: "Milk", emoji: "🥛", isHealthy: true },
    { id: 5, name: "Candy", emoji: "🍬", isHealthy: false },
    { id: 6, name: "Spinach", emoji: "🍃", isHealthy: true },
    { id: 7, name: "Soda", emoji: "🥤", isHealthy: false },
    { id: 8, name: "Nuts", emoji: "🥜", isHealthy: true },
    { id: 9, name: "Ice Cream", emoji: "🍦", isHealthy: false },
    { id: 10, name: "Carrots", emoji: "🥕", isHealthy: true }
  ];

  // Shuffle and select 10 food items
  const getShuffledFoods = () => {
    const shuffled = [...foodItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  const [shuffledFoods, setShuffledFoods] = useState(getShuffledFoods());

  const handleFoodSelect = (foodId) => {
    // Toggle selection
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter(id => id !== foodId));
    } else {
      // Limit to 5 selections
      if (selectedFoods.length < 5) {
        setSelectedFoods([...selectedFoods, foodId]);
      }
    }
  };

  const handleSubmit = () => {
    const correctChoices = selectedFoods.filter(foodId => {
      const food = shuffledFoods.find(f => f.id === foodId);
      return food.isHealthy;
    }).length;
    
    const totalSelected = selectedFoods.length;
    setFeedback({ correct: correctChoices, total: totalSelected });
    setShowFeedback(true);
    
    // If all 5 selections are correct (healthy foods)
    if (correctChoices === 5) {
      setTimeout(() => {
        setGameFinished(true);
        showAnswerConfetti();
      }, 2000);
    } else {
      // Show feedback for 2 seconds, then allow retry
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const resetGame = () => {
    setSelectedFoods([]);
    setShowFeedback(false);
    setShuffledFoods(getShuffledFoods());
  };



  return (
    <GameShell
      title="Badge: Nutrition Smart Kid"
      subtitle={showFeedback ? "Results" : `Select 5 healthy foods (${selectedFoods.length}/5)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-20"
      gameType="health-female"
      totalLevels={20}
      currentLevel={20}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
      showAnswerConfetti={false}
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Choose 5 healthy foods to earn your Nutrition Smart Kid Badge!
            </h2>
            <p className="text-white/80">
              Select only healthy foods from the options below.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
            {shuffledFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => handleFoodSelect(food.id)}
                disabled={selectedFoods.length >= 5 && !selectedFoods.includes(food.id)}
                className={`aspect-square flex flex-col items-center justify-center text-3xl rounded-2xl transition-all transform ${
                  selectedFoods.includes(food.id)
                    ? food.isHealthy
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg scale-105 ring-2 ring-green-400'
                      : 'bg-gradient-to-br from-red-500 to-orange-600 shadow-lg scale-105 ring-2 ring-red-400'
                    : 'bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 shadow-md hover:shadow-lg hover:scale-105'
                } ${selectedFoods.length >= 5 && !selectedFoods.includes(food.id) ? 'opacity-50' : ''}`}
              >
                <span className="text-3xl mb-1">{food.emoji}</span>
                <span className="text-xs font-medium text-white">{food.name}</span>
              </button>
            ))}
          </div>

          {!showFeedback && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={selectedFoods.length !== 5}
                className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
                  selectedFoods.length === 5
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                Check My Choices
              </button>
            </div>
          )}

          {showFeedback && (
            <div className={`p-6 rounded-2xl text-center mb-6 ${
              feedback.correct === 5
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`text-lg mb-3 ${
                feedback.correct === 5 ? 'text-green-300' : 'text-red-300'
              }`}>
                {feedback.correct === 5
                  ? '🎉 Perfect! You selected all 5 healthy foods!'
                  : `You selected ${feedback.correct} healthy foods out of ${feedback.total}. Try again!`}
              </p>
              
              {feedback.correct === 5 ? (
                <div className="text-yellow-400 font-bold">
                  Congratulations! You've earned your Nutrition Smart Kid Badge!
                </div>
              ) : (
                <button
                  onClick={resetGame}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {gameFinished && (
            <div className="text-center p-6 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-400">
              <div className="text-6xl mb-4">🏅</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">Nutrition Smart Kid</h3>
              <p className="text-white">
                You've mastered healthy food choices! Keep up the great work.
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default NutritionSmartBadge;