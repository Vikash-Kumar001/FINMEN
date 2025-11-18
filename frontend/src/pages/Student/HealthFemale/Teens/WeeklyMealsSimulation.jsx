import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WeeklyMealsSimulation = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const days = [
    {
      id: 1,
      name: "Monday",
      scenario: "It's the start of the school week. You're busy with morning prep. What breakfast do you choose?",
      options: [
        {
          id: "a",
          text: "Balanced breakfast with idli, sambar, and fruit",
          emoji: "🍛",
          description: "Provides energy and nutrients for the day ahead",
          isCorrect: true
        },
        {
          id: "b",
          text: "Instant noodles with no vegetables",
          emoji: "🍜",
          description: "Quick but lacks essential nutrients",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip breakfast to save time",
          emoji: "⏰",
          description: "Skipping breakfast reduces concentration and energy",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      name: "Tuesday",
      scenario: "You have sports practice after school. What do you pack for a post-practice snack?",
      options: [
        {
          id: "a",
          text: "Banana and a handful of nuts",
          emoji: "🍌",
          description: "Banana provides potassium, nuts provide protein and healthy fats",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chips and cola",
          emoji: "🍟",
          description: "Lacks nutrients needed for muscle recovery",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing, just rest",
          emoji: "😴",
          description: "Your body needs nutrients to recover properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      name: "Wednesday",
      scenario: "It's a busy day with back-to-back classes. What lunch do you choose?",
      options: [
        {
          id: "a",
          text: "Home-cooked meal with dal, roti, vegetables, and curd",
          emoji: "🍛",
          description: "Nutritious and balanced meal for sustained energy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fast food burger and fries",
          emoji: "🍔",
          description: "High in unhealthy fats and low in essential nutrients",
          isCorrect: false
        },
        {
          id: "c",
          text: "Instant noodles again",
          emoji: "🍜",
          description: "Lacks variety and essential nutrients",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      name: "Thursday",
      scenario: "You're studying for exams late. What do you eat for energy?",
      options: [
        {
          id: "a",
          text: "Light healthy snack like sprouts or fruit",
          emoji: "🥗",
          description: "Provides steady energy without causing drowsiness",
          isCorrect: true
        },
        {
          id: "b",
          text: "Chocolate and energy drinks",
          emoji: "🍫",
          description: "Sugar crash will reduce your study efficiency",
          isCorrect: false
        },
        {
          id: "c",
          text: "Heavy meal that makes you sleepy",
          emoji: "😴",
          description: "Heavy meals reduce concentration during study time",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      name: "Friday",
      scenario: "It's the end of the week. How do you plan your weekend meals?",
      options: [
        {
          id: "a",
          text: "Balanced meals with family, including traditional foods",
          emoji: "👨‍👩‍👧‍👦",
          description: "Maintains healthy habits while enjoying family time",
          isCorrect: true
        },
        {
          id: "b",
          text: "All fast food because it's convenient",
          emoji: "🍔",
          description: "Convenient but lacks nutrition and variety",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip meals to maintain weight",
          emoji: "📉",
          description: "Skipping meals is unhealthy and unsustainable",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentDay().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { day: currentDay, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentDay < days.length - 1) {
        setCurrentDay(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentDay = () => days[currentDay];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-drink-choice");
  };

  return (
    <GameShell
      title="Simulation: Weekly Meals"
      subtitle={`Day ${currentDay + 1} of ${days.length}: ${days[currentDay].name}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-18"
      gameType="health-female"
      totalLevels={20}
      currentLevel={18}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Day {currentDay + 1}/{days.length}: {days[currentDay].name}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Weekly Meal Planner</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentDay().scenario}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentDay().options.map(option => (
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

export default WeeklyMealsSimulation;