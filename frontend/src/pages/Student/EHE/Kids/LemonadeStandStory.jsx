import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LemonadeStandStory = () => {
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
      text: "You sell 5 cups of lemonade. What do you get?",
      options: [
        {
          id: "b",
          text: "More lemons",
          emoji: "🍋",
          description: "Not quite! You started with lemons, but selling gives you money.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Money",
          emoji: "💰",
          description: "Correct! When you sell something, you get money in return.",
          isCorrect: true
        },
        {
          id: "c",
          text: "A new friend",
          emoji: "👥",
          description: "Nice thought, but selling products gives you money!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do with the money you earn?",
      options: [
        {
          id: "c",
          text: "Throw it away",
          emoji: "🗑️",
          description: "No! That would be wasteful.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save some and spend some wisely",
          emoji: "🏦",
          description: "Perfect! It's good to save some money and spend some on things you need.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend it all on candy",
          emoji: "🍬",
          description: "Fun, but not the best use of your earnings!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you make your lemonade stand more successful?",
      options: [
        {
          id: "b",
          text: "Make it dirty and uninviting",
          emoji: "🧹",
          description: "That would drive customers away!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Charge very high prices",
          emoji: "💸",
          description: "That might scare customers away!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep it clean and offer good service",
          emoji: "✨",
          description: "Exactly! A clean stand with good service attracts customers!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What's an important cost in running a lemonade stand?",
      options: [
        {
          id: "a",
          text: "Buying lemons, sugar, and cups",
          emoji: "🛒",
          description: "Correct! These are expenses you need to pay for.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Free lemons from trees",
          emoji: "🌳",
          description: "Even free lemons have a value!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Having fun with friends",
          emoji: "🎉",
          description: "That's a benefit, not a cost!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to count your money at the end of the day?",
      options: [
        {
          id: "b",
          text: "To spend it immediately",
          emoji: "🛍️",
          description: "Not the main reason for counting!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To show off to friends",
          emoji: "炫耀",
          description: "That's not the important reason!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To know how much you earned and plan for tomorrow",
          emoji: "📊",
          description: "Exactly! Counting helps you track your business success!",
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
      title="Lemonade Stand Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-21"
      gameType="ehe"
      totalLevels={10}
      currentLevel={21}
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

export default LemonadeStandStory;