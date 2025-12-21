import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GoodHabitsPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-96";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stages = [
    {
      id: 1,
      title: "Morning Star",
      question: "Which poster shows a great morning?",
      options: [
        {
          id: "a",
          text: "Wake Up Happy",
          emoji: "☀️",
          description: "Start the day with a smile!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sleep In Late",
          emoji: "🛌",
          description: "Sleeping too late wastes the morning.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip Breakfast",
          emoji: "🍽️",
          description: "Breakfast gives you fuel.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Clean & Fresh",
      question: "Which poster shows good hygiene?",
      options: [
        {
          id: "b",
          text: "Messy Hair",
          emoji: "🦁",
          description: "Combing hair looks neat.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Dirty Clothes",
          emoji: "👕",
          description: "Wear clean clothes every day.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brush & Wash",
          emoji: "🚿",
          description: "Clean body feels great!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      title: "Active Kid",
      question: "Which poster shows a healthy activity?",
      options: [
        {
          id: "b",
          text: "Play Video Games",
          emoji: "🎮",
          description: "Limit screen time.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ride Bike",
          emoji: "🚲",
          description: "Biking is great exercise!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Sit on Couch",
          emoji: "🛋️",
          description: "Sitting too long isn't healthy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Smart Eater",
      question: "Which poster shows smart eating?",
      options: [
        {
          id: "c",
          text: "Skip Lunch",
          emoji: "🚫",
          description: "Your body needs food energy.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only Dessert",
          emoji: "🍰",
          description: "Too much sugar is bad.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Balanced Meal",
          emoji: "🥗",
          description: "Protein, veggies, and grains!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Sleep Tight",
      question: "Which poster shows good sleep?",
      options: [
        {
          id: "b",
          text: "Sleep on Floor",
          emoji: "🧱",
          description: "A bed is more comfortable.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Early Bedtime",
          emoji: "🛌",
          description: "Early to bed, early to rise!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stay Up All Night",
          emoji: "🦉",
          description: "You need rest to grow.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      // Show feedback for incorrect answer and move to next question
      showCorrectAnswerFeedback(0, false);
      
      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/habits-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Good Habits Poster"
      subtitle={`Poster ${currentStage + 1} of ${stages.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{currentS.title}</h3>
            <p className="text-white/90 text-lg">{currentS.question}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentS.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/20 transition-all transform hover:scale-105 flex flex-col items-center gap-4 group"
                disabled={gameFinished}
              >
                <div className="text-6xl group-hover:scale-110 transition-transform">
                  {option.emoji}
                </div>
                <div className="text-white font-bold text-xl text-center">
                  {option.text}
                </div>
                <p className="text-white/70 text-sm text-center">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default GoodHabitsPoster;
