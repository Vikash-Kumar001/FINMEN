import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyMatchesPuzzle = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-94";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What matches with 'Eating Fruits & Veggies'?",
      options: [
        {
          id: "a",
          text: "Feeling tired",
          emoji: "😴",
          description: "Healthy food gives energy, not tiredness.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Strong, healthy body",
          emoji: "💪",
          description: "Correct! Good food builds a strong body.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Gets you sick",
          emoji: "🤒",
          description: "Vitamins help fight sickness.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Bad dreams",
          emoji: "👻",
          description: "Food doesn't cause bad dreams.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the best match for 'Regular Exercise'?",
      options: [
        {
          id: "a",
          text: "Strong heart and muscles",
          emoji: "❤️",
          description: "Yes! Exercise keeps your heart happy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Watching TV",
          emoji: "📺",
          description: "That is the opposite of exercise.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eating candy",
          emoji: "🍬",
          description: "That is not a match for exercise.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Sleeping all day",
          emoji: "🛌",
          description: "Your body needs to move.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What matches with 'Brushing Teeth'?",
      options: [
        {
          id: "a",
          text: "Yellow smile",
          emoji: "😬",
          description: "Brushing makes teeth white.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Dirty hands",
          emoji: "👐",
          description: "That's about washing hands.",
          isCorrect: false
        },
        {
          id: "c",
          text: "No cavities and fresh breath",
          emoji: "✨",
          description: "Correct! Keep those teeth shiny!",
          isCorrect: true
        },
        {
          id: "d",
          text: "Messy hair",
          emoji: "🤪",
          description: "That's about combing hair.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What matches with 'Getting enough sleep'?",
      options: [
        {
          id: "a",
          text: "Energy for the day",
          emoji: "⚡",
          description: "Yes! Sleep recharges your battery.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Being grumpy",
          emoji: "😠",
          description: "Lack of sleep makes you grumpy.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Falling down",
          emoji: "😵",
          description: "Sleep helps balance too.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Hungry tummy",
          emoji: "😋",
          description: "Sleep isn't about food.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What matches with 'Washing Hands'?",
      options: [
        {
          id: "a",
          text: "Dirty clothes",
          emoji: "👕",
          description: "That's about laundry.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Germs going away",
          emoji: "🦠",
          description: "Correct! Wash those germs away!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Messy room",
          emoji: "🧸",
          description: "That's about cleaning up toys.",
          isCorrect: false
        },
        {
          id: "d",
          text: "Loud noise",
          emoji: "📢",
          description: "Washing is quiet.",
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
      title="Puzzle: Healthy Matches"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={94}
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

export default HealthyMatchesPuzzle;