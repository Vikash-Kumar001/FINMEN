import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateBeautyConfidence = () => {
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
      text: "Is physical beauty or character more important for confidence?",
      options: [
        {
          id: "a",
          text: "Character builds lasting self-worth",
          emoji: "💎",
          description: "Inner qualities create genuine, stable confidence",
          isCorrect: true
        },
        {
          id: "b",
          text: "Physical beauty is the key to confidence",
          emoji: "💄",
          description: "Appearance-based confidence is temporary and unstable",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both are equally important",
          emoji: "⚖️",
          description: "Character has a more significant impact on true confidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How does focusing on appearance affect self-esteem?",
      options: [
        {
          id: "a",
          text: "Builds strong, lasting confidence",
          emoji: "🏔️",
          description: "Appearance-based confidence is actually fragile",
          isCorrect: false
        },
        {
          id: "b",
          text: "Creates instability and constant comparison",
          emoji: "🌊",
          description: "Appearance changes and comparisons reduce self-worth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Has no effect on self-perception",
          emoji: "😐",
          description: "Appearance focus significantly impacts self-esteem",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What role do talents and skills play in confidence?",
      options: [
        {
          id: "a",
          text: "They are less important than looks",
          emoji: "🖼️",
          description: "Skills and talents actually have greater impact",
          isCorrect: false
        },
        {
          id: "b",
          text: "They create genuine, earned self-assurance",
          emoji: "🎯",
          description: "Accomplishments build stable self-worth",
          isCorrect: true
        },
        {
          id: "c",
          text: "They don't contribute to confidence",
          emoji: "❌",
          description: "Achievements are fundamental to self-assurance",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is character more valuable than appearance?",
      options: [
        {
          id: "a",
          text: "It changes as frequently as appearance",
          emoji: "🔄",
          description: "Character is actually more stable than appearance",
          isCorrect: false
        },
        {
          id: "b",
          text: "It's enduring and defines who you are",
          emoji: "⏳",
          description: "Character grows stronger over time and situations",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's less important for relationships",
          emoji: "👥",
          description: "Character is essential for meaningful connections",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should society value individuals?",
      options: [
        {
          id: "a",
          text: "Primarily for their physical appearance",
          emoji: "✨",
          description: "Appearance-focused valuation is superficial and limiting",
          isCorrect: false
        },
        {
          id: "b",
          text: "Equally for appearance and character",
          emoji: "⚖️",
          description: "Character should be prioritized over appearance",
          isCorrect: false
        },
        {
          id: "c",
          text: "For their contributions, kindness, and character",
          emoji: "🌟",
          description: "Internal qualities create lasting positive impact",
          isCorrect: true
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
    navigate("/student/health-female/teens/journal-self-respect");
  };

  return (
    <GameShell
      title="Debate: Beauty = Confidence?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-66"
      gameType="health-female"
      totalLevels={10}
      currentLevel={6}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
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

export default DebateBeautyConfidence;