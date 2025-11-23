import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SavingStory = () => {
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
      text: "You get pocket money. Should you spend all or save some?",
      options: [
        {
          id: "c",
          text: "Spend all on toys",
          emoji: "玩具",
          description: "Fun, but not the best use of your money!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save some and spend some wisely",
          emoji: "🏦",
          description: "Perfect! It's good to save some money for future needs.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide it under your pillow",
          emoji: "🛏️",
          description: "That's not safe or helpful for growing your money!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is saving money important?",
      options: [
        {
          id: "b",
          text: "To show off to friends",
          emoji: "炫耀",
          description: "That's not the main reason to save money!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To avoid spending on anything",
          emoji: "🚫",
          description: "We need to spend on essentials - saving is about planning!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To have money for future needs and emergencies",
          emoji: "🔮",
          description: "Exactly! Saving helps you prepare for future expenses.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Where is the best place to save your money?",
      options: [
        {
          id: "b",
          text: "In a piggy bank only",
          emoji: "🐖",
          description: "A piggy bank is good, but there are better options!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Under your mattress",
          emoji: "🛏️",
          description: "That's not safe and your money won't grow!",
          isCorrect: false
        },
        {
          id: "a",
          text: "In a bank account",
          emoji: "🏦",
          description: "Perfect! Banks keep your money safe and help it grow with interest!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What's a good reason to save money?",
      options: [
        {
          id: "c",
          text: "To avoid ever spending it",
          emoji: "🔒",
          description: "We need to spend on essentials - saving is about planning!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To collect as much as possible without purpose",
          emoji: "📦",
          description: "It's better to save for specific goals!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To buy something special in the future",
          emoji: "🎁",
          description: "Exactly! Saving for goals helps you achieve dreams!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How much of your money should you save?",
      options: [
        {
          id: "b",
          text: "All of it - never spend anything",
          emoji: "🔒",
          description: "We need to spend on essentials - saving is about balance!",
          isCorrect: false
        },
        {
          id: "c",
          text: "None of it - spend it all",
          emoji: "💸",
          description: "That's not a good plan for financial health!",
          isCorrect: false
        },
        {
          id: "a",
          text: "A portion of it, like 20-30%",
          emoji: "⚖️",
          description: "Perfect! Saving a portion helps you build financial habits!",
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
      title="Saving Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-25"
      gameType="ehe"
      totalLevels={10}
      currentLevel={25}
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

export default SavingStory;