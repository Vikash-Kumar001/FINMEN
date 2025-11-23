import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WageStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen reads that workers in a factory are not being paid equally for the same work. What is this?",
      options: [
        {
          id: "a",
          text: "A normal business practice",
          emoji: "💼",
          description: "That's not right. Equal pay for equal work is a basic principle of fairness and justice in the workplace.",
          isCorrect: false
        },
        {
          id: "b",
          text: "An injustice that should be addressed",
          emoji: "⚖️",
          description: "That's right! Unequal pay for the same work is unjust and violates principles of fairness and human rights.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Something that can't be changed",
          emoji: "🤷",
          description: "That's not true. Injustices can be addressed through awareness, advocacy, and appropriate authorities.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should the teen do about this discovery?",
      options: [
        {
          id: "a",
          text: "Ignore it since it's not their problem",
          emoji: "😶",
          description: "That's not responsible. When we discover injustices, we have a moral obligation to help address them.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Research labor laws and report to authorities",
          emoji: "📚",
          description: "That's right! Understanding laws and reporting violations to appropriate authorities is a responsible way to address injustice.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Publicly shame the company on social media",
          emoji: "📱",
          description: "That's not the best approach. While raising awareness is important, proper channels should be used to address violations.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is equal pay important for society?",
      options: [
        {
          id: "a",
          text: "It reduces poverty and increases economic stability",
          emoji: "📈",
          description: "That's right! Equal pay helps reduce poverty, increases economic stability, and promotes social cohesion.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It only benefits certain groups",
          emoji: "👥",
          description: "That's incorrect. Equal pay benefits society as a whole by promoting fairness and economic efficiency.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It makes no difference to overall welfare",
          emoji: "❌",
          description: "That's not true. Equal pay has significant positive impacts on individuals, families, and communities.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which group is most affected by wage inequality?",
      options: [
        {
          id: "a",
          text: "Women and marginalized communities",
          emoji: "👩",
          description: "That's right! Women and marginalized communities are disproportionately affected by wage inequality due to systemic biases.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only highly educated workers",
          emoji: "🎓",
          description: "That's not accurate. Wage inequality affects workers across all education levels, with greater impact on vulnerable groups.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It affects everyone equally",
          emoji: "🔄",
          description: "That's incorrect. Wage inequality disproportionately affects women and marginalized communities due to systemic discrimination.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can society address wage inequality?",
      options: [
        {
          id: "a",
          text: "Through transparent pay practices and strong labor laws",
          emoji: "📋",
          description: "That's right! Transparency in pay practices and strong enforcement of labor laws are key to addressing wage inequality.",
          isCorrect: true
        },
        {
          id: "b",
          text: "By accepting it as inevitable",
          emoji: "😔",
          description: "That's not the solution. Wage inequality is a solvable problem that requires active effort from individuals, organizations, and governments.",
          isCorrect: false
        },
        {
          id: "c",
          text: "By eliminating all jobs",
          emoji: "🗑️",
          description: "That's not practical. The goal is fair wages for all workers, not elimination of employment opportunities.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Wage Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-65"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={65}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default WageStory;