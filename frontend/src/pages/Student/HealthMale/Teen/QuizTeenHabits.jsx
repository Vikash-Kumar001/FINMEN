import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizTeenHabits = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which supports health?",
      options: [
        {
          id: "b",
          text: "Sleep + balanced diet",
          emoji: "😴",
          description: "Sleep and nutrition are essential for teen health",
          isCorrect: true
        },
        {
          id: "a",
          text: "Skipping meals",
          emoji: "🍽️",
          description: "Regular meals provide necessary nutrients",
          isCorrect: false
        },
        {
          id: "c",
          text: "Staying up all night",
          emoji: "🌙",
          description: "Sleep is crucial for growth and development",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a healthy teen habit for mental health?",
      options: [
        {
          id: "a",
          text: "Regular exercise",
          emoji: "🏃",
          description: "Physical activity improves mood and reduces stress",
          isCorrect: true
        },
        {
          id: "c",
          text: "Social media all day",
          emoji: "📱",
          description: "Too much screen time can harm mental health",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skipping school",
          emoji: "🏫",
          description: "Education is important for future success",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does a consistent bedtime help teens?",
      options: [
        {
          id: "b",
          text: "Better school performance",
          emoji: "📚",
          description: "Good sleep improves focus and learning",
          isCorrect: true
        },
        {
          id: "c",
          text: "More time for TV",
          emoji: "📺",
          description: "Quality sleep is more important than screen time",
          isCorrect: false
        },
        {
          id: "a",
          text: "No difference",
          emoji: "🤷",
          description: "Regular sleep schedule improves health",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is important for teen physical health?",
      options: [
        {
          id: "a",
          text: "Daily movement and activity",
          emoji: "🏃",
          description: "Regular exercise maintains physical fitness",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only eating junk food",
          emoji: "🍔",
          description: "Balanced nutrition supports physical health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all sports",
          emoji: "⚽",
          description: "Physical activity is essential for health",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should teens manage screen time?",
      options: [
        {
          id: "b",
          text: "No limits needed",
          emoji: "📱",
          description: "Too much screen time affects sleep and health",
          isCorrect: false
        },
        {
          id: "a",
          text: "Set healthy limits",
          emoji: "⏰",
          description: "Balanced screen time supports healthy development",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only use screens",
          emoji: "💻",
          description: "Real activities are important for health",
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
    navigate("/student/health-male/teens/reflex-teen-routine");
  };

  return (
    <GameShell
      title="Quiz on Teen Habits"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-92"
      gameType="health-male"
      totalLevels={100}
      currentLevel={92}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
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

export default QuizTeenHabits;
