import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnGrowth = () => {
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
      text: "Which combination best supports healthy growth?",
      options: [
        {
          id: "a",
          text: "Exercise and good nutrition",
          emoji: "🏃‍♀️",
          description: "Correct! Regular exercise and proper nutrition work together to support healthy growth and development.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eating only candy and sleeping late",
          emoji: "🍬",
          description: "Candy lacks essential nutrients and poor sleep can hinder growth. This combination doesn't support healthy development.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skipping meals and avoiding physical activity",
          emoji: "😞",
          description: "Skipping meals deprives your body of nutrients, and lack of exercise can weaken muscles and bones.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How many hours of sleep do children typically need for healthy growth?",
      options: [
        {
          id: "a",
          text: "6-7 hours",
          emoji: "😴",
          description: "This is generally not enough sleep for children. Growth hormone is primarily released during deep sleep.",
          isCorrect: false
        },
        {
          id: "b",
          text: "9-11 hours",
          emoji: "😴",
          description: "Exactly! Children need 9-11 hours of sleep for proper growth hormone production and overall development.",
          isCorrect: true
        },
        {
          id: "c",
          text: "12-14 hours",
          emoji: "😴",
          description: "While extra sleep isn't harmful, 12-14 hours is more than typically needed for most children.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which nutrient is most important for bone growth?",
      options: [
        {
          id: "a",
          text: "Calcium",
          emoji: "🥛",
          description: "Right! Calcium is essential for building strong bones and teeth during growth periods.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sugar",
          emoji: "🍬",
          description: "Sugar provides energy but doesn't contribute to bone growth. Excess sugar can actually interfere with calcium absorption.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Salt",
          emoji: "🧂",
          description: "Salt is necessary in small amounts but doesn't directly support bone growth like calcium does.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What role does protein play in growth?",
      options: [
        {
          id: "a",
          text: "Builds and repairs body tissues",
          emoji: "💪",
          description: "Perfect! Protein is essential for building and repairing muscles, organs, and other body tissues during growth.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only provides quick energy",
          emoji: "⚡",
          description: "Carbohydrates provide quick energy. Protein's primary role is tissue building and repair, not immediate energy.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes you feel full without nutritional benefits",
          emoji: "🍽️",
          description: "Protein does help with satiety, but it also provides essential amino acids for growth and development.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which activity is most beneficial for height growth?",
      options: [
        {
          id: "a",
          text: "Hanging exercises and stretching",
          emoji: "🧗‍♀️",
          description: "Good choice! Activities that stretch the spine and promote good posture can help you reach your maximum height potential.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Lifting heavy weights",
          emoji: "🏋️‍♀️",
          description: "Heavy weight lifting can be harmful to growing bones and joints. Light resistance training is safer during growth periods.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sitting for long periods",
          emoji: "🛋️",
          description: "Prolonged sitting doesn't promote growth and can lead to poor posture, which may affect height development.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Growth"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-22"
      gameType="health-female"
      totalLevels={30}
      currentLevel={22}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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

export default QuizOnGrowth;