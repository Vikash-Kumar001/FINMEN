import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionMatchPuzzle = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-14";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which nutrient makes your bones and teeth strong?",
      options: [
        {
          id: "a",
          text: "Sugar",
          emoji: "🍭",
          description: "Sugar gives quick energy but can hurt your teeth!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Calcium",
          emoji: "🦴",
          description: "Correct! Calcium (found in milk) is building block for bones.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What gives your body energy to run and play?",
      options: [
        {
          id: "a",
          text: "Carbohydrates",
          emoji: "⚡",
          description: "Yes! Foods like rice and bread give you energy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Salt",
          emoji: "🧂",
          description: "Salt is needed in small amounts but doesn't give energy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which nutrient helps your body fight sickness?",
      options: [
        {
          id: "a",
          text: "Fat",
          emoji: "🧀",
          description: "Fat gives energy and warmth but isn't the main disease fighter.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Vitamins",
          emoji: "🛡️",
          description: "Right! Vitamins (in fruits & veggies) are your body's shield.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What helps your muscles grow big and strong?",
      options: [
        {
          id: "a",
          text: "Protein",
          emoji: "💪",
          description: "Bingo! Protein (in dal, eggs, paneer) builds muscles.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Water",
          emoji: "💧",
          description: "Water hydrates you but doesn't build muscles directly.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which nutrient is good for your eyes?",
      options: [
        {
          id: "a",
          text: "Vitamin A",
          emoji: "🥕",
          description: "Correct! Carrots have Vitamin A which is great for sight.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Iron",
          emoji: "🧲",
          description: "Iron is good for blood, but Vitamin A is for eyes.",
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
      title="Nutrition Match Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={14}
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

export default NutritionMatchPuzzle;