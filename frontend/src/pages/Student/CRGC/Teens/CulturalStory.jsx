import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CulturalStory = () => {
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
      text: "Teen meets friend from another religion. Should she mock or learn?",
      options: [
        {
          id: "a",
          text: "Mock their beliefs",
          emoji: "😂",
          description: "That's not respectful. Making fun of someone's religious beliefs is hurtful and shows intolerance.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Learn about their religion and respect it",
          emoji: "",
          description: "That's right! Learning about and respecting different religions promotes understanding and inclusion.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "A classmate wears traditional clothing from their culture. What should you do?",
      options: [
        {
          id: "a",
          text: "Ask questions respectfully to learn more",
          emoji: "❓",
          description: "Perfect! Showing genuine interest in someone's culture helps build bridges and friendships.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make fun of their clothing",
          emoji: "👕",
          description: "That's not kind. Making fun of someone's traditional clothing is disrespectful and hurtful.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're invited to a cultural celebration. Should you attend?",
      options: [
        {
          id: "a",
          text: "Attend to show support and learn",
          emoji: "🎉",
          description: "Great choice! Participating in cultural celebrations shows respect and helps you learn about different traditions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the invitation",
          emoji: "🚫",
          description: "That's not inclusive. Attending cultural celebrations helps build community and shows respect for others.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A friend speaks with an accent. How should you respond?",
      options: [
        {
          id: "a",
          text: "Be patient and listen carefully",
          emoji: "👂",
          description: "Wonderful! Being patient and respectful when someone speaks with an accent shows kindness and inclusion.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Laugh at their accent",
          emoji: "😆",
          description: "That's hurtful. Making fun of someone's accent is a form of bullying and shows disrespect.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Different cultural foods are served at lunch. What should you do?",
      options: [
        {
          id: "a",
          text: "Try different foods and appreciate the variety",
          emoji: "🍽️",
          description: "Excellent! Trying different cultural foods shows openness to new experiences and respect for diversity.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Refuse to eat anything unfamiliar",
          emoji: "🙅",
          description: "That's not inclusive. Being open to trying different cultural foods helps you appreciate diversity.",
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
      title="Cultural Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-11"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={11}
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

export default CulturalStory;