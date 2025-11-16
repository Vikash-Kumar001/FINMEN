import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateLearningEndsCollege = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Does learning stop after completing a college degree?",
      options: [
        {
          id: "a",
          text: "No, learning is a lifelong process",
          emoji: "📚",
          description: "Exactly! The world changes constantly, requiring continuous learning",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, college provides all necessary knowledge",
          emoji: "🎓",
          description: "Fields evolve rapidly, making ongoing learning essential",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if you want to stay employed",
          emoji: "💼",
          description: "Learning benefits all aspects of life, not just employment",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's a key reason professionals must continue learning?",
      options: [
        {
          id: "a",
          text: "Technology and industry practices constantly evolve",
          emoji: "🔄",
          description: "Perfect! Staying current is essential in fast-changing fields",
          isCorrect: true
        },
        {
          id: "b",
          text: "Employers require it for entertainment",
          emoji: "🎮",
          description: "Continuous learning serves practical career advancement purposes",
          isCorrect: false
        },
        {
          id: "c",
          text: "Learning is only for students",
          emoji: "👶",
          description: "Learning benefits professionals at all career stages",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does lifelong learning benefit personal development?",
      options: [
        {
          id: "a",
          text: "Keeps the mind active and expands perspectives",
          emoji: "🧠",
          description: "Exactly! Learning enhances cognitive abilities and worldview",
          isCorrect: true
        },
        {
          id: "b",
          text: "Creates unnecessary stress",
          emoji: "😰",
          description: "Learning, when approached properly, enhances rather than diminishes well-being",
          isCorrect: false
        },
        {
          id: "c",
          text: "Is only useful for career advancement",
          emoji: "💼",
          description: "Learning enriches all aspects of life beyond professional contexts",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the best approach to lifelong learning?",
      options: [
        {
          id: "a",
          text: "Stay curious and seek learning opportunities regularly",
          emoji: "🔍",
          description: "Perfect! A growth mindset leads to continuous development",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only learn when forced by employers",
          emoji: "⏰",
          description: "Proactive learning is more effective than reactive learning",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all new information to prevent confusion",
          emoji: "🛡️",
          description: "Embracing new information, when properly evaluated, enhances understanding",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can professionals balance work with continuous learning?",
      options: [
        {
          id: "a",
          text: "Dedicate specific time and set learning goals",
          emoji: "📅",
          description: "Exactly! Structured approaches make learning sustainable",
          isCorrect: true
        },
        {
          id: "b",
          text: "Quit jobs to focus only on learning",
          emoji: "🚪",
          description: "Career experience provides valuable learning opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never learn anything new",
          emoji: "❌",
          description: "Stagnation limits both professional and personal growth",
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
    navigate("/student/ehe/teens/journal-growth-plans");
  };

  return (
    <GameShell
      title="Debate: Learning Ends After College?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="ehe-teen-96"
      gameType="ehe"
      totalLevels={100}
      currentLevel={96}
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
            <h3 className="text-2xl font-bold text-white mb-2">Learning After College Debate</h3>
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

export default DebateLearningEndsCollege;