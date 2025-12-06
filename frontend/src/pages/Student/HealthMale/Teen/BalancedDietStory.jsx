import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BalancedDietStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-11";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You're hungry after school. What's the best snack?",
      options: [
        {
          id: "b",
          text: "Bag of chips",
          emoji: "🍟",
          description: "Empty calories won't help you grow.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Apple and nuts",
          emoji: "🍎",
          description: "Fiber and protein for energy!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Candy bar",
          emoji: "🍫",
          description: "Sugar crash coming soon.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friends are eating fast food. What do you do?",
      options: [
        {
          id: "c",
          text: "Eat only fries",
          emoji: "🍟",
          description: "Still not very nutritious.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Order a grilled chicken wrap",
          emoji: "🌯",
          description: "A healthier choice with protein.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Get the biggest burger",
          emoji: "🍔",
          description: "Too much grease and salt.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is protein important for teens?",
      options: [
        {
          id: "b",
          text: "It tastes good",
          emoji: "😋",
          description: "True, but not the main reason.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It makes you sleep",
          emoji: "😴",
          description: "Carbs might, but not protein.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Builds muscles and height",
          emoji: "💪",
          description: "Essential for your growth spurt.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You're thirsty. What should you drink?",
      options: [
        {
          id: "c",
          text: "Energy drink",
          emoji: "⚡",
          description: "Too much caffeine and sugar.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Water",
          emoji: "💧",
          description: "The best hydration for your body.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Soda",
          emoji: "🥤",
          description: "Just liquid sugar.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should be on half your plate?",
      options: [
        {
          id: "b",
          text: "Rice",
          emoji: "🍚",
          description: "Rice is good, but veggies are key.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Meat",
          emoji: "🥩",
          description: "Protein is important, but not half the plate.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Fruits and Vegetables",
          emoji: "🥦",
          description: "Vitamins and minerals galore!",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/quiz-nutrition-teen");
  };

  return (
    <GameShell
      title="Balanced Diet Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default BalancedDietStory;
