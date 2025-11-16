import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MasculinityStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: 'Teen hears "Real men don\'t cry." Should he believe?',
      options: [
        {
          id: "c",
          text: "Yes, crying is weak",
          emoji: "💪",
          description: "Emotions are human and healthy to express",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, feelings are human",
          emoji: "❤️",
          description: "Everyone has emotions and expressing them is healthy",
          isCorrect: true
        },
        {
          id: "a",
          text: "Only in private",
          emoji: "🏠",
          description: "It's okay to express emotions when needed",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What makes a real man according to healthy standards?",
      options: [
        {
          id: "a",
          text: "Being tough always",
          emoji: "💪",
          description: "Real strength includes kindness and emotional intelligence",
          isCorrect: false
        },
        {
          id: "c",
          text: "Showing respect to others",
          emoji: "🤝",
          description: "Respect and kindness are key traits of healthy masculinity",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never showing emotions",
          emoji: "😐",
          description: "Suppressing emotions can harm mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should teens respond to toxic masculinity messages?",
      options: [
        {
          id: "b",
          text: "Accept them as truth",
          emoji: "✅",
          description: "Question and challenge harmful stereotypes",
          isCorrect: false
        },
        {
          id: "a",
          text: "Question and learn healthy alternatives",
          emoji: "🧠",
          description: "Learning about healthy masculinity promotes positive growth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them completely",
          emoji: "🤷",
          description: "Understanding helps form healthy beliefs",
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
    navigate("/student/health-male/teens/quiz-masculinity-myths");
  };

  return (
    <GameShell
      title="Masculinity Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-61"
      gameType="health-male"
      totalLevels={70}
      currentLevel={61}
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

export default MasculinityStory;
