import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HealthyVsHarmfulPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-84";
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
      category: "Healthy",
      question: "Which one is HEALTHY for your body?",
      options: [
        { id: "a", text: "Fresh Water", emoji: "💧", isCorrect: true, explanation: "Water keeps you hydrated and healthy!" },
        { id: "b", text: "Cigarettes", emoji: "🚬", isCorrect: false, explanation: "Cigarettes hurt your lungs." },
        { id: "c", text: "Beer", emoji: "🍺", isCorrect: false, explanation: "Alcohol is bad for growing kids." }
      ]
    },
    {
      id: 2,
      category: "Harmful",
      question: "Which one is HARMFUL (bad) for you?",
      options: [
        { id: "b", text: "Apples", emoji: "🍎", isCorrect: false, explanation: "Apples are good for you!" },
        { id: "a", text: "Smoking", emoji: "😤", isCorrect: true, explanation: "Smoking damages your body." },
        { id: "c", text: "Running", emoji: "🏃", isCorrect: false, explanation: "Running makes you strong." }
      ]
    },
    {
      id: 3,
      category: "Healthy",
      question: "Which activity makes you STRONG?",
      options: [
        { id: "c", text: "Drinking Alcohol", emoji: "🍷", isCorrect: false, explanation: "Alcohol makes you weak." },
        { id: "b", text: "Taking Drugs", emoji: "💊", isCorrect: false, explanation: "Drugs are dangerous." },
        { id: "a", text: "Playing Soccer", emoji: "⚽", isCorrect: true, explanation: "Sports build strong muscles!" }
      ]
    },
    {
      id: 4,
      category: "Harmful",
      question: "What should you AVOID?",
      options: [
        { id: "b", text: "Vegetables", emoji: "🥦", isCorrect: false, explanation: "Veggies are super healthy!" },
        { id: "a", text: "Unknown Pills", emoji: "💊", isCorrect: true, explanation: "Never take pills not given by parents/doctors." },
        { id: "c", text: "Sleep", emoji: "😴", isCorrect: false, explanation: "Sleep helps you grow." }
      ]
    },
    {
      id: 5,
      category: "Healthy",
      question: "What helps your brain GROW?",
      options: [
        { id: "c", text: "Wine", emoji: "🥂", isCorrect: false, explanation: "Alcohol hurts the brain." },
        { id: "b", text: "Smoke", emoji: "🌫️", isCorrect: false, explanation: "Smoke is bad for your brain." },
        { id: "a", text: "Reading Books", emoji: "📚", isCorrect: true, explanation: "Reading makes you smarter!" }
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
    navigate("/student/health-male/kids/alcohol-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Healthy vs Harmful"
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
            <p className="text-white/80">Find the right choice!</p>
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

export default HealthyVsHarmfulPuzzle;
