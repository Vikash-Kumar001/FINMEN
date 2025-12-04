import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DentistStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-78";
  const gameData = getGameDataById(gameId);

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
      text: "Who helps keep your teeth healthy?",
      options: [
        {
          id: "b",
          text: "The baker",
          emoji: "👨‍🍳",
          description: "Bakers make bread, not fix teeth",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "The gardener",
          emoji: "🌻",
          description: "Gardeners take care of plants",
          isCorrect: false
        },
        {
          id: "a",
          text: "The dentist",
          emoji: "🦷",
          description: "Dentists are doctors for your teeth",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "How often should you brush your teeth?",
      options: [
        {
          id: "a",
          text: "Twice a day",
          emoji: "☀️🌙",
          description: "Brush in the morning and before bed",
          isCorrect: true
        },
        {
          id: "c",
          text: "Once a week",
          emoji: "📅",
          description: "That's not enough to stop cavities",
          isCorrect: false
        },
        
        {
          id: "b",
          text: "Only on birthdays",
          emoji: "🎂",
          description: "You need to brush every day",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What food is bad for your teeth?",
      options: [
        {
          id: "b",
          text: "Apples",
          emoji: "🍎",
          description: "Apples are healthy and crunchy",
          isCorrect: false
        },
        {
          id: "a",
          text: "Sticky candy",
          emoji: "🍬",
          description: "Sugar sticks to teeth and causes cavities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Carrots",
          emoji: "🥕",
          description: "Carrots are good for your teeth",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What does floss do?",
      options: [
        {
          id: "c",
          text: "Makes teeth blue",
          emoji: "🔵",
          description: "Floss doesn't change tooth color",
          isCorrect: false
        },
        {
          id: "a",
          text: "Cleans between teeth",
          emoji: "🧵",
          description: "It removes food where your brush can't reach",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tastes like pizza",
          emoji: "🍕",
          description: "Floss usually tastes like mint",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why do we go to the dentist?",
      options: [
        {
          id: "b",
          text: "To get toys",
          emoji: "🧸",
          description: "We go for health, not just prizes",
          isCorrect: false
        },
        {
          id: "c",
          text: "To take a nap",
          emoji: "😴",
          description: "You need to be awake to open your mouth",
          isCorrect: false
        },
        {
          id: "a",
          text: "To check for cavities",
          emoji: "🔍",
          description: "Dentists catch problems early to keep teeth strong",
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
    navigate("/student/health-male/kids/reflex-healthy-steps");
  };

  return (
    <GameShell
      title="Dentist Story"
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

export default DentistStory;
