import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizEntrepreneurTraits = () => {
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
      text: "Which trait is most important for entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Creativity",
          emoji: "🎨",
          description: "Correct! Creativity helps entrepreneurs develop innovative solutions and think outside the box",
          isCorrect: true
        },
        {
          id: "b",
          text: "Laziness",
          emoji: "😴",
          description: "Laziness prevents progress and success in entrepreneurship",
          isCorrect: false
        },
        {
          id: "c",
          text: "Quitting",
          emoji: "🚪",
          description: "Quitting prevents entrepreneurs from overcoming challenges and achieving goals",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What does resilience mean for entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Bouncing back from failures and setbacks",
          emoji: "🔄",
          description: "Exactly! Resilience helps entrepreneurs learn from failures and keep going",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never trying anything new",
          emoji: "🔒",
          description: "Avoiding new experiences prevents growth and innovation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Giving up when things get difficult",
          emoji: "🏳️",
          description: "Giving up prevents entrepreneurs from achieving their goals",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is risk-taking important for entrepreneurs?",
      options: [
        {
          id: "a",
          text: "It enables trying new ideas and opportunities",
          emoji: "🎲",
          description: "Perfect! Calculated risks lead to innovation and growth",
          isCorrect: true
        },
        {
          id: "b",
          text: "It guarantees instant success",
          emoji: "🏆",
          description: "Risk-taking doesn't guarantee success but opens doors to possibilities",
          isCorrect: false
        },
        {
          id: "c",
          text: "It eliminates all challenges",
          emoji: "🛡️",
          description: "Risk-taking involves facing challenges, not eliminating them",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What role does leadership play in entrepreneurship?",
      options: [
        {
          id: "a",
          text: "Inspiring and guiding others toward goals",
          emoji: "👑",
          description: "Correct! Leadership helps entrepreneurs build teams and influence positive change",
          isCorrect: true
        },
        {
          id: "b",
          text: "Bossing people around",
          emoji: "😠",
          description: "True leadership involves inspiration, not intimidation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Working alone without collaboration",
          emoji: "👤",
          description: "Entrepreneurship often requires teamwork and collaboration",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How does adaptability benefit entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Adjusting to changing market conditions",
          emoji: "🔄",
          description: "Exactly! Adaptability helps entrepreneurs respond to new challenges and opportunities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sticking rigidly to original plans",
          emoji: "📋",
          description: "Inflexibility can prevent entrepreneurs from capitalizing on new opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying what everyone else does",
          emoji: "🐑",
          description: "Blindly copying others doesn't lead to innovation or competitive advantage",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/ehe/teens/reflex-teen-skills");
  };

  return (
    <GameShell
      title="Quiz on Entrepreneur Traits"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-12"
      gameType="ehe"
      totalLevels={20}
      currentLevel={12}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizEntrepreneurTraits;