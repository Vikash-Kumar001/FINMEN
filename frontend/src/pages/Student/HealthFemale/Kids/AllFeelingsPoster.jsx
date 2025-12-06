import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AllFeelingsPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-56";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What title fits a poster about feelings?",
      options: [
        {
          id: "a",
          text: "Robots Have No Feelings",
          emoji: "🤖",
          description: "This poster is about you.",
          isCorrect: false
        },
        {
          id: "b",
          text: "All Feelings Are Okay!",
          emoji: "🌈",
          description: "Correct! That is a great message.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only Smiles Allowed",
          emoji: "🙂",
          description: "Other feelings exist too.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which image shows 'sadness'?",
      options: [
        {
          id: "a",
          text: "A blue rain cloud",
          emoji: "🌧️",
          description: "Yes! That feels sad.",
          isCorrect: true
        },
        {
          id: "b",
          text: "A bright sun",
          emoji: "☀️",
          description: "Sun usually means happy.",
          isCorrect: false
        },
        {
          id: "c",
          text: "A pizza",
          emoji: "🍕",
          description: "Pizza is food.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which image shows 'anger'?",
      options: [
        {
          id: "a",
          text: "A sleeping cat",
          emoji: "🐱",
          description: "That is calm.",
          isCorrect: false
        },
        {
          id: "b",
          text: "A red fire or volcano",
          emoji: "🌋",
          description: "Correct! Anger feels hot like fire.",
          isCorrect: true
        },
        {
          id: "c",
          text: "A flower",
          emoji: "🌸",
          description: "Flowers are peaceful.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps all feelings?",
      options: [
        {
          id: "a",
          text: "Talking, hugging, breathing",
          emoji: "🤗",
          description: "Yes! Those are good tools.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yelling loudly",
          emoji: "📢",
          description: "Yelling might scare others.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring them",
          emoji: "🙈",
          description: "Feel your feelings.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Where is it safe to have feelings?",
      options: [
        {
          id: "a",
          text: "Only in a box",
          emoji: "📦",
          description: "You can feel anywhere.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Anywhere, especially with safe people",
          emoji: "🏡",
          description: "Correct! It is safe to feel.",
          isCorrect: true
        },
        {
          id: "c",
          text: "On the moon",
          emoji: "🌑",
          description: "Safe on Earth too.",
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
      title="Poster: All Feelings"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={56}
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

export default AllFeelingsPoster;