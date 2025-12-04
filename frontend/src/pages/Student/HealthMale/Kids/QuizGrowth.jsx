import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizGrowth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-22";
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
      text: "What helps boys grow stronger?",
      options: [
        {
          id: "b",
          text: "Only junk food",
          emoji: "🍟",
          description: "Junk food doesn't help you grow strong",
          isCorrect: false
        },
        {
          id: "a",
          text: "Exercise + nutrition",
          emoji: "💪",
          description: "Exercise and healthy food help build strong bodies",
          isCorrect: true
        },
        {
          id: "c",
          text: "Watching TV",
          emoji: "📺",
          description: "Exercise and nutrition are key for growth",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How many hours of sleep do growing kids need?",
      options: [
        {
          id: "c",
          text: "4 hours",
          emoji: "😴",
          description: "Growing kids need more sleep for development",
          isCorrect: false
        },
        {
          id: "a",
          text: "8-10 hours",
          emoji: "🛌",
          description: "8-10 hours of sleep helps growth and energy",
          isCorrect: true
        },
        {
          id: "b",
          text: "12 hours",
          emoji: "😪",
          description: "8-10 hours is the right amount for kids",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What food helps build strong bones?",
      options: [
        {
          id: "a",
          text: "Milk and dairy",
          emoji: "🥛",
          description: "Calcium in milk helps build strong bones",
          isCorrect: true
        },
        {
          id: "b",
          text: "Candy",
          emoji: "🍬",
          description: "Candy has sugar but no bone-building nutrients",
          isCorrect: false
        },
        {
          id: "c",
          text: "Chips",
          emoji: "🥔",
          description: "Chips don't help build strong bones",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What activity helps you grow taller?",
      options: [
        {
          id: "b",
          text: "Playing video games",
          emoji: "🎮",
          description: "Physical activity helps with growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Reading books",
          emoji: "📚",
          description: "While reading is good, exercise is better for growth",
          isCorrect: false
        },
        {
          id: "a",
          text: "Running and jumping",
          emoji: "🏃",
          description: "Physical activities help strengthen bones and muscles",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is drinking water important for growth?",
      options: [
        {
          id: "c",
          text: "It makes you taller instantly",
          emoji: "📏",
          description: "Water doesn't make you taller instantly",
          isCorrect: false
        },
        {
          id: "b",
          text: "It's not important",
          emoji: "🤷",
          description: "Water is essential for all body functions",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keeps body working properly",
          emoji: "💧",
          description: "Water helps all body processes including growth",
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Quiz on Growth"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
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
      currentLevel={22}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Growth Quiz</h3>
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
                className={`bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${choices.some(c => c.question === currentQuestion) ? 'opacity-75 cursor-not-allowed' : ''
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

export default QuizGrowth;
