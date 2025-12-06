import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FruitVsCandyStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-11";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You're hungry after school. Do you eat grapes or candy?",
      options: [
        {
          id: "a",
          text: "Grapes",
          emoji: "🍇",
          description: "Great choice! Grapes are full of vitamins and natural sugars that give you energy without making you sick.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Candy",
          emoji: "🍬",
          description: "Candy has lots of sugar that can hurt your teeth and make you feel sick later.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend offers you chips or an apple. Which do you choose?",
      options: [
        {
          id: "a",
          text: "Chips",
          emoji: "🥔",
          description: "Chips are tasty but don't give your body the nutrients it needs to grow strong.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Apple",
          emoji: "🍎",
          description: "Perfect! Apples have fiber and vitamins that help your body stay healthy and strong.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "For a snack, do you want ice cream or yogurt with berries?",
      options: [
        {
          id: "a",
          text: "Ice cream",
          emoji: "🍦",
          description: "Ice cream is sweet but has lots of sugar that isn't good for your body.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yogurt with berries",
          emoji: "🍓",
          description: "Excellent choice! Yogurt has protein for strong muscles and berries have vitamins.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You're at a party. Do you eat cake or fruit salad?",
      options: [
        {
          id: "b",
          text: "Fruit salad",
          emoji: "🥗",
          description: "Wonderful! Fruit salad gives you lots of vitamins and fiber to keep you healthy.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Cake",
          emoji: "🎂",
          description: "Cake is okay for special occasions, but it's mostly sugar and doesn't help your body grow.",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 5,
      text: "After dinner, do you want chocolate or a banana?",
      options: [
        {
          id: "a",
          text: "Banana",
          emoji: "🍌",
          description: "Bananas are perfect! They have potassium for strong muscles and natural sugars for energy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chocolate",
          emoji: "🍫",
          description: "Chocolate has lots of sugar that can cause cavities and make you feel tired later.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (selectedOptionId) return; // Prevent double clicking

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
    }, 2000); // 2 second delay to read feedback
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Fruit vs Candy Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={11}
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

export default FruitVsCandyStory;