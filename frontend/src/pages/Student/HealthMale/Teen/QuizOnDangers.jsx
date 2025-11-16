import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnDangers = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Smoking causes?",
      options: [
        {
          id: "a",
          text: "Stronger lungs",
          emoji: "🫁",
          description: "Smoking actually damages lungs severely",
          isCorrect: false
        },
        {
          id: "b",
          text: "Cancer",
          emoji: "🦠",
          description: "Smoking is a leading cause of various cancers",
          isCorrect: true
        },
        {
          id: "c",
          text: "Healthy teeth",
          emoji: "🦷",
          description: "Smoking stains teeth and causes gum disease",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens to your heart when you smoke?",
      options: [
        {
          id: "c",
          text: "Gets stronger",
          emoji: "❤️",
          description: "Smoking weakens heart and increases disease risk",
          isCorrect: false
        },
        {
          id: "a",
          text: "Higher risk of heart disease",
          emoji: "💔",
          description: "Smoking damages blood vessels and heart",
          isCorrect: true
        },
        {
          id: "b",
          text: "No effect",
          emoji: "😐",
          description: "Smoking has many negative heart effects",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does alcohol affect the liver?",
      options: [
        {
          id: "a",
          text: "Makes it healthier",
          emoji: "🫀",
          description: "Alcohol causes liver damage and disease",
          isCorrect: false
        },
        {
          id: "b",
          text: "Causes liver damage",
          emoji: "🩹",
          description: "Heavy drinking leads to liver cirrhosis",
          isCorrect: true
        },
        {
          id: "c",
          text: "No effect on liver",
          emoji: "✅",
          description: "Alcohol is processed by the liver",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What does drug use do to the brain?",
      options: [
        {
          id: "b",
          text: "Improves brain function",
          emoji: "🧠",
          description: "Drugs alter brain chemistry negatively",
          isCorrect: false
        },
        {
          id: "a",
          text: "Changes brain chemistry",
          emoji: "⚗️",
          description: "Drugs can cause permanent brain damage",
          isCorrect: true
        },
        {
          id: "c",
          text: "No brain effects",
          emoji: "🤷",
          description: "All drugs affect brain function",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why should teens avoid substance use?",
      options: [
        {
          id: "c",
          text: "Only adults can handle it",
          emoji: "👨‍🦳",
          description: "Substances harm developing teen bodies more",
          isCorrect: false
        },
        {
          id: "a",
          text: "Affects brain development",
          emoji: "🧠",
          description: "Teen brains are still developing and vulnerable",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's not cool",
          emoji: "😎",
          description: "Health risks are the main concern",
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
    navigate("/student/health-male/teens/reflex-teen-choice");
  };

  return (
    <GameShell
      title="Quiz on Dangers"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-82"
      gameType="health-male"
      totalLevels={90}
      currentLevel={82}
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

export default QuizOnDangers;
