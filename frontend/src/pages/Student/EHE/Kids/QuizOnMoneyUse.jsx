import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnMoneyUse = () => {
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
      text: "What do we use money for?",
      options: [
        {
          id: "a",
          text: "Buying needs",
          emoji: "🛒",
          description: "Correct! We use money to buy things we need like food and clothes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Playing only",
          emoji: "🎮",
          description: "Money can buy games, but it's used for much more than just playing!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Collecting rocks",
          emoji: "🪨",
          description: "Rocks are free - you don't need money to collect them!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which of these is a need?",
      options: [
        {
          id: "c",
          text: "Designer shoes",
          emoji: "👠",
          description: "Designer shoes are wants, not needs.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Food",
          emoji: "🍎",
          description: "Correct! Food is a basic need for survival.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Video games",
          emoji: "🎮",
          description: "Video games are wants, not needs.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do with money you don't need right now?",
      options: [
        {
          id: "a",
          text: "Save it in a bank",
          emoji: "🏦",
          description: "Perfect! Banks keep your money safe and help it grow!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend it all immediately",
          emoji: "💸",
          description: "That's not a good idea! You should save some for later.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hide it under your bed",
          emoji: "🛏️",
          description: "That's not safe or helpful for growing your money!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to earn money?",
      options: [
        {
          id: "c",
          text: "To avoid doing chores",
          emoji: "🧹",
          description: "Chores teach responsibility, not a reason to earn money!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To buy things we need and want",
          emoji: "🛍️",
          description: "Exactly! We earn money to afford the things we need and some wants.",
          isCorrect: true
        },
        {
          id: "b",
          text: "To brag to friends",
          emoji: "📣",
          description: "That's not the main reason to earn money!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the difference between a need and a want?",
      options: [
        {
          id: "b",
          text: "Wants are more important than needs",
          emoji: "👑",
          description: "Actually, needs are more important for survival!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Needs are essential for survival, wants make life better",
          emoji: "💡",
          description: "Correct! Needs like food and shelter are essential, while wants like toys make life more enjoyable.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Needs are expensive, wants are cheap",
          emoji: "🏷️",
          description: "That's not the difference! Price doesn't determine need vs want.",
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
      title="Quiz on Money Use"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-22"
      gameType="ehe"
      totalLevels={10}
      currentLevel={22}
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

export default QuizOnMoneyUse;