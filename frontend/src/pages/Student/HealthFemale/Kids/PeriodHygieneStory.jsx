import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodHygieneStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-45";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is a period a sickness?",
      options: [
        {
          id: "a",
          text: "Yes, call a doctor",
          emoji: "🚑",
          description: "It is not an illness.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, it's a normal body change",
          emoji: "🌸",
          description: "Correct! It means you are growing.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Yes, stay in bed forever",
          emoji: "🛌",
          description: "You can still do things.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do you use for a period?",
      options: [
        {
          id: "a",
          text: "Band-aids",
          emoji: "🩹",
          description: "Band-aids are for cuts.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Pads or Tampons",
          emoji: "🩸",
          description: "Yes! They keep you clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Paper towels not made for it",
          emoji: "🧻",
          description: "Use proper supplies.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How often should you change a pad?",
      options: [
        {
          id: "a",
          text: "Every few hours",
          emoji: "⏰",
          description: "Correct! To stay fresh.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once a week",
          emoji: "📅",
          description: "That is too long.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never",
          emoji: "🙅‍♀️",
          description: "You must change it.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "If you have cramps (tummy ache)...",
      options: [
        {
          id: "a",
          text: "Scream",
          emoji: "😱",
          description: "Try to relax.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Use a warm heating pad or rest",
          emoji: "🌡️",
          description: "Yes! Warmth helps.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Jump on a trampoline",
          emoji: "🤸‍♀️",
          description: "Rest is better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who can you talk to about periods?",
      options: [
        {
          id: "a",
          text: "Mom, Aunt, or older sister",
          emoji: "👩‍🦳",
          description: "Correct! Women can help.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only pets",
          emoji: "🐱",
          description: "Talk to an adult.",
          isCorrect: false
        },
        {
          id: "c",
          text: "No one",
          emoji: "🤐",
          description: "It is okay to talk about it.",
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
      title="Period Hygiene Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={98}
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

export default PeriodHygieneStory;