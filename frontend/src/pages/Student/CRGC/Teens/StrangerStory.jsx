import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StrangerStory = () => {
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
      text: "You see an old woman carrying heavy bags. Should you help?",
      options: [
        {
          id: "a",
          text: "Yes, help her",
          emoji: "🛍️",
          description: "That's right! Helping others in need shows compassion and kindness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, ignore her",
          emoji: "🚶",
          description: "That's not compassionate. Helping others creates a caring community.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "An elderly man looks lost. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore him",
          emoji: "🙈",
          description: "That's not kind. Everyone deserves help when they're in need.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask if he needs assistance",
          emoji: "🙋",
          description: "Perfect! Offering help to someone who looks lost shows empathy.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "A stranger drops their wallet. What's the right thing to do?",
      options: [
        {
          id: "a",
          text: "Pick it up and return it",
          emoji: "👛",
          description: "Great choice! Returning lost items shows integrity and compassion.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Leave it or take it",
          emoji: "💸",
          description: "That's not the right thing to do. Returning lost items is the honest and kind choice.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You notice a stranger looking sad on a bench. Should you?",
      options: [
        {
          id: "a",
          text: "Mind your own business",
          emoji: "🤫",
          description: "That's not empathetic. Sometimes a small act of kindness can make a big difference.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask if they're okay",
          emoji: "💬",
          description: "Wonderful! Showing concern for others' wellbeing is a sign of compassion.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "A tourist asks you for directions. What should you do?",
      options: [
        {
          id: "a",
          text: "Give clear directions or help them find help",
          emoji: "🗺️",
          description: "Excellent! Helping others navigate shows kindness and community spirit.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell them to figure it out themselves",
          emoji: "🙄",
          description: "That's not helpful. Assisting lost people is a basic act of human kindness.",
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
      title="Stranger Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-1"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={1}
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

export default StrangerStory;