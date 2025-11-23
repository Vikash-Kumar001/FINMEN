import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AngerStory = () => {
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
      text: "Friend breaks your toy. Should you hit her?",
      options: [
        {
          id: "a",
          text: "No, I should calm down and talk about it",
          emoji: "🧘",
          description: "Exactly! Hitting never solves problems and can hurt others. Talking calmly helps resolve conflicts.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, she broke my toy so I should hit her",
          emoji: "😠",
          description: "Hitting doesn't solve problems and can make situations worse. It's better to express feelings with words.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You're angry because someone took your seat. What's the best response?",
      options: [
        {
          id: "a",
          text: "Ask politely if you can have your seat back",
          emoji: "💬",
          description: "Great choice! Asking politely shows respect and is more likely to get a positive response.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yell at them and grab the seat back",
          emoji: "😤",
          description: "Yelling and grabbing can escalate the situation. A calm approach is more effective and respectful.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel angry about a grade you received. How should you handle it?",
      options: [
        {
          id: "a",
          text: "Talk to the teacher about how to improve",
          emoji: "📚",
          description: "Perfect! Talking to your teacher shows maturity and helps you learn how to do better next time.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Crumple up the paper and throw it away",
          emoji: "🗑️",
          description: "Destroying your work won't help you learn or improve. It's better to understand what went wrong.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Someone says something mean about you. What should you do?",
      options: [
        {
          id: "a",
          text: "Take a deep breath and decide how to respond",
          emoji: "🌬️",
          description: "Wonderful! Taking a moment to breathe helps you respond thoughtfully instead of reacting with anger.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Immediately yell back at them",
          emoji: "🤬",
          description: "Yelling back usually makes conflicts worse. Taking a moment helps you respond more effectively.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You're frustrated with a difficult homework problem. What's best?",
      options: [
        {
          id: "a",
          text: "Take a break and come back to it later",
          emoji: "⏸️",
          description: "Excellent! Taking a break helps reduce frustration and often makes problems easier to solve.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Get so angry that you give up entirely",
          emoji: ".quit",
          description: "Giving up because of anger means missing a learning opportunity. Taking breaks helps maintain focus.",
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
      title="Anger Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-58"
      gameType="health-female"
      totalLevels={60}
      currentLevel={58}
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

export default AngerStory;