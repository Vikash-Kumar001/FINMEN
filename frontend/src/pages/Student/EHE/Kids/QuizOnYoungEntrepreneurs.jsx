import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnYoungEntrepreneurs = () => {
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
      text: "What do young entrepreneurs show?",
      options: [
        {
          id: "a",
          text: "Laziness",
          emoji: "😴",
          description: "That's not what entrepreneurs show!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Creativity and Courage",
          emoji: "💡",
          description: "Exactly! Young entrepreneurs are creative and courageous!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Fear of trying new things",
          emoji: "😨",
          description: "Entrepreneurs face fears and try new things!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's an important skill for young entrepreneurs?",
      options: [
        {
          id: "c",
          text: "Avoiding all risks",
          emoji: "🛡️",
          description: "Entrepreneurship involves calculated risks!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Problem-solving",
          emoji: "🧩",
          description: "Perfect! Entrepreneurs solve problems creatively!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Waiting for others to solve problems",
          emoji: "⏳",
          description: "Entrepreneurs take initiative to solve problems!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why do young entrepreneurs start businesses?",
      options: [
        {
          id: "b",
          text: "To avoid learning new skills",
          emoji: "📚",
          description: "Entrepreneurship helps develop new skills!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To copy others without thinking",
          emoji: "📋",
          description: "Entrepreneurs innovate rather than just copy!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To create solutions and earn money",
          emoji: "🚀",
          description: "Exactly! Entrepreneurs create solutions and earn money!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What should young entrepreneurs do when they face challenges?",
      options: [
        {
          id: "c",
          text: "Give up immediately",
          emoji: "🏳️",
          description: "That's not how successful entrepreneurs think!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Blame others for their problems",
          emoji: "😠",
          description: "Successful entrepreneurs take responsibility!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Learn from failures and keep trying",
          emoji: "🔄",
          description: "Perfect! Learning from failures is key to success!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How can young entrepreneurs improve their ideas?",
      options: [
        {
          id: "b",
          text: "Never listen to feedback",
          emoji: "🙉",
          description: "Feedback helps improve ideas!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stick to the first version forever",
          emoji: "🔒",
          description: "Ideas can always be improved!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Test, get feedback, and iterate",
          emoji: "🧪",
          description: "Exactly! Testing and iteration improve ideas!",
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
      title="Quiz on Young Entrepreneurs"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-42"
      gameType="ehe"
      totalLevels={10}
      currentLevel={42}
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

export default QuizOnYoungEntrepreneurs;