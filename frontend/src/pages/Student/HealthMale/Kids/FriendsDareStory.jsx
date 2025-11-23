import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendsDareStory = () => {
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
      text: "Your friend dares you to skip homework and play outside instead. What do you do?",
      options: [
        {
          id: "b",
          text: "Skip homework and play",
          emoji: "🏃",
          description: "Homework helps you learn and do well in school",
          isCorrect: false
        },
        {
          id: "a",
          text: "Finish homework first, then play",
          emoji: "📚",
          description: "Doing homework shows responsibility and good choices",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide homework and pretend it's done",
          emoji: "🙈",
          description: "Honesty and completing work are important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends dare you to eat a whole cake before dinner. What's the smart choice?",
      options: [
        {
          id: "c",
          text: "Eat it all and feel sick",
          emoji: "🤢",
          description: "Too much sugar isn't healthy for your body",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and wait for proper dessert",
          emoji: "⏰",
          description: "Waiting shows self-control and healthy choices",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take just a little bite",
          emoji: "🍰",
          description: "It's better to say no to unhealthy dares completely",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend dares you to run across a busy street. What should you do?",
      options: [
        {
          id: "b",
          text: "Run across quickly",
          emoji: "🏃",
          description: "Running across busy streets is very dangerous",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and find a safe way to cross",
          emoji: "🚦",
          description: "Safety is more important than any dare",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask an adult to help",
          emoji: "👨‍👩‍👧",
          description: "Asking for help with dangerous dares is smart",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Friends dare you to stay up all night playing games. What's best?",
      options: [
        {
          id: "c",
          text: "Stay up all night",
          emoji: "🕚",
          description: "Sleep is important for your body and brain",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and get good sleep",
          emoji: "😴",
          description: "Good sleep helps you learn and stay healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Play just a little longer",
          emoji: "🎮",
          description: "Bedtime rules help you get enough rest",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Someone dares you to throw trash on the ground. What do you do?",
      options: [
        {
          id: "b",
          text: "Throw it on the ground",
          emoji: "🗑️",
          description: "Littering hurts the environment and shows bad character",
          isCorrect: false
        },
        {
          id: "c",
          text: "Find a trash can instead",
          emoji: "♻️",
          description: "Finding proper disposal shows respect for the environment",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and explain why it's wrong",
          emoji: "🗣️",
          description: "Standing up for what's right makes you a good friend",
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
    navigate("/student/health-male/kids/quiz-peer-pressure");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Friend's Dare Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-61"
      gameType="health-male"
      totalLevels={70}
      currentLevel={61}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
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

export default FriendsDareStory;
