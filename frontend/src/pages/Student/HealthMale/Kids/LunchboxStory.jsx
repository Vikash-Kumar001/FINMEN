import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LunchboxStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-15";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your lunchbox has burger and homemade sandwich. Which do you eat?",
      options: [
        {
          id: "b",
          text: "Burger",
          emoji: "🍔",
          description: "Burger has too much fat and processed meat",
          isCorrect: false
        },
        {
          id: "a",
          text: "Homemade sandwich",
          emoji: "🥪",
          description: "Homemade sandwich is fresh and nutritious",
          isCorrect: true
        },
        {
          id: "c",
          text: "Neither",
          emoji: "😕",
          description: "Homemade sandwich is the healthy choice",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "School cafeteria: pizza or vegetable wrap. What do you choose?",
      options: [
        {
          id: "a",
          text: "Vegetable wrap",
          emoji: "🥬",
          description: "Vegetable wrap gives you vitamins and fiber",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pizza",
          emoji: "🍕",
          description: "Pizza has too much cheese and processed dough",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both",
          emoji: "🤝",
          description: "Vegetable wrap is much healthier",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Mom packed fruit salad or cookies. Which one do you pick?",
      options: [
        {
          id: "c",
          text: "Mix both",
          emoji: "🍪",
          description: "Fruit salad is natural and full of nutrients",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cookies",
          emoji: "🍪",
          description: "Cookies have lots of sugar and no nutrition",
          isCorrect: false
        },
        {
          id: "a",
          text: "Fruit salad",
          emoji: "🍓",
          description: "Fruit salad gives you natural vitamins",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Field trip lunch: hot dog or veggie sticks with hummus. What do you eat?",
      options: [
        {
          id: "b",
          text: "Hot dog",
          emoji: "🌭",
          description: "Hot dog is processed meat with lots of salt",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both equally",
          emoji: "🤷",
          description: "Veggie sticks are fresh and healthy",
          isCorrect: false
        },
        {
          id: "a",
          text: "Veggie sticks with hummus",
          emoji: "🥕",
          description: "Vegetables and hummus give protein and vitamins",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Birthday party lunch: cake or yogurt with berries. Which is better?",
      options: [
        {
          id: "b",
          text: "Cake",
          emoji: "🍰",
          description: "Cake has too much sugar and frosting",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yogurt with berries",
          emoji: "🫐",
          description: "Yogurt and berries are nutritious and delicious",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip lunch",
          emoji: "😴",
          description: "Yogurt with berries is the healthy option",
          isCorrect: false
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Lunchbox Story"
      subtitle={`Choice ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Choice {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🍱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Smart Lunch Choices</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className={`bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${choices.some(c => c.question === currentQuestion) ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default LunchboxStory;
