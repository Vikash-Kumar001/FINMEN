import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanWaterStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen designs a water filter for villages with contaminated water. What problem is being solved?",
      options: [
        {
          id: "a",
          text: "Safe drinking water access",
          emoji: "💧",
          description: "Perfect! Providing clean water prevents waterborne diseases and saves lives",
          isCorrect: true
        },
        {
          id: "b",
          text: "Entertainment needs",
          emoji: "🎮",
          description: "While entertainment is important, safe water is a basic necessity",
          isCorrect: false
        },
        {
          id: "c",
          text: "Fashion trends",
          emoji: "👗",
          description: "Fashion is not a critical issue compared to access to safe drinking water",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is access to clean water important for communities?",
      options: [
        {
          id: "a",
          text: "Prevents diseases and improves health",
          emoji: "🏥",
          description: "Exactly! Clean water prevents cholera, dysentery, and other waterborne diseases",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes water taste better for cooking",
          emoji: "👩‍🍳",
          description: "While taste matters, the primary benefit is health protection",
          isCorrect: false
        },
        {
          id: "c",
          text: "Looks clearer in glasses",
          emoji: "👓",
          description: "Appearance is not the main benefit of clean water",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What skills helped the teen design the water filter?",
      options: [
        {
          id: "a",
          text: "Engineering and problem-solving",
          emoji: "🔧",
          description: "Perfect! Technical knowledge and creative problem-solving were essential",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only artistic abilities",
          emoji: "🎨",
          description: "While design helps, engineering knowledge is crucial for functional solutions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring community needs",
          emoji: "🔇",
          description: "Understanding community needs is vital for effective solutions",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can this water filter benefit the community?",
      options: [
        {
          id: "a",
          text: "Reduces medical costs and improves productivity",
          emoji: "📈",
          description: "Exactly! Healthier people are more productive and spend less on medical care",
          isCorrect: true
        },
        {
          id: "b",
          text: "Creates more plastic waste",
          emoji: "🗑️",
          description: "A good filter should reduce waste, not create more",
          isCorrect: false
        },
        {
          id: "c",
          text: "Increases dependence on outside help",
          emoji: "🧍",
          description: "A sustainable solution empowers communities to help themselves",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the broader impact of solving water access issues?",
      options: [
        {
          id: "a",
          text: "Empowers communities, especially women and children",
          emoji: "💪",
          description: "Perfect! When water is accessible, children (especially girls) can attend school",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only benefits the teen inventor",
          emoji: "👤",
          description: "Social innovations aim to benefit entire communities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eliminates all global problems",
          emoji: "🌎",
          description: "While important, water access is one of many global challenges",
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
    navigate("/student/ehe/teens/debate-profit-vs-purpose");
  };

  return (
    <GameShell
      title="Clean Water Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-85"
      gameType="ehe"
      totalLevels={90}
      currentLevel={85}
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
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-2xl font-bold text-white mb-2">Clean Water Innovation</h3>
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

export default CleanWaterStory;