import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GrowingTallerStory = () => {
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
      text: "You've noticed you're taller than last year. Is this normal?",
      options: [
        {
          id: "a",
          text: "Yes, growing taller is a normal part of development",
          emoji: "✅",
          description: "Exactly! Growing taller is a natural and healthy part of development during childhood and adolescence.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, you should stay the same height forever",
          emoji: "❌",
          description: "Everyone grows at different rates and times. Growing taller is completely normal!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says they haven't grown in months. Should they be worried?",
      options: [
        {
          id: "a",
          text: "Yes, they should see a doctor immediately",
          emoji: "🏥",
          description: "Not necessarily. Growth happens in spurts, and there are periods of slower growth between spurts.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, growth happens in spurts with breaks in between",
          emoji: "😌",
          description: "Correct! Growth isn't constant. There are growth spurts followed by periods of slower growth.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What helps support healthy growth?",
      options: [
        {
          id: "a",
          text: "Good nutrition, sleep, and exercise",
          emoji: "🥗",
          description: "Perfect! Proper nutrition, adequate sleep, and regular exercise all support healthy growth.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skipping meals and staying up late",
          emoji: "😴",
          description: "Skipping meals and poor sleep can actually hinder healthy growth and development.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're worried you're not growing as fast as your friends. What should you do?",
      options: [
        {
          id: "a",
          text: "Compare yourself to others constantly",
          emoji: "😔",
          description: "Everyone grows at their own pace. Comparing yourself to others can create unnecessary stress.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus on healthy habits and remember everyone grows differently",
          emoji: "😊",
          description: "Great choice! Everyone has their own growth pattern. Focus on healthy habits and be patient with yourself.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Your parents are concerned about your growth rate. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Ignore their concerns completely",
          emoji: "🤐",
          description: "While it's normal to grow at different rates, it's important to address parental concerns with understanding.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Talk to them and possibly consult a doctor for peace of mind",
          emoji: "👨‍⚕️",
          description: "Good idea! Communication with parents and professional guidance can provide reassurance for everyone.",
          isCorrect: true
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
      title="Growing Taller Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-21"
      gameType="health-female"
      totalLevels={30}
      currentLevel={21}
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

export default GrowingTallerStory;