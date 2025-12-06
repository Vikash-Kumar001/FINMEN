import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyStoryTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-21";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice your voice cracking when you talk. What's happening?",
      options: [
        {
          id: "b",
          text: "You are losing your voice",
          emoji: "😶",
          description: "It's not gone, just changing.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your voice box is growing",
          emoji: "🗣️",
          description: "It's a normal part of puberty.",
          isCorrect: true
        },
        {
          id: "c",
          text: "You shouted too much",
          emoji: "📢",
          description: "Even quiet teens get voice cracks.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You feel angry for no reason sometimes. Is this normal?",
      options: [
        {
          id: "c",
          text: "No, you are bad",
          emoji: "😈",
          description: "Emotions don't make you bad.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, it's hormones",
          emoji: "🧪",
          description: "Hormones can cause mood swings.",
          isCorrect: true
        },
        {
          id: "b",
          text: "You need more sleep only",
          emoji: "😴",
          description: "Sleep helps, but hormones are the cause.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You are growing taller very fast. What do you need?",
      options: [
        {
          id: "b",
          text: "Less food",
          emoji: "🍽️",
          description: "You need fuel to grow!",
          isCorrect: false
        },
        {
          id: "c",
          text: "More coffee",
          emoji: "☕",
          description: "Caffeine can stunt growth.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Healthy food and sleep",
          emoji: "🥗",
          description: "Your body needs resources to build.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You start sweating more. What should you do?",
      options: [
        {
          id: "c",
          text: "Stop exercising",
          emoji: "🛑",
          description: "Exercise is good for you.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Use deodorant",
          emoji: "🧴",
          description: "Hygiene helps manage sweat.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wear heavy clothes",
          emoji: "🧥",
          description: "That makes you sweat more.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see hair growing on your face. Should you shave?",
      options: [
        {
          id: "b",
          text: "You must shave daily",
          emoji: "🪒",
          description: "Only if you want to.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Pluck it out",
          emoji: "🤏",
          description: "That hurts and isn't efficient.",
          isCorrect: false
        },
        {
          id: "a",
          text: "It's your choice",
          emoji: "🧔",
          description: "Shave or grow it, it's up to you.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/quiz-puberty-teen");
  };

  return (
    <GameShell
      title="Puberty Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PubertyStoryTeen;
