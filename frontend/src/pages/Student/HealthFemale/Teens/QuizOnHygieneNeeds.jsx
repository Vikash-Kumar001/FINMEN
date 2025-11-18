import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnHygieneNeeds = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What helps prevent body odor during puberty?",
      options: [
        {
          id: "a",
          text: "Bathing regularly",
          emoji: "🛁",
          description: "Regular bathing removes sweat and bacteria that cause body odor",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skipping bath completely",
          emoji: "😅",
          description: "Skipping baths allows bacteria to build up, causing odor",
          isCorrect: false
        },
        {
          id: "c",
          text: "Using only perfume",
          emoji: "🌸",
          description: "Perfume only masks smell but doesn't solve the root cause",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During menstruation, how often should you change sanitary pads?",
      options: [
        {
          id: "a",
          text: "Only when completely soaked",
          emoji: "🌊",
          description: "Waiting too long increases infection risk and odor",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every 4-6 hours or when soiled",
          emoji: "⏰",
          description: "Regular changing prevents bacterial growth and odor",
          isCorrect: true
        },
        {
          id: "c",
          text: "Once a day is enough",
          emoji: "📅",
          description: "Once daily is not sufficient during menstruation",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best way to care for oily skin during puberty?",
      options: [
        {
          id: "a",
          text: "Scrubbing vigorously",
          emoji: "🔥",
          description: "Harsh scrubbing can irritate skin and increase oil production",
          isCorrect: false
        },
        {
          id: "b",
          text: "Using harsh soaps",
          emoji: "🧼",
          description: "Harsh soaps can strip natural oils and cause more oil production",
          isCorrect: false
        },
        {
          id: "c",
          text: "Gentle face washing twice daily",
          emoji: "🧴",
          description: "Gentle cleansing removes excess oil without irritating skin",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to wash your hair regularly during puberty?",
      options: [
        {
          id: "a",
          text: "Hair grows faster and needs cleaning",
          emoji: "⏱️",
          description: "Hair growth speed doesn't determine washing frequency",
          isCorrect: false
        },
        {
          id: "b",
          text: "Oil and sweat increase, requiring more frequent washing",
          emoji: "💇",
          description: "Hormonal changes increase oil production, making hair oilier",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's not necessary to wash hair more often",
          emoji: "❌",
          description: "Regular washing prevents oil buildup and scalp issues",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best approach to intimate hygiene during puberty?",
      options: [
        {
          id: "a",
          text: "Using harsh soaps and scrubbing",
          emoji: "🧽",
          description: "Harsh products can disrupt natural pH and cause irritation",
          isCorrect: false
        },
        {
          id: "b",
          text: "Gentle cleaning with mild soap and water",
          emoji: "💧",
          description: "Gentle cleaning maintains natural pH balance and prevents irritation",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoiding cleaning altogether",
          emoji: "🚫",
          description: "Proper hygiene is essential to prevent infections",
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
    navigate("/student/health-female/teens/reflex-hygiene-check");
  };

  return (
    <GameShell
      title="Quiz on Hygiene Needs"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-2"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
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

export default QuizOnHygieneNeeds;