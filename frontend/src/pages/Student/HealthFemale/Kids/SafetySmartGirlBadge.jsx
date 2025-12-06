import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetySmartGirlBadge = () => {
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
      text: "To earn the 'Germ Buster' badge you must...",
      options: [
        {
          id: "a",
          text: "Never wash hands",
          emoji: "🦠",
          description: "Keep hands clean!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands with soap often",
          emoji: "🧼",
          description: "Correct! That busts germs.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Share tissues",
          emoji: "🤧",
          description: "Don't share used tissues.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The 'Safe Rider' badge is given for...",
      options: [
        {
          id: "a",
          text: "Standing up in the bus",
          emoji: "🚌",
          description: "Sit down safely.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Riding with no hands",
          emoji: "🚲",
          description: "Hold on tight!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wearing a helmet and seatbelt",
          emoji: "⛑️",
          description: "Yes! Safety gear is key.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "How do you get the 'Doctor's Helper' badge?",
      options: [
        {
          id: "a",
          text: "Running away from shots",
          emoji: "🏃‍♀️",
          description: "Be brave for shots.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Being brave and following advice",
          emoji: "🦸‍♀️",
          description: "Correct! Help the doctor help you.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Yelling loudly",
          emoji: "📢",
          description: "Use your inside voice.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What makes you a 'Prevention Pro'?",
      options: [
        {
          id: "b",
          text: "Eating well, sleeping, and playing safely",
          emoji: "🌟",
          description: "Yes! Healthy habits prevent sickness.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Sleeping only 1 hour",
          emoji: "🕐",
          description: "You need more sleep.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Eating only chips",
          emoji: "🥔",
          description: "Chips aren't enough nutrition.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who keeps you safe?",
      options: [
        {
          id: "a",
          text: "Only chance/luck",
          emoji: "🎲",
          description: "Don't rely on luck.",
          isCorrect: false
        },
        {
          id: "b",
          text: "You, parents, and doctors",
          emoji: "👪",
          description: "Exactly! It's a team effort.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Magic",
          emoji: "✨",
          description: "Safety is real, not magic.",
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
      title="Badge: Safety Smart Girl"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={70}
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

export default SafetySmartGirlBadge;