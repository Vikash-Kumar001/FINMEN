import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafeGirlBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-90";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "How do you earn the 'Safe Choice' badge?",
      options: [
        {
          id: "a",
          text: "Try alcohol once",
          emoji: "🍺",
          description: "Even once is unsafe.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Say NO to all harmful things",
          emoji: "🛡️",
          description: "Correct! That is a safe choice.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide in your room",
          emoji: "🚪",
          description: "Be confident, not hiding.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "To get the 'Strong Voice' badge...",
      options: [
        {
          id: "a",
          text: "Speak up if something feels wrong",
          emoji: "🗣️",
          description: "Yes! Use your strong voice.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Whisper your secrets",
          emoji: "🤫",
          description: "Speak up for safety.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never talk to adults",
          emoji: "🤐",
          description: "Trusted adults help you.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The 'Healthy Body' badge requires...",
      options: [
        {
          id: "a",
          text: "Eating only candy",
          emoji: "🍭",
          description: "Candy isn't healthy food.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Protecting your body from smoke and drugs",
          emoji: "🫁",
          description: "Correct! Keep your body clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Never bathing",
          emoji: "🚿",
          description: "Hygiene is important too.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What unlocks the 'Smart Friend' badge?",
      options: [
        {
          id: "a",
          text: "Influencing friends to be safe",
          emoji: "🤝",
          description: "Yes! Help friends be safe too.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Daring friends to be bad",
          emoji: "😈",
          description: "That is not being a smart friend.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring your friends",
          emoji: "🤷‍♀️",
          description: "Friends care about each other.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You are a 'Permission Pro' if you...",
      options: [
        {
          id: "a",
          text: "Take things without asking",
          emoji: "👐",
          description: "Always ask first.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask a parent before taking medicine or going somewhere",
          emoji: "🙋‍♀️",
          description: "Correct! Always ask for permission.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Guess if it's okay",
          emoji: "🤔",
          description: "Don't guess with safety.",
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
      title="Badge: Safe Girl"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={90}
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

export default SafeGirlBadge;