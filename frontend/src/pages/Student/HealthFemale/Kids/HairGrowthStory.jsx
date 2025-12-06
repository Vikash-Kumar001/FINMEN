import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HairGrowthStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-84";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice hair growing under your arms.",
      options: [
        {
          id: "a",
          text: "Try to pull it out",
          emoji: "🤏",
          description: "Ouch! Don't do that.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Know it's a normal part of growing up",
          emoji: "😊",
          description: "Correct! It happens to everyone.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide in your room",
          emoji: "🚪",
          description: "No need to hide.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Hair also grows on legs.",
      options: [
        {
          id: "a",
          text: "Panic",
          emoji: "😱",
          description: "Stay calm, it's normal.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It's okay, bodies change",
          emoji: "🦵",
          description: "Yes! Your body is changing.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Wear pants forever",
          emoji: "👖",
          description: "Wear what you like!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Does growing hair hurt?",
      options: [
        {
          id: "a",
          text: "Yes, a lot",
          emoji: "😫",
          description: "Growing hair doesn't hurt.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, you don't feel it",
          emoji: "😌",
          description: "Correct! It's painless.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only on Tuesdays",
          emoji: "📅",
          description: "It never hurts.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why do we have hair?",
      options: [
        {
          id: "a",
          text: "To look like bears",
          emoji: "🐻",
          description: "We are not bears.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It protects our skin and keeps us warm",
          emoji: "🛡️",
          description: "Yes! Hair has a job.",
          isCorrect: true
        },
        {
          id: "c",
          text: "To annoy us",
          emoji: "😤",
          description: "It's not there to annoy you.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "If you have questions about your body...",
      options: [
        {
          id: "a",
          text: "Ask a parent or doctor",
          emoji: "🗣️",
          description: "Correct! They can explain.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Guess",
          emoji: "🤔",
          description: "Better to ask.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask your pet",
          emoji: "🐶",
          description: "Pets don't know body science.",
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
      title="Hair Growth Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={84}
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

export default HairGrowthStory;