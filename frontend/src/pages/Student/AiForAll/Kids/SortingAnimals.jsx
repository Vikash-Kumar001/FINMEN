import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SortingAnimals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [sortedItems, setSortedItems] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const animals = [
    { id: 1, name: "Cow", emoji: "🐄", category: "Farm" },
    { id: 2, name: "Dog", emoji: "🐕", category: "Pet" },
    { id: 3, name: "Cat", emoji: "🐈", category: "Pet" },
    { id: 4, name: "Chicken", emoji: "🐓", category: "Farm" },
    { id: 5, name: "Rabbit", emoji: "🐇", category: "Pet" }
  ];

  const categories = [
    { name: "Farm", emoji: "🌾" },
    { name: "Pet", emoji: "🏠" }
  ];

  const handleDrop = (animal, category) => {
    const isCorrect = animal.category === category.name;
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setSortedItems(prev => [...prev, { ...animal, selected: category.name }]);

    if (sortedItems.length + 1 === animals.length) {
      setTimeout(() => setShowResult(true), 500);
    }
  };

  const handleTryAgain = () => {
    setSortedItems([]);
    setScore(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-basics-badge"); // Update next game path
  };

  const accuracy = Math.round((score / animals.length) * 100);

  return (
    <GameShell
      title="Sorting Animals"
      score={score}
      subtitle={`Sort ${sortedItems.length} of ${animals.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-24"
      gameType="ai"
      totalLevels={20}
      currentLevel={24}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Drag the animal to the correct category!
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-4">Animals</h4>
                <div className="space-y-4">
                  {animals.map(animal => !sortedItems.find(s => s.id === animal.id) && (
                    <div
                      key={animal.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", animal.id)}
                      className="bg-green-500/30 hover:bg-green-500/50 p-4 rounded-xl text-white font-bold cursor-move select-none flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                    >
                      <span className="text-2xl">{animal.emoji}</span>
                      <span>{animal.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Categories</h4>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div
                      key={category.name}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const id = parseInt(e.dataTransfer.getData("text/plain"));
                        const animal = animals.find(a => a.id === id);
                        handleDrop(animal, category);
                      }}
                      className="bg-blue-500/30 hover:bg-blue-500/50 p-4 rounded-xl text-white font-bold min-h-[50px] flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                    >
                      <span className="text-2xl">{category.emoji}</span>
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Data Sorting Pro!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You sorted {score} out of {animals.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Sorting data correctly is how AI "learns." You helped the robot learn!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {score} Points! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default SortingAnimals;