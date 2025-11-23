import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GoodHabitsPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedElements, setSelectedElements] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const posterElements = [
    { id: "title", text: "GOOD HABITS BUILD GREAT KIDS", emoji: "🌟", category: "title" },
    { id: "good", text: "Good", emoji: "✅", category: "word" },
    { id: "habits", text: "Habits", emoji: "🔄", category: "word" },
    { id: "great", text: "Great", emoji: "🏆", category: "word" },
    { id: "kids", text: "Kids", emoji: "👦", category: "word" },
    { id: "message", text: "Daily habits shape your future", emoji: "📈", category: "message" },
    { id: "brush", text: "Brush Daily", emoji: "🪥", category: "habit" },
    { id: "read", text: "Read Books", emoji: "📚", category: "habit" },
    { id: "sleep", text: "Sleep Well", emoji: "😴", category: "habit" },
    { id: "rainbow", text: "🌈", emoji: "🌈", category: "decoration" }
  ];

  const handleElementToggle = (elementId) => {
    if (selectedElements.includes(elementId)) {
      setSelectedElements(prev => prev.filter(id => id !== elementId));
    } else {
      setSelectedElements(prev => [...prev, elementId]);
    }
  };

  React.useEffect(() => {
    // Check if user has selected enough elements to complete the poster
    const requiredElements = ["title", "message"];
    const hasRequired = requiredElements.every(req => selectedElements.includes(req));
    const hasHabits = posterElements.filter(el => el.category === "habit").some(el => selectedElements.includes(el.id));

    if (hasRequired && hasHabits && selectedElements.length >= 5 && !gameFinished) {
      setGameFinished(true);
      showCorrectAnswerFeedback(0, true); // Badge reward
    }
  }, [selectedElements, gameFinished]);

  const handleNext = () => {
    navigate("/student/health-male/kids/habits-journal");
  };

  const selectedCount = selectedElements.length;
  const isComplete = gameFinished;

  return (
    <GameShell
      title="Good Habits Win Poster"
      subtitle={`Design your poster - ${selectedCount} elements chosen`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={0}
      gameId="health-male-kids-96"
      gameType="health-male"
      totalLevels={100}
      currentLevel={96}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">Create Your Good Habits Win Poster</h3>
            <p className="text-white/90 mb-4">
              Design a poster that shows "Good Habits Build Great Kids"
            </p>
            <div className="bg-white/20 rounded-full p-3 inline-block mb-4">
              <span className="text-white font-bold">Choose at least 5 elements including title and daily habits!</span>
            </div>
          </div>

          {/* Poster Preview */}
          <div className="bg-gradient-to-br from-green-100/20 to-yellow-100/20 rounded-2xl p-8 mb-6 min-h-[300px] border-2 border-white/30">
            <div className="text-center space-y-4">
              {selectedElements.length === 0 ? (
                <div className="text-white/60">
                  <div className="text-6xl mb-4">📄</div>
                  <p>Your poster will appear here as you add elements!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                  {selectedElements.map(elementId => {
                    const element = posterElements.find(el => el.id === elementId);
                    return (
                      <div
                        key={elementId}
                        className="bg-white/20 rounded-xl p-3 text-center transform hover:scale-105 transition-all"
                      >
                        <div className="text-3xl mb-1">{element.emoji}</div>
                        <div className="text-white font-medium text-sm">{element.text}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Element Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posterElements.map(element => {
              const isSelected = selectedElements.includes(element.id);

              return (
                <button
                  key={element.id}
                  onClick={() => handleElementToggle(element.id)}
                  className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 text-white hover:from-blue-600 hover:to-indigo-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{element.emoji}</div>
                    <div className="font-bold text-sm mb-1">{element.text}</div>
                    <div className="text-xs opacity-80 capitalize">{element.category}</div>
                    {isSelected && <div className="text-lg mt-1">✅</div>}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🎨</div>
                <h3 className="text-3xl font-bold text-white mb-2">Poster Complete!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  Your "Good Habits Build Great Kids" poster is inspiring! You created a powerful message about the importance of daily habits!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">HABIT ARTIST</div>
                </div>
                <p className="text-white/80">
                  Excellent work showing how good habits create great kids! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default GoodHabitsPoster;
