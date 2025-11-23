import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HigherEducationStory = () => {
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
      text: "A teen wants to become a doctor. What should she focus on in high school?",
      options: [
        {
          id: "a",
          text: "Only arts and literature",
          emoji: "📚",
          description: "While communication skills are important, science subjects are essential for medical careers",
          isCorrect: false
        },
        {
          id: "b",
          text: "Science subjects like biology and chemistry",
          emoji: "🔬",
          description: "Perfect! Strong foundations in science are crucial for medical school preparation",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only physical education",
          emoji: "🏃",
          description: "Physical fitness is helpful but not the primary focus for medical career preparation",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the first step toward becoming a doctor after high school?",
      options: [
        {
          id: "a",
          text: "Get a job at a hospital",
          emoji: "🏥",
          description: "Hospital jobs require prior education and training in the medical field",
          isCorrect: false
        },
        {
          id: "b",
          text: "Study medicine in college",
          emoji: "🎓",
          description: "Exactly! Medical school is the essential next step after completing pre-med requirements",
          isCorrect: true
        },
        {
          id: "c",
          text: "Start a medical business",
          emoji: "💼",
          description: "Medical practice requires extensive education and licensing before starting a business",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is it important to maintain good grades in pre-med courses?",
      options: [
        {
          id: "a",
          text: "To qualify for competitive medical programs",
          emoji: "🏆",
          description: "Correct! Medical schools are highly competitive and require excellent academic performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "To avoid studying hard subjects",
          emoji: "😴",
          description: "Good grades require dedicated study, not avoidance of challenging subjects",
          isCorrect: false
        },
        {
          id: "c",
          text: "To skip medical school entrance exams",
          emoji: "📋",
          description: "Medical school entrance exams are required regardless of undergraduate grades",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What extracurricular activities would help a teen aspiring to be a doctor?",
      options: [
        {
          id: "a",
          text: "Volunteering at hospitals or clinics",
          emoji: "❤️",
          description: "Perfect! Healthcare volunteering provides experience and demonstrates commitment to the field",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only playing video games",
          emoji: "🎮",
          description: "While some skills transfer, medical careers require interpersonal and healthcare experience",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all social activities",
          emoji: "👻",
          description: "Medical professionals need strong communication skills developed through social interaction",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How long does it typically take to become a practicing doctor?",
      options: [
        {
          id: "a",
          text: "4 years of college + 4 years of medical school + residency",
          emoji: "📅",
          description: "Exactly! Becoming a doctor requires extensive education and training, typically 11-15 years",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just 2 years of training",
          emoji: "⏱️",
          description: "Medical careers require much more extensive education than most professions",
          isCorrect: false
        },
        {
          id: "c",
          text: "No formal education needed",
          emoji: "❌",
          description: "Medical practice requires rigorous education, licensing, and ongoing professional development",
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
    navigate("/student/ehe/teens/quiz-teen-paths");
  };

  return (
    <GameShell
      title="Higher Education Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-51"
      gameType="ehe"
      totalLevels={60}
      currentLevel={51}
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
            <div className="text-5xl mb-4">🏥</div>
            <h3 className="text-2xl font-bold text-white mb-2">Medical Career Path</h3>
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

export default HigherEducationStory;