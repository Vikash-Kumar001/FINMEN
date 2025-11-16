import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyVsHarmfulPuzzle = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      item: "Apple",
      emoji: "🍎",
      description: "Is this healthy or harmful for your body?",
      categories: [
        { id: "healthy", text: "Healthy", emoji: "💚", isCorrect: true },
        { id: "harmful", text: "Harmful", emoji: "☠️", isCorrect: false }
      ]
    },
    {
      id: 2,
      item: "Tobacco",
      emoji: "🚬",
      description: "Is this healthy or harmful for your body?",
      categories: [
        { id: "healthy2", text: "Healthy", emoji: "💚", isCorrect: false },
        { id: "harmful2", text: "Harmful", emoji: "☠️", isCorrect: true }
      ]
    },
    {
      id: 3,
      item: "Water",
      emoji: "💧",
      description: "Is this healthy or harmful for your body?",
      categories: [
        { id: "healthy3", text: "Healthy", emoji: "💚", isCorrect: true },
        { id: "harmful3", text: "Harmful", emoji: "☠️", isCorrect: false }
      ]
    },
    {
      id: 4,
      item: "Alcohol",
      emoji: "🍺",
      description: "Is this healthy or harmful for your body?",
      categories: [
        { id: "healthy4", text: "Healthy", emoji: "💚", isCorrect: false },
        { id: "harmful4", text: "Harmful", emoji: "☠️", isCorrect: true }
      ]
    },
    {
      id: 5,
      item: "Exercise",
      emoji: "🏃",
      description: "Is this healthy or harmful for your body?",
      categories: [
        { id: "healthy5", text: "Healthy", emoji: "💚", isCorrect: true },
        { id: "harmful5", text: "Harmful", emoji: "☠️", isCorrect: false }
      ]
    }
  ];

  const handleCategorySelect = (categoryId) => {
    const currentP = puzzles[currentPuzzle];
    const selectedCat = currentP.categories.find(c => c.id === categoryId);
    const isCorrect = selectedCat.isCorrect;

    if (isCorrect && !matchedPairs.includes(currentPuzzle)) {
      setCoins(prev => prev + 1);
      setMatchedPairs(prev => [...prev, currentPuzzle]);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedCategory(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/alcohol-story");
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];

  return (
    <GameShell
      title="Healthy vs Harmful Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-84"
      gameType="health-male"
      totalLevels={90}
      currentLevel={84}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getCurrentPuzzle().emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{getCurrentPuzzle().item}</h3>
            <p className="text-white/90 mb-6">{getCurrentPuzzle().description}</p>
            <p className="text-white text-lg">Choose the correct category!</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentPuzzle().categories.map(category => {
              const isCorrect = category.isCorrect;
              const isMatched = matchedPairs.includes(currentPuzzle);

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={isMatched}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isMatched
                      ? isCorrect
                        ? 'bg-green-100/20 border-green-500 text-white'
                        : 'bg-red-100/20 border-red-500 text-white'
                      : 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`text-3xl mr-4 ${isMatched && isCorrect ? 'opacity-100' : 'opacity-60'}`}>
                        {category.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${isMatched && isCorrect ? 'text-green-300' : 'text-white'}`}>
                          {isMatched && isCorrect ? '✅ ' : isMatched && !isCorrect ? '❌ ' : '☐ '}{category.text}
                        </h3>
                      </div>
                    </div>
                    {isMatched && isCorrect && (
                      <div className="text-2xl">🎉</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🧩</div>
                <h3 className="text-3xl font-bold text-white mb-2">Puzzle Master!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  You identified all healthy vs harmful items perfectly! You know what helps and hurts your body!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">HEALTH PUZZLER</div>
                </div>
                <p className="text-white/80">
                  Great job distinguishing between healthy and harmful choices! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HealthyVsHarmfulPuzzle;
