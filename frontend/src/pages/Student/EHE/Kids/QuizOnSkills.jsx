import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSkills = () => {
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
      text: "Which skill helps entrepreneurs solve problems and find new solutions?",
      options: [
        {
          id: "a",
          text: "Problem-solving",
          emoji: "🧩",
          description: "Correct! Entrepreneurs need to solve problems creatively!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sleeping late",
          emoji: "😴",
          description: "Sleep is important, but it doesn't solve business problems!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Watching TV",
          emoji: "📺",
          description: "Entertainment is good, but it doesn't help with business challenges!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What skill helps you understand what customers want and need?",
      options: [
        {
          id: "c",
          text: "Running fast",
          emoji: "🏃",
          description: "Fitness is good, but not for understanding customer needs!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cooking",
          emoji: "🍳",
          description: "Cooking is useful, but not for understanding customers!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Communication",
          emoji: "💬",
          description: "Perfect! Good communication helps you listen to and understand customers!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Which skill helps you work well with others on a team?",
      options: [
        {
          id: "c",
          text: "Drawing",
          emoji: "🎨",
          description: "Art is creative, but not specifically for teamwork!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Teamwork",
          emoji: "🤝",
          description: "Exactly! Teamwork is essential for success in business!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Singing",
          emoji: "🎤",
          description: "Singing is fun, but not essential for teamwork!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What skill helps you come up with new ideas and think differently?",
      options: [
        {
          id: "b",
          text: "Shopping",
          emoji: "🛍️",
          description: "Shopping is fun, but not for generating ideas!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Creativity",
          emoji: "💡",
          description: "Great! Creativity helps you innovate and find unique solutions!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Cleaning",
          emoji: "🧹",
          description: "Cleanliness is good, but not for creative thinking!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which skill helps you keep going even when things get tough?",
      options: [
        {
          id: "c",
          text: "Playing games",
          emoji: "🎮",
          description: "Games are fun, but don't develop perseverance!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eating sweets",
          emoji: "🍰",
          description: "Treats are nice, but don't build resilience!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Perseverance",
          emoji: "💪",
          description: "Correct! Perseverance helps you overcome challenges!",
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
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Skills"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-12"
      gameType="ehe"
      totalLevels={10}
      currentLevel={12}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
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
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
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

export default QuizOnSkills;