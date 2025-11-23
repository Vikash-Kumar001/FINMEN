import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FoodStory = () => {
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
      text: "You have extra lunch. You see a hungry child nearby. What should you do?",
      options: [
        {
          id: "a",
          text: "Share your lunch with them",
          emoji: "🍎",
          description: "That's right! Sharing food with someone who is hungry shows kindness and compassion.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore them and eat your lunch",
          emoji: "😒",
          description: "That's not very kind. Ignoring someone who is hungry misses an opportunity to help.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you offer your food to the hungry child?",
      options: [
        {
          id: "a",
          text: "Give it kindly and respectfully",
          emoji: "🤗",
          description: "Perfect! Offering help with kindness and respect makes the other person feel valued.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Throw it at them",
          emoji: "🥹",
          description: "That's not respectful. Throwing food is wasteful and disrespectful to others.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What if the child says they're not hungry?",
      options: [
        {
          id: "a",
          text: "Insist they take it",
          emoji: "😤",
          description: "That's not respectful. Everyone has the right to make their own choices.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Respect their decision",
          emoji: "👍",
          description: "Great! Respecting others' decisions shows maturity and consideration.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friend tells you not to share your food. What should you do?",
      options: [
        {
          id: "a",
          text: "Listen to your friend",
          emoji: "🤐",
          description: "That's not the right choice. Being kind to others is more important than peer pressure.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Do what you think is right",
          emoji: "🦸",
          description: "Wonderful! Following your conscience and being kind is the right choice.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How does sharing your food make you feel?",
      options: [
        {
          id: "a",
          text: "Happy and fulfilled",
          emoji: "😊",
          description: "Excellent! Helping others often brings joy and a sense of fulfillment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Annoyed and burdened",
          emoji: "😩",
          description: "That's not the typical response. Acts of kindness usually make us feel good.",
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
      title="Food Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-55"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={55}
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

export default FoodStory;