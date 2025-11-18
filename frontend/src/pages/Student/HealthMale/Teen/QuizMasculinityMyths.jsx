import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizMasculinityMyths = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is true?",
      options: [
        {
          id: "a",
          text: "Men can show emotions",
          emoji: "😊",
          description: "Expressing emotions is healthy for everyone",
          isCorrect: true
        },
        {
          id: "b",
          text: "Men must be tough always",
          emoji: "💪",
          description: "Vulnerability is also a strength",
          isCorrect: false
        },
        {
          id: "c",
          text: "Men can't be sensitive",
          emoji: "😐",
          description: "Sensitivity is a strength, not a weakness",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What defines healthy masculinity?",
      options: [
        {
          id: "a",
          text: "Respecting all people equally",
          emoji: "🤝",
          description: "Respect is a core component of healthy masculinity",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never showing weakness",
          emoji: "💪",
          description: "Asking for help shows strength",
          isCorrect: false
        },
        {
          id: "c",
          text: "Suppressing emotions",
          emoji: "😶",
          description: "Emotional expression is important for mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should men handle stress?",
      options: [
        {
          id: "a",
          text: "Talk about feelings with friends",
          emoji: "💬",
          description: "Sharing helps manage stress effectively",
          isCorrect: true
        },
        {
          id: "b",
          text: "Bottle it up inside",
          emoji: "🤐",
          description: "Expressing emotions helps manage stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it completely",
          emoji: "🤷",
          description: "Addressing stress is important for well-being",
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
    navigate("/student/health-male/teens/reflex-masculinity-check");
  };

  return (
    <GameShell
      title="Quiz on Masculinity Myths"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-62"
      gameType="health-male"
      totalLevels={70}
      currentLevel={62}
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

export default QuizMasculinityMyths;
