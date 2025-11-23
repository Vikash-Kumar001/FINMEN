import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmpathyStory = () => {
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
      text: "A friend struggles to carry books. What's the first step in design thinking?",
      options: [
        {
          id: "a",
          text: "Understand the problem through empathy",
          emoji: "❤️",
          description: "Correct! Empathy is the foundation of design thinking - understanding users' needs.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Jump straight to solving the problem",
          emoji: "🏃",
          description: "Rushing to solutions without understanding needs often leads to ineffective designs.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the problem completely",
          emoji: "🙈",
          description: "Ignoring problems prevents innovation and helping others.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is empathy important in innovation?",
      options: [
        {
          id: "a",
          text: "It helps understand real user needs and pain points",
          emoji: "🎯",
          description: "Exactly! Solutions that address real needs are more likely to be successful.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes you feel superior to others",
          emoji: "👑",
          description: "Empathy is about understanding others, not feeling superior.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's only important for artists",
          emoji: "🎨",
          description: "Empathy is valuable in all fields, especially innovation and problem-solving.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you practice empathy when solving problems?",
      options: [
        {
          id: "a",
          text: "Listen actively and ask thoughtful questions",
          emoji: "👂",
          description: "Great! Listening helps understand others' perspectives and real needs.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Assume you know what others need without asking",
          emoji: "🤔",
          description: "Assumptions often lead to solutions that don't address real problems.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focus only on your own ideas",
          emoji: "💭",
          description: "User-centered design requires understanding others' needs, not just your ideas.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the benefit of empathetic problem-solving?",
      options: [
        {
          id: "a",
          text: "Creates solutions that truly help people",
          emoji: "🌟",
          description: "Perfect! Empathetic solutions address real needs and have greater impact.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes you look smart to others",
          emoji: "炫耀",
          description: "The goal of innovation should be helping people, not showing off.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Requires less research and effort",
          emoji: "⏱️",
          description: "Empathetic problem-solving often requires more research, but leads to better outcomes.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How does empathy lead to better innovation?",
      options: [
        {
          id: "a",
          text: "Identifies unmet needs and opportunities",
          emoji: "🔍",
          description: "Correct! Understanding needs reveals opportunities for meaningful innovation.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Copies what others have already done",
          emoji: "📎",
          description: "Empathy helps identify unique needs, not just copy existing solutions.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focuses only on technical features",
          emoji: "⚙️",
          description: "Technical features matter, but empathy ensures they address real user needs.",
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
    navigate("/student/ehe/teens/quiz-design-thinking");
  };

  return (
    <GameShell
      title="Empathy Story"
      subtitle={`Level 31 of 40`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-31"
      gameType="ehe"
      totalLevels={40}
      currentLevel={31}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 31/40</span>
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

export default EmpathyStory;