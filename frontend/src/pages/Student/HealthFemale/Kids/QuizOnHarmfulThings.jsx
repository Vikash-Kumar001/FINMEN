import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnHarmfulThings = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-82";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which of these is medicine?",
      options: [
        {
          id: "a",
          text: "Candy",
          emoji: "🍬",
          description: "Candy is a treat.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Soda",
          emoji: "🥤",
          description: "Soda is a drink.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Pills from the doctor",
          emoji: "💊",
          description: "Correct! Only take if doctor says.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Is alcohol (beer/wine) for kids?",
      options: [
        {
          id: "a",
          text: "Yes, at parties",
          emoji: "🎉",
          description: "No, never for kids.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, it hurts growing bodies",
          emoji: "🚫",
          description: "Yes! It is only for adults.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Maybe on Tuesdays",
          emoji: "📅",
          description: "Not on any day.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What if you see a needle on the ground?",
      options: [
        {
          id: "b",
          text: "Don't touch and tell an adult",
          emoji: "🛑",
          description: "Correct! Stay safe.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Pick it up",
          emoji: "💉",
          description: "That is very dangerous.",
          isCorrect: false
        },
      
        {
          id: "c",
          text: "Kick it",
          emoji: "🦶",
          description: "Don't touch it at all.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Are cleaning sprays (like bleach) safe to drink?",
      options: [
        {
          id: "a",
          text: "Yes, they clean you",
          emoji: "🧴",
          description: "No! They are poison.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No! They are poison",
          emoji: "☠️",
          description: "Yes! Never drink cleaners.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if they smell like lemon",
          emoji: "🍋",
          description: "Smell doesn't make it safe.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is 'Healthy' for your body?",
      options: [
        {
          id: "a",
          text: "Smoke and alcohol",
          emoji: "🚬",
          description: "Those hurt your body.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Water and good food",
          emoji: "🥦",
          description: "Exactly! Fuel your body right.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eating rocks",
          emoji: "🪨",
          description: "Rocks are not food.",
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
      title="Quiz on Harmful Things"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={72}
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

export default QuizOnHarmfulThings;