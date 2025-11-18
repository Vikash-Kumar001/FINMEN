import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LunchboxStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "It's lunch time! You see pizza and a homemade meal with roti, dal, and vegetables. What do you choose?",
      options: [
        {
          id: "a",
          text: "Pizza",
          emoji: "🍕",
          description: "Pizza is tasty but doesn't give your body all the nutrients it needs for energy and growth.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Homemade meal with roti, dal, and vegetables",
          emoji: "🍛",
          description: "Great choice! This meal has carbohydrates, protein, and vitamins to keep you healthy and energized.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Your friend shares chips and you have fruit in your lunchbox. Which snack do you eat?",
      options: [
        {
          id: "a",
          text: "Chips",
          emoji: "🥔",
          description: "Chips are crunchy but don't give your body the nutrients it needs.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fruit",
          emoji: "🍎",
          description: "Perfect! Fruits have vitamins and natural sugars that are good for you.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "You have a choice between a sugary drink and water. Which do you drink with your lunch?",
      options: [
        {
          id: "a",
          text: "Sugary drink",
          emoji: "🥤",
          description: "Sugary drinks can make you feel tired and don't hydrate your body well.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Water",
          emoji: "💧",
          description: "Excellent! Water keeps you hydrated and helps your body work properly.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "For dessert, do you want a homemade ladoo or store-bought candy?",
      options: [
        {
          id: "a",
          text: "Store-bought candy",
          emoji: "🍬",
          description: "Candy has lots of processed sugar that isn't good for your teeth.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Homemade ladoo",
          emoji: "🍬",
          description: "Good choice! Homemade ladoo has natural ingredients and less processed sugar.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Your lunchbox has a milk packet and a juice box. Which drink gives you more nutrition?",
      options: [
        {
          id: "a",
          text: "Juice box",
          emoji: "🧃",
          description: "Juice boxes often have added sugars and fewer nutrients than milk.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Milk packet",
          emoji: "🥛",
          description: "Right! Milk has protein and calcium to help build strong bones and muscles.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Lunchbox Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-15"
      gameType="health-female"
      totalLevels={15}
      currentLevel={15}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default LunchboxStory;