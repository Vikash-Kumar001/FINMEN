import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FailureStory = () => {
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
      text: "A teen's first project fails. Should she give up?",
      options: [
        {
          id: "a",
          text: "No, try again with lessons learned",
          emoji: "🔄",
          description: "Excellent! Failure is a learning opportunity that builds resilience",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, quit immediately",
          emoji: "🏳️",
          description: "Quitting prevents growth and the chance to apply lessons learned",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame others for the failure",
          emoji: "😠",
          description: "Blaming others prevents personal growth and accountability",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to respond to project failure?",
      options: [
        {
          id: "a",
          text: "Analyze what went wrong and improve",
          emoji: "🔍",
          description: "Perfect! Analysis helps identify areas for improvement and prevents future mistakes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the failure completely",
          emoji: "🙈",
          description: "Ignoring failure prevents learning and growth opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Repeat the same approach exactly",
          emoji: "🔁",
          description: "Repeating failed approaches rarely leads to different results",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can failure help entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Builds resilience and problem-solving skills",
          emoji: "💪",
          description: "Great! Overcoming challenges strengthens entrepreneurial capabilities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes them give up permanently",
          emoji: "😞",
          description: "Resilient entrepreneurs use failure as a stepping stone to success",
          isCorrect: false
        },
        {
          id: "c",
          text: "Has no impact on future success",
          emoji: "😐",
          description: "Failure provides valuable lessons that inform better future decisions",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should the teen do after analyzing her failed project?",
      options: [
        {
          id: "a",
          text: "Create an improved plan and try again",
          emoji: "📝",
          description: "Exactly! Applying lessons learned increases chances of future success",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid all future projects",
          emoji: "🔒",
          description: "Avoiding challenges prevents growth and achievement of goals",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy someone else's successful project exactly",
          emoji: "📎",
          description: "While learning from others is valuable, each situation requires unique solutions",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How do successful entrepreneurs view failure?",
      options: [
        {
          id: "a",
          text: "As a natural part of the learning process",
          emoji: "🌱",
          description: "Perfect! Embracing failure as learning leads to innovation and growth",
          isCorrect: true
        },
        {
          id: "b",
          text: "As a reason to quit forever",
          emoji: "🚪",
          description: "Viewing failure as final prevents the growth that comes from persistence",
          isCorrect: false
        },
        {
          id: "c",
          text: "As something that never happens to them",
          emoji: "👑",
          description: "All entrepreneurs experience failure; success comes from how they respond",
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
    navigate("/student/ehe/teens/debate-born-or-made");
  };

  return (
    <GameShell
      title="Failure Story"
      subtitle={`Level 15 of 20`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-15"
      gameType="ehe"
      totalLevels={20}
      currentLevel={15}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 15/20</span>
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

export default FailureStory;