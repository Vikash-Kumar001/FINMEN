import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPrevention = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-72";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "How do we stop germs from spreading?",
      options: [
        {
          id: "a",
          text: "Share drinks",
          emoji: "🥤",
          description: "Sharing cups spreads germs.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands often",
          emoji: "🧼",
          description: "Correct! Clean hands kill germs.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Never bathe",
          emoji: "🛀",
          description: "Bathing cleans germs away.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "When should you sneeze?",
      options: [
        {
          id: "a",
          text: "On your friend",
          emoji: "🤧",
          description: "Yuck! Don't do that.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Into your elbow or tissue",
          emoji: "💪",
          description: "Yes! Catch the sneeze.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Into the air",
          emoji: "💨",
          description: "That sprays germs everywhere.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What keeps your teeth healthy?",
      options: [
        {
          id: "b",
          text: "Brushing twice a day",
          emoji: "🪥",
          description: "Exactly! Keep them shiny.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Eating candy",
          emoji: "🍭",
          description: "Sugar causes cavities.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Chewing rocks",
          emoji: "🪨",
          description: "Rocks break teeth!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why do we sleep?",
      options: [
        {
          id: "a",
          text: "To be bored",
          emoji: "🥱",
          description: "Sleep isn't boring.",
          isCorrect: false
        },
        {
          id: "b",
          text: "To help our body repair and grow",
          emoji: "🛌",
          description: "Yes! Sleep powers you up.",
          isCorrect: true
        },
        {
          id: "c",
          text: "To miss school",
          emoji: "🏫",
          description: "We sleep at night.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What protects your head when biking?",
      options: [
        {
          id: "a",
          text: "A hat",
          emoji: "🧢",
          description: "A hat is not hard enough.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Your hair",
          emoji: "💇‍♀️",
          description: "Hair doesn't protect from bumps.",
          isCorrect: false
        },
        {
          id: "b",
          text: "A helmet",
          emoji: "⛑️",
          description: "Correct! Helmets save heads.",
          isCorrect: true
        },
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
      title="Quiz on Prevention"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={62}
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

export default QuizOnPrevention;