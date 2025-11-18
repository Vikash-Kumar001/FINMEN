import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthCheckStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen feels dizzy often. Should she visit a doctor?",
      options: [
        {
          id: "a",
          text: "Yes, dizziness can indicate health issues",
          emoji: "🏥",
          description: "Regular checkups help detect problems early",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's normal during teenage years",
          emoji: "🔄",
          description: "Persistent dizziness should be evaluated",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if it gets worse",
          emoji: "⏳",
          description: "Early intervention prevents complications",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should teens have health checkups?",
      options: [
        {
          id: "a",
          text: "Only when sick",
          emoji: "🤒",
          description: "This misses opportunities for prevention",
          isCorrect: false
        },
        {
          id: "b",
          text: "Once a year for preventive care",
          emoji: "📅",
          description: "Annual checkups monitor growth and development",
          isCorrect: true
        },
        {
          id: "c",
          text: "Every month",
          emoji: "🔁",
          description: "This is excessive for healthy teens",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you discuss during a health checkup?",
      options: [
        {
          id: "a",
          text: "Only physical symptoms",
          emoji: "💪",
          description: "Limited discussion misses important issues",
          isCorrect: false
        },
        {
          id: "b",
          text: "Physical, mental, and social health concerns",
          emoji: "🧠",
          description: "Comprehensive care addresses all aspects of well-being",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing - just let the doctor decide",
          emoji: "🤐",
          description: "Active participation improves care quality",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to be honest with your doctor?",
      options: [
        {
          id: "a",
          text: "To avoid embarrassment",
          emoji: "😳",
          description: "Honesty is essential for proper diagnosis",
          isCorrect: false
        },
        {
          id: "b",
          text: "To get accurate diagnosis and treatment",
          emoji: "✅",
          description: "Truthful information enables effective care",
          isCorrect: true
        },
        {
          id: "c",
          text: "To impress the doctor",
          emoji: "🤩",
          description: "Medical care is about health, not approval",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if you're nervous about a doctor visit?",
      options: [
        {
          id: "a",
          text: "Skip the appointment",
          emoji: "🏃",
          description: "Avoidance can worsen health problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Bring a parent or trusted adult for support",
          emoji: "👨‍👩‍👧",
          description: "Support helps reduce anxiety and improves communication",
          isCorrect: true
        },
        {
          id: "c",
          text: "Lie about symptoms",
          emoji: "🤥",
          description: "Dishonesty prevents proper treatment",
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
    navigate("/student/health-female/teens/quiz-preventive-health");
  };

  return (
    <GameShell
      title="Health Check Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-71"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
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

export default HealthCheckStory;