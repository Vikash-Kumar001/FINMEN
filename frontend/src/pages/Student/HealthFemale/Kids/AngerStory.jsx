import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AngerStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-58";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your sibling breaks your toy.",
      options: [
        {
          id: "a",
          text: "Break their toy",
          emoji: "🔨",
          description: "Two wrongs don't make a right.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell an adult and take deep breaths",
          emoji: "😮‍💨",
          description: "Correct! Handle it calmly.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Cry forever",
          emoji: "😭",
          description: "Crying is okay, but try to solve it.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You feel like hitting something.",
      options: [
        {
          id: "a",
          text: "Hit a pillow",
          emoji: "🛌",
          description: "Yes! Pillows are soft and safe.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hit a friend",
          emoji: "🙅‍♀️",
          description: "Never hit people.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hit the wall",
          emoji: "🧱",
          description: "Ouch! You will hurt your hand.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You are mad because you lost a game.",
      options: [
        {
          id: "a",
          text: "Flip the board",
          emoji: "╯°□°）╯",
          description: "Do not ruin the game.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Say 'Good game' and try again next time",
          emoji: "🤝",
          description: "Correct! Be a good sport.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Steal the pieces",
          emoji: "🕵️‍♀️",
          description: "That is cheating.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What does anger feel like in your body?",
      options: [
        {
          id: "a",
          text: "Cold and sleepy",
          emoji: "❄️",
          description: "Anger usually feels hot.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hot and tight",
          emoji: "🔥",
          description: "Yes! Your face might get red.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ticklish",
          emoji: "🪶",
          description: "Anger isn't ticklish.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How do you cool down?",
      options: [
        {
          id: "a",
          text: "Count to 10 slowly",
          emoji: "🔟",
          description: "Correct! Counting helps.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eat hot sauce",
          emoji: "🌶️",
          description: "That makes you hotter!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Run in circles screaming",
          emoji: "🏃‍♀️",
          description: "Try to sit still and breathe.",
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
      title="Anger Story"
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

export default AngerStory;