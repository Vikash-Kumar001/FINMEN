import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowingUpPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-85";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What slogan fits a 'Growing Up' poster?",
      options: [
        {
          id: "a",
          text: "Stay Small Forever",
          emoji: "👶",
          description: "Everyone grows up.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Growing is Amazing!",
          emoji: "🌟",
          description: "Correct! It is a special time.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Growing is Bad",
          emoji: "👎",
          description: "Growing is good!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What picture shows a changing body?",
      options: [
        {
          id: "a",
          text: "Getting taller",
          emoji: "📏",
          description: "Yes! Height changes a lot.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Staying the same",
          emoji: "⏸️",
          description: "Bodies don't stay the same.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Turning into a fish",
          emoji: "🐟",
          description: "Humans don't become fish.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How do you feel about growing?",
      options: [
        {
          id: "a",
          text: "Excited and Proud",
          emoji: "🤩",
          description: "Correct! Be proud of your body.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Scared",
          emoji: "😨",
          description: "It's okay, but don't be scared.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing",
          emoji: "😐",
          description: "It's a big change!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Who helps you understand changes?",
      options: [
        {
          id: "a",
          text: "The TV",
          emoji: "📺",
          description: "TV isn't always right.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Mom or a trusted adult",
          emoji: "👩‍👧",
          description: "Yes! Talk to them.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Strangers online",
          emoji: "💻",
          description: "Not safe.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Growing up means...",
      options: [
        {
          id: "a",
          text: "Less fun",
          emoji: "😔",
          description: "It's still fun!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Learning new things about yourself",
          emoji: "🧠",
          description: "Correct! You discover who you are.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eating only candy",
          emoji: "🍬",
          description: "No, better food needed.",
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
      title="Poster: Growing Up"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={85}
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

export default GrowingUpPoster;