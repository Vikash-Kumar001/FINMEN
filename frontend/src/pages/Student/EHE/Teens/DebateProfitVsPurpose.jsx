import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateProfitVsPurpose = () => {
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
      text: "Which is more important for a business?",
      options: [
        {
          id: "a",
          text: "Profit only",
          emoji: "💰",
          description: "Focusing only on profit can lead to short-term thinking and unethical practices",
          isCorrect: false
        },
        {
          id: "b",
          text: "Purpose with profit",
          emoji: "🎯",
          description: "Exactly! A clear purpose with sustainable profits creates long-term value",
          isCorrect: true
        },
        {
          id: "c",
          text: "Neither profit nor purpose",
          emoji: "❌",
          description: "Businesses need both financial sustainability and a meaningful purpose",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when businesses focus only on short-term profits?",
      options: [
        {
          id: "a",
          text: "They may harm stakeholders and communities",
          emoji: "💥",
          description: "Exactly! Short-term profit focus can lead to exploitation and environmental damage",
          isCorrect: true
        },
        {
          id: "b",
          text: "They always succeed long-term",
          emoji: "📈",
          description: "Short-term profit focus often leads to long-term failure",
          isCorrect: false
        },
        {
          id: "c",
          text: "They solve all social problems",
          emoji: "🌍",
          description: "Profit-only businesses rarely address social issues effectively",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does having a clear purpose benefit a business?",
      options: [
        {
          id: "a",
          text: "Attracts loyal customers and talented employees",
          emoji: "👥",
          description: "Perfect! People want to support and work for purpose-driven organizations",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eliminates all competition",
          emoji: "🏆",
          description: "Purpose helps differentiate but doesn't eliminate competition",
          isCorrect: false
        },
        {
          id: "c",
          text: "Requires no financial planning",
          emoji: "💸",
          description: "Purpose-driven businesses still need solid financial management",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the role of profits in purpose-driven businesses?",
      options: [
        {
          id: "a",
          text: "Fund the mission and ensure sustainability",
          emoji: "🔄",
          description: "Exactly! Profits enable purpose-driven businesses to continue their work",
          isCorrect: true
        },
        {
          id: "b",
          text: "Are irrelevant to the mission",
          emoji: "❓",
          description: "Profits are essential for long-term mission fulfillment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Should be maximized at all costs",
          emoji: "⬆️",
          description: "Purpose-driven businesses balance profits with their mission",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can businesses balance profit and purpose effectively?",
      options: [
        {
          id: "a",
          text: "Integrate purpose into core strategy and operations",
          emoji: "⚙️",
          description: "Perfect! Purpose should guide decisions, not be an afterthought",
          isCorrect: true
        },
        {
          id: "b",
          text: "Focus on purpose only during marketing",
          emoji: "📢",
          description: "Authentic purpose integration goes far beyond marketing",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore financial performance completely",
          emoji: "📉",
          description: "Financial sustainability is necessary for long-term purpose fulfillment",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/ehe/teens/journal-of-impact");
  };

  return (
    <GameShell
      title="Debate: Profit vs Purpose"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-86"
      gameType="ehe"
      totalLevels={90}
      currentLevel={86}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Profit vs Purpose Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default DebateProfitVsPurpose;