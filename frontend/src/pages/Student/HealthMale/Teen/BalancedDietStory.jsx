import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BalancedDietStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You're at a party and see only burgers and pizza. What do you do?",
      options: [
        {
          id: "a",
          text: "Look for balanced options",
          emoji: "🥗",
          description: "Mix of proteins, veggies, and grains keeps you healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eat only junk food",
          emoji: "🍔",
          description: "Party food should be balanced with healthy choices too",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip eating completely",
          emoji: "❌",
          description: "Your body needs regular nutrition even at parties",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Mom made dal and rice for dinner. You want only rice. What should you do?",
      options: [
        {
          id: "a",
          text: "Eat only rice",
          emoji: "🍚",
          description: "Rice alone lacks protein and nutrients",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask for something else",
          emoji: "🤷",
          description: "Home food can be made nutritious with simple additions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Add dal and veggies",
          emoji: "🍛",
          description: "Complete meal with protein, carbs, and vitamins",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your school lunch has bread and fruit. What makes it balanced?",
      options: [
        {
          id: "a",
          text: "Add protein like eggs or cheese",
          emoji: "🥚",
          description: "Protein + carbs + fruit = complete nutrition",
          isCorrect: true
        },
        {
          id: "b",
          text: "Add only more bread",
          emoji: "🍞",
          description: "Too many carbs without protein isn't balanced",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat only the fruit",
          emoji: "🍎",
          description: "Missing protein and complex carbs for energy",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're growing taller and need energy. What's the best food choice?",
      options: [
        {
          id: "a",
          text: "Only sugary drinks and snacks",
          emoji: "🥤",
          description: "Sugar gives quick energy but no lasting nutrition",
          isCorrect: false
        },
        {
          id: "b",
          text: "Mix of roti, dal, veggies, and milk",
          emoji: "🥘",
          description: "Complete nutrition supports growth and energy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip meals to save time",
          emoji: "⏰",
          description: "Regular meals are important for growing bodies",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Friends order only fast food. You want to eat healthy. What do you suggest?",
      options: [
        {
          id: "a",
          text: "Order only fast food too",
          emoji: "🍟",
          description: "Peer pressure shouldn't affect your health choices",
          isCorrect: false
        },
        {
          id: "b",
          text: "Don't eat with friends",
          emoji: "😔",
          description: "You can eat healthy while being social",
          isCorrect: false
        },
        {
          id: "c",
          text: "Suggest balanced meal options",
          emoji: "🥗",
          description: "Healthy choices can influence friends positively",
          isCorrect: true
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
    navigate("/student/health-male/teens/quiz-nutrition-teen");
  };

  return (
    <GameShell
      title="Balanced Diet Story"
      subtitle={`Decision ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-teen-11"
      gameType="health-male"
      totalLevels={100}
      currentLevel={11}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 11/100</span>
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

export default BalancedDietStory;
