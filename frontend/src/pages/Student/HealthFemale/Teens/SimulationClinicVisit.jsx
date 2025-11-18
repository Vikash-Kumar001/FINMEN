import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationClinicVisit = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Booking Appointment",
      description: "Teen needs to book a doctor's appointment. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Call the clinic and explain symptoms clearly",
          emoji: "📞",
          description: "Clear communication helps with appropriate scheduling",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid booking and hope symptoms disappear",
          emoji: "🙈",
          description: "Delaying care can worsen health conditions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Book the latest possible appointment",
          emoji: "⏳",
          description: "Timely care is important for health issues",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Waiting Room",
      description: "Teen arrives early but has to wait. How should she handle the wait?",
      options: [
        {
          id: "a",
          text: "Bring a book or quiet activity to pass time",
          emoji: "📚",
          description: "Preparation makes waiting more comfortable",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complain loudly about the wait time",
          emoji: "😠",
          description: "This creates tension and doesn't change wait times",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave and come back later without notice",
          emoji: "🏃",
          description: "This disrupts the appointment schedule",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Meeting the Doctor",
      description: "Doctor asks about symptoms. How should the teen respond?",
      options: [
        {
          id: "a",
          text: "Be honest and specific about symptoms and concerns",
          emoji: "✅",
          description: "Accurate information helps with proper diagnosis",
          isCorrect: true
        },
        {
          id: "b",
          text: "Minimize symptoms to avoid worry",
          emoji: "🤫",
          description: "Incomplete information can lead to misdiagnosis",
          isCorrect: false
        },
        {
          id: "c",
          text: "Exaggerate symptoms to get more attention",
          emoji: "🎭",
          description: "This can lead to unnecessary tests or treatments",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Following Advice",
      description: "Doctor gives health advice and prescribes medication. What should the teen do?",
      options: [
        {
          id: "a",
          text: "Ask questions to understand the treatment plan",
          emoji: "❓",
          description: "Understanding improves compliance and outcomes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore advice and take medication irregularly",
          emoji: "❌",
          description: "Non-compliance reduces treatment effectiveness",
          isCorrect: false
        },
        {
          id: "c",
          text: "Follow advice only when convenient",
          emoji: "⏰",
          description: "Inconsistent adherence can worsen conditions",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Follow-up Care",
      description: "Doctor recommends a follow-up visit. How should the teen respond?",
      options: [
        {
          id: "a",
          text: "Schedule and attend the follow-up appointment",
          emoji: "📅",
          description: "Follow-up ensures treatment effectiveness",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip the follow-up if feeling better",
          emoji: "🏃",
          description: "Premature discontinuation can cause relapse",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only attend if symptoms return",
          emoji: "🤒",
          description: "Preventive follow-up is often more effective",
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
    navigate("/student/health-female/teens/reflex-teen-alert");
  };

  return (
    <GameShell
      title="Simulation: Clinic Visit"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-78"
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

export default SimulationClinicVisit;