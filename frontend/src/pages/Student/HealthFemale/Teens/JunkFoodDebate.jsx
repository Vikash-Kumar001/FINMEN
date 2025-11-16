import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JunkFoodDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is it okay to eat junk food once in a while?",
      options: [
        {
          id: "a",
          text: "Yes, in moderation with a balanced diet",
          emoji: "👍",
          description: "Occasional treats are okay if overall diet is healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, never eat junk food",
          emoji: "👎",
          description: "Complete restriction can lead to unhealthy relationships with food",
          isCorrect: false
        },
        {
          id: "c",
          text: "Yes, as much as you want",
          emoji: "🍟",
          description: "Excessive junk food leads to health issues",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the problem with eating junk food daily?",
      options: [
        {
          id: "a",
          text: "No problems, it's tasty",
          emoji: "😋",
          description: "Daily junk food has serious health consequences",
          isCorrect: false
        },
        {
          id: "b",
          text: "Lacks nutrients and causes health issues",
          emoji: "⚠️",
          description: "Daily junk food leads to obesity, poor nutrition, and health problems",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only expensive",
          emoji: "💰",
          description: "Cost is not the main issue with junk food",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you enjoy treats while staying healthy?",
      options: [
        {
          id: "a",
          text: "Eat treats on special occasions only",
          emoji: "🎉",
          description: "Special occasions make treats more enjoyable and less routine",
          isCorrect: true
        },
        {
          id: "b",
          text: "Replace all meals with treats",
          emoji: "🍔",
          description: "This would be unhealthy and unbalanced",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never allow yourself treats",
          emoji: "🚫",
          description: "Complete restriction often leads to binging later",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's a better approach to food choices?",
      options: [
        {
          id: "a",
          text: "Balance 80% healthy, 20% treats",
          emoji: "⚖️",
          description: "This allows for both nutrition and enjoyment",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only eat what tastes good",
          emoji: "👅",
          description: "Taste alone doesn't ensure nutritional needs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only eat what's healthy, no exceptions",
          emoji: "🥦",
          description: "Too restrictive and may lead to unhealthy relationships with food",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to understand moderation?",
      options: [
        {
          id: "a",
          text: "Helps develop a healthy relationship with food",
          emoji: "🧠",
          description: "Moderation teaches balance and self-control",
          isCorrect: true
        },
        {
          id: "b",
          text: "Allows unlimited junk food consumption",
          emoji: "🍟",
          description: "Moderation doesn't mean unlimited consumption",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes you eat less healthy food",
          emoji: "📉",
          description: "Moderation is about balance, not just eating less",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/health-female/teens/food-choices-journal");
  };

  return (
    <GameShell
      title="Debate: Junk Food Sometimes?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="health-female-teen-16"
      gameType="health-female"
      totalLevels={20}
      currentLevel={16}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Junk Food Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default JunkFoodDebate;