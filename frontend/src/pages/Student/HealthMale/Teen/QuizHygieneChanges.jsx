import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizHygieneChanges = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "During puberty, which is correct?",
      options: [
        {
          id: "a",
          text: "Use perfume instead",
          emoji: "🌸",
          description: "Perfume only covers smell, doesn't solve hygiene issues",
          isCorrect: false
        },
        {
          id: "b",
          text: "Bathe twice if needed",
          emoji: "🛁",
          description: "Puberty causes more sweating, so bathing twice daily helps",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore sweat completely",
          emoji: "😅",
          description: "Ignoring sweat leads to body odor and skin problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens to skin during puberty?",
      options: [
        {
          id: "a",
          text: "Gets more oily and prone to acne",
          emoji: "🧴",
          description: "Hormone changes cause oilier skin during puberty",
          isCorrect: true
        },
        {
          id: "b",
          text: "No changes at all",
          emoji: "😊",
          description: "Puberty brings many skin changes",
          isCorrect: false
        },
        {
          id: "c",
          text: "Becomes completely dry",
          emoji: "🏜️",
          description: "Puberty usually makes skin oilier, not drier",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Best way to handle puberty body odor?",
      options: [
        {
          id: "a",
          text: "Daily deodorant + clean clothes",
          emoji: "🧼",
          description: "Regular hygiene prevents body odor during puberty",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it completely",
          emoji: "🤷",
          description: "Proper hygiene is essential during puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Strong perfume only",
          emoji: "🌺",
          description: "Perfume covers but doesn't solve the root cause",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "During puberty, how often should you change clothes?",
      options: [
        {
          id: "a",
          text: "Only when visibly dirty",
          emoji: "👀",
          description: "Sweat and bacteria can make clothes smelly even if clean-looking",
          isCorrect: false
        },
        {
          id: "b",
          text: "Once a week is enough",
          emoji: "📅",
          description: "Daily clothing changes are important during puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Daily and after sweating",
          emoji: "👕",
          description: "Clean clothes prevent bacteria growth and odor",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to handle acne during puberty?",
      options: [
        {
          id: "a",
          text: "Gentle face washing and moisturizing",
          emoji: "🧴",
          description: "Proper skin care routine helps manage puberty acne",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pop all pimples immediately",
          emoji: "💥",
          description: "Popping pimples can cause scarring and infection",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use adult-strength products",
          emoji: "🧴",
          description: "Teen skin needs gentle, age-appropriate products",
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
    navigate("/student/health-male/teen/reflex-smart-hygiene");
  };

  return (
    <GameShell
      title="Quiz on Hygiene Changes"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-2"
      gameType="health-male"
      totalLevels={10}
      currentLevel={2}
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

export default QuizHygieneChanges;
