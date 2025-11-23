import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AppBuilderStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A 15-year-old notices her schoolmates struggle to organize study schedules. What should she do first?",
      options: [
        {
          id: "a",
          text: "Ignore the problem",
          emoji: "🙈",
          description: "Ignoring problems doesn't help anyone and misses opportunities for innovation",
          isCorrect: false
        },
        {
          id: "b",
          text: "Research existing solutions",
          emoji: "🔍",
          description: "Good start! Researching existing solutions helps understand the market and identify gaps",
          isCorrect: true
        },
        {
          id: "c",
          text: "Copy an existing app exactly",
          emoji: "📋",
          description: "Copying without understanding doesn't create value or solve unique problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After research, she finds existing apps but they're too complex for students. What's her next step?",
      options: [
        {
          id: "a",
          text: "Create a simpler version",
          emoji: "✨",
          description: "Perfect! Simplifying complex solutions for a specific audience is true innovation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give up because apps exist",
          emoji: "🏳️",
          description: "Existing solutions often have room for improvement or better targeting",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make it more complex",
          emoji: "🤯",
          description: "Making things more complex when simplicity is needed defeats the purpose",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "She starts building her app. What should she focus on first?",
      options: [
        {
          id: "a",
          text: "Core features that solve the main problem",
          emoji: "🎯",
          description: "Exactly! Start with core features that directly address the main problem",
          isCorrect: true
        },
        {
          id: "b",
          text: "Fancy animations and graphics",
          emoji: "🎨",
          description: "While visuals matter, solving the core problem should come first",
          isCorrect: false
        },
        {
          id: "c",
          text: "Social media integration",
          emoji: "📱",
          description: "Secondary features can come later after the core problem is solved",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "She tests her app with friends. What should she do with their feedback?",
      options: [
        {
          id: "a",
          text: "Ignore it because she knows best",
          emoji: "👂",
          description: "User feedback is crucial for creating solutions that actually work",
          isCorrect: false
        },
        {
          id: "b",
          text: "Consider and implement useful suggestions",
          emoji: "💬",
          description: "Excellent! User feedback helps improve the solution and user experience",
          isCorrect: true
        },
        {
          id: "c",
          text: "Redesign everything from scratch",
          emoji: "🔄",
          description: "Major redesigns should only happen when core assumptions are wrong",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Her app becomes popular at school. What should she do next?",
      options: [
        {
          id: "a",
          text: "Share it with other schools and improve based on feedback",
          emoji: "🚀",
          description: "Perfect! Expansion with continuous improvement leads to greater impact",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop improving it",
          emoji: "🛑",
          description: "Continuous improvement is key to maintaining relevance and value",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sell it immediately for money",
          emoji: "💰",
          description: "While monetization is important, ensuring value comes first",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/ehe/teens/quiz-teen-entrepreneurs");
  };

  return (
    <GameShell
      title="App Builder Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-41"
      gameType="ehe"
      totalLevels={50}
      currentLevel={41}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen App Innovator</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
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

export default AppBuilderStory;