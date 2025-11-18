import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenDaySimulation = () => {
  const navigate = useNavigate();
  const [currentHour, setCurrentHour] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const hours = [
    {
      id: 1,
      time: "7:00 AM",
      scenario: "You wake up for school. What's your morning routine?",
      options: [
        {
          id: "a",
          text: "Brush teeth, shower, eat breakfast",
          emoji: "🦷",
          description: "Good hygiene and nutrition start your day right",
          isCorrect: true
        },
        {
          id: "b",
          text: "Quick brush and skip shower",
          emoji: "⏰",
          description: "Incomplete hygiene may affect your confidence",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip hygiene completely",
          emoji: "😴",
          description: "Poor hygiene affects health and social interactions",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      time: "10:00 AM",
      scenario: "You feel a bit hungry between classes. What do you choose?",
      options: [
        {
          id: "a",
          text: "Healthy snack like fruit or nuts",
          emoji: "🍎",
          description: "Provides steady energy without sugar crash",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chips from vending machine",
          emoji: "🍟",
          description: "High in unhealthy fats and low in nutrients",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing, just wait for lunch",
          emoji: "枵",
          description: "Skipping meals can reduce concentration",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      time: "1:00 PM",
      scenario: "It's lunch time. How do you approach your meal?",
      options: [
        {
          id: "a",
          text: "Balanced meal with dal, roti, vegetables",
          emoji: "🍛",
          description: "Nutritious meal provides energy for afternoon activities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fast food from outside",
          emoji: "🍔",
          description: "High in unhealthy fats and low in essential nutrients",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip lunch to save time",
          emoji: "⏳",
          description: "Skipping meals reduces energy and concentration",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      time: "4:00 PM",
      scenario: "You're feeling stressed after school. How do you manage?",
      options: [
        {
          id: "a",
          text: "Take a walk or do light exercise",
          emoji: "🚶",
          description: "Physical activity helps reduce stress naturally",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eat comfort food to feel better",
          emoji: "🍦",
          description: "Temporary relief but may cause energy crashes",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just sit and worry about assignments",
          emoji: "😰",
          description: "Worrying without action increases stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      time: "8:00 PM",
      scenario: "Before bed, what's your evening routine?",
      options: [
        {
          id: "a",
          text: "Clean face, change into clean clothes, relax",
          emoji: "😴",
          description: "Good hygiene and relaxation promote better sleep",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just change clothes quickly",
          emoji: "🏃",
          description: "Incomplete hygiene may lead to skin issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay up late on phone/social media",
          emoji: "📱",
          description: "Poor sleep affects growth and concentration",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentHour().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { hour: currentHour, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentHour < hours.length - 1) {
        setCurrentHour(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentHour = () => hours[currentHour];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-teen-health");
  };

  return (
    <GameShell
      title="Simulation: Teen Day"
      subtitle={`Time ${currentHour + 1} of ${hours.length}: ${hours[currentHour].time}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-28"
      gameType="health-female"
      totalLevels={30}
      currentLevel={28}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Time {currentHour + 1}/{hours.length}: {hours[currentHour].time}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Day Simulator</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentHour().scenario}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentHour().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default TeenDaySimulation;