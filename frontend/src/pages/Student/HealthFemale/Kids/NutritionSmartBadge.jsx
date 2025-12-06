import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionSmartBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-20";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which food group is best for growing taller?",
      options: [
        {
          id: "a",
          text: "Candy",
          emoji: "🍬",
          description: "Candy doesn't help you grow.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Protein (Milk, Eggs)",
          emoji: "🥛",
          description: "Correct! Protein builds your body.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What nutrient helps you have strong teeth?",
      options: [
        {
          id: "a",
          text: "Calcium",
          emoji: "🦷",
          description: "Yes! Calcium makes teeth strong.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sugar",
          emoji: "🍭",
          description: "Sugar can cause cavities.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which of these is a 'smart' snack for your brain?",
      options: [
        {
          id: "a",
          text: "Walnuts",
          emoji: "🧠",
          description: "Great! Nuts are brain food.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chips",
          emoji: "🍟",
          description: "Chips can make you feel sluggish.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is water better than soda?",
      options: [
        {
          id: "a",
          text: "Soda is too bubbly",
          emoji: "🥤",
          description: "Bubbles aren't the main problem, sugar is.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No added sugar",
          emoji: "💧",
          description: "Exactly! Water hydrates without the sugar crash.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What makes your plate a 'Nutrition Smart' plate?",
      options: [
        {
          id: "a",
          text: "Lots of Colors",
          emoji: "🌈",
          description: "Yes! A rainbow of food means many nutrients.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only Brown Food",
          emoji: "🥔",
          description: "We need more variety than just one color.",
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
      title="Nutrition Smart Badge"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={20}
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

export default NutritionSmartBadge;