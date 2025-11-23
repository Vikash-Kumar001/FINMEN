import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SocialBusinessStory = () => {
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
      text: "A teen creates an app to connect farmers directly to buyers. What type of business is this?",
      options: [
        {
          id: "a",
          text: "Social business",
          emoji: "🌍",
          description: "Perfect! This business solves a social problem while being financially sustainable",
          isCorrect: true
        },
        {
          id: "b",
          text: "Traditional retail",
          emoji: "🏪",
          description: "Traditional retail doesn't focus on solving social problems",
          isCorrect: false
        },
        {
          id: "c",
          text: "Entertainment app",
          emoji: "🎮",
          description: "This app has a practical purpose beyond entertainment",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the main goal of a social business?",
      options: [
        {
          id: "a",
          text: "Maximize profits only",
          emoji: "💰",
          description: "Profit maximization is a traditional business goal, not social business",
          isCorrect: false
        },
        {
          id: "b",
          text: "Solve social problems sustainably",
          emoji: "🌱",
          description: "Exactly! Social businesses aim to solve social issues while being financially sustainable",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid making money",
          emoji: "❌",
          description: "Social businesses need to be financially sustainable to continue their work",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does a social business differ from a charity?",
      options: [
        {
          id: "a",
          text: "It must be financially sustainable",
          emoji: "📈",
          description: "Correct! Social businesses aim to be self-sustaining rather than dependent on donations",
          isCorrect: true
        },
        {
          id: "b",
          text: "It gives away everything for free",
          emoji: "🎁",
          description: "Social businesses charge for their products/services to maintain sustainability",
          isCorrect: false
        },
        {
          id: "c",
          text: "It only helps rich people",
          emoji: "👑",
          description: "Social businesses typically focus on helping underserved communities",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which is a benefit of social businesses?",
      options: [
        {
          id: "a",
          text: "Create positive social impact",
          emoji: "✨",
          description: "Exactly! Social businesses create measurable positive change in communities",
          isCorrect: true
        },
        {
          id: "b",
          text: "Exploit workers for profit",
          emoji: "😢",
          description: "Social businesses prioritize fair treatment of workers and communities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore environmental concerns",
          emoji: "🗑️",
          description: "Social businesses typically consider environmental sustainability as part of their mission",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What skills are important for social entrepreneurs?",
      options: [
        {
          id: "a",
          text: "Problem-solving and empathy",
          emoji: "🧠",
          description: "Perfect! Understanding problems deeply and finding creative solutions are key",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only technical coding skills",
          emoji: "💻",
          description: "While technical skills help, social entrepreneurs need broader skill sets",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring community needs",
          emoji: "🔇",
          description: "Successful social entrepreneurs deeply engage with the communities they serve",
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
    navigate("/student/ehe/teens/quiz-changemakers");
  };

  return (
    <GameShell
      title="Social Business Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-81"
      gameType="ehe"
      totalLevels={90}
      currentLevel={81}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-white mb-2">Social Business Story</h3>
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

export default SocialBusinessStory;