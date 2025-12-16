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

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
    if (answered) return;
    
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    const isLastQuestion = currentQuestion === questions.length - 1;
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Fruit vs Candy Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult && getCurrentQuestion() ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default FruitVsCandyStory;
