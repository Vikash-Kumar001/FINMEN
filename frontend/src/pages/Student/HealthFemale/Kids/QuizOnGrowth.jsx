import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnGrowth = () => {
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
      text: "Which food helps build muscles?",
      options: [
        {
          id: "a",
          text: "Lettuce",
          emoji: "🥬",
          description: "Lettuce is good, but protein builds muscle.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eggs or Beans",
          emoji: "🥚",
          description: "Correct! Protein power!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Cotton candy",
          emoji: "🍭",
          description: "Just sugar.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What does calcium (in milk) do?",
      options: [
        {
          id: "a",
          text: "Makes bones strong",
          emoji: "🦴",
          description: "Yes! Strong bones for growing.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes hair purple",
          emoji: "🟣",
          description: "It doesn't change hair color.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes you fly",
          emoji: "🕊️",
          description: "Milk doesn't give flight.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Is it okay if I grow slower than my friend?",
      options: [
        {
          id: "a",
          text: "No, hurry up",
          emoji: "🏃‍♀️",
          description: "You can't force growth.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, everyone has their own speed",
          emoji: "🐢",
          description: "Correct! Every body is unique.",
          isCorrect: true
        },
        {
          id: "c",
          text: "It means you are broken",
          emoji: "🏥",
          description: "You are not broken.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps your brain grow?",
      options: [
        {
          id: "a",
          text: "Watching TV all day",
          emoji: "📺",
          description: "Your brain needs exercise too.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Reading and learning",
          emoji: "📖",
          description: "Yes! Exercise your brain.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Staring at a wall",
          emoji: "🧱",
          description: "Boring for the brain.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "When do you grow the most?",
      options: [
        {
          id: "a",
          text: "While playing tag",
          emoji: "🏃",
          description: "Exercise helps, but isn't when you grow.",
          isCorrect: false
        },
        {
          id: "b",
          text: "While you sleep",
          emoji: "🛌",
          description: "Correct! Sleep is growing time.",
          isCorrect: true
        },
        {
          id: "c",
          text: "While eating pizza",
          emoji: "🍕",
          description: "Eating provides fuel, sleep does the work.",
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
      title="Quiz on Growth"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={81}
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

export default QuizOnGrowth;