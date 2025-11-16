import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenCareerFair = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "At a career fair, a teen explores AI, green jobs, and gaming careers. What should guide her choice?",
      options: [
        {
          id: "a",
          text: "What excites her and matches her skills",
          emoji: "🎯",
          description: "Perfect! Passion combined with aptitude leads to fulfilling careers",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only highest salary potential",
          emoji: "💰",
          description: "While financial considerations matter, personal interest is equally important",
          isCorrect: false
        },
        {
          id: "c",
          text: "What her friends are choosing",
          emoji: "👥",
          description: "Following friends may not align with personal interests or strengths",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A representative from a green energy company explains their work. How should the teen engage?",
      options: [
        {
          id: "a",
          text: "Ask specific questions about the role and growth opportunities",
          emoji: "❓",
          description: "Exactly! Thoughtful questions help understand if this career is a good fit",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pretend to be busy and avoid interaction",
          emoji: "😴",
          description: "Missed opportunities prevent valuable career insights and networking",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only talk about unrelated topics",
          emoji: "🔀",
          description: "Staying on topic helps gather relevant information about career prospects",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "An AI company representative mentions the field is rapidly evolving. How should the teen respond?",
      options: [
        {
          id: "a",
          text: "Ask about required skills and how to stay current",
          emoji: "📚",
          description: "Perfect! Understanding learning requirements helps with career preparation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Decide it's too complicated",
          emoji: "🤯",
          description: "Embracing challenges and continuous learning leads to career growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the information",
          emoji: "🙉",
          description: "Staying informed about industry trends is crucial for career success",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A gaming company representative discusses both creative and technical roles. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Explore both areas to understand different opportunities",
          emoji: "🔍",
          description: "Exactly! Comprehensive exploration helps identify the best fit",
          isCorrect: true
        },
        {
          id: "b",
          text: "Focus only on one area without learning about others",
          emoji: "🎯",
          description: "Limited exploration may miss better-fitting opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Dismiss the entire field immediately",
          emoji: "❌",
          description: "Keeping an open mind allows for discovering unexpected opportunities",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After the career fair, what should the teen do next?",
      options: [
        {
          id: "a",
          text: "Review materials and follow up with interesting contacts",
          emoji: "✅",
          description: "Perfect! Follow-up converts fair experiences into real opportunities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Forget about it and do nothing",
          emoji: "😴",
          description: "Inaction wastes the time and effort invested in attending the fair",
          isCorrect: false
        },
        {
          id: "c",
          text: "Immediately choose a career based on one conversation",
          emoji: "🎲",
          description: "Rushing decisions without reflection often lead to poor outcomes",
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
    navigate("/student/ehe/teens/reflex-teen-alert");
  };

  return (
    <GameShell
      title="Simulation: Teen Career Fair"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-78"
      gameType="ehe"
      totalLevels={80}
      currentLevel={78}
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
            <h3 className="text-2xl font-bold text-white mb-2">Future Career Fair Simulator</h3>
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

export default SimulationTeenCareerFair;