import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenStressDay = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Morning Rush",
      description: "You wake up late and have an important exam. What do you do?",
      options: [
        {
          id: "a",
          text: "Stay calm, get ready quickly, and review key points",
          emoji: "⏰",
          description: "Composed approach helps you perform better",
          isCorrect: true
        },
        {
          id: "b",
          text: "Panic and rush without any preparation",
          emoji: "😰",
          description: "Panic reduces your ability to think clearly",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip the exam and stay in bed",
          emoji: "😴",
          description: "Avoidance prevents learning and growth",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Practice Session",
      description: "During practice, you make several mistakes. How do you respond?",
      options: [
        {
          id: "a",
          text: "Learn from mistakes and practice more",
          emoji: "📈",
          description: "Growth mindset leads to improvement",
          isCorrect: true
        },
        {
          id: "b",
          text: "Get frustrated and give up",
          emoji: "😤",
          description: "Frustration blocks learning and progress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame others for your mistakes",
          emoji: "😠",
          description: "Blaming prevents taking responsibility for growth",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Lunch Break",
      description: "You're feeling overwhelmed with studies. What's your approach?",
      options: [
        {
          id: "a",
          text: "Take a proper break, eat well, and relax",
          emoji: "🍽️",
          description: "Rest and nutrition maintain energy and focus",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip lunch and continue studying",
          emoji: "📚",
          description: "Neglecting basic needs reduces effectiveness",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat junk food while multitasking",
          emoji: "🍟",
          description: "Poor nutrition and divided attention are counterproductive",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "After School",
      description: "You have extra classes and homework. How do you manage?",
      options: [
        {
          id: "a",
          text: "Prioritize tasks and allocate time wisely",
          emoji: "📋",
          description: "Good time management reduces stress and improves results",
          isCorrect: true
        },
        {
          id: "b",
          text: "Do everything last minute without planning",
          emoji: "⏳",
          description: "Poor planning increases stress and reduces quality",
          isCorrect: false
        },
        {
          id: "c",
          text: "Procrastinate and worry about tomorrow",
          emoji: "😴",
          description: "Delaying tasks increases tomorrow's stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Evening Wind-Down",
      description: "After a stressful day, how do you end your day?",
      options: [
        {
          id: "a",
          text: "Reflect positively, relax, and prepare for tomorrow",
          emoji: "🧘",
          description: "Positive reflection builds resilience for future challenges",
          isCorrect: true
        },
        {
          id: "b",
          text: "Worry about tomorrow and stay up late",
          emoji: "🌙",
          description: "Worrying and sleep deprivation increase stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Binge entertainment to escape reality",
          emoji: "📺",
          description: "Avoidance prevents processing and learning from experiences",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentScenario().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-emotional-health");
  };

  return (
    <GameShell
      title="Simulation: Teen Stress Day"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-58"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default SimulationTeenStressDay;