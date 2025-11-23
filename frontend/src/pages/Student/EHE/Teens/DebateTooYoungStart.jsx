import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateTooYoungStart = () => {
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
      text: "Can teens run businesses successfully?",
      options: [
        {
          id: "a",
          text: "Yes, with proper support and learning",
          emoji: "✅",
          description: "Correct! Many successful entrepreneurs started young with the right mindset and support",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, they lack experience and skills",
          emoji: "❌",
          description: "While experience helps, many essential entrepreneurial skills can be developed at any age",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What advantages do teen entrepreneurs have?",
      options: [
        {
          id: "a",
          text: "Fresh perspectives and tech-savviness",
          emoji: "📱",
          description: "Exactly! Teens often bring innovative ideas and digital fluency to business",
          isCorrect: true
        },
        {
          id: "b",
          text: "They have no advantages over adults",
          emoji: "🤷",
          description: "Teens have unique advantages like adaptability, creativity, and fresh perspectives",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What challenges do teen entrepreneurs face?",
      options: [
        {
          id: "a",
          text: "Limited access to capital and networks",
          emoji: "🔒",
          description: "Correct! These are common challenges, but they can be overcome with creativity and support",
          isCorrect: true
        },
        {
          id: "b",
          text: "They face no challenges at all",
          emoji: "🌈",
          description: "Like all entrepreneurs, teens face unique challenges that require problem-solving",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can teens overcome entrepreneurial challenges?",
      options: [
        {
          id: "a",
          text: "By learning, seeking mentorship, and starting small",
          emoji: "🎓",
          description: "Perfect! These strategies help build skills and reduce risks while learning",
          isCorrect: true
        },
        {
          id: "b",
          text: "By ignoring challenges and hoping they disappear",
          emoji: "🙈",
          description: "Acknowledging and addressing challenges is essential for entrepreneurial success",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the value of teen entrepreneurship?",
      options: [
        {
          id: "a",
          text: "Develops life skills and confidence early",
          emoji: "💪",
          description: "Exactly! Entrepreneurship builds valuable skills like problem-solving, leadership, and resilience",
          isCorrect: true
        },
        {
          id: "b",
          text: "It has no real value for personal development",
          emoji: "EmptyEntries",
          description: "Entrepreneurial experiences provide significant personal and professional development",
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
    navigate("/student/ehe/teens/journal-role-models");
  };

  return (
    <GameShell
      title="Debate: Too Young to Start?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-46"
      gameType="ehe"
      totalLevels={50}
      currentLevel={46}
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
            <h3 className="text-2xl font-bold text-white mb-2">Teen Entrepreneurship Debate</h3>
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

export default DebateTooYoungStart;