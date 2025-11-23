import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotHelperStory = () => {
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
      text: "Robots help in factories. What career works with robots?",
      options: [
        {
          id: "a",
          text: "Robotics Engineer",
          emoji: "🔧",
          description: "Exactly! Robotics engineers design and build robots!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Farmer",
          emoji: "🌾",
          description: "Farmers grow crops, not build robots!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Chefs cook food, not build robots!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do robotics engineers do?",
      options: [
        {
          id: "a",
          text: "Design and build robots",
          emoji: "⚙️",
          description: "Correct! They design and build robots for various uses!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only play with toys",
          emoji: "🎮",
          description: "Robotics engineering is serious work, not just play!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Drive buses",
          emoji: "🚌",
          description: "Bus drivers transport people, not build robots!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Where do robotics engineers work?",
      options: [
        {
          id: "a",
          text: "Factories, labs, tech companies",
          emoji: "🏢",
          description: "Perfect! They work in various technical environments!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only at the beach",
          emoji: "🏖️",
          description: "That's not where robotics engineers typically work!",
          isCorrect: false
        },
        {
          id: "c",
          text: "In restaurants",
          emoji: "🍽️",
          description: "Restaurants employ chefs and servers, not robotics engineers!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What skills are important for robotics engineers?",
      options: [
        {
          id: "a",
          text: "Math, science, problem-solving",
          emoji: "🧮",
          description: "Exactly! Strong technical and analytical skills are essential!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only singing",
          emoji: "🎤",
          description: "Singing is great, but robotics engineers need technical skills!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only dancing",
          emoji: "💃",
          description: "Dancing is fun, but robotics engineers need technical skills!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why are robots helpful in factories?",
      options: [
        {
          id: "a",
          text: "They work fast and accurately",
          emoji: "⚡",
          description: "Perfect! Robots increase efficiency and precision!",
          isCorrect: true
        },
        {
          id: "b",
          text: "They take long breaks",
          emoji: "😴",
          description: "Robots actually work continuously without breaks!",
          isCorrect: false
        },
        {
          id: "c",
          text: "They make mistakes often",
          emoji: "❌",
          description: "Robots are designed to minimize errors!",
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
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Robot Helper Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-71"
      gameType="ehe"
      totalLevels={10}
      currentLevel={71}
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

export default RobotHelperStory;