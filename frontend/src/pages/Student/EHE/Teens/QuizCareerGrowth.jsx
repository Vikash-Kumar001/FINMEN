import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizCareerGrowth = () => {
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
      text: "Which factor most helps in career growth?",
      options: [
        {
          id: "a",
          text: "Continuous learning and skill development",
          emoji: "📚",
          description: "Exactly! Lifelong learning keeps you relevant and competitive",
          isCorrect: true
        },
        {
          id: "b",
          text: "Doing nothing new or different",
          emoji: "😴",
          description: "Stagnation limits career advancement opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all challenges",
          emoji: "🛡️",
          description: "Growth requires embracing challenges, not avoiding them",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's a key benefit of networking for career growth?",
      options: [
        {
          id: "a",
          text: "Access to opportunities and mentorship",
          emoji: "🤝",
          description: "Perfect! Professional relationships open doors to new possibilities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only meeting people for personal gain",
          emoji: "💰",
          description: "Authentic networking focuses on mutual benefit and genuine connections",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all social interactions",
          emoji: "🔇",
          description: "Isolation limits career growth potential",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does taking on challenging projects affect career growth?",
      options: [
        {
          id: "a",
          text: "Demonstrates capability and builds expertise",
          emoji: "💪",
          description: "Exactly! Challenging work showcases your potential to employers",
          isCorrect: true
        },
        {
          id: "b",
          text: "Creates unnecessary stress with no benefits",
          emoji: "😰",
          description: "While challenging, growth opportunities ultimately reduce career anxiety",
          isCorrect: false
        },
        {
          id: "c",
          text: "Should always be avoided",
          emoji: "❌",
          description: "Avoiding challenges limits professional development",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is setting career goals important?",
      options: [
        {
          id: "a",
          text: "Provides direction and motivation for growth",
          emoji: "🎯",
          description: "Perfect! Clear goals focus efforts and measure progress",
          isCorrect: true
        },
        {
          id: "b",
          text: "Creates unrealistic expectations",
          emoji: "💭",
          description: "Well-defined goals are achievable and adaptable",
          isCorrect: false
        },
        {
          id: "c",
          text: "Limits flexibility in career choices",
          emoji: "⛓️",
          description: "Goals provide framework while allowing for adjustments",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What role does feedback play in career development?",
      options: [
        {
          id: "a",
          text: "Identifies areas for improvement and growth",
          emoji: "🔄",
          description: "Exactly! Constructive feedback accelerates professional development",
          isCorrect: true
        },
        {
          id: "b",
          text: "Should be ignored to maintain confidence",
          emoji: "🙉",
          description: "Feedback, when properly received, builds confidence and competence",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only matters for entry-level positions",
          emoji: "👶",
          description: "Feedback benefits professionals at all career stages",
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
    navigate("/student/ehe/teens/reflex-teen-growth");
  };

  return (
    <GameShell
      title="Quiz on Career Growth"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-92"
      gameType="ehe"
      totalLevels={100}
      currentLevel={92}
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
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-2">Career Growth Quiz</h3>
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

export default QuizCareerGrowth;