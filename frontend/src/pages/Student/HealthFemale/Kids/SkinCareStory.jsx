import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SkinCareStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-48";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You are going out in the bright sun. How do you protect your skin?",
      options: [
        {
          id: "a",
          text: "Wear a heavy coat",
          emoji: "🧥",
          description: "You'll be too hot!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Put on Sunscreen",
          emoji: "🧴",
          description: "Exactly! Sunscreen protects you from sunburn.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Do nothing",
          emoji: "☀️",
          description: "The sun can hurt your skin.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your skin feels dry and itchy in winter. What helps?",
      options: [
        {
          id: "a",
          text: "Using lotion",
          emoji: "🧴",
          description: "Correct! Lotion keeps skin soft.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Scratching hard",
          emoji: "💅",
          description: "Scratching damages your skin.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Taking a super hot bath",
          emoji: "🛀",
          description: "Hot water can dry skin even more.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You notice a small pimple on your nose. Should you pop it?",
      options: [
        {
          id: "a",
          text: "Yes, pop it!",
          emoji: "💥",
          description: "Popping can leave scars or cause infection.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, keep it clean and gentle",
          emoji: "🫧",
          description: "Right! Let it heal on its own.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Put toothpaste on it",
          emoji: "🪥",
          description: "Toothpaste can irritate your skin.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps your skin glow from the inside?",
      options: [
        {
          id: "a",
          text: "Drinking Water",
          emoji: "💧",
          description: "Yes! Hydration is great for skin.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Drinking Soda",
          emoji: "🥤",
          description: "Soda is full of sugar.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eating Pizza daily",
          emoji: "🍕",
          description: "Greasy food isn't the best for skin.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Before going to sleep, you should...",
      options: [
        {
          id: "a",
          text: "Wash your face",
          emoji: "🧼",
          description: "Correct! Remove the day's dirt.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Put on makeup",
          emoji: "💄",
          description: "Never sleep with makeup on.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat cookies",
          emoji: "🍪",
          description: "Crumbs in bed? No thanks!",
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
      title="Skin Care Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={38}
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

export default SkinCareStory;