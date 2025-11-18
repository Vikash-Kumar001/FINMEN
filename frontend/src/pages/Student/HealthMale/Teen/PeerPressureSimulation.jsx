import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureSimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "At a party, friends offer you alcohol. What do you do?",
      options: [
        {
          id: "a",
          text: "Join them",
          emoji: "🍺",
          description: "Giving in to pressure can lead to dangerous situations",
          isCorrect: false
        },
        {
          id: "b",
          text: "Say No",
          emoji: "✋",
          description: "Clear refusal shows confidence and self-respect",
          isCorrect: true
        },
        {
          id: "c",
          text: "Walk Away",
          emoji: "🚶",
          description: "Removing yourself from pressure is a smart choice",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Friends say 'Everyone smokes, why don't you?' How do you respond?",
      options: [
        {
          id: "a",
          text: "Explain health reasons",
          emoji: "💬",
          description: "Sharing knowledge can educate others",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make excuses",
          emoji: "😅",
          description: "Being direct is more confident",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say 'I don't want to'",
          emoji: "✋",
          description: "Simple, clear refusal is effective",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "At school, classmates pressure you to try vaping. What's your strategy?",
      options: [
        {
          id: "a",
          text: "Tell a teacher",
          emoji: "📞",
          description: "Sometimes adult help is needed",
          isCorrect: false
        },
        {
          id: "b",
          text: "Change the subject",
          emoji: "💬",
          description: "Redirecting conversation avoids confrontation",
          isCorrect: true
        },
        {
          id: "c",
          text: "Try it to stop pressure",
          emoji: "💨",
          description: "Giving in creates more problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Online, friends challenge you to substance dares. How do you handle it?",
      options: [
        {
          id: "a",
          text: "Block and report",
          emoji: "🚫",
          description: "Protecting yourself online is important",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the messages",
          emoji: "🙈",
          description: "Addressing issues directly is better",
          isCorrect: false
        },
        {
          id: "c",
          text: "Accept the challenge",
          emoji: "✅",
          description: "Online dares can be dangerous",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What strengthens you against substance peer pressure?",
      options: [
        {
          id: "b",
          text: "Having clear personal values",
          emoji: "💪",
          description: "Strong values help resist negative influences",
          isCorrect: true
        },
        {
          id: "c",
          text: "Wanting approval",
          emoji: "👍",
          description: "Self-respect matters more than approval",
          isCorrect: false
        },
        {
          id: "a",
          text: "Going with the crowd",
          emoji: "👥",
          description: "Making independent choices shows maturity",
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

    setChoices([...choices, { step: currentStep, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentStep < scenarios.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentStep];

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-safe-teen");
  };

  return (
    <GameShell
      title="Simulation: Peer Pressure"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-88"
      gameType="health-male"
      totalLevels={90}
      currentLevel={88}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Peer Pressure Simulator</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentScenario().options.map(option => (
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

export default PeerPressureSimulation;
