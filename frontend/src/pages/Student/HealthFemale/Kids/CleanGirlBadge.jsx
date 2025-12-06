import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanGirlBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-79";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "To earn the 'Lungs Protector' badge...",
      options: [
        {
          id: "a",
          text: "Breathe car smoke",
          emoji: "🚗",
          description: "That hurts lungs.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stay away from cigarette smoke",
          emoji: "🚭",
          description: "Correct! Keep air clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Smoke for fun",
          emoji: "🚬",
          description: "Never smoke.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The 'Smart Sipper' badge is for...",
      options: [
        {
          id: "a",
          text: "Drinking only soda",
          emoji: "🥤",
          description: "Too much sugar.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Drinking water and milk",
          emoji: "🥛",
          description: "Yes! Healthy drinks.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Drinking coffee",
          emoji: "☕",
          description: "Coffee isn't for kids.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How to get the 'Safe Sniffer' badge?",
      options: [
        {
          id: "a",
          text: "Smell bleach",
          emoji: "👃",
          description: "Chemicals can hurt your nose.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Smell flowers, stay away from chemicals",
          emoji: "🌸",
          description: "Correct! Safe smells only.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Smell garbage",
          emoji: "🗑️",
          description: "Yuck!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The 'No Thanks' Hero badge is for...",
      options: [
        {
          id: "a",
          text: "Taking anything offered",
          emoji: "🎁",
          description: "Not safe.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Refusing drugs and alcohol",
          emoji: "✋",
          description: "Yes! Say no to bad things.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Saying no to vegetables",
          emoji: "🥦",
          description: "Veggies are good!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who helps you stay clean and safe?",
      options: [
        {
          id: "a",
          text: "Strangers",
          emoji: "👤",
          description: "Don't trust strangers easily.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Parents and teachers",
          emoji: "🏫",
          description: "Correct! Trusted adults help.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Video games",
          emoji: "🎮",
          description: "Games are fun but can't protect you.",
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
      title="Badge: Clean Girl"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={79}
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

export default CleanGirlBadge;
