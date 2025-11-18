import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HandwashHeroine = () => {
  const navigate = useNavigate();
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
          text: "Wash hands with soap",
          emoji: "🧼",
          description: "Great choice! Clean hands keep germs away from your food.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wipe hands on clothes",
          emoji: "👕",
          description: "Your clothes aren't clean! Always use soap and water.",
          isCorrect: false
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
          text: "Wash hands with soap",
          emoji: "🐾",
          description: "Perfect! This keeps both you and your pet healthy!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wipe hands on pants",
          emoji: "👖",
          description: "That won't clean your hands properly!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Lick hands clean",
          emoji: "👅",
          description: "No! That's not how we clean our hands!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How long should you wash your hands?",
      options: [
        {
          id: "a",
          text: "5 seconds quickly",
          emoji: "⚡",
          description: "Too fast! You need more time to clean all the germs.",
          isCorrect: false
        },
        {
          id: "b",
          text: "20 seconds, sing happy birthday",
          emoji: "🎵",
          description: "Perfect! This gives soap enough time to work.",
          isCorrect: true
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
          text: "Wash hands with soap",
          emoji: "🚽",
          description: "Yes! This keeps you and others healthy!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just skip it this time",
          emoji: "🏃‍♀️",
          description: "Washing is important every time!",
          isCorrect: false
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
          text: "Wash with soap and water",
          emoji: "🧽",
          description: "Perfect! Soap helps remove all the dirt and germs!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Blow on them",
          emoji: "💨",
          description: "That won't clean your hands at all!",
          isCorrect: false
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
      title="Handwash Heroine"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-1"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
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

          <div className="space-y-3">
            {getCurrentQuestion().options.map((option) => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const isCorrect = option.isCorrect;
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    showFeedback
                      ? isCorrect
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : isSelected
                        ? 'bg-red-500/20 border-2 border-red-400'
                        : 'bg-white/5 border border-white/10'
                      : isSelected
                      ? 'bg-blue-500/20 border-2 border-blue-400'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="text-white/90">{option.text}</span>
                  </div>
                  {showFeedback && isSelected && (
                    <p className="mt-2 text-sm text-white/70">{option.description}</p>
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