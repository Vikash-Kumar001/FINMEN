import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SweatStory = () => {
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
      text: "You've started sweating more than before. What's the best response?",
      options: [
        {
          id: "a",
          text: "Take a bath daily and maintain good hygiene",
          emoji: "🛁",
          description: "Exactly! Increased sweating means you need to maintain good hygiene to stay fresh and prevent odor.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it and continue as before",
          emoji: "😴",
          description: "Ignoring increased sweating can lead to body odor and discomfort. Good hygiene is important.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why do we sweat more during certain times?",
      options: [
        {
          id: "a",
          text: "Due to hormonal changes, physical activity, or weather",
          emoji: "🌡️",
          description: "Correct! Sweating increases due to hormonal changes during development, physical activity, and warm weather.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only when we're sick",
          emoji: "🤒",
          description: "While illness can cause sweating, we also sweat normally during development, exercise, and in warm weather.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How often should you bathe when sweating more?",
      options: [
        {
          id: "a",
          text: "Daily, or more often if needed",
          emoji: "🚿",
          description: "Great choice! Bathing daily or more frequently when sweating a lot helps maintain hygiene and comfort.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only once a week",
          emoji: "📅",
          description: "When sweating increases, bathing only once a week may not be sufficient to maintain good hygiene.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What type of clothes help manage increased sweating?",
      options: [
        {
          id: "a",
          text: "Breathable fabrics like cotton",
          emoji: "👕",
          description: "Perfect! Breathable fabrics help absorb sweat and allow air circulation, keeping you more comfortable.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tight synthetic materials",
          emoji: "👔",
          description: "Tight synthetic materials trap sweat and heat, making you feel more uncomfortable and increasing odor.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if you're embarrassed about sweating?",
      options: [
        {
          id: "a",
          text: "Talk to a trusted adult about normal body changes",
          emoji: "👩‍👧",
          description: "Wonderful! Talking to trusted adults helps you understand normal body changes and find solutions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid social situations completely",
          emoji: "🚶‍♀️",
          description: "Avoiding social situations isn't necessary. Increased sweating during development is normal and manageable.",
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
      title="Sweat Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-41"
      gameType="health-female"
      totalLevels={50}
      currentLevel={41}
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

export default SweatStory;