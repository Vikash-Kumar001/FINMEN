import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateDoctorFear = () => {
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
      text: "Are doctor visits primarily scary or safe for teens?",
      options: [
        {
          id: "a",
          text: "Safe - doctors help maintain health",
          emoji: "🛡️",
          description: "Medical professionals are trained to help patients",
          isCorrect: true
        },
        {
          id: "b",
          text: "Scary - doctors might deliver bad news",
          emoji: "😨",
          description: "While anxiety is normal, fear shouldn't prevent care",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both equally - it depends on the situation",
          emoji: "⚖️",
          description: "Safety and professional care are primary benefits",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the main purpose of a doctor's visit?",
      options: [
        {
          id: "a",
          text: "To find problems and keep you healthy",
          emoji: "🔍",
          description: "Prevention and maintenance are key medical goals",
          isCorrect: true
        },
        {
          id: "b",
          text: "To make you anxious about your health",
          emoji: "😰",
          description: "Anxiety is a side effect, not the purpose",
          isCorrect: false
        },
        {
          id: "c",
          text: "To spend money on unnecessary tests",
          emoji: "💸",
          description: "Medical care focuses on health, not profit",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you reduce anxiety about doctor visits?",
      options: [
        {
          id: "a",
          text: "Bring a trusted adult for support",
          emoji: "👨‍👩‍👧",
          description: "Support helps reduce anxiety and improve communication",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid doctors completely",
          emoji: "🏃",
          description: "Avoidance can lead to serious health problems",
          isCorrect: false
        },
        {
          id: "c",
          text: "Don't tell the doctor about symptoms",
          emoji: "🤐",
          description: "Honesty is essential for proper care",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you expect during a routine checkup?",
      options: [
        {
          id: "a",
          text: "Professional, respectful care focused on your health",
          emoji: "👩‍⚕️",
          description: "Medical professionals are trained to be helpful and respectful",
          isCorrect: true
        },
        {
          id: "b",
          text: "Judgment about your lifestyle choices",
          emoji: "🤨",
          description: "Doctors provide guidance without personal judgment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Painful or uncomfortable procedures",
          emoji: "😣",
          description: "Routine visits typically involve minimal discomfort",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to overcome fear of doctors?",
      options: [
        {
          id: "a",
          text: "To maintain good health throughout life",
          emoji: "🌟",
          description: "Regular care prevents and manages health issues",
          isCorrect: true
        },
        {
          id: "b",
          text: "To prove you're brave to friends",
          emoji: "💪",
          description: "Health benefits are more important than social approval",
          isCorrect: false
        },
        {
          id: "c",
          text: "Because doctors insist on it",
          emoji: "😤",
          description: "Medical care is about personal health benefits",
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
    navigate("/student/health-female/teens/journal-doctor-visits");
  };

  return (
    <GameShell
      title="Debate: Doctor Fear"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-76"
      gameType="health-female"
      totalLevels={10}
      currentLevel={6}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
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

export default DebateDoctorFear;