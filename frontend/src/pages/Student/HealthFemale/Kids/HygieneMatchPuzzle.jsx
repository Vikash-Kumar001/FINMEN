import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneMatchPuzzle = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-44";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which item helps you clean between your teeth?",
      options: [
        {
          id: "a",
          text: "Shoelace",
          emoji: "👟",
          description: "That's for shoes, not teeth!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Dental Floss",
          emoji: "🧵",
          description: "Yes! Floss removes stuck food.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Paper clip",
          emoji: "📎",
          description: "Ouch! Never use sharp things.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which item keeps your hair tangle-free?",
      options: [
        {
          id: "a",
          text: "Toothbrush",
          emoji: "🪥",
          description: "That's for teeth!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Comb or Brush",
          emoji: "💇‍♀️",
          description: "Correct! Keep your hair neat.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Spoon",
          emoji: "🥄",
          description: "Spoons are for eating.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What do we use to trim nails?",
      options: [
        {
          id: "a",
          text: "Nail Clippers",
          emoji: "✂️",
          description: "Yes! Keep nails short and clean.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Teeth",
          emoji: "😬",
          description: "Don't bite your nails! It spreads germs.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Knife",
          emoji: "🔪",
          description: "Too dangerous!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps us smell good?",
      options: [
        {
          id: "a",
          text: "Onions",
          emoji: "🧅",
          description: "Onions have a strong smell!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Deodorant",
          emoji: "🧴",
          description: "Correct! It keeps odors away.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Mud",
          emoji: "🧱",
          description: "Mud is dirty.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What do you use to dry off after a shower?",
      options: [
        {
          id: "a",
          text: "Clean Towel",
          emoji: "🧖‍♀️",
          description: "Yes! Dry your skin well.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Dirty Laundry",
          emoji: "👕",
          description: "That defeats the purpose of showering!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Newspaper",
          emoji: "📰",
          description: "Not very effective for drying skin.",
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
      title="Hygiene Match Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={34}
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

export default HygieneMatchPuzzle;