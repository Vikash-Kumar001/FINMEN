import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VillageSolarStory = () => {
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
      text: "A teen sets up solar lamps in a dark village. What is this?",
      options: [
        {
          id: "a",
          text: "Social impact",
          emoji: "💡",
          description: "Exactly! Providing clean energy to underserved communities!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just selling products",
          emoji: "🛒",
          description: "While products are involved, the main goal is social impact!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wasting electricity",
          emoji: "⚡",
          description: "Solar energy is renewable and environmentally friendly!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is solar energy important for villages?",
      options: [
        {
          id: "a",
          text: "Provides clean, renewable power",
          emoji: "🌞",
          description: "Correct! Solar energy is sustainable and accessible!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only looks nice",
          emoji: "✨",
          description: "While solar installations look modern, their real value is functional!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes noise",
          emoji: "🔊",
          description: "Solar panels actually operate silently!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What are benefits of solar lamps?",
      options: [
        {
          id: "a",
          text: "Safe, clean, and affordable",
          emoji: "✅",
          description: "Perfect! Solar lamps eliminate fire hazards and reduce costs!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only work in sunlight",
          emoji: "☀️",
          description: "Modern solar lamps store energy for nighttime use!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Expensive to maintain",
          emoji: "💸",
          description: "Solar lamps have low maintenance costs after initial setup!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does this help education?",
      options: [
        {
          id: "a",
          text: "Children can study after dark",
          emoji: "📚",
          description: "Exactly! Lighting enables evening study time!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only for entertainment",
          emoji: "🎮",
          description: "While entertainment is nice, education is the primary benefit!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Replaces teachers",
          emoji: "🤖",
          description: "Solar lamps support teachers and students, not replace them!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What skills help with solar projects?",
      options: [
        {
          id: "a",
          text: "Technical and community skills",
          emoji: "🛠️",
          description: "Perfect! Both technical knowledge and community engagement are key!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only money",
          emoji: "💰",
          description: "While funding helps, skills and dedication are more important!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring locals",
          emoji: "🙈",
          description: "Community involvement is essential for project success!",
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
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Village Solar Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-88"
      gameType="ehe"
      totalLevels={10}
      currentLevel={88}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
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
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default VillageSolarStory;