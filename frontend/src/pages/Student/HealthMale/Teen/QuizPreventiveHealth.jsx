import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizPreventiveHealth = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is preventive care?",
      options: [
        {
          id: "a",
          text: "Treating symptoms after they appear",
          emoji: "💊",
          description: "Preventive care happens before problems start",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignoring fever until it worsens",
          emoji: "🤒",
          description: "Preventive care addresses health before issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Getting vaccines",
          emoji: "💉",
          description: "Vaccines prevent diseases before they occur",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What is the main goal of preventive healthcare?",
      options: [
        {
          id: "b",
          text: "Treat existing diseases",
          emoji: "🏥",
          description: "Preventive care focuses on stopping problems before they start",
          isCorrect: false
        },
        {
          id: "a",
          text: "Prevent health problems",
          emoji: "🛡️",
          description: "Prevention is better than treatment",
          isCorrect: true
        },
        {
          id: "c",
          text: "Emergency care only",
          emoji: "🚑",
          description: "Preventive care includes regular checkups",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How often should teens get dental checkups?",
      options: [
        {
          id: "c",
          text: "Every 2-3 years",
          emoji: "⏰",
          description: "Regular dental care prevents major issues",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every 6 months",
          emoji: "🦷",
          description: "Twice-yearly cleanings maintain oral health",
          isCorrect: true
        },
        {
          id: "a",
          text: "Only when in pain",
          emoji: "😬",
          description: "Preventive dental care is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which preventive measure helps mental health?",
      options: [
        {
          id: "a",
          text: "Regular exercise routine",
          emoji: "🏃",
          description: "Physical activity improves mental well-being",
          isCorrect: true
        },
        {
          id: "c",
          text: "Isolating when stressed",
          emoji: "🏠",
          description: "Social connections help mental health",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignoring emotions",
          emoji: "😶",
          description: "Expressing emotions is healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should teens do for preventive eye care?",
      options: [
        {
          id: "b",
          text: "Regular eye exams",
          emoji: "👁️",
          description: "Eye exams detect vision problems early",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only wear glasses when needed",
          emoji: "👓",
          description: "Preventive eye care includes regular checkups",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ignore vision changes",
          emoji: "🙈",
          description: "Early detection prevents vision problems",
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
    navigate("/student/health-male/teens/reflex-preventive-health");
  };

  return (
    <GameShell
      title="Quiz on Preventive Health"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-72"
      gameType="health-male"
      totalLevels={80}
      currentLevel={72}
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

export default QuizPreventiveHealth;
