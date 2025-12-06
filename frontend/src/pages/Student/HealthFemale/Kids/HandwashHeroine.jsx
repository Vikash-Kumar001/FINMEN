import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HandwashHeroine = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-1"; // Match key in index.js

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What's the first thing you should do before eating lunch?",
      options: [
        {
          id: "a",
          text: "Wipe hands on clothes",
          emoji: "👕",
          description: "Your clothes aren't clean! Always use soap and water.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands with soap",
          emoji: "🧼",
          description: "Great choice! Clean hands keep germs away from your food.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just rinse with water",
          emoji: "💧",
          description: "Water alone doesn't remove all the germs. Use soap too!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After playing with your pet, you should:",
      options: [
        {
          id: "a",
          text: "Wipe hands on pants",
          emoji: "👖",
          description: "That won't clean your hands properly!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Lick hands clean",
          emoji: "👅",
          description: "No! That's not how we clean our hands!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash hands with soap",
          emoji: "🐾",
          description: "Perfect! This keeps both you and your pet healthy!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How long should you wash your hands?",
      options: [
        {
          id: "a",
          text: "20 seconds, sing happy birthday",
          emoji: "🎵",
          description: "Perfect! This gives soap enough time to work.",
          isCorrect: true
        },
        {
          id: "b",
          text: "5 seconds quickly",
          emoji: "⚡",
          description: "Too fast! You need more time to clean all the germs.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just a quick rinse",
          emoji: "💦",
          description: "Rinsing isn't enough to remove all the germs!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "After using the bathroom, you should:",
      options: [
        {
          id: "a",
          text: "Just skip it this time",
          emoji: "🏃‍♀️",
          description: "Washing is important every time!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands with soap",
          emoji: "🚽",
          description: "Yes! This keeps you and others healthy!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only use water",
          emoji: "💧",
          description: "Soap is needed to remove all the germs!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your hands got dirty while gardening. What's the best way to clean them?",
      options: [
        {
          id: "a",
          text: "Wipe on grass",
          emoji: "🌱",
          description: "Grass won't clean your hands properly!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Blow on them",
          emoji: "💨",
          description: "That won't clean your hands at all!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash with soap and water",
          emoji: "🧽",
          description: "Perfect! Soap helps remove all the dirt and germs!",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    // Prevent multiple clicks if feedback is already showing
    if (choices.some(c => c.question === currentQuestion)) return;

    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + coinsPerLevel);
      showCorrectAnswerFeedback(coinsPerLevel, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000); // Slightly longer delay for reading feedback
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Handwash Heroine"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <div className="text-right">
              <span className="text-yellow-400 font-bold block">Coins: {coins}/{totalCoins}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6">
            {currentQ.text}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const feedback = choices.find(c => c.question === currentQuestion);
              const isSelected = feedback?.optionId === option.id;
              const isCorrect = option.isCorrect;
              const showFeedback = !!feedback;

              let buttonStyle = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-transparent";

              if (showFeedback) {
                if (isCorrect) {
                  // Correct answer always green
                  buttonStyle = "bg-green-500 border-green-400";
                } else if (isSelected && !isCorrect) {
                  // Wrong selection red
                  buttonStyle = "bg-red-500 border-red-400";
                } else {
                  // Others dimmed
                  buttonStyle = "bg-white/10 opacity-50";
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 text-white shadow-lg ${buttonStyle}`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="font-medium">{option.text}</span>
                  </div>
                  {showFeedback && (isSelected || isCorrect) && (
                    <p className="mt-2 text-sm text-white/90 bg-black/20 p-2 rounded-lg">
                      {option.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default HandwashHeroine;