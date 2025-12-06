import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowingTallerStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-80";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice your pants are too short.",
      options: [
        {
          id: "a",
          text: "Cry",
          emoji: "😢",
          description: "It's okay to grow!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell parents you are growing!",
          emoji: "📏",
          description: "Correct! That is great news.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Cut off your legs",
          emoji: "✂️",
          description: "Oh no! Never do that.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "To grow tall and strong, you need...",
      options: [
        {
          id: "a",
          text: "Magic beans",
          emoji: "🌱",
          description: "Those are for fairy tales.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Healthy food and sleep",
          emoji: "🥗",
          description: "Yes! Fuel your growth.",
          isCorrect: true
        },
        {
          id: "c",
          text: "To hang upside down",
          emoji: "🦇",
          description: "That just makes you dizzy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Is everyone exactly the same height?",
      options: [
        {
          id: "a",
          text: "Yes, like robots",
          emoji: "🤖",
          description: "People are different.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, everyone grows differently",
          emoji: "👭",
          description: "Correct! Being different is okay.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only on Mars",
          emoji: "👽",
          description: "We are on Earth.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Growing makes you hungry.",
      options: [
        {
          id: "a",
          text: "Eat a healthy snack",
          emoji: "🍎",
          description: "Yes! Feed your body.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Starve yourself",
          emoji: "🍽️",
          description: "Your body needs food.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat paper",
          emoji: "📄",
          description: "Paper is not food.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Growing up is...",
      options: [
        {
          id: "a",
          text: "Scary",
          emoji: "👻",
          description: "It can be new, but it's good.",
          isCorrect: false
        },
        {
          id: "b",
          text: "A normal adventure",
          emoji: "🚀",
          description: "Correct! Enjoy the journey.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Boring",
          emoji: "😑",
          description: "It's full of changes!",
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
      title="Growing Taller Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={80}
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

export default GrowingTallerStory;