import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const SimulationExamPrep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state

  const scenarios = [
    {
      id: 1,
      title: "Study vs Sleep Decision",
      description: "You have an exam tomorrow. Should you study till 3 AM or get sleep and study the next day?",
      options: [
        {
          id: "a",
          text: "Study till 3 AM - Sacrifice sleep for study",
          emoji: "🌙",
          isCorrect: false
        },
        {
          id: "b",
          text: "Sleep 8 hrs + study next day - Prioritize rest, then study",
          emoji: "😴",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip both sleep and study - Avoid responsibilities",
          emoji: "😶",
          isCorrect: false
        },
        {
          id: "d",
          text: "Cram all night before exam - Last-minute studying",
          emoji: "🤯",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Best Preparation Strategy",
      description: "You have an exam tomorrow. What's the best preparation strategy?",
      options: [
        {
          id: "a",
          text: "Stay up all night studying - Exhausting approach",
          emoji: "🌙",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Panic and study continuously - Stressful approach",
          emoji: "😰",
          isCorrect: false
        },
         {
          id: "b",
          text: "Study during the day, sleep 8-10 hours - Balanced approach",
          emoji: "📊",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ignore the exam completely - Avoidance approach",
          emoji: "🙄",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Study-Sleep Balance",
      description: "How should you balance study time and sleep before an exam?",
      options: [
        {
          id: "a",
          text: "Cram the night before, skip sleep - Short-term approach",
          emoji: "🤯",
          isCorrect: false
        },
        {
          id: "b",
          text: "Study constantly, minimal sleep - Exhausting approach",
          emoji: "💨",
          isCorrect: false
        },
        {
          id: "c",
          text: "Procrastinate, then panic study - Ineffective approach",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "d",
          text: "Study in advance, maintain sleep schedule - Long-term preparation",
          emoji: "📅",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Sleep Impact on Performance",
      description: "What's the impact of sleep on exam performance?",
      options: [
        {
          id: "a",
          text: "Adequate sleep improves memory and focus - Enhances performance",
          emoji: "🧠",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sleep reduces study time - Misconception",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sleep has no effect on exams - Incorrect belief",
          emoji: "🤔",
          isCorrect: false
        },
        {
          id: "d",
          text: "More sleep means less study time - False trade-off",
          emoji: "⚖️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Best Exam Preparation",
      description: "What's the best approach for exam preparation?",
      options: [
        {
          id: "a",
          text: "Last-minute all-night study sessions - Ineffective approach",
          emoji: "🤯",
          isCorrect: false
        },
        {
          id: "b",
          text: "Sacrifice sleep for extra study hours - Counterproductive",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Random study times, irregular sleep - Unpredictable approach",
          emoji: "🎲",
          isCorrect: false
        },
        {
          id: "d",
          text: "Regular study schedule with consistent sleep - Sustainable approach",
          emoji: "📅",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
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

  const handleNext = () => {
    navigate("/student/brain/teen/reflex-smart-rest");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Exam Prep"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="brain-teens-68"
      gameType="brain"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/brain-health/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {getCurrentScenario().title}
          </h2>
          
          <p className="text-white/90 mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

export default SimulationExamPrep;
