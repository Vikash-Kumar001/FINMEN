import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BathTimeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showCoinFeedback, setShowCoinFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Mom says 'Take bath daily.' What do you do?",
      options: [
        {
          id: "a",
          text: "Take bath daily",
          emoji: "🛁",
          description: "Clean body stays healthy and fresh",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip bath sometimes",
          emoji: "😅",
          description: "Skipping baths leads to germs and bad smell",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only bath once a week",
          emoji: "📅",
          description: "Daily bathing is important for hygiene",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You played outside all day. What happens next?",
      options: [
        {
          id: "a",
          text: "Take a refreshing bath",
          emoji: "🧼",
          description: "Bath removes dirt and sweat from playing",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go straight to dinner",
          emoji: "🍽️",
          description: "Dirty body brings germs to food",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just change clothes",
          emoji: "👕",
          description: "Need bath to clean body, not just clothes",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend says 'Bathing is boring!' What do you say?",
      options: [
        {
          id: "a",
          text: "You're right, I'll skip",
          emoji: "😒",
          description: "Skipping baths is unhealthy",
          isCorrect: false
        },
        {
          id: "b",
          text: "Clean body stays healthy",
          emoji: "💪",
          description: "Daily baths prevent sickness",
          isCorrect: true
        },
        {
          id: "c",
          text: "Make it fun with toys",
          emoji: "🦆",
          description: "Bathing can be fun and healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "After swimming in pool, what should you do?",
      options: [
        {
          id: "a",
          text: "Take shower immediately",
          emoji: "🚿",
          description: "Pool water has chemicals that need washing off",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wait until tomorrow",
          emoji: "⏰",
          description: "Chemicals and germs should be washed off today",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just dry off",
          emoji: "💨",
          description: "Need soap and water to clean properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Mom notices you smell after playing. What happens?",
      options: [
        {
          id: "a",
          text: "Mom reminds you to bath",
          emoji: "🛁",
          description: "Daily baths keep you fresh and clean",
          isCorrect: true
        },
        {
          id: "b",
          text: "Everyone stays away",
          emoji: "😷",
          description: "Bad smell from no baths pushes friends away",
          isCorrect: false
        },
        {
          id: "c",
          text: "You feel sick",
          emoji: "🤒",
          description: "Germs from dirt can make you ill",
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
      setShowCoinFeedback(true);
      setTimeout(() => setShowCoinFeedback(false), 1500);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Calculate final score
        const correctAnswers = choices.filter(choice => choice.isCorrect).length + (isCorrect ? 1 : 0);
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/kids/stay-fresh-poster");
  };

  return (
    <GameShell
      title="Bath Time Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-5"
      gameType="health-male"
      totalLevels={10}
      currentLevel={5}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative">
          {showCoinFeedback && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-bounce">
                +1
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
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

export default BathTimeStory;
