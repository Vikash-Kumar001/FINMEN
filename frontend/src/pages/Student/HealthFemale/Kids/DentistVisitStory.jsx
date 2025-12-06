import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DentistVisitStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-78";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You are going to the dentist today.",
      options: [
        {
          id: "a",
          text: "Hide under the car",
          emoji: "🚗",
          description: "You have to go to keep teeth healthy.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Brush your teeth and get ready",
          emoji: "🪥",
          description: "Correct! Go with clean teeth.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eat lots of sticky candy",
          emoji: "🍬",
          description: "Candy isn't good before the dentist.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The dentist chair looks big and special.",
      options: [
        {
          id: "a",
          text: "Climb on it like a jungle gym",
          emoji: "🐒",
          description: "Sit quietly.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Sleep on the floor",
          emoji: "😴",
          description: "Use the chair.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Sit still and open wide",
          emoji: "😲",
          description: "Yes! Let the dentist see.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "The dentist uses a small mirror.",
      options: [
        {
          id: "a",
          text: "Bite it",
          emoji: "😬",
          description: "Don't bite the tools.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Let them look at your teeth",
          emoji: "👀",
          description: "Correct! They are checking for cavities.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Grab it",
          emoji: "🖐️",
          description: "Keep your hands down.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The dentist finds a small cavity (hole).",
      options: [
        {
          id: "b",
          text: "Let them fix it so it stops hurting",
          emoji: "🛠️",
          description: "Yes! Fixing it is important.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Cry loudly",
          emoji: "😭",
          description: "The dentist can fix it.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Run away with the hole",
          emoji: "🏃‍♀️",
          description: "It will get worse if you run.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How do you keep cavities away?",
      options: [
        {
          id: "a",
          text: "Never brush",
          emoji: "🙅‍♀️",
          description: "That causes cavities.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Brush and floss every day",
          emoji: "🦷",
          description: "Correct! Clean teeth are happy teeth.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Drink only soda",
          emoji: "🥤",
          description: "Soda is bad for teeth.",
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
      title="Dentist Visit Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={68}
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

export default DentistVisitStory;