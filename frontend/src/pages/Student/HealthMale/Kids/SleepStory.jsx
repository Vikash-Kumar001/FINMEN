import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SleepStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-95";
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
      text: "It's 8:00 PM. What should you do?",
      options: [
        {
          id: "b",
          text: "Start a new movie",
          emoji: "🎬",
          description: "Movies keep you awake too late.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Eat a big meal",
          emoji: "🍔",
          description: "Eating late can give you a tummy ache.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Start getting ready for bed",
          emoji: "🥱",
          description: "A routine helps you sleep better.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What helps you relax before sleep?",
      options: [
        {
          id: "c",
          text: "Playing video games",
          emoji: "🎮",
          description: "Screens wake up your brain.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Reading a book",
          emoji: "📖",
          description: "Reading calms your mind.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Running laps",
          emoji: "🏃",
          description: "Exercise wakes up your body.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your room should be...",
      options: [
        {
          id: "b",
          text: "Bright and noisy",
          emoji: "📢",
          description: "Noise and light keep you awake.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Dark and quiet",
          emoji: "🌙",
          description: "Darkness tells your body it's sleep time.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Full of toys",
          emoji: "🧸",
          description: "Too many toys can be distracting.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is sleep important?",
      options: [
        {
          id: "a",
          text: "It helps you grow and learn",
          emoji: "📈",
          description: "Your brain and body work while you sleep.",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's boring",
          emoji: "😐",
          description: "Sleep is vital, not boring!",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "It wastes time",
          emoji: "⏳",
          description: "Sleep is the best use of time for health.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You wake up feeling...",
      options: [
        {
          id: "b",
          text: "Grumpy",
          emoji: "😠",
          description: "Good sleep makes you happy!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tired",
          emoji: "😫",
          description: "Good sleep gives you energy.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Happy and energized",
          emoji: "😄",
          description: "Ready for a great day!",
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
    navigate("/student/health-male/kids/good-habits-poster");
  };

  return (
    <GameShell
      title="Sleep Story"
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

export default SleepStory;
