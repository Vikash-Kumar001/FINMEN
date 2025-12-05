import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoutineStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: "You wake up late every day for school. Should you fix your routine?",
      options: [
        {
          id: "a",
          text: "Keep sleeping late",
          emoji: "😴",
          description: "Late wake-ups cause stress and poor performance",
          isCorrect: false
        },
        {
          id: "b",
          text: "Set alarm earlier",
          emoji: "⏰",
          description: "Early routine allows time for healthy breakfast and preparation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Yes, create consistent schedule",
          emoji: "📅",
          description: "Consistent routine improves health and school performance",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What should be part of your morning routine?",
      options: [
          {
          id: "a",
          text: "Healthy breakfast + exercise",
          emoji: "🥣",
          description: "Good nutrition and movement start the day right",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip breakfast",
          emoji: "🍽️",
          description: "Breakfast provides energy for the day",
          isCorrect: false
        },
      
        {
          id: "c",
          text: "Only check phone",
          emoji: "📱",
          description: "Healthy habits should come before screens",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does a consistent routine help teens?",
      options: [
        {
          id: "a",
          text: "Makes life boring",
          emoji: "😴",
          description: "Routine provides structure and reduces stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Improves time management",
          emoji: "⏱️",
          description: "Good routines help manage time effectively",
          isCorrect: true
        },
        {
          id: "b",
          text: "Limits freedom",
          emoji: "🔒",
          description: "Healthy routines actually increase freedom",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What happens when you maintain a healthy routine?",
      options: [
        {
          id: "b",
          text: "More stress",
          emoji: "😰",
          description: "Consistent routines reduce daily stress",
          isCorrect: false
        },
        {
          id: "a",
          text: "Better sleep and energy",
          emoji: "😊",
          description: "Regular schedule improves sleep quality and energy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Less social time",
          emoji: "👥",
          description: "Good routines include time for friends and activities",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should you start building a healthy routine?",
      options: [
        {
          id: "c",
          text: "Small changes gradually",
          emoji: "🌱",
          description: "Small, consistent changes build lasting habits",
          isCorrect: true
        },
        {
          id: "a",
          text: "Change everything at once",
          emoji: "💥",
          description: "Gradual changes are more sustainable",
          isCorrect: false
        },
        {
          id: "b",
          text: "Copy friend's routine",
          emoji: "👤",
          description: "Personalized routines work best",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (gameFinished) return;

    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/quiz-teen-habits");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Routine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-91"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {currentQ.text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map(option => (
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

export default RoutineStory;
