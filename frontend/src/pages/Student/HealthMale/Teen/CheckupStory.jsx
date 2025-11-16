import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CheckupStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel weak often and tired all the time. What should you do?",
      options: [
        {
          id: "c",
          text: "Ignore it and push through",
          emoji: "💪",
          description: "Ignoring symptoms can lead to bigger health problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Schedule a health checkup",
          emoji: "🏥",
          description: "Regular checkups help identify and prevent health issues",
          isCorrect: true
        },
        {
          id: "a",
          text: "Just rest more",
          emoji: "😴",
          description: "While rest helps, professional checkup is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "At the doctor's office, you're nervous. How do you respond?",
      options: [
        {
          id: "a",
          text: "Be honest about symptoms",
          emoji: "💬",
          description: "Honesty helps doctors give proper diagnosis",
          isCorrect: true
        },
        {
          id: "c",
          text: "Downplay your concerns",
          emoji: "😅",
          description: "Being open helps get the right treatment",
          isCorrect: false
        },
        {
          id: "b",
          text: "Leave without talking",
          emoji: "🚪",
          description: "Communication is key for good healthcare",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Doctor recommends follow-up tests. What's the best approach?",
      options: [
        {
          id: "b",
          text: "Follow all recommendations",
          emoji: "✅",
          description: "Following medical advice prevents complications",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip some tests",
          emoji: "🤷",
          description: "All tests are important for complete health picture",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ignore recommendations",
          emoji: "❌",
          description: "Professional advice should be followed for health",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How often should teens get routine checkups?",
      options: [
        {
          id: "c",
          text: "Only when sick",
          emoji: "🤒",
          description: "Preventive checkups catch issues early",
          isCorrect: false
        },
        {
          id: "a",
          text: "Annually for preventive care",
          emoji: "📅",
          description: "Regular checkups help maintain good health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Every few years",
          emoji: "⏰",
          description: "More frequent checkups are better for teens",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After checkup, doctor gives health tips. What should you do?",
      options: [
        {
          id: "a",
          text: "Follow the advice immediately",
          emoji: "💯",
          description: "Implementing healthy changes improves well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wait and see",
          emoji: "⏳",
          description: "Acting on advice prevents future issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the suggestions",
          emoji: "🙈",
          description: "Professional advice should be valued",
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
    navigate("/student/health-male/teens/quiz-preventive-health");
  };

  return (
    <GameShell
      title="Checkup Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-71"
      gameType="health-male"
      totalLevels={80}
      currentLevel={71}
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

export default CheckupStory;
