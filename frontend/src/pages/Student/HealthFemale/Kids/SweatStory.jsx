import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SweatStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-41";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You just finished playing soccer and you're sweating. What should you do?",
      options: [
        {
          id: "a",
          text: "Sit in dirty clothes all day",
          emoji: "🤢",
          description: "Sweat can irritate your skin if left too long.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Take a shower or wash up",
          emoji: "🚿",
          description: "Correct! Washing away sweat keeps you fresh.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Put on perfume only",
          emoji: "🌸",
          description: "Perfume doesn't clean the sweat away.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why do we sweat?",
      options: [
        {
          id: "a",
          text: "To cool down our body",
          emoji: "🌡️",
          description: "Yes! It's like your body's air conditioning.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Because we are crying",
          emoji: "😢",
          description: "Sweat comes from skin pores, not eyes.",
          isCorrect: false
        },
        {
          id: "c",
          text: "To make our clothes wet",
          emoji: "👕",
          description: "That happens, but it's not the reason!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps if your underarms smell after sweating?",
      options: [
        {
          id: "a",
          text: "Ignoring it",
          emoji: "🤷‍♀️",
          description: "It's better to address it so you feel confident.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wearing heavy wool",
          emoji: "🧥",
          description: "That might make you sweat more!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Using mild deodorant",
          emoji: "🧼",
          description: "Good choice! It helps with body odor.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "When is it important to wash your face?",
      options: [
        {
          id: "a",
          text: "Never",
          emoji: "🚫",
          description: "Your face needs cleaning too.",
          isCorrect: false
        },
        {
          id: "b",
          text: "After sweating or playing",
          emoji: "⚽",
          description: "Exactly! Keep those pores clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only on birthdays",
          emoji: "🎂",
          description: "You should wash more often than that!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Wearing clean clothes helps you avoid...",
      options: [
        {
          id: "a",
          text: "Body odor and germs",
          emoji: "🦠",
          description: "Correct! Bacteria loves damp, dirty clothes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Homework",
          emoji: "📚",
          description: "Nice try, but clothes don't do homework!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Growing tall",
          emoji: "📏",
          description: "Clothes don't stop you from growing.",
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
      title="Sweat Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={41}
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

export default SweatStory;