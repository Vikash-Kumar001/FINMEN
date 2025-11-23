import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizHygieneAdvanced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which prevents body odor?",
      options: [
        {
          id: "b",
          text: "Wearing same shirt",
          emoji: "👕",
          description: "Wearing clean clothes prevents body odor",
          isCorrect: false
        },
        {
          id: "a",
          text: "Bathing daily",
          emoji: "🧼",
          description: "Regular bathing removes sweat and bacteria",
          isCorrect: true
        },
        {
          id: "c",
          text: "Using lots of perfume",
          emoji: "🌸",
          description: "Clean body prevents odor better than perfume",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should you change your clothes?",
      options: [
        {
          id: "c",
          text: "Once a week",
          emoji: "📅",
          description: "Change clothes when they're dirty or sweaty",
          isCorrect: false
        },
        {
          id: "a",
          text: "When they're dirty",
          emoji: "🧺",
          description: "Clean clothes keep you fresh and healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only on special days",
          emoji: "🎉",
          description: "Daily hygiene includes clean clothes",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best way to handle sweaty clothes?",
      options: [
        {
          id: "a",
          text: "Wash them regularly",
          emoji: "🧽",
          description: "Clean clothes prevent bacteria and odor",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep wearing them",
          emoji: "♻️",
          description: "Fresh clothes help you feel confident",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spray with air freshener",
          emoji: "🌬️",
          description: "Proper washing is best for hygiene",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "When should you wash your face?",
      options: [
        {
          id: "b",
          text: "Only when it looks dirty",
          emoji: "👀",
          description: "Wash face twice daily for healthy skin",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never, it cleans itself",
          emoji: "🤷",
          description: "Regular face washing prevents acne",
          isCorrect: false
        },
        {
          id: "a",
          text: "Morning and night",
          emoji: "🌅",
          description: "Daily face washing keeps skin healthy",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is deodorant important for growing kids?",
      options: [
        {
          id: "b",
          text: "It makes you popular",
          emoji: "👑",
          description: "Deodorant helps with body odor from sweating",
          isCorrect: false
        },
        {
          id: "a",
          text: "Controls body odor",
          emoji: "🌸",
          description: "As you grow, deodorant helps manage natural odors",
          isCorrect: true
        },
        {
          id: "c",
          text: "Changes your height",
          emoji: "📏",
          description: "Deodorant helps with hygiene, not growth",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(3, true);
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
    navigate("/student/health-male/kids/reflex-hygiene-check");
  };

  return (
    <GameShell
      title="Quiz on Hygiene"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-male-kids-42"
      gameType="health-male"
      totalLevels={50}
      currentLevel={42}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 3}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Advanced Hygiene Quiz</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizHygieneAdvanced;
