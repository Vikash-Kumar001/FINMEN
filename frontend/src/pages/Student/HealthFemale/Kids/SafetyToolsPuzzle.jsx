import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetyToolsPuzzle = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-74";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which tool protects you from the sun?",
      options: [
        {
          id: "a",
          text: "A flashlight",
          emoji: "🔦",
          description: "Flashlights make light, not block sun.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Sunscreen and a hat",
          emoji: "🧴",
          description: "Correct! They block harmful rays.",
          isCorrect: true
        },
        {
          id: "c",
          text: "A sweater",
          emoji: "🧥",
          description: "A sweater might make you too hot.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which tool helps in a car crash?",
      options: [
        {
          id: "a",
          text: "Seatbelt",
          emoji: "🚙",
          description: "Yes! Seatbelts save lives.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Radio",
          emoji: "📻",
          description: "Radio plays music.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Car horn",
          emoji: "📣",
          description: "Horns warn, but don't hold you safe.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which tool helps you see in the dark so you don't trip?",
      options: [
        {
          id: "a",
          text: "Sunglasses",
          emoji: "😎",
          description: "Sunglasses make it darker.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Flashlight or Lamp",
          emoji: "💡",
          description: "Correct! Light helps you see.",
          isCorrect: true
        },
        {
          id: "c",
          text: "A blanket",
          emoji: "🛌",
          description: "Blankets are for sleeping.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What do you wear to protect your knees when skating?",
      options: [
        {
          id: "a",
          text: "Knee pads",
          emoji: "🛡️",
          description: "Yes! They cushion falls.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Socks",
          emoji: "🧦",
          description: "Socks are too thin.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sandals",
          emoji: "🩴",
          description: "Sandals are for feet.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What tool helps you if you get a small cut?",
      options: [
        {
          id: "a",
          text: "A hammer",
          emoji: "🔨",
          description: "Hammers are for building.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "A spoon",
          emoji: "🥄",
          description: "Spoons are for eating.",
          isCorrect: false
        },
        {
          id: "b",
          text: "A bandage (plaster)",
          emoji: "🩹",
          description: "Exactly! It covers the cut.",
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
      title="Safety Tools Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={64}
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

export default SafetyToolsPuzzle;