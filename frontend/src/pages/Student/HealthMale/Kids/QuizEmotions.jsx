import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizEmotions = () => {
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
      text: "Which of these is an emotion?",
      options: [
        {
          id: "b",
          text: "Happy",
          emoji: "😊",
          description: "Happy is a feeling you have inside",
          isCorrect: true
        },
        {
          id: "a",
          text: "Chair",
          emoji: "🪑",
          description: "A chair is a thing, not a feeling",
          isCorrect: false
        },
        {
          id: "c",
          text: "Book",
          emoji: "📚",
          description: "A book is a thing you read, not a feeling",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What does 'sad' mean?",
      options: [
        {
          id: "c",
          text: "A type of food",
          emoji: "🍎",
          description: "Sad is when you feel unhappy or cry",
          isCorrect: false
        },
        {
          id: "a",
          text: "When you feel unhappy",
          emoji: "😢",
          description: "Sad means feeling unhappy or down",
          isCorrect: true
        },
        {
          id: "b",
          text: "A game you play",
          emoji: "🎮",
          description: "Sad is an emotion, not a game",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which shows someone is angry?",
      options: [
        {
          id: "b",
          text: "Smiling and laughing",
          emoji: "😄",
          description: "Angry people usually frown or yell",
          isCorrect: false
        },
        {
          id: "c",
          text: "Frowning and crossing arms",
          emoji: "😠",
          description: "These are signs of anger",
          isCorrect: true
        },
        {
          id: "a",
          text: "Jumping with joy",
          emoji: "🤾",
          description: "This shows happiness, not anger",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is 'excited'?",
      options: [
        {
          id: "a",
          text: "When you feel really happy and energetic",
          emoji: "🎉",
          description: "Excited means very happy and full of energy",
          isCorrect: true
        },
        {
          id: "c",
          text: "When you're very tired",
          emoji: "😴",
          description: "Excited is the opposite of tired",
          isCorrect: false
        },
        {
          id: "b",
          text: "A type of vegetable",
          emoji: "🥕",
          description: "Excited is a feeling, not a food",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which feeling helps you know something is wrong?",
      options: [
        {
          id: "b",
          text: "Happiness",
          emoji: "😊",
          description: "Fear helps us stay safe when something might be dangerous",
          isCorrect: false
        },
        {
          id: "c",
          text: "Fear",
          emoji: "😨",
          description: "Fear tells us when we need to be careful",
          isCorrect: true
        },
        {
          id: "a",
          text: "Boredom",
          emoji: "😐",
          description: "Fear is more helpful than boredom for staying safe",
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
    navigate("/student/health-male/kids/reflex-emotion-check");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Emotions"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-52"
      gameType="health-male"
      totalLevels={60}
      currentLevel={52}
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

export default QuizEmotions;
