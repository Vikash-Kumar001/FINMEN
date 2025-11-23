import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MentorStory = () => {
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
      text: "A teen meets an experienced professional in her field. Should she ask questions and learn from them?",
      options: [
        {
          id: "a",
          text: "Yes, mentors provide valuable guidance and insights",
          emoji: "👨‍🏫",
          description: "Perfect! Mentors accelerate learning through their experience",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, she should figure everything out alone",
          emoji: "🧍",
          description: "Isolation limits learning from others' experiences",
          isCorrect: false
        },
        {
          id: "c",
          text: "No, mentors are only for adults",
          emoji: "👶",
          description: "Mentors benefit professionals at all career stages",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to approach a potential mentor?",
      options: [
        {
          id: "a",
          text: "Be respectful, show genuine interest, and be specific about what you want to learn",
          emoji: "🤝",
          description: "Exactly! Clear, respectful communication builds strong mentor relationships",
          isCorrect: true
        },
        {
          id: "b",
          text: "Demand their time without explanation",
          emoji: "⏰",
          description: "Unreasonable demands rarely lead to successful mentor relationships",
          isCorrect: false
        },
        {
          id: "c",
          text: "Expect them to do your work for you",
          emoji: "💼",
          description: "Mentors guide, but you must do the work yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should a mentee prepare for mentorship meetings?",
      options: [
        {
          id: "a",
          text: "Come with specific questions and goals",
          emoji: "🎯",
          description: "Perfect! Preparation maximizes the value of mentorship time",
          isCorrect: true
        },
        {
          id: "b",
          text: "Show up without any preparation",
          emoji: "😴",
          description: "Unprepared meetings waste valuable mentor time",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only ask for job opportunities",
          emoji: "💼",
          description: "Mentorship is about learning, not just job seeking",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's an important aspect of a successful mentor-mentee relationship?",
      options: [
        {
          id: "a",
          text: "Mutual respect and clear communication",
          emoji: "💬",
          description: "Exactly! Respect and communication form the foundation of mentorship",
          isCorrect: true
        },
        {
          id: "b",
          text: "The mentor doing all the talking",
          emoji: "🗣️",
          description: "Effective mentorship involves dialogue, not monologue",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never asking for feedback",
          emoji: "🔇",
          description: "Feedback is essential for growth in mentorship relationships",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can a mentee show appreciation for their mentor's time?",
      options: [
        {
          id: "a",
          text: "Follow through on advice and update them on progress",
          emoji: "📈",
          description: "Perfect! Applying lessons and sharing progress shows respect for mentorship",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never contact them again after getting advice",
          emoji: "👋",
          description: "Successful mentor relationships continue beyond initial advice",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only reach out when in crisis",
          emoji: "🚨",
          description: "Regular, positive communication strengthens mentor relationships",
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
    navigate("/student/ehe/teens/debate-learning-ends-college");
  };

  return (
    <GameShell
      title="Mentor Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-95"
      gameType="ehe"
      totalLevels={100}
      currentLevel={95}
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
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h3 className="text-2xl font-bold text-white mb-2">Mentor Story</h3>
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

export default MentorStory;