import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnTeenHygiene = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which helps skin health during puberty?",
      options: [
        {
          id: "a",
          text: "Gentle wash with mild soap",
          emoji: "🧴",
          description: "Gentle cleansing removes excess oil without irritating skin",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignoring pimples completely",
          emoji: "❌",
          description: "Ignoring skin issues can lead to worsening conditions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Scrubbing vigorously with harsh soap",
          emoji: "🔥",
          description: "Harsh scrubbing can irritate skin and increase oil production",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should you wash your hair during puberty?",
      options: [
        {
          id: "a",
          text: "Every other day or daily if oily",
          emoji: "💇",
          description: "Hormonal changes may require more frequent washing",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once a week regardless of oiliness",
          emoji: "📅",
          description: "This may not be sufficient during hormonal changes",
          isCorrect: false
        },
        {
          id: "c",
          text: "Twice a day with strong shampoo",
          emoji: "🧼",
          description: "Over-washing can strip natural oils and cause more oil production",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best approach to body odor during puberty?",
      options: [
        {
          id: "a",
          text: "Regular bathing and clean clothes",
          emoji: "🛁",
          description: "Good hygiene prevents bacterial buildup that causes odor",
          isCorrect: true
        },
        {
          id: "b",
          text: "Using only perfume to mask smell",
          emoji: "🌸",
          description: "Perfume only masks odor but doesn't solve the root cause",
          isCorrect: false
        },
        {
          id: "c",
          text: "Bathing only once a week",
          emoji: "🚿",
          description: "Infrequent bathing allows bacteria to multiply",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should you care for your face during puberty?",
      options: [
        {
          id: "a",
          text: "Wash twice daily with gentle cleanser",
          emoji: "💧",
          description: "Consistent gentle cleansing helps prevent breakouts",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wash only when visibly dirty",
          emoji: "👀",
          description: "Waiting until visibly dirty allows oil buildup",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash with hot water and harsh soap",
          emoji: "🔥",
          description: "Hot water and harsh soap can irritate skin",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to handle excessive sweating?",
      options: [
        {
          id: "a",
          text: "Use antiperspirant and wear breathable clothes",
          emoji: "👕",
          description: "These methods help control sweat and reduce odor",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid drinking water to reduce sweating",
          emoji: "❌",
          description: "Dehydration is unhealthy and doesn't effectively reduce sweating",
          isCorrect: false
        },
        {
          id: "c",
          text: "Apply deodorant once a week",
          emoji: "📅",
          description: "Daily application is needed for effective odor control",
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
    navigate("/student/health-female/teens/reflex-teen-hygiene");
  };

  return (
    <GameShell
      title="Quiz on Teen Hygiene"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-42"
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

export default QuizOnTeenHygiene;