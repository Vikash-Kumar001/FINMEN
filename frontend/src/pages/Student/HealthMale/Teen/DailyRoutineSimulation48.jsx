import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyRoutineSimulation48 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-48";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const steps = [
    {
      id: 1,
      time: "7:00 AM",
      activity: "Wake up. First thing?",
      options: [
        {
          id: "b",
          text: "Check phone",
          emoji: "📱",
          description: "Start with hygiene.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Eat candy",
          emoji: "🍬",
          description: "Not a healthy breakfast.",
          isCorrect: false
        },
         {
          id: "a",
          text: "Brush teeth/Wash face",
          emoji: "🪥",
          description: "Fresh start.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      time: "7:15 AM",
      activity: "Getting dressed.",
      options: [
        {
          id: "c",
          text: "Wear yesterday's socks",
          emoji: "🧦",
          description: "Stinky!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Put on deodorant & clean clothes",
          emoji: "👕",
          description: "Ready for the day.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip underwear",
          emoji: "👖",
          description: "Wear clean underwear.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      time: "12:00 PM",
      activity: "Lunch time. Hands are dirty.",
      options: [
        {
          id: "b",
          text: "Eat immediately",
          emoji: "🍔",
          description: "Germs!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash hands first",
          emoji: "🧼",
          description: "Safe eating.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Lick fingers",
          emoji: "👅",
          description: "Gross.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      time: "4:00 PM",
      activity: "Back from sports.",
      options: [
        {
          id: "a",
          text: "Shower",
          emoji: "🚿",
          description: "Clean off sweat.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Sit on couch",
          emoji: "🛋️",
          description: "You are sweaty.",
          isCorrect: false
        },
        
        {
          id: "b",
          text: "Spray perfume",
          emoji: "🌸",
          description: "Masks smell only.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      time: "9:00 PM",
      activity: "Bedtime.",
      options: [
        {
          id: "b",
          text: "Sleep in jeans",
          emoji: "👖",
          description: "Uncomfortable.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Eat sugar",
          emoji: "🍭",
          description: "Bad for teeth and sleep.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brush teeth & wear PJs",
          emoji: "🛌",
          description: "Good night routine.",
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = steps[currentStep].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-hygiene-alert-49");
  };

  return (
    <GameShell
      title="Daily Routine Simulation"
      subtitle={`Time: ${steps[currentStep].time}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={steps.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{steps.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{steps[currentStep].time}</h3>
          <p className="text-white text-lg mb-6">
            {steps[currentStep].activity}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {steps[currentStep].options.map(option => (
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

export default DailyRoutineSimulation48;
