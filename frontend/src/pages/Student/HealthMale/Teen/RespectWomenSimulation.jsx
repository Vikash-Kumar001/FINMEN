import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectWomenSimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "Teen hears friends make rude jokes about girls. Should he join or stop?",
      options: [
        {
          id: "a",
          text: "Join in to fit in",
          emoji: "😏",
          description: "Joining disrespectful behavior harms everyone",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stop them politely",
          emoji: "✋",
          description: "Speaking up against disrespect shows character",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore and stay silent",
          emoji: "😶",
          description: "Silence can enable harmful behavior",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you respond to disrespectful comments about women?",
      options: [
        {
          id: "c",
          text: "Laugh along",
          emoji: "😂",
          description: "Laughing encourages disrespectful behavior",
          isCorrect: false
        },
        {
          id: "a",
          text: "Call them out directly",
          emoji: "🗣️",
          description: "Direct confrontation can escalate situations",
          isCorrect: false
        },
        {
          id: "b",
          text: "Change the subject respectfully",
          emoji: "💬",
          description: "Redirecting conversation promotes positive dialogue",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What shows respect towards women in daily interactions?",
      options: [
        {
          id: "a",
          text: "Opening doors for them",
          emoji: "🚪",
          description: "Respect is about equality, not just gestures",
          isCorrect: false
        },
        {
          id: "c",
          text: "Listening to their opinions",
          emoji: "👂",
          description: "Valuing everyone's voice shows true respect",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complimenting their appearance",
          emoji: "😊",
          description: "Respect goes beyond physical compliments",
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
    navigate("/student/health-male/teens/reflex-respect-check");
  };

  return (
    <GameShell
      title="Simulation: Respect Women"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-68"
      gameType="health-male"
      totalLevels={70}
      currentLevel={68}
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
            <h3 className="text-2xl font-bold text-white mb-2">Respect Simulator</h3>
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

export default RespectWomenSimulation;
