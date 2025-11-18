import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTimeBalance = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Exam Week + Sports Practice",
      description: "Teen has exams this week and sports practice every day. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Create a schedule that balances study and practice time",
          emoji: "📅",
          description: "Planning helps manage both commitments effectively",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip sports practice to focus only on studying",
          emoji: "📚",
          description: "This neglects physical health and team commitments",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focus only on sports and hope for the best on exams",
          emoji: "🏃",
          description: "Academic responsibilities are equally important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Friend's Party vs. Study Time",
      description: "A friend invites you to a party during your regular study time. How do you respond?",
      options: [
        {
          id: "a",
          text: "Attend the party but reschedule study time for later",
          emoji: "🎉",
          description: "Flexibility within boundaries maintains both social and academic health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cancel all study plans to attend the party",
          emoji: "🥳",
          description: "Consistent study habits are important for academic success",
          isCorrect: false
        },
        {
          id: "c",
          text: "Decline the party to stick to study schedule",
          emoji: "📚",
          description: "Social connections are also important for well-being",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Weekend Plans",
      description: "You have a full weekend with family time, study group, and personal projects. How do you organize?",
      options: [
        {
          id: "a",
          text: "Prioritize tasks and allocate time blocks for each activity",
          emoji: "⏰",
          description: "Strategic planning maximizes productivity and enjoyment",
          isCorrect: true
        },
        {
          id: "b",
          text: "Do whatever feels most appealing at the moment",
          emoji: "😊",
          description: "Impulse-based decisions can lead to imbalance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try to do everything at once, multitasking constantly",
          emoji: "🔄",
          description: "Multitasking often reduces effectiveness of all activities",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Late Night Dilemma",
      description: "It's 10 PM and you're enjoying a movie, but you planned to sleep by 9:30. What do you do?",
      options: [
        {
          id: "a",
          text: "Finish the current episode and go to sleep 30 minutes late",
          emoji: "📺",
          description: "Small flexibility maintains both enjoyment and routine",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay up until the end of the movie, even if it's very late",
          emoji: "🎬",
          description: "Consistent sleep schedules are important for health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stop the movie immediately and go to sleep",
          emoji: "😴",
          description: "Rigid adherence can reduce quality of life",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Unexpected Opportunity",
      description: "A mentor offers you a valuable internship opportunity that conflicts with some planned activities. How do you respond?",
      options: [
        {
          id: "a",
          text: "Evaluate the opportunity and adjust your schedule accordingly",
          emoji: "💼",
          description: "Strategic adjustments can enhance long-term goals",
          isCorrect: true
        },
        {
          id: "b",
          text: "Accept without considering impact on other commitments",
          emoji: "✅",
          description: "Balanced evaluation prevents overcommitment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Decline to avoid disrupting your current schedule",
          emoji: "❌",
          description: "Growth opportunities should be considered thoughtfully",
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
    navigate("/student/health-female/teens/reflex-teen-alert-habits");
  };

  return (
    <GameShell
      title="Simulation: Time Balance"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-98"
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

export default SimulationTimeBalance;