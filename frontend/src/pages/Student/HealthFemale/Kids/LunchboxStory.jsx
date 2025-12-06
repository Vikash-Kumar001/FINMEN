import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LunchboxStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-15";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
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
          text: "Homemade Roti & Dal",
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
          emoji: "🥡",
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
          text: "Milk packet",
          emoji: "🥛",
          description: "Right! Milk has protein and calcium to help build strong bones and muscles.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Juice box",
          emoji: "🧃",
          description: "Juice boxes often have added sugars and fewer nutrients than milk.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (selectedOptionId) return;

    setSelectedOptionId(optionId);
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setSelectedOptionId(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Lunchbox Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={15}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {questions[currentQuestion].text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => {
              const isSelected = selectedOptionId === option.id;
              const showFeedback = selectedOptionId !== null;

              let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";

              if (showFeedback && isSelected) {
                buttonClass = option.isCorrect
                  ? "bg-green-500 ring-4 ring-green-300"
                  : "bg-red-500 ring-4 ring-red-300";
              } else if (showFeedback && !isSelected) {
                buttonClass = "bg-white/10 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${buttonClass}`}
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-6">{option.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 text-white">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white font-medium mt-2 animate-fadeIn">{option.description}</p>
                      )}
                    </div>
                    {showFeedback && isSelected && (
                      <div className="text-3xl ml-4">
                        {option.isCorrect ? "✅" : "❌"}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default LunchboxStory;