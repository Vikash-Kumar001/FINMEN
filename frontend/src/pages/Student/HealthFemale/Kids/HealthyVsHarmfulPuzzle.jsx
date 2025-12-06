import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyVsHarmfulPuzzle = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-84";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is HEALTHY?",
      options: [
        {
          id: "a",
          text: "Cigarettes",
          emoji: "🚬",
          description: "Smoking is harmful.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Bleach",
          emoji: "🧴",
          description: "Bleach is poison.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fresh fruit",
          emoji: "🍎",
          description: "Correct! Fruit is great for you.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Which is HARMFUL?",
      options: [
        {
          id: "a",
          text: "Water",
          emoji: "💧",
          description: "Water is healthy.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Alcohol",
          emoji: "🍺",
          description: "Yes, alcohol hurts kids.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Exercise",
          emoji: "🏃",
          description: "Exercise makes you strong.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps you grow?",
      options: [
        {
          id: "b",
          text: "Vegetables",
          emoji: "🥬",
          description: "Correct! Veggies have vitamins.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Candy only",
          emoji: "🍭",
          description: "Too much sugar is bad.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Smoke",
          emoji: "🌫️",
          description: "Smoke stops growth.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What makes you sick?",
      options: [
        {
          id: "a",
          text: "Washing hands",
          emoji: "🧼",
          description: "That keeps germs away.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Sleeping",
          emoji: "😴",
          description: "Sleep is good for you.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eating rotten food",
          emoji: "🤢",
          description: "Yes! Rotten food has germs.",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What is safe to drink?",
      options: [
        {
          id: "a",
          text: "Cleaning spray",
          emoji: "🚧",
          description: "Never drink cleaners.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Water or milk",
          emoji: "🥛",
          description: "Correct! Those are safe.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Paint",
          emoji: "🎨",
          description: "Paint is not a drink.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (selectedOptionId) return;

    setSelectedOptionId(optionId);
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setSelectedOptionId(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Healthy vs Harmful Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={74}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {questions[currentQuestion].text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => {
              const isSelected = selectedOptionId === option.id;
              const showFeedback = selectedOptionId !== null;

              let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";

              if (showFeedback && isSelected) {
                buttonClass = option.isCorrect
                  ? "bg-green-500 ring-4 ring-green-300"
                  : "bg-red-500 ring-4 ring-red-300";
              } else if (showFeedback && !isSelected) {
                buttonClass = "bg-white/10 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${buttonClass}`}
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-6">{option.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 text-white">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white font-medium mt-2 animate-fadeIn">{option.description}</p>
                      )}
                    </div>
                    {showFeedback && isSelected && (
                      <div className="text-3xl ml-4">
                        {option.isCorrect ? "✅" : "❌"}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default HealthyVsHarmfulPuzzle;