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
      text: "Exams are coming up. What's the best approach to manage stress?",
      options: [
        {
          id: "a",
          text: "Plan regular breaks and study schedule",
          emoji: "📅",
          description: "Balanced approach prevents burnout and maintains focus",
          isCorrect: true
        },
        {
          id: "b",
          text: "Panic and study all night",
          emoji: "😰",
          description: "This leads to exhaustion and reduced performance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the exams completely",
          emoji: "😴",
          description: "Avoidance increases stress and leads to poor results",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During exam preparation, how should you handle difficult topics?",
      options: [
        {
          id: "a",
          text: "Break them into smaller parts and tackle one at a time",
          emoji: "🧩",
          description: "Makes complex topics more manageable",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip them and hope they don't appear",
          emoji: "❌",
          description: "This leaves knowledge gaps and increases anxiety",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spend all time on difficult topics only",
          emoji: "⏳",
          description: "Neglects other important areas",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you maintain energy during long study sessions?",
      options: [
        {
          id: "a",
          text: "Take short breaks, stay hydrated, and eat healthy snacks",
          emoji: "💧",
          description: "Maintains focus and prevents mental fatigue",
          isCorrect: true
        },
        {
          id: "b",
          text: "Drink lots of caffeine and skip meals",
          emoji: "☕",
          description: "Leads to energy crashes and reduced concentration",
          isCorrect: false
        },
        {
          id: "c",
          text: "Study continuously without any breaks",
          emoji: "📚",
          description: "Causes burnout and decreases retention",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if you feel overwhelmed during exams?",
      options: [
        {
          id: "a",
          text: "Practice deep breathing and positive self-talk",
          emoji: "🧘",
          description: "Calms the mind and reduces anxiety",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give up and stop trying",
          emoji: "🏳️",
          description: "Quitting prevents learning and growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Compare yourself to others constantly",
          emoji: "👥",
          description: "Increases stress and reduces confidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After exams, how should you evaluate your performance?",
      options: [
        {
          id: "a",
          text: "Reflect on what went well and areas for improvement",
          emoji: "🤔",
          description: "Promotes growth and better preparation next time",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only focus on mistakes and feel bad",
          emoji: "😞",
          description: "Negative focus affects confidence and motivation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Don't think about it at all",
          emoji: "🙈",
          description: "Missing opportunities to learn from experience",
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
    navigate("/student/health-female/teens/quiz-stress-relief");
  };

  return (
    <GameShell
      title="Stress Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-51"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
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