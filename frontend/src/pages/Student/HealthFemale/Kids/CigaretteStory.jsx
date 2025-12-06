import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CigaretteStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-81";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You see someone smoking a cigarette.",
      options: [
        {
          id: "a",
          text: "Stand close and breathe it in",
          emoji: "🌬️",
          description: "That smoke is bad for you.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Walk away or cover your nose",
          emoji: "🚶‍♀️",
          description: "Correct! Keep your lungs clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Take the cigarette",
          emoji: "✋",
          description: "Don't touch it.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What does smoking do to lungs?",
      options: [
        {
          id: "a",
          text: "Makes them purple",
          emoji: "🟣",
          description: "It doesn't make them purple.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Makes them black and sick",
          emoji: "🖤",
          description: "Yes! It hurts your breathing.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Makes them super strong",
          emoji: "💪",
          description: "Smoking makes lungs weak.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone offers you a cigarette.",
      options: [
        {
          id: "b",
          text: "Say 'No way!' and run home",
          emoji: "🏃‍♀️",
          description: "Correct! Stay far away.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Try it once",
          emoji: "☝️",
          description: "Even once is dangerous.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Put it in your pocket",
          emoji: "👖",
          description: "Don't keep it.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is smoking bad?",
      options: [
        {
          id: "a",
          text: "It causes coughs and cancer",
          emoji: "😷",
          description: "Yes! It is very harmful.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes you look cool",
          emoji: "😎",
          description: "Being healthy is cool.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It tastes like candy",
          emoji: "🍭",
          description: "It smells and tastes yucky.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What makes your lungs happy?",
      options: [
        {
          id: "a",
          text: "Smoke",
          emoji: "🚬",
          description: "Smoke hurts lungs.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fresh air and running",
          emoji: "🌳",
          description: "Correct! Fresh air is best.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Dust",
          emoji: "🌫️",
          description: "Dust makes you sneeze.",
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
      title="Cigarette Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={71}
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

export default CigaretteStory;