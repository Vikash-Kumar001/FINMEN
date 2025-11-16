import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutrientMatchPuzzle = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      nutrient: "Iron",
      correctFood: "Spinach",
      options: ["Spinach", "Bread", "Milk"],
      description: "Iron helps carry oxygen in your blood"
    },
    {
      id: 2,
      nutrient: "Protein",
      correctFood: "Eggs",
      options: ["Eggs", "Sugar", "Water"],
      description: "Protein builds and repairs muscles"
    },
    {
      id: 3,
      nutrient: "Vitamin C",
      correctFood: "Orange",
      options: ["Orange", "Rice", "Salt"],
      description: "Vitamin C boosts your immune system"
    },
    {
      id: 4,
      nutrient: "Calcium",
      correctFood: "Milk",
      options: ["Milk", "Oil", "Soda"],
      description: "Calcium makes bones and teeth strong"
    },
    {
      id: 5,
      nutrient: "Fiber",
      correctFood: "Apples",
      options: ["Apples", "Candy", "Chips"],
      description: "Fiber helps digestion and keeps you full"
    }
  ];

  const handleNutrientClick = (nutrient) => {
    if (selectedNutrient === nutrient) {
      setSelectedNutrient(null);
    } else {
      setSelectedNutrient(nutrient);
    }
  };

  const handleFoodClick = (food) => {
    if (!selectedNutrient) return;

    const currentPuzzleData = puzzles[currentPuzzle];
    const isCorrect = currentPuzzleData.correctFood === food;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setMatchedPairs([...matchedPairs, { puzzle: currentPuzzle, nutrient: selectedNutrient, food }]);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setChoices([...choices, { puzzle: currentPuzzle, food, isCorrect: true }]);

        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedNutrient(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      setChoices([...choices, { puzzle: currentPuzzle, food, isCorrect: false }]);
      setSelectedNutrient(null);
    }
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];
  const correctMatches = choices.filter(c => c.isCorrect).length;

  const handleNext = () => {
    navigate("/student/health-male/teens/sports-nutrition-story");
  };

  return (
    <GameShell
      title="Puzzle: Nutrient Match"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctMatches * 5}
      gameId="health-male-teen-14"
      gameType="health-male"
      totalLevels={100}
      currentLevel={14}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 14/100</span>
            <span className="text-yellow-400 font-bold">Coins: {correctMatches * 5}</span>
          </div>

          {showSuccess && (
            <div className="text-center mb-4 p-4 bg-green-500/20 rounded-lg">
              <p className="text-green-400 font-bold">Perfect Match! 🎉</p>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-white text-xl font-bold mb-2">
              Match: {getCurrentPuzzle().nutrient}
            </h3>
            <p className="text-white/80">{getCurrentPuzzle().description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nutrients Column */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-center">Nutrients</h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleNutrientClick(getCurrentPuzzle().nutrient)}
                  className={`w-full p-4 rounded-xl text-center transition-all ${
                    selectedNutrient === getCurrentPuzzle().nutrient
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">🔬</div>
                  <div className="font-bold">{getCurrentPuzzle().nutrient}</div>
                </button>
              </div>
            </div>

            {/* Foods Column */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-center">Foods</h4>
              <div className="space-y-3">
                {getCurrentPuzzle().options.map(food => (
                  <button
                    key={food}
                    onClick={() => handleFoodClick(food)}
                    className="w-full p-4 rounded-xl text-center transition-all bg-gray-600 text-white hover:bg-gray-500"
                  >
                    <div className="text-2xl mb-1">
                      {food === "Spinach" ? "🥬" :
                       food === "Eggs" ? "🥚" :
                       food === "Orange" ? "🍊" :
                       food === "Milk" ? "🥛" :
                       food === "Apples" ? "🍎" :
                       food === "Bread" ? "🍞" :
                       food === "Sugar" ? "🍬" :
                       food === "Water" ? "💧" :
                       food === "Rice" ? "🍚" :
                       food === "Salt" ? "🧂" :
                       food === "Oil" ? "🫒" :
                       food === "Soda" ? "🥤" :
                       food === "Candy" ? "🍬" :
                       food === "Chips" ? "🥔" : "🍎"}
                    </div>
                    <div className="font-bold">{food}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Click a nutrient, then click the matching food!
            </p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default NutrientMatchPuzzle;
