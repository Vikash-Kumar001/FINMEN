import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnLifelongLearning = () => {
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
      text: "Learning stops when?",
      options: [
        {
          id: "a",
          text: "After school",
          emoji: "🏫",
          description: "Learning doesn't stop after school - it continues throughout your life!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Never",
          emoji: "♾️",
          description: "Correct! Learning is a lifelong process that never stops!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Lifelong learning helps you:",
      options: [
        {
          id: "a",
          text: "Adapt to changes in the world",
          emoji: "🔄",
          description: "Exactly! The world is always changing, and lifelong learning helps you adapt!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay stuck in old ways",
          emoji: "🛑",
          description: "Actually, lifelong learning helps you grow and adapt, not stay stuck!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which is an example of lifelong learning?",
      options: [
        {
          id: "a",
          text: "Learning to cook new recipes as an adult",
          emoji: "👨‍🍳",
          description: "Perfect! Learning new skills at any age is lifelong learning!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only learning what's taught in school",
          emoji: "📚",
          description: "Lifelong learning goes beyond school - it includes all learning throughout life!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is lifelong learning important for careers?",
      options: [
        {
          id: "a",
          text: "Jobs and skills change over time",
          emoji: "💼",
          description: "Right! As jobs evolve, you need to keep learning new skills!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once you get a job, you don't need to learn more",
          emoji: "😴",
          description: "Actually, most careers require continuous learning to stay relevant!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you practice lifelong learning?",
      options: [
        {
          id: "a",
          text: "Read books, take courses, or learn new hobbies",
          emoji: "📖",
          description: "Excellent! There are many ways to keep learning throughout your life!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid new experiences and challenges",
          emoji: "🔒",
          description: "Actually, trying new things is a key part of lifelong learning!",
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
      title="Quiz on Lifelong Learning"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-92"
      gameType="ehe"
      totalLevels={10}
      currentLevel={92}
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

export default QuizOnLifelongLearning;