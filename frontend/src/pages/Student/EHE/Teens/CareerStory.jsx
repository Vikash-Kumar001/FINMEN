import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CareerStory = () => {
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
      text: "A teen loves drawing and creating visual art. Which career would be a good fit?",
      options: [
        {
          id: "a",
          text: "Software Engineer",
          emoji: "💻",
          description: "While creative, this focuses more on coding than visual arts",
          isCorrect: false
        },
        {
          id: "b",
          text: "Graphic Designer/Artist",
          emoji: "🎨",
          description: "Perfect! Graphic designers and artists use drawing skills to create visual content",
          isCorrect: true
        },
        {
          id: "c",
          text: "Accountant",
          emoji: "🧮",
          description: "This career focuses on numbers and finance rather than art",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should the teen consider when choosing a career related to their passion?",
      options: [
        {
          id: "a",
          text: "Only salary, not personal interest",
          emoji: "💰",
          description: "While salary is important, passion and interest are equally crucial for long-term satisfaction",
          isCorrect: false
        },
        {
          id: "b",
          text: "Balance of passion, skills, and market demand",
          emoji: "⚖️",
          description: "Excellent! A good career choice considers personal interests, skills, and job market opportunities",
          isCorrect: true
        },
        {
          id: "c",
          text: "What their friends think is cool",
          emoji: "👥",
          description: "Career choices should be based on personal fit rather than peer pressure",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can the teen develop their artistic skills for a career?",
      options: [
        {
          id: "a",
          text: "Practice regularly and take art classes",
          emoji: "🖌️",
          description: "Great! Regular practice and formal education help develop professional skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only draw when feeling inspired",
          emoji: "✨",
          description: "Professional development requires consistent effort, not just inspiration",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy others' work without learning techniques",
          emoji: "🔄",
          description: "While learning from others is valuable, understanding techniques is essential",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What are important qualities for a successful artist or designer?",
      options: [
        {
          id: "a",
          text: "Creativity, patience, and communication skills",
          emoji: "🧠",
          description: "Exactly! These qualities help artists create meaningful work and collaborate effectively",
          isCorrect: true
        },
        {
          id: "b",
          text: "Perfectionism and working alone",
          emoji: "🎯",
          description: "While attention to detail is important, collaboration and iteration are key in creative fields",
          isCorrect: false
        },
        {
          id: "c",
          text: "Speed over quality",
          emoji: "⚡",
          description: "Quality is more important than speed in creative careers",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can the teen explore career options in art and design?",
      options: [
        {
          id: "a",
          text: "Research careers, talk to professionals, and try internships",
          emoji: "🔍",
          description: "Perfect! Research, networking, and hands-on experience help make informed career decisions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Choose based on the shortest training program",
          emoji: "⏱️",
          description: "Career choices should consider fit and interest, not just training duration",
          isCorrect: false
        },
        {
          id: "c",
          text: "Pick randomly without research",
          emoji: "🎲",
          description: "Informed decisions lead to better career satisfaction",
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
    navigate("/student/ehe/teens/quiz-on-careers");
  };

  return (
    <GameShell
      title="Career Story"
      subtitle={`Level 1 of 10`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-1"
      gameType="ehe"
      totalLevels={10}
      currentLevel={1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 1/10</span>
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

export default CareerStory;