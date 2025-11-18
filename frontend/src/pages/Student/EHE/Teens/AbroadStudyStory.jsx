import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AbroadStudyStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen dreams of studying abroad. What's the first step she should take?",
      options: [
        {
          id: "a",
          text: "Research universities and programs that match her interests",
          emoji: "🔍",
          description: "Perfect! Research is the foundation for making informed decisions about study abroad",
          isCorrect: true
        },
        {
          id: "b",
          text: "Immediately apply to the most expensive university",
          emoji: "💸",
          description: "Financial considerations are important but shouldn't be the primary factor",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy what her friends are doing",
          emoji: "👥",
          description: "Personal goals and interests should guide educational decisions",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's essential for a successful study abroad experience?",
      options: [
        {
          id: "a",
          text: "Preparation, exams, and funds",
          emoji: "📋",
          description: "Exactly! Thorough preparation in all areas ensures a smooth transition",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only having lots of money",
          emoji: "💰",
          description: "Financial resources are important but not sufficient alone for success",
          isCorrect: false
        },
        {
          id: "c",
          text: "Knowing someone in the country",
          emoji: "👨‍👩‍👧‍👦",
          description: "Connections help but aren't essential for a successful study abroad experience",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should a student focus on when preparing for abroad studies?",
      options: [
        {
          id: "a",
          text: "Language skills, academic requirements, and cultural understanding",
          emoji: "📚",
          description: "Perfect! These three areas are crucial for adapting to a new educational environment",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only packing clothes and gadgets",
          emoji: "🛍️",
          description: "Practical preparations are important but academic and cultural preparation are more crucial",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all local interactions",
          emoji: "🚫",
          description: "Cultural engagement is essential for a successful international experience",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can a student fund their abroad education?",
      options: [
        {
          id: "a",
          text: "Scholarships, part-time work, and family support",
          emoji: "🏦",
          description: "Exactly! Multiple funding sources provide financial stability for studies",
          isCorrect: true
        },
        {
          id: "b",
          text: "Borrowing excessive loans without planning",
          emoji: "💳",
          description: "Financial planning is crucial to avoid excessive debt burden",
          isCorrect: false
        },
        {
          id: "c",
          text: "Relying only on luck",
          emoji: "🍀",
          description: "Systematic financial planning is necessary for educational success",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's a benefit of studying abroad?",
      options: [
        {
          id: "a",
          text: "Global perspective and cultural exposure",
          emoji: "🌍",
          description: "Perfect! International experience broadens horizons and enhances career prospects",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoiding all challenges",
          emoji: "😴",
          description: "International study involves challenges that contribute to personal growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "No need to learn anything new",
          emoji: "❌",
          description: "Studying abroad is fundamentally about learning and growth",
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
    navigate("/student/ehe/teens/debate-local-vs-global");
  };

  return (
    <GameShell
      title="Abroad Study Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-65"
      gameType="ehe"
      totalLevels={70}
      currentLevel={65}
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

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Study Abroad Journey</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default AbroadStudyStory;