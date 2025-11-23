import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const IdeaStory = () => {
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
      text: "A teen notices waste in the school canteen. What should she do?",
      options: [
        {
          id: "a",
          text: "Think of waste-reduction ideas",
          emoji: "💡",
          description: "Correct! Identifying problems is the first step toward innovative solutions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the problem completely",
          emoji: "🙈",
          description: "Ignoring problems prevents positive change and innovation.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain without proposing solutions",
          emoji: "😠",
          description: "Complaining without solutions doesn't lead to meaningful change.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best approach to brainstorming ideas?",
      options: [
        {
          id: "a",
          text: "Generate many ideas without judging initially",
          emoji: "🧠",
          description: "Exactly! Quantity often leads to quality in brainstorming sessions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Focus on one idea and ignore others",
          emoji: " tunnel",
          description: "Limiting yourself to one idea early prevents exploring creative possibilities.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only consider obvious solutions",
          emoji: "📋",
          description: "Obvious solutions may not address root causes effectively.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can the teen develop her waste-reduction idea?",
      options: [
        {
          id: "a",
          text: "Research, prototype, and test solutions",
          emoji: "🔬",
          description: "Great! The design thinking process helps develop and refine ideas effectively.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Implement immediately without testing",
          emoji: "🚀",
          description: "Testing helps identify potential issues before full implementation.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up if the first attempt fails",
          emoji: "🏳️",
          description: "Iteration and improvement are key parts of the innovation process.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to consider multiple perspectives?",
      options: [
        {
          id: "a",
          text: "Different viewpoints reveal new possibilities",
          emoji: "👥",
          description: "Perfect! Diverse perspectives often lead to more innovative and inclusive solutions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It complicates the process unnecessarily",
          emoji: "🔄",
          description: "Multiple perspectives enrich solutions rather than complicate them.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only experts should contribute ideas",
          emoji: "👑",
          description: "Everyone has valuable insights that can contribute to better solutions.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the benefit of documenting ideas?",
      options: [
        {
          id: "a",
          text: "Track progress and improvements over time",
          emoji: "📊",
          description: "Correct! Documentation helps refine ideas and measure development progress.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Show off to friends",
          emoji: "炫耀",
          description: "The purpose of documentation is development, not showing off.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Prevent others from stealing ideas",
          emoji: "🔒",
          description: "Sharing ideas often leads to valuable feedback and collaboration.",
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
    navigate("/student/ehe/teens/debate-innovation-tech");
  };

  return (
    <GameShell
      title="Idea Story"
      subtitle={`Level 35 of 40`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-35"
      gameType="ehe"
      totalLevels={40}
      currentLevel={35}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 35/40</span>
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

export default IdeaStory;