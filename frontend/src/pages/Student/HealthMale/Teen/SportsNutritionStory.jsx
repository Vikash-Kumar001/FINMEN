import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SportsNutritionStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You just finished football practice and feel very thirsty. What should you drink?",
      options: [
        {
          id: "b",
          text: "Sugary cola",
          emoji: "🥤",
          description: "Cola has too much sugar and no electrolytes",
          isCorrect: false
        },
        {
          id: "a",
          text: "Water or sports drink",
          emoji: "💧",
          description: "Water hydrates and restores electrolytes lost in sweat",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing, wait till home",
          emoji: "⏰",
          description: "Need to hydrate immediately after sports",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Before basketball game, your coach suggests eating. What do you choose?",
      options: [
        {
          id: "c",
          text: "Heavy burger meal",
          emoji: "🍔",
          description: "Heavy food can make you feel sluggish during games",
          isCorrect: false
        },
        {
          id: "a",
          text: "Banana and nuts",
          emoji: "🍌",
          description: "Light, healthy carbs and protein for sustained energy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip eating completely",
          emoji: "❌",
          description: "Body needs fuel for sports performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "After cricket match, you feel very hungry. What's the best recovery meal?",
      options: [
        {
          id: "a",
          text: "Rice, dal, and vegetables",
          emoji: "🍛",
          description: "Carbs for energy, protein for muscles, veggies for vitamins",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only sweets and chocolates",
          emoji: "🍬",
          description: "Sugar gives quick energy but no lasting nutrition",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wait till next meal",
          emoji: "⏳",
          description: "Body needs recovery nutrition after intense activity",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "During tennis practice, you start feeling tired. What helps maintain energy?",
      options: [
        {
          id: "b",
          text: "Regular water breaks",
          emoji: "💧",
          description: "Staying hydrated prevents fatigue during sports",
          isCorrect: true
        },
        {
          id: "c",
          text: "Energy drinks only",
          emoji: "⚡",
          description: "Too much caffeine can cause dehydration",
          isCorrect: false
        },
        {
          id: "a",
          text: "Skip water to save time",
          emoji: "⏱️",
          description: "Hydration is crucial for sports performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your swimming coach talks about nutrition. What should you focus on?",
      options: [
        {
          id: "c",
          text: "Only protein for muscles",
          emoji: "🥩",
          description: "Need balanced nutrition including carbs for energy",
          isCorrect: false
        },
        {
          id: "a",
          text: "Balanced diet with all nutrients",
          emoji: "🥗",
          description: "Complete nutrition supports overall sports performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Whatever tastes good",
          emoji: "😋",
          description: "Taste matters but nutrition is more important for athletes",
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
    navigate("/student/health-male/teens/junk-food-debate");
  };

  return (
    <GameShell
      title="Sports Nutrition Story"
      subtitle={`Scenario ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-teen-15"
      gameType="health-male"
      totalLevels={100}
      currentLevel={15}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 15/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 5}</span>
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

export default SportsNutritionStory;
