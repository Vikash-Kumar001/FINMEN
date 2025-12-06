import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StayFreshPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-46";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which title is best for a 'Stay Fresh' poster?",
      options: [
        {
          id: "a",
          text: "Never Wash!",
          emoji: "🚫",
          description: "That is the opposite of staying fresh!",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Messy is Best",
          emoji: "🗑️",
          description: "Hygiene is about being clean, not messy.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Sparkle & Shine: Clean is Cool",
          emoji: "✨",
          description: "Great! Clean hygiene makes you shine.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What picture shows good dental hygiene?",
      options: [
        {
          id: "a",
          text: "Eating sticky candy",
          emoji: "🍬",
          description: "Candy hurts teeth.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Girl brushing happily",
          emoji: "🦷",
          description: "Yes! Brushing makes smiles bright.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Sleeping with mouth open",
          emoji: "😴",
          description: "That doesn't clean your teeth.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What item belongs on a 'Bath Time' poster?",
      options: [
        {
          id: "a",
          text: "Mud Pie",
          emoji: "🥧",
          description: "Mud makes you dirty!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Rubber Duck & Soap",
          emoji: "🦆",
          description: "Perfect! Fun and clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Sandwich",
          emoji: "🥪",
          description: "Don't bring food to the bath!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which slogan is true?",
      options: [
        {
          id: "b",
          text: "Clean hands, healthy body",
          emoji: "👐",
          description: "Correct! Washing hands stops sickness.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Smelling bad helps you make friends",
          emoji: "🤢",
          description: "It usually does the opposite.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Germs are good pets",
          emoji: "🦠",
          description: "Germs make us sick.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What feeling does being clean give you?",
      options: [
        {
          id: "a",
          text: "Confidence",
          emoji: "😎",
          description: "Yes! You feel ready for anything.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tiredness",
          emoji: "😴",
          description: "A bath might relax you, but clean feels fresh.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Grumpiness",
          emoji: "😠",
          description: "Being fresh usually makes you happy.",
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
      title="Poster: Stay Fresh"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={36}
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

export default StayFreshPoster;