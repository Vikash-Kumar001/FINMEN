import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GapYearStory = () => {
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
      text: "A teen takes a gap year to learn coding. What's the most important consideration?",
      options: [
        {
          id: "a",
          text: "Just traveling without purpose",
          emoji: "✈️",
          description: "Travel can be valuable but without purpose, it may not contribute to career goals",
          isCorrect: false
        },
        {
          id: "b",
          text: "Building genuine skills and experiences",
          emoji: "🛠️",
          description: "Perfect! Skill development and meaningful experiences make gap years valuable",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoiding all academic work",
          emoji: "❌",
          description: "Gap years can include learning opportunities, not just leisure activities",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How can a gap year benefit a teen's future career?",
      options: [
        {
          id: "a",
          text: "Provides real-world experience and clarity",
          emoji: "🌟",
          description: "Exactly! Real experiences help teens make informed career decisions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Delays entry into the workforce unnecessarily",
          emoji: "⏰",
          description: "When planned well, gap years enhance rather than delay career preparation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eliminates the need for further education",
          emoji: "🎓",
          description: "Gap years complement education rather than replace it",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should a teen focus on during a productive gap year?",
      options: [
        {
          id: "a",
          text: "Internships, volunteering, or skill development",
          emoji: "💼",
          description: "Perfect! Structured learning experiences provide valuable skills and networking",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only entertainment and leisure",
          emoji: "🎮",
          description: "While relaxation is important, skill-building activities provide long-term benefits",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all social interaction",
          emoji: "👻",
          description: "Social connections and networking are valuable for personal and professional growth",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's a key factor for a successful gap year?",
      options: [
        {
          id: "a",
          text: "Clear goals and planning",
          emoji: "🎯",
          description: "Exactly! Defined objectives ensure the gap year contributes to personal development",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spending as much money as possible",
          emoji: "💸",
          description: "Financial responsibility is important; spending without purpose isn't beneficial",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding any challenges",
          emoji: "🛋️",
          description: "Challenges and learning experiences are key benefits of well-planned gap years",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should a teen prepare for a gap year?",
      options: [
        {
          id: "a",
          text: "Research opportunities and create a structured plan",
          emoji: "📋",
          description: "Perfect! Thorough research and planning maximize the value of a gap year",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make spontaneous decisions without preparation",
          emoji: "🎲",
          description: "While flexibility is good, preparation ensures productive use of time",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only focus on avoiding schoolwork",
          emoji: "😴",
          description: "Gap years should enhance development, not just provide an escape from academics",
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
    navigate("/student/ehe/teens/debate-degree-or-skill");
  };

  return (
    <GameShell
      title="Gap Year Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-55"
      gameType="ehe"
      totalLevels={60}
      currentLevel={55}
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
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-white mb-2">Gap Year Planning</h3>
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

export default GapYearStory;