import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FruitVsCandyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-11";
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
      text: "You see an apple and candy at snack time. Which do you choose?",
      options: [
        {
          id: "b",
          text: "Candy",
          emoji: "🍬",
          description: "Candy has lots of sugar but no healthy nutrients",
          isCorrect: false
        },
        {
          id: "a",
          text: "Apple",
          emoji: "🍎",
          description: "Apple gives you vitamins and keeps you healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Both equally",
          emoji: "🤷",
          description: "Apple is much healthier than candy",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend offers you chocolate or an orange. What do you pick?",
      options: [
        {
          id: "a",
          text: "Orange",
          emoji: "🍊",
          description: "Orange has vitamin C and natural sweetness",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chocolate",
          emoji: "🍫",
          description: "Chocolate is tasty but has too much sugar",
          isCorrect: false
        },
        {
          id: "c",
          text: "Neither",
          emoji: "❌",
          description: "Orange is the healthy choice here",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "At birthday party, you can have cake or banana. Which one?",
      options: [
        {
          id: "c",
          text: "Skip both",
          emoji: "😴",
          description: "Banana is healthy and gives you energy",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cake",
          emoji: "🍰",
          description: "Cake has too much sugar and fat",
          isCorrect: false
        },
        {
          id: "a",
          text: "Banana",
          emoji: "🍌",
          description: "Banana is naturally sweet and nutritious",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Mom gives you choice: cookies or grapes. What do you choose?",
      options: [
        {
          id: "b",
          text: "Cookies",
          emoji: "🍪",
          description: "Cookies are processed and have lots of sugar",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both",
          emoji: "😊",
          description: "Grapes are much healthier than cookies",
          isCorrect: false
        },
        {
          id: "a",
          text: "Grapes",
          emoji: "🍇",
          description: "Grapes give you antioxidants and natural energy",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "School lunch: chips or apple slices. Which is better?",
      options: [
        {
          id: "b",
          text: "Chips",
          emoji: "🥔",
          description: "Chips are fried and have too much salt",
          isCorrect: false
        },
        {
          id: "a",
          text: "Apple slices",
          emoji: "🍏",
          description: "Apple slices are fresh and full of fiber",
          isCorrect: true
        },
        {
          id: "c",
          text: "Mix them",
          emoji: "🤝",
          description: "Apple slices are the clear healthy choice",
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
      title="Fruit vs Candy Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
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
            <span className="text-white/80">Story {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🍎</div>
            <h3 className="text-2xl font-bold text-white mb-2">Healthy Food Choices</h3>
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
                className={`bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${choices.some(c => c.question === currentQuestion) ? 'opacity-75 cursor-not-allowed' : ''
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

export default FruitVsCandyStory;
