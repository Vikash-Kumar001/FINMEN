import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizDailyHabits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is a good daily habit?",
      options: [
        {
          id: "a",
          text: "Sleeping on time",
          emoji: "😴",
          description: "Good sleep helps your body and brain grow strong",
          isCorrect: true
        },
        {
          id: "b",
          text: "Playing all night",
          emoji: "🎮",
          description: "Playing all night makes you tired and grumpy",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skipping breakfast",
          emoji: "🍽️",
          description: "Breakfast gives you energy for the day",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is eating breakfast important?",
      options: [
        {
          id: "c",
          text: "It makes you gain weight",
          emoji: "⚖️",
          description: "Breakfast gives you energy and helps you focus",
          isCorrect: false
        },
        {
          id: "a",
          text: "It gives you energy for the morning",
          emoji: "⚡",
          description: "Breakfast helps you think clearly and stay focused",
          isCorrect: true
        },
        {
          id: "b",
          text: "It doesn't matter if you skip it",
          emoji: "🤷",
          description: "Breakfast is the most important meal of the day",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What happens when you exercise daily?",
      options: [
        {
          id: "b",
          text: "You get more tired",
          emoji: "😴",
          description: "Exercise actually gives you more energy",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your body gets stronger",
          emoji: "💪",
          description: "Daily exercise builds muscles and keeps you healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing changes",
          emoji: "😑",
          description: "Exercise improves your health in many ways",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why should you read books regularly?",
      options: [
        {
          id: "c",
          text: "It makes you sleepy",
          emoji: "😴",
          description: "Reading improves your knowledge and imagination",
          isCorrect: false
        },
        {
          id: "a",
          text: "It improves your knowledge and brain",
          emoji: "🧠",
          description: "Reading helps you learn new things and think better",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's just something to do",
          emoji: "📖",
          description: "Reading builds vocabulary and understanding",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to end your day?",
      options: [
        {
          id: "b",
          text: "Stay up late watching TV",
          emoji: "📺",
          description: "Going to bed on time helps you wake up refreshed",
          isCorrect: false
        },
        {
          id: "a",
          text: "Go to bed at a regular time",
          emoji: "🌙",
          description: "Regular bedtime helps your body rest and grow",
          isCorrect: true
        },
        {
          id: "c",
          text: "Play games until you fall asleep",
          emoji: "🎮",
          description: "Consistent bedtime creates healthy sleep habits",
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

  const handleNext = () => {
    navigate("/student/health-male/kids/reflex-habit-check");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Daily Habits"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-92"
      gameType="health-male"
      totalLevels={100}
      currentLevel={92}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizDailyHabits;
