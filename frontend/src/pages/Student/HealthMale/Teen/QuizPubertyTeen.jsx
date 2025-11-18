import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizPubertyTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which of these is a sign of puberty?",
      options: [
        {
          id: "a",
          text: "Getting taller",
          emoji: "📏",
          description: "Growth spurts are a common puberty sign",
          isCorrect: true
        },
        {
          id: "b",
          text: "Staying the same height",
          emoji: "📐",
          description: "Most teens experience growth during puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Getting shorter",
          emoji: "📉",
          description: "Teens usually grow taller, not shorter",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What causes voice changes during puberty?",
      options: [
        {
          id: "c",
          text: "Hormones",
          emoji: "🧬",
          description: "Hormones cause voice deepening in teen boys",
          isCorrect: true
        },
        {
          id: "a",
          text: "Drinking too much soda",
          emoji: "🥤",
          description: "Voice changes are due to natural hormone changes",
          isCorrect: false
        },
        {
          id: "b",
          text: "Talking too much",
          emoji: "🗣️",
          description: "Voice cracks happen due to growing vocal cords",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why do teens sweat more during puberty?",
      options: [
        {
          id: "a",
          text: "More sweat glands activate",
          emoji: "💧",
          description: "Puberty activates more sweat glands for temperature control",
          isCorrect: true
        },
        {
          id: "b",
          text: "They exercise less",
          emoji: "🛋️",
          description: "Increased sweating is due to hormonal changes",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's just temporary weather",
          emoji: "🌤️",
          description: "Sweating is a normal puberty response",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do when you notice puberty changes?",
      options: [
        {
          id: "b",
          text: "Learn about them positively",
          emoji: "📖",
          description: "Understanding puberty helps you feel confident",
          isCorrect: true
        },
        {
          id: "c",
          text: "Try to hide all changes",
          emoji: "🙈",
          description: "It's normal to talk about puberty with trusted adults",
          isCorrect: false
        },
        {
          id: "a",
          text: "Worry that something's wrong",
          emoji: "😰",
          description: "Puberty changes are normal and happen to everyone",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How long does puberty usually last?",
      options: [
        {
          id: "a",
          text: "2-5 years",
          emoji: "⏰",
          description: "Puberty typically takes several years to complete",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only a few months",
          emoji: "🗓️",
          description: "Puberty is a gradual process over years",
          isCorrect: false
        },
        {
          id: "c",
          text: "It happens overnight",
          emoji: "🌙",
          description: "Changes happen gradually over time",
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
    navigate("/student/health-male/teens/reflex-puberty-check-teen");
  };

  return (
    <GameShell
      title="Quiz on Puberty (Teen)"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 3}
      gameId="health-male-teen-22"
      gameType="health-male"
      totalLevels={100}
      currentLevel={22}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 22/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 3}</span>
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

export default QuizPubertyTeen;
