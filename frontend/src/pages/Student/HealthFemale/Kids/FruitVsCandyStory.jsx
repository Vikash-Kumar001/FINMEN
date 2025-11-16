import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FruitVsCandyStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
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
          id: "a",
          text: "Cake",
          emoji: "🎂",
          description: "Cake is okay for special occasions, but it's mostly sugar and doesn't help your body grow.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fruit salad",
          emoji: "🥗",
          description: "Wonderful! Fruit salad gives you lots of vitamins and fiber to keep you healthy.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "After dinner, do you want chocolate or a banana?",
      options: [
        {
          id: "a",
          text: "Chocolate",
          emoji: "🍫",
          description: "Chocolate has lots of sugar that can cause cavities and make you feel tired later.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Banana",
          emoji: "🍌",
          description: "Bananas are perfect! They have potassium for strong muscles and natural sugars for energy.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Fruit vs Candy Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-11"
      gameType="health-female"
      totalLevels={15}
      currentLevel={11}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default FruitVsCandyStory;