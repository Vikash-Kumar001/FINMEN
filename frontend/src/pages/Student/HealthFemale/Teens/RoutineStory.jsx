import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoutineStory = () => {
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
      text: "Teen girl sleeps late and wakes tired. Should she fix her routine?",
      options: [
        {
          id: "a",
          text: "Yes, consistent sleep improves health and focus",
          emoji: "✅",
          description: "Regular sleep patterns support physical and mental health",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, she's a teenager and should stay up late",
          emoji: "❌",
          description: "Even teens need adequate sleep for optimal functioning",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only on weekends when she has time",
          emoji: "📅",
          description: "Inconsistent routines don't provide the same benefits",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the benefit of a consistent daily routine?",
      options: [
        {
          id: "a",
          text: "Better time management and reduced stress",
          emoji: "⏰",
          description: "Routines help organize activities efficiently",
          isCorrect: true
        },
        {
          id: "b",
          text: "Less flexibility and spontaneity",
          emoji: "🚫",
          description: "Routines actually create space for meaningful activities",
          isCorrect: false
        },
        {
          id: "c",
          text: "More time spent on planning",
          emoji: "📝",
          description: "Routines reduce the need for constant decision-making",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does a morning routine benefit a teen?",
      options: [
        {
          id: "a",
          text: "Starts the day with purpose and energy",
          emoji: "🌞",
          description: "Structured mornings set a positive tone for the day",
          isCorrect: true
        },
        {
          id: "b",
          text: "Takes too much time away from sleep",
          emoji: "😴",
          description: "Efficient routines can actually improve sleep quality",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes the day feel rushed and stressful",
          emoji: "😰",
          description: "Well-planned routines reduce morning stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should be included in a healthy teen routine?",
      options: [
        {
          id: "a",
          text: "Sleep, nutrition, exercise, and study time",
          emoji: "📋",
          description: "Balanced routines address all aspects of well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only activities that are fun and entertaining",
          emoji: "🎉",
          description: "Well-rounded routines include responsibilities and self-care",
          isCorrect: false
        },
        {
          id: "c",
          text: "Whatever feels convenient in the moment",
          emoji: "🤷",
          description: "Intentional routines are more beneficial than spontaneous ones",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to stick to a routine even when it's hard?",
      options: [
        {
          id: "a",
          text: "Builds discipline and creates positive habits",
          emoji: "💪",
          description: "Consistency reinforces beneficial behaviors",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes life boring and predictable",
          emoji: "😴",
          description: "Routines free up mental energy for creative pursuits",
          isCorrect: false
        },
        {
          id: "c",
          text: "Shows others you can follow rules",
          emoji: "👥",
          description: "Personal growth is more important than external validation",
          isCorrect: false
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
    navigate("/student/health-female/teens/quiz-teen-habits");
  };

  return (
    <GameShell
      title="Routine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-91"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
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

export default RoutineStory;