import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SickDayStory = () => {
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
      text: "You feel unwell. Should you hide or tell parents?",
      options: [
        {
          id: "a",
          text: "Tell parents - they can help and get medical care if needed",
          emoji: "👨‍👩‍👧",
          description: "Exactly! Telling parents when you're unwell helps them take care of you and get medical help if necessary.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide it - they might get angry or make me go to school",
          emoji: "🤐",
          description: "That's not the best choice. Hiding illness can make it worse. Parents want to help you feel better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have a fever. What should you do?",
      options: [
        {
          id: "a",
          text: "Rest, drink water, and tell an adult",
          emoji: "😴",
          description: "Great choice! Rest and hydration help your body fight illness. Telling an adult ensures you get proper care.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Go to school to avoid missing work",
          emoji: "📚",
          description: "Going to school when sick can make you feel worse and spread illness to others. Rest helps recovery.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend has a contagious illness. Should you visit?",
      options: [
        {
          id: "a",
          text: "Call or text to check on them, but avoid in-person visits",
          emoji: "📱",
          description: "Perfect! Staying away prevents spreading illness while still showing care through calls or messages.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Visit to show you care about your friend",
          emoji: "🤗",
          description: "While caring about friends is important, visiting when they're contagious can make you sick too.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're feeling better after being sick. What's best?",
      options: [
        {
          id: "a",
          text: "Wait until fully recovered before returning to normal activities",
          emoji: "⏳",
          description: "Wonderful! Returning too soon can relapse your illness and affect others. Full recovery prevents setbacks.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Return immediately to catch up on missed activities",
          emoji: "🏃",
          description: "Rushing back can cause a relapse. It's better to fully recover first to protect your health and others.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You need to take medicine. What should you do?",
      options: [
        {
          id: "a",
          text: "Take it exactly as prescribed by doctor or parent",
          emoji: "💊",
          description: "Excellent! Following medication instructions ensures effective treatment and prevents complications.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take more than prescribed to feel better faster",
          emoji: "💊💊",
          description: "Taking more medicine than prescribed can be dangerous. Follow instructions for safe and effective treatment.",
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
      title="Sick Day Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-75"
      gameType="health-female"
      totalLevels={80}
      currentLevel={75}
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

export default SickDayStory;