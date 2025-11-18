import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BodyImageStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel short compared to your peers. Should you feel worthless?",
      options: [
        {
          id: "a",
          text: "No, worth comes from within",
          emoji: "💪",
          description: "Self-worth is about character, not physical traits",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, height determines worth",
          emoji: "📏",
          description: "Everyone has unique qualities beyond physical appearance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Compare yourself to others",
          emoji: "👀",
          description: "Comparing leads to negative self-image",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friends are taller and you feel left out. What should you do?",
      options: [
        {
          id: "a",
          text: "Try to change your height",
          emoji: "📏",
          description: "Accepting yourself as you are is healthier",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus on your strengths",
          emoji: "⭐",
          description: "Everyone has unique talents and abilities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid social activities",
          emoji: "🏠",
          description: "Isolation worsens negative feelings",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you improve body image during puberty?",
      options: [
        {
          id: "a",
          text: "Compare to social media",
          emoji: "📱",
          description: "Social media often shows unrealistic standards",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus only on appearance",
          emoji: "🪞",
          description: "Body image includes mental and emotional health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Practice self-acceptance",
          emoji: "❤️",
          description: "Accepting changes and focusing on health is key",
          isCorrect: true
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
    navigate("/student/health-male/teens/boys-should-not-cry-debate");
  };

  return (
    <GameShell
      title="Body Image Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-55"
      gameType="health-male"
      totalLevels={60}
      currentLevel={55}
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

export default BodyImageStory;
