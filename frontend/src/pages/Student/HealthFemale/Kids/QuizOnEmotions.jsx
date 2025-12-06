import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnEmotions = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-52";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is it okay to feel sad sometimes?",
      options: [
        {
          id: "a",
          text: "No, never",
          emoji: "🙅‍♀️",
          description: "Everyone feels sad sometimes.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, it is normal",
          emoji: "✅",
          description: "Correct! All feelings are okay.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if you fall down",
          emoji: "🤕",
          description: "Not just then.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What helps when you are angry?",
      options: [
        {
          id: "a",
          text: "Taking deep breaths",
          emoji: "🌬️",
          description: "Yes! Breathing calms you down.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Screaming at a friend",
          emoji: "📢",
          description: "That hurts feelings.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Breaking a toy",
          emoji: "🔨",
          description: "Don't break things.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How do you know how a friend feels?",
      options: [
        {
          id: "a",
          text: "Guess",
          emoji: "🤔",
          description: "Asking is better.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Look at their face or ask them",
          emoji: "👀",
          description: "Correct! Faces show feelings.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them",
          emoji: "🙈",
          description: "Pay attention to friends.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "If you are very worried, what should you do?",
      options: [
        {
          id: "a",
          text: "Hide under the bed",
          emoji: "🛌",
          description: "Hiding doesn't solve it.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Talk to a trusted adult",
          emoji: "🗣️",
          description: "Yes! They can help.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Run away",
          emoji: "🏃‍♀️",
          description: "Stay safe and talk.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What makes you feel happy?",
      options: [
        {
          id: "a",
          text: "Getting hurt",
          emoji: "🤕",
          description: "That hurts!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Doing things I love",
          emoji: "🎨",
          description: "Correct! Hobbies bring joy.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Being mean",
          emoji: "😠",
          description: "Being mean feels bad later.",
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
      title="Quiz on Emotions"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={88}
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

export default QuizOnEmotions;