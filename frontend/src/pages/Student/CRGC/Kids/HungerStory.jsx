import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HungerStory = () => {
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
      text: "You see a classmate who looks very thin and tired. What might be missing in their life?",
      options: [
        {
          id: "a",
          text: "Right to food and proper nutrition",
          emoji: "🍎",
          description: "That's right! Every child has the right to adequate food and nutrition for healthy growth.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Right to expensive clothes",
          emoji: "👕",
          description: "While clothing is important, the more basic need that might be missing is adequate nutrition.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What can you do if you notice someone who seems to be struggling with hunger?",
      options: [
        {
          id: "a",
          text: "Tell a teacher or trusted adult",
          emoji: "👩‍🏫",
          description: "Perfect! Adults can help connect the child and their family with resources they need.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it because it's not your problem",
          emoji: "🙈",
          description: "That's not helpful. When we see someone in need, it's important to seek help from adults.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can schools help ensure all students have enough to eat?",
      options: [
        {
      id: "a",
          text: "Provide free or reduced-price meals",
          emoji: "🍽️",
          description: "Great idea! School meal programs help ensure all students have access to nutritious food.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only allow wealthy students to eat",
          emoji: "💰",
          description: "That's not fair. Schools should work to ensure all students have access to meals.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is the right to food important for children?",
      options: [
        {
          id: "a",
          text: "It helps children grow, learn, and stay healthy",
          emoji: "🧠",
          description: "That's right! Proper nutrition is essential for physical growth, brain development, and overall health.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes children eat more than others",
          emoji: "overeating",
          description: "That's not the point. The right to food ensures adequate nutrition, not overeating.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What can communities do to address hunger?",
      options: [
        {
          id: "a",
          text: "Support food banks and community programs",
          emoji: "🤝",
          description: "Excellent! Community support through food banks and programs helps ensure everyone has access to food.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Blame families for their situation",
          emoji: "😠",
          description: "That's not helpful. Blaming doesn't solve the problem and can make it worse for families in need.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Hunger Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-65"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={65}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
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

export default HungerStory;