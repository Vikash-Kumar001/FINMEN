import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StressStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Exams are coming and you feel stressed. Should you study nonstop?",
      options: [
        {
          id: "b",
          text: "Study nonstop",
          emoji: "📚",
          description: "Nonstop studying can cause burnout and reduce focus",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take regular breaks",
          emoji: "⏸️",
          description: "Breaks help your brain rest and improve memory retention",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore exams completely",
          emoji: "😴",
          description: "Preparation is important, but balance is key",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During study breaks, what should you do?",
      options: [
        {
          id: "a",
          text: "Go for a short walk",
          emoji: "🚶",
          description: "Physical activity reduces stress and clears the mind",
          isCorrect: true
        },
        {
          id: "b",
          text: "Watch TV all break",
          emoji: "📺",
          description: "Too much screen time can increase stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Study more during breaks",
          emoji: "📖",
          description: "Breaks need to be true rest periods",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How long should study sessions be for best results?",
      options: [
        {
          id: "c",
          text: "Hours without breaks",
          emoji: "⏰",
          description: "Long sessions without breaks reduce efficiency",
          isCorrect: false
        },
        {
          id: "a",
          text: "45-60 minutes with breaks",
          emoji: "🕐",
          description: "Pomodoro technique helps maintain focus",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only when you feel like it",
          emoji: "🤷",
          description: "Consistent schedule is better for stress management",
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
    navigate("/student/health-male/teens/quiz-stress-relief");
  };

  return (
    <GameShell
      title="Stress Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-51"
      gameType="health-male"
      totalLevels={60}
      currentLevel={51}
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

export default StressStory;
