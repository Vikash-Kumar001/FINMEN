import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyGirlsWinPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-96";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What slogan fits best on a 'Healthy Girls' poster?",
      options: [
        {
          id: "a",
          text: "Eat candy all day!",
          emoji: "🍭",
          description: "Not a healthy message.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Strong, Smart, and Healthy!",
          emoji: "💪",
          description: "Perfect! That is inspiring.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Sleep is for the weak",
          emoji: "🥱",
          description: "We actually need sleep to be strong.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Never wash your hands",
          emoji: "🦠",
          description: "Hygiene is key to health.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which image shows a 'Winning' routine?",
      options: [
       
        {
          id: "b",
          text: "Girl playing video games at 2 AM",
          emoji: "🎮",
          description: "That is not a winning routine.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Girl eating pizza for breakfast",
          emoji: "🍕",
          description: "Breakfast needs more nutrients.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Girl skipping school",
          emoji: "🚫",
          description: "School is important!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Girl waking up early and stretching",
          emoji: "🧘‍♀️",
          description: "Yes! Start the day with energy.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Who are the heroes in our healthy story poster?",
      options: [
        {
          id: "a",
          text: "Girls who help others stay safe",
          emoji: "👯‍♀️",
          description: "Correct! Helping others is heroic.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Bullies",
          emoji: "🦹",
          description: "Bullies are not heroes.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Lazy cats",
          emoji: "🐱",
          description: "Cute, but not the hero here.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Germs",
          emoji: "🦠",
          description: "Germs are the villains!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What color represents energy and health?",
      options: [
        {
          id: "a",
          text: "Bright Green and Orange",
          emoji: "🟢",
          description: "Colors of fresh veggies and sun!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Dull Grey",
          emoji: "🌫️",
          description: "Grey is a bit gloomy.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Muddy Brown",
          emoji: "🟤",
          description: "Not very energetic.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Invisible",
          emoji: "👻",
          description: "We want to be seen!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The final message on the poster is...",
      options: [
        {
          id: "a",
          text: "I give up",
          emoji: "🏳️",
          description: "Never give up!",
          isCorrect: false
        },
        {
          id: "b",
          text: "I choose health every day!",
          emoji: "🌟",
          description: "Correct! A powerful choice.",
          isCorrect: true
        },
        {
          id: "c",
          text: "I only like soda",
          emoji: "🥤",
          description: "Water is better.",
          isCorrect: false
        },
        {
          id: "d",
          text: "I am bored",
          emoji: "😑",
          description: "Be excited about health!",
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
      title="Poster: Healthy Girls Win"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={96}
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

export default HealthyGirlsWinPoster;