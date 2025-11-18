import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebatePeriodHygieneSchools = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should schools teach period hygiene openly?",
      options: [
        {
          id: "a",
          text: "Yes, with respect and scientific accuracy",
          emoji: "✅",
          description: "Open education reduces stigma and promotes health",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's a private family matter",
          emoji: "🔒",
          description: "Many families may not provide adequate education",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only to female students",
          emoji: "🚺",
          description: "Males should also understand to reduce stigma",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should schools handle period hygiene education?",
      options: [
        {
          id: "a",
          text: "Include all genders with scientific facts",
          emoji: "📚",
          description: "Inclusive education promotes understanding and empathy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only through female teachers",
          emoji: "👩‍🏫",
          description: "This may reinforce gender segregation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid the topic completely",
          emoji: "🤫",
          description: "Avoidance perpetuates stigma and misinformation",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Should schools provide period products?",
      options: [
        {
          id: "a",
          text: "Yes, ensure all students have access",
          emoji: "🩹",
          description: "Access prevents absenteeism and reduces inequality",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, families should provide them",
          emoji: "🏠",
          description: "Economic barriers may prevent access for some students",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only for wealthy students",
          emoji: "💰",
          description: "This increases inequality and stigma",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can schools create a supportive environment?",
      options: [
        {
          id: "a",
          text: "Private spaces and understanding policies",
          emoji: "🚪",
          description: "Privacy and flexibility reduce stress and embarrassment",
          isCorrect: true
        },
        {
          id: "b",
          text: "Public announcements about periods",
          emoji: "📢",
          description: "This may cause embarrassment for students",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore period-related absences",
          emoji: "❌",
          description: "This may increase dropout rates among affected students",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the benefit of inclusive period education?",
      options: [
        {
          id: "a",
          text: "Reduces stigma and improves health outcomes",
          emoji: "🌟",
          description: "Education leads to better health practices and social acceptance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Creates unnecessary attention to the topic",
          emoji: "📢",
          description: "Proper education is essential for health and well-being",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only benefits female students",
          emoji: "🚺",
          description: "All students benefit from understanding and empathy",
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
    navigate("/student/health-female/teens/journal-teen-hygiene");
  };

  return (
    <GameShell
      title="Debate: Period Hygiene in Schools"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-46"
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

export default DebatePeriodHygieneSchools;