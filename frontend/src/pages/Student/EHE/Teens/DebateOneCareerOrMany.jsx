import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateOneCareerOrMany = () => {
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
      text: "Should teens pick one career early or explore many options?",
      options: [
        {
          id: "a",
          text: "Explore many options first",
          emoji: "🔍",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pick one career early and stick to it",
          emoji: "📌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let parents decide without input",
          emoji: "👨‍👩‍👧‍👦",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What are the benefits of exploring multiple career options?",
      options: [
        {
          id: "a",
          text: "Discover diverse interests and find the best fit",
          emoji: "🌟",
          isCorrect: true
        },
        {
          id: "b",
          text: "Confuse yourself with too many choices",
          emoji: "😵",
          isCorrect: false
        },
        {
          id: "c",
          text: "Delay inevitable specialization",
          emoji: "⏰",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does early career exploration benefit long-term success?",
      options: [
        {
          id: "a",
          text: "Builds broader skills and informed decision-making",
          emoji: "🧠",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wastes time that could be spent specializing",
          emoji: "⏳",
          isCorrect: false
        },
        {
          id: "c",
          text: "Creates unnecessary pressure to succeed",
          emoji: "😰",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's a balanced approach to career exploration?",
      options: [
        {
          id: "a",
          text: "Try different internships, courses, and volunteer work",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "b",
          text: "Randomly switch jobs without reflection",
          emoji: "🔄",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all career-related activities until college",
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can teens effectively explore career options?",
      options: [
        {
          id: "a",
          text: "Talk to professionals, job shadow, and take relevant courses",
          emoji: "👥",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only read about careers online",
          emoji: "💻",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy whatever their best friend chooses",
          emoji: "👯",
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
    navigate("/student/ehe/teens/journal-of-career-choice");
  };

  return (
    <GameShell
      title="Debate: One Career or Many?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-6"
      gameType="ehe"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
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
            <h3 className="text-2xl font-bold text-white mb-2">Career Exploration Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

export default DebateOneCareerOrMany;