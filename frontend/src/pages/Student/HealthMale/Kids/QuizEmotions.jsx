import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizEmotions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-52";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which of these is an emotion?",
      options: [
        {
          id: "a",
          text: "Chair",
          emoji: "🪑",
          description: "A chair is a thing, not a feeling",
          isCorrect: false
        },
        {
          id: "b",
          text: "Happy",
          emoji: "😊",
          description: "Happy is a feeling you have inside",
          isCorrect: true
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
        },
        {
          id: "c",
          text: "A type of food",
          emoji: "🍎",
          description: "Sad is when you feel unhappy or cry",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which shows someone is angry?",
      options: [
        {
          id: "a",
          text: "Jumping with joy",
          emoji: "🤾",
          description: "This shows happiness, not anger",
          isCorrect: false
        },
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
          id: "b",
          text: "A type of vegetable",
          emoji: "🥕",
          description: "Excited is a feeling, not a food",
          isCorrect: false
        },
        {
          id: "c",
          text: "When you're very tired",
          emoji: "😴",
          description: "Excited is the opposite of tired",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which feeling helps you know something is wrong?",
      options: [
        {
          id: "a",
          text: "Boredom",
          emoji: "😐",
          description: "Fear is more helpful than boredom for staying safe",
          isCorrect: false
        },
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
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Quiz on Emotions"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      backPath="/games/health-male/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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
