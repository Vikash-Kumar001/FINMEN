import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NutrientMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-14";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      category: "Protein",
      question: "Which food is rich in PROTEIN?",
      options: [
        { id: "a", text: "Eggs", emoji: "🥚", isCorrect: true, explanation: "Eggs are a great protein source." },
        { id: "b", text: "Candy", emoji: "🍬", isCorrect: false, explanation: "Candy is just sugar." },
        { id: "c", text: "Butter", emoji: "🧈", isCorrect: false, explanation: "Butter is fat." }
      ]
    },
    {
      id: 2,
      category: "Vitamin C",
      question: "Which food has lots of VITAMIN C?",
      options: [
        { id: "b", text: "Bread", emoji: "🍞", isCorrect: false, explanation: "Bread is carbs." },
        { id: "a", text: "Orange", emoji: "🍊", isCorrect: true, explanation: "Citrus fruits are full of Vitamin C." },
        { id: "c", text: "Cheese", emoji: "🧀", isCorrect: false, explanation: "Cheese is calcium and fat." }
      ]
    },
    {
      id: 3,
      category: "Iron",
      question: "Which food gives you IRON?",
      options: [
        { id: "c", text: "Ice Cream", emoji: "🍦", isCorrect: false, explanation: "Not a source of iron." },
        { id: "b", text: "Soda", emoji: "🥤", isCorrect: false, explanation: "No nutrients here." },
        { id: "a", text: "Spinach", emoji: "🍃", isCorrect: true, explanation: "Leafy greens are iron-rich." }
      ]
    },
    {
      id: 4,
      category: "Calcium",
      question: "Which food builds strong BONES?",
      options: [
        { id: "b", text: "Chips", emoji: "🍟", isCorrect: false, explanation: "Chips are unhealthy." },
        { id: "a", text: "Milk", emoji: "🥛", isCorrect: true, explanation: "Milk is famous for calcium." },
        { id: "c", text: "Chicken", emoji: "🍗", isCorrect: false, explanation: "Chicken is protein." }
      ]
    },
    {
      id: 5,
      category: "Carbohydrates",
      question: "Which food gives ENERGY?",
      options: [
        { id: "c", text: "Water", emoji: "💧", isCorrect: false, explanation: "Water hydrates, doesn't give calories." },
        { id: "b", text: "Oil", emoji: "🛢️", isCorrect: false, explanation: "Oil is fat." },
        { id: "a", text: "Rice", emoji: "🍚", isCorrect: true, explanation: "Rice is a staple carb for energy." }
      ]
    }
  ];

  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/sports-nutrition-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Nutrient Match Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={puzzles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">{currentP.question}</h3>
            <p className="text-white/80">Match the nutrient!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentP.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/20 transition-all transform hover:scale-105 flex flex-col items-center gap-4 group"
              >
                <div className="text-6xl group-hover:scale-110 transition-transform">
                  {option.emoji}
                </div>
                <div className="text-white font-bold text-xl text-center">
                  {option.text}
                </div>
                <p className="text-white/70 text-sm text-center">{option.explanation}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default NutrientMatchPuzzle;
