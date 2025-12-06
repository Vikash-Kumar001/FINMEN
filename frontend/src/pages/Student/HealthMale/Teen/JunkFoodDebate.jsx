import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JunkFoodDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-16";
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
      title: "The Craving",
      question: "Is it okay to eat junk food sometimes?",
      options: [
        {
          id: "a",
          text: "Yes, in moderation",
          emoji: "⚖️",
          description: "Treats are fine occasionally.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, never ever",
          emoji: "🚫",
          description: "Too strict can lead to binges.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Yes, every day",
          emoji: "🍔",
          description: "That's unhealthy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Peer Pressure",
      question: "Friends are eating pizza. What do you do?",
      options: [
        {
          id: "b",
          text: "Eat 10 slices",
          emoji: "🍕",
          description: "Overeating makes you sluggish.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Have 1-2 slices & salad",
          emoji: "🥗",
          description: "Balance is key.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Sit and starve",
          emoji: "🤐",
          description: "You can enjoy food socially.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Energy Levels",
      question: "Does junk food give you good energy?",
      options: [
        {
          id: "c",
          text: "Yes, forever",
          emoji: "🔋",
          description: "No, it's short-lived.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It makes you super strong",
          emoji: "💪",
          description: "It usually makes you tired.",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, it causes a crash",
          emoji: "📉",
          description: "Sugar highs are followed by lows.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Cost",
      question: "Is junk food cheaper than home cooking?",
      options: [
        {
          id: "b",
          text: "Always cheaper",
          emoji: "💸",
          description: "Not always, and health costs add up.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Home cooking saves money",
          emoji: "🏠",
          description: "Buying ingredients is usually cheaper.",
          isCorrect: true
        },
        {
          id: "c",
          text: "They cost the same",
          emoji: "🤷",
          description: "Eating out is usually pricier.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Future Health",
      question: "What happens if you only eat junk?",
      options: [
        {
          id: "c",
          text: "You become a superhero",
          emoji: "🦸",
          description: "Unlikely.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Nothing changes",
          emoji: "😐",
          description: "Your body will suffer.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Health problems later",
          emoji: "🏥",
          description: "Heart issues, diabetes, etc.",
          isCorrect: true
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
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/diet-change-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Junk Food Debate"
      subtitle={`Topic ${currentStage + 1} of ${stages.length}`}
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

export default JunkFoodDebate;
