import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationCareerUpgrade = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "A teen has been working at a company for a year. She notices new technologies being used in her field. What should she do?",
      options: [
        {
          id: "a",
          text: "Take a course to learn the new technologies",
          emoji: "📖",
          description: "Perfect! Proactive learning keeps you relevant in your field",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the new technologies and continue as before",
          emoji: "😴",
          description: "Staying static limits career growth opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain about changes to coworkers",
          emoji: "😠",
          description: "Negativity doesn't advance your career or skills",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Her manager offers her a chance to lead a small project. How should she respond?",
      options: [
        {
          id: "a",
          text: "Accept the challenge to develop leadership skills",
          emoji: "💪",
          description: "Exactly! Taking on responsibilities builds valuable experience",
          isCorrect: true
        },
        {
          id: "b",
          text: "Decline because it might be too difficult",
          emoji: "😨",
          description: "Avoiding challenges limits professional development",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask someone else to do it for her",
          emoji: "🤷",
          description: "Delegating opportunities prevents personal growth",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "She receives feedback that her presentation skills need improvement. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Take a public speaking course and practice regularly",
          emoji: "🎤",
          description: "Perfect! Addressing weaknesses directly leads to improvement",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the feedback to protect her ego",
          emoji: "🛡️",
          description: "Avoiding feedback limits personal and professional growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame others for not understanding her presentations",
          emoji: "😠",
          description: "Deflecting responsibility prevents skill development",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A networking event is happening in her industry. Should she attend?",
      options: [
        {
          id: "a",
          text: "Yes, networking can open new opportunities",
          emoji: "🤝",
          description: "Exactly! Professional relationships often lead to career advancement",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's a waste of time",
          emoji: "⏰",
          description: "Networking builds valuable professional connections",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if her boss forces her to go",
          emoji: "👤",
          description: "Proactive networking is more effective than passive attendance",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "She's considering a certification that could advance her career. What should influence her decision?",
      options: [
        {
          id: "a",
          text: "Relevance to career goals and industry demand",
          emoji: "🎯",
          description: "Perfect! Strategic choices maximize career advancement",
          isCorrect: true
        },
        {
          id: "b",
          text: "The cheapest option regardless of quality",
          emoji: "💰",
          description: "Quality education often provides better long-term value",
          isCorrect: false
        },
        {
          id: "c",
          text: "What her friends are doing",
          emoji: "👥",
          description: "Personal career goals should guide educational decisions",
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
    navigate("/student/ehe/teens/reflex-career-alert");
  };

  return (
    <GameShell
      title="Simulation: Career Upgrade"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-98"
      gameType="ehe"
      totalLevels={100}
      currentLevel={98}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-white mb-2">Career Upgrade Simulator</h3>
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

export default SimulationCareerUpgrade;