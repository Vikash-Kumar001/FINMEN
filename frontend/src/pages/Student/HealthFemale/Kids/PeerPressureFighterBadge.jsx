import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureFighterBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-70";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "To earn the 'Brave Voice' badge, you must...",
      options: [
        {
          id: "a",
          text: "Never speak",
          emoji: "🙊",
          description: "You need to use your voice.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Say 'NO' to unsafe things",
          emoji: "🛑",
          description: "Correct! Be brave and say no.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Yell at everyone",
          emoji: "📣",
          description: "Yelling isn't brave, it's loud.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The 'Friendship Hero' badge is for...",
      options: [
        {
          id: "a",
          text: "Helping friends make good choices",
          emoji: "🦸‍♀️",
          description: "Yes! Heroes help friends.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Being the boss of everyone",
          emoji: "👑",
          description: "Heroes serve, not boss.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring friends",
          emoji: "🙈",
          description: "Heroes don't ignore friends.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How do you get the 'Smart Choice' badge?",
      options: [
        {
          id: "a",
          text: "Do what everyone else does",
          emoji: "🐑",
          description: "Think for yourself.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Think about safety first",
          emoji: "🧠",
          description: "Correct! Safety first makes you smart.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Flip a coin",
          emoji: "🪙",
          description: "Don't gamble with choices.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The 'Kindness Captain' badge requires...",
      options: [
        {
          id: "a",
          text: "Including others in games",
          emoji: "🤝",
          description: "Yes! Always include others.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only playing alone",
          emoji: "🧍",
          description: "Captains lead by including.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Taking all the toys",
          emoji: "🧸",
          description: "Sharing is caring.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who is a 'Respect Ranger'?",
      options: [
        {
          id: "a",
          text: "Someone who teases",
          emoji: "😜",
          description: "Teasing shows no respect.",
          isCorrect: false
        },
    
        {
          id: "c",
          text: "Someone who interrupts",
          emoji: "✋",
          description: "Interrupting is rude.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Someone who listens and cares",
          emoji: "👂",
          description: "Exactly! Respect means listening.",
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
      title="Badge: Peer Pressure Fighter"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={60}
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

export default PeerPressureFighterBadge;