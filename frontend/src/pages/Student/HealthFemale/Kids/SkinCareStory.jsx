import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SkinCareStory = () => {
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
      text: "You notice pimples appearing on your face. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Wash gently with mild soap and avoid picking",
          emoji: "🧼",
          description: "Exactly! Gentle washing helps keep skin clean without irritation, and picking can cause scarring.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pick at them to get rid of them quickly",
          emoji: "✋",
          description: "Picking can push bacteria deeper, cause infection, and lead to permanent scarring.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What causes acne during development?",
      options: [
        {
          id: "a",
          text: "Hormonal changes that increase oil production",
          emoji: "🧬",
          description: "Correct! Hormonal changes during development increase oil production, which can clog pores.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eating too much chocolate",
          emoji: "🍫",
          description: "While diet can affect overall health, acne is primarily caused by hormonal changes, not specific foods.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you care for acne-prone skin?",
      options: [
        {
          id: "a",
          text: "Gentle cleansing twice daily and avoiding harsh products",
          emoji: "🚿",
          description: "Great choice! Gentle cleansing removes excess oil and dirt without irritating the skin.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Scrub vigorously to remove all oil",
          emoji: "🌀",
          description: "Harsh scrubbing can irritate skin and make acne worse. Gentle cleansing is more effective.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "When should you talk to an adult about persistent acne?",
      options: [
        {
          id: "a",
          text: "If gentle care doesn't help after a few weeks",
          emoji: "👩‍⚕️",
          description: "Perfect! If good habits don't improve acne after a few weeks, professional advice can help.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never - it's just a normal part of growing up",
          emoji: "🤐",
          description: "While acne is common during development, persistent or severe cases benefit from professional guidance.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's a healthy approach to skin care during development?",
      options: [
        {
          id: "a",
          text: "Consistent gentle care and patience with natural changes",
          emoji: "😌",
          description: "Wonderful! Skin changes during development are normal. Consistent gentle care and patience are key.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Trying many different products at once",
          emoji: "🛍️",
          description: "Using too many products can irritate skin. It's better to stick to gentle, consistent care.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Skin Care Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-48"
      gameType="health-female"
      totalLevels={50}
      currentLevel={48}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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

export default SkinCareStory;