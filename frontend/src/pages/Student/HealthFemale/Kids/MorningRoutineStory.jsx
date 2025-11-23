import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MorningRoutineStory = () => {
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
      text: "Should you brush + wash face after waking up?",
      options: [
        {
          id: "a",
          text: "Yes, it's important for good hygiene and health",
          emoji: "😊",
          description: "Exactly! Brushing teeth and washing your face removes germs and bacteria that accumulate overnight.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's not necessary in the morning",
          emoji: "😴",
          description: "Morning hygiene is essential for good health. It helps prevent infections and keeps you feeling fresh.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend skips breakfast to save time. What do you do?",
      options: [
        {
          id: "a",
          text: "Explain that breakfast gives energy for the day",
          emoji: "💬",
          description: "Great choice! Breakfast provides essential nutrients and energy to start your day right.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip breakfast too to fit in",
          emoji: "👥",
          description: "Healthy habits are more important than fitting in. Skipping breakfast can lead to low energy and poor concentration.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel rushed in the morning. Should you still take time for hygiene?",
      options: [
        {
          id: "a",
          text: "Yes, hygiene is important even when rushed",
          emoji: "⏰",
          description: "Perfect! Good hygiene habits should never be skipped, even when you're in a hurry.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, skip it when you're late",
          emoji: "🏃",
          description: "Skipping hygiene can lead to health problems. It's better to wake up a few minutes earlier to maintain good habits.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You see your sibling brushing teeth without toothpaste. What do you think?",
      options: [
        {
          id: "a",
          text: "Toothpaste is important for cleaning teeth properly",
          emoji: "🦷",
          description: "Wonderful! Toothpaste contains fluoride that helps strengthen teeth and fight cavities.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Brushing alone is enough",
          emoji: "🤔",
          description: "Toothpaste is essential for proper dental hygiene. It helps remove plaque and prevents tooth decay.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You learn that morning hygiene prevents illness. How does this make you feel?",
      options: [
        {
          id: "a",
          text: "Glad I follow good morning hygiene habits",
          emoji: "💪",
          description: "Excellent! Understanding how hygiene prevents illness reinforces your commitment to healthy habits.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Think it won't affect you",
          emoji: "🤷",
          "description": "Good hygiene habits protect everyone from illness. Consistent practices help keep you healthy.",
          "isCorrect": false
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
      title="Morning Routine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-91"
      gameType="health-female"
      totalLevels={100}
      currentLevel={91}
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

export default MorningRoutineStory;