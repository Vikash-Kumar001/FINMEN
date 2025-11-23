import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PassionStory = () => {
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
      text: "A teen loves helping people and making a positive difference. What career might be a good fit?",
      options: [
        {
          id: "a",
          text: "Social Worker or Doctor",
          emoji: "👩‍⚕️",
          description: "Excellent! Both careers focus on helping people and improving lives",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stock Trader",
          emoji: "📈",
          description: "While this can be fulfilling, it doesn't directly focus on helping people",
          isCorrect: false
        },
        {
          id: "c",
          text: "Professional Gamer",
          emoji: "🎮",
          description: "Entertainment-focused career that doesn't directly help people",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is it important to consider your passions when choosing a career?",
      options: [
        {
          id: "a",
          text: "Passion leads to greater job satisfaction and motivation",
          emoji: "😊",
          description: "Exactly! Passionate work feels less like work and more like purpose",
          isCorrect: true
        },
        {
          id: "b",
          text: "Passion is irrelevant to career success",
          emoji: "😐",
          description: "Actually, passion is a key driver of long-term career satisfaction",
          isCorrect: false
        },
        {
          id: "c",
          text: "Passion guarantees high income",
          emoji: "💰",
          description: "While passion can lead to success, it doesn't guarantee financial outcomes",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you discover your true passions?",
      options: [
        {
          id: "a",
          text: "Try different activities and reflect on what energizes you",
          emoji: "🔍",
          description: "Perfect! Exploration and self-reflection help identify genuine interests",
          isCorrect: true
        },
        {
          id: "b",
          text: "Copy what your friends are passionate about",
          emoji: "👥",
          description: "Others' passions may not align with your own interests and values",
          isCorrect: false
        },
        {
          id: "c",
          text: "Choose based on what seems easiest",
          emoji: "😴",
          description: "Ease of pursuit doesn't necessarily indicate true passion",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if your passion doesn't directly translate to a career?",
      options: [
        {
          id: "a",
          text: "Find ways to incorporate it as a hobby or side interest",
          emoji: "🎨",
          description: "Great! Passions can enrich life even if they're not your main career",
          isCorrect: true
        },
        {
          id: "b",
          text: "Completely abandon the passion",
          emoji: "❌",
          description: "Passions contribute to well-being and shouldn't be entirely discarded",
          isCorrect: false
        },
        {
          id: "c",
          text: "Force it into an unrelated career",
          emoji: "🔨",
          description: "Forcing passions into mismatched careers often leads to frustration",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you develop a passion into a career?",
      options: [
        {
          id: "a",
          text: "Gain relevant education, skills, and experience in that field",
          emoji: "📚",
          description: "Exactly! Formal learning and practical experience build career-ready skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "Rely only on natural talent without development",
          emoji: "天赋",
          description: "Even natural talents need cultivation and professional development",
          isCorrect: false
        },
        {
          id: "c",
          text: "Expect immediate success without effort",
          emoji: "🚀",
          description: "Career development requires sustained effort and patience",
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
    navigate("/student/ehe/teens/debate-one-career-or-many");
  };

  return (
    <GameShell
      title="Passion Story"
      subtitle={`Level 5 of 10`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-5"
      gameType="ehe"
      totalLevels={10}
      currentLevel={5}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 5/10</span>
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

export default PassionStory;