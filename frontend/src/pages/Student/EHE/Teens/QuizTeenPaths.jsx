import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizTeenPaths = () => {
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
      text: "Which is a valid career path after high school?",
      options: [
        {
          id: "a",
          text: "College",
          emoji: "🎓",
          description: "Correct! College is a common path for many careers requiring advanced education",
          isCorrect: true
        },
        {
          id: "b",
          text: "Vocational training",
          emoji: "🔧",
          description: "Correct! Vocational training provides specialized skills for specific careers",
          isCorrect: true
        },
        {
          id: "c",
          text: "Both college and vocational training",
          emoji: "✅",
          description: "Exactly! Both are valid paths depending on career goals and interests",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What's an advantage of vocational training?",
      options: [
        {
          id: "a",
          text: "Enters workforce faster with specific skills",
          emoji: "⚡",
          description: "Perfect! Vocational training provides job-ready skills in a shorter time frame",
          isCorrect: true
        },
        {
          id: "b",
          text: "No practical experience required",
          emoji: "📚",
          description: "Vocational training emphasizes hands-on practical experience",
          isCorrect: false
        },
        {
          id: "c",
          text: "Higher cost than college",
          emoji: "💰",
          description: "Vocational training is typically more affordable than college",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's an advantage of college education?",
      options: [
        {
          id: "a",
          text: "Broader knowledge and career flexibility",
          emoji: "🌐",
          description: "Exactly! College provides diverse knowledge and opens multiple career paths",
          isCorrect: true
        },
        {
          id: "b",
          text: "No need for further learning",
          emoji: "🏁",
          description: "Education is a lifelong process, even after college graduation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Guaranteed high salary",
          emoji: "💸",
          description: "Salaries depend on many factors, not just educational level",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which careers typically require college education?",
      options: [
        {
          id: "a",
          text: "Doctor, Lawyer, Engineer",
          emoji: "👨‍⚕️",
          description: "Correct! These professions require advanced knowledge and licensing",
          isCorrect: true
        },
        {
          id: "b",
          text: "Plumber, Electrician, Chef",
          emoji: "🔧",
          description: "These careers often use vocational training, though some may have college options",
          isCorrect: false
        },
        {
          id: "c",
          text: "Retail salesperson, Cashier",
          emoji: "🛒",
          description: "These positions typically require on-the-job training rather than college",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should guide your choice between college and vocational training?",
      options: [
        {
          id: "a",
          text: "Career interests and job market demand",
          emoji: "🎯",
          description: "Perfect! Personal interests and market opportunities should guide educational choices",
          isCorrect: true
        },
        {
          id: "b",
          text: "What your friends are doing",
          emoji: "👥",
          description: "While peer support is helpful, personal fit is more important for long-term success",
          isCorrect: false
        },
        {
          id: "c",
          text: "The cheapest option only",
          emoji: "🏷️",
          description: "Cost is a factor but shouldn't be the only consideration for career preparation",
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
    navigate("/student/ehe/teens/reflex-teen-career-2");
  };

  return (
    <GameShell
      title="Quiz on Teen Paths"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-52"
      gameType="ehe"
      totalLevels={60}
      currentLevel={52}
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
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-white mb-2">Career Path Quiz</h3>
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

export default QuizTeenPaths;