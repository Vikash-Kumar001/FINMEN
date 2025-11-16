import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizStressRelief = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which reduces stress?",
      options: [
        {
          id: "b",
          text: "Worry More",
          emoji: "😟",
          description: "Worrying increases stress levels",
          isCorrect: false
        },
        {
          id: "a",
          text: "Sleep + Exercise",
          emoji: "😴",
          description: "Sleep and exercise are proven stress relievers",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip meals",
          emoji: "🍽️",
          description: "Proper nutrition helps manage stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Best way to handle exam stress?",
      options: [
        {
          id: "a",
          text: "Regular study breaks",
          emoji: "⏸️",
          description: "Breaks prevent burnout during study sessions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Study all night",
          emoji: "🌙",
          description: "Lack of sleep increases stress and reduces performance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the exams",
          emoji: "🤷",
          description: "Proper preparation reduces exam anxiety",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps with stress before bed?",
      options: [
        {
          id: "c",
          text: "Screen time",
          emoji: "📱",
          description: "Screens can disrupt sleep and increase stress",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deep breathing exercises",
          emoji: "🫁",
          description: "Deep breathing calms the mind and promotes sleep",
          isCorrect: true
        },
        {
          id: "b",
          text: "More studying",
          emoji: "📚",
          description: "Relaxation techniques are better before bed",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does physical activity help stress?",
      options: [
        {
          id: "b",
          text: "Increases anxiety",
          emoji: "😰",
          description: "Exercise releases endorphins that reduce stress",
          isCorrect: false
        },
        {
          id: "a",
          text: "Releases feel-good chemicals",
          emoji: "😊",
          description: "Endorphins from exercise improve mood and reduce stress",
          isCorrect: true
        },
        {
          id: "c",
          text: "Makes you more tired",
          emoji: "😴",
          description: "While tiring, exercise overall reduces stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do when feeling overwhelmed?",
      options: [
        {
          id: "a",
          text: "Talk to a trusted adult",
          emoji: "💬",
          description: "Sharing concerns helps reduce stress burden",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep it all inside",
          emoji: "🤐",
          description: "Bottling emotions can worsen stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the feelings",
          emoji: "🙈",
          description: "Acknowledging feelings is important for mental health",
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
    navigate("/student/health-male/teens/reflex-stress-check");
  };

  return (
    <GameShell
      title="Quiz on Stress Relief"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-52"
      gameType="health-male"
      totalLevels={60}
      currentLevel={52}
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

export default QuizStressRelief;
