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

  const [score, setScore] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
    setSelectedOption(option.id);
    resetFeedback();

    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/alcohol-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Healthy vs Harmful"
      subtitle={showResult ? "Puzzle Complete!" : `Match healthy and harmful choices (${currentPuzzle + 1}/${puzzles.length} completed)`}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="health-male"
      totalLevels={puzzles.length}
      currentLevel={currentPuzzle + 1}
      maxScore={puzzles.length}
      showConfetti={showResult && score === puzzles.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Puzzles: {currentPuzzle + 1}/{puzzles.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{puzzles.length}</span>
              </div>
              
              <p className="text-white/90 text-center mb-6">
                {currentP.question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentP.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrect = isSelected && option.isCorrect;
                  const isWrong = isSelected && !option.isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-xl transition-all border-2 ${
                        !selectedOption
                          ? 'bg-white/10 hover:bg-white/20 border-white/30 cursor-pointer'
                          : isCorrect
                            ? 'bg-green-500/20 border-green-400 opacity-70 cursor-not-allowed'
                            : isWrong
                              ? 'bg-red-500/20 border-red-400 opacity-70 cursor-not-allowed'
                              : 'bg-white/10 border-white/30 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{option.emoji}</span>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-white">{option.text}</div>
                          <div className="text-sm text-white/70">{option.explanation}</div>
                        </div>
                        {isSelected && (
                          <span className={`text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default HealthyVsHarmfulPuzzle;
