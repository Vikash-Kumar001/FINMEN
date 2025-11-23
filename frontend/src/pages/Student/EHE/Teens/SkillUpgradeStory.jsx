import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SkillUpgradeStory = () => {
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
      text: "A teen wants a promotion at work. Should she learn new skills to qualify?",
      options: [
        {
          id: "b",
          text: "No, she should wait for others to notice her",
          emoji: "⏳",
          description: "Waiting passively rarely leads to career advancement",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, upgrading skills increases promotion chances",
          emoji: "📈",
          description: "Perfect! Continuous skill development makes you more valuable to employers",
          isCorrect: true
        },
        {
          id: "c",
          text: "No, skills don't matter in the workplace",
          emoji: "❌",
          description: "Skills are essential for career growth and job performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which approach is best for identifying skills to develop?",
      options: [
        {
          id: "a",
          text: "Analyze job requirements and industry trends",
          emoji: "🔍",
          description: "Exactly! Understanding market needs helps prioritize relevant skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "Copy what friends are learning",
          emoji: "👥",
          description: "What works for others may not align with your career goals",
          isCorrect: false
        },
        {
          id: "c",
          text: "Learn only what's comfortable",
          emoji: "🛋️",
          description: "Growth requires stepping out of comfort zones",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can a teen effectively learn new skills?",
      options: [
        {
          id: "a",
          text: "Combine online courses, practice, and mentorship",
          emoji: "📚",
          description: "Perfect! Multiple learning approaches reinforce skill development",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only read about skills without practicing",
          emoji: "📖",
          description: "Practical application is crucial for skill mastery",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all learning platforms",
          emoji: "🚫",
          description: "Various learning resources can accelerate skill development",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the benefit of regularly upgrading skills?",
      options: [
        {
          id: "b",
          text: "More stress and workload",
          emoji: "😰",
          description: "While learning can be challenging, it ultimately reduces career anxiety",
          isCorrect: false
        },
        {
          id: "c",
          text: "Less need for work-life balance",
          emoji: "⚖️",
          description: "Skill development should enhance, not compromise, work-life balance",
          isCorrect: false
        },
        {
          id: "a",
          text: "Increased job security and career opportunities",
          emoji: "🛡️",
          description: "Exactly! Adaptable workers are valued in changing job markets",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "How should a teen balance current job responsibilities with skill development?",
      options: [
        {
          id: "a",
          text: "Dedicate specific time for learning while maintaining job performance",
          emoji: "⏰",
          description: "Perfect! Structured time management ensures both areas improve",
          isCorrect: true
        },
        {
          id: "b",
          text: "Neglect job duties to focus only on learning",
          emoji: "📉",
          description: "Current job performance is essential for career advancement",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all skill development to focus only on current work",
          emoji: "🔄",
          description: "Stagnation limits long-term career potential",
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
    navigate("/student/ehe/teens/quiz-career-growth");
  };

  return (
    <GameShell
      title="Skill Upgrade Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-91"
      gameType="ehe"
      totalLevels={100}
      currentLevel={91}
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
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">Skill Upgrade Story</h3>
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

export default SkillUpgradeStory;