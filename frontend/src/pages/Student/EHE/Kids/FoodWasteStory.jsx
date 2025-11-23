import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FoodWasteStory = () => {
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
      text: "A boy collects leftover food to give poor children. What is this?",
      options: [
        {
          id: "a",
          text: "Social entrepreneurship",
          emoji: "🤝",
          description: "Exactly! Using business skills to solve social problems!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just charity",
          emoji: "💝",
          description: "It's more than charity - it's a sustainable social business model!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wasting time",
          emoji: "⏰",
          description: "This is valuable work that helps both people and reduces waste!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is social entrepreneurship?",
      options: [
        {
          id: "a",
          text: "Business for social good",
          emoji: "🌱",
          description: "Correct! Using business methods to solve social problems!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only making money",
          emoji: "💰",
          description: "Social entrepreneurship focuses on social impact, not just profit!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Government work",
          emoji: "🏛️",
          description: "While governments help, social entrepreneurship is independent!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is reducing food waste important?",
      options: [
        {
          id: "a",
          text: "Helps environment and people",
          emoji: "🌍",
          description: "Perfect! Reduces environmental impact and helps those in need!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only saves money",
          emoji: "💸",
          description: "While it saves money, the environmental and social benefits are greater!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes more garbage",
          emoji: "🗑️",
          description: "Reducing waste means less garbage, not more!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you help reduce food waste?",
      options: [
        {
          id: "a",
          text: "Share excess food",
          emoji: "🍎",
          description: "Exactly! Sharing helps people and reduces waste!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Buy more than needed",
          emoji: "🛒",
          description: "Buying excess leads to more waste!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Throw food away",
          emoji: "🗑️",
          description: "That creates waste instead of solving it!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What skills help social entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Problem-solving and empathy",
          emoji: "💡",
          description: "Perfect! Understanding problems and caring about solutions!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only being rich",
          emoji: "💎",
          description: "Money helps, but skills and passion are more important!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring problems",
          emoji: "🙈",
          description: "Social entrepreneurs actively solve problems!",
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
      title="Food Waste Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-81"
      gameType="ehe"
      totalLevels={10}
      currentLevel={81}
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

export default FoodWasteStory;