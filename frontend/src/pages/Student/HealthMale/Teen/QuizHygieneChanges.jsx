import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizHygieneChanges = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-2";
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
      text: "Why do you need to change clothes more often in puberty?",
      options: [
        {
          id: "b",
          text: "To look cool",
          emoji: "😎",
          description: "Style is good, but hygiene is key.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Sweat and bacteria build up",
          emoji: "🦠",
          description: "Clothes trap sweat and can smell.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Because parents say so",
          emoji: "👪",
          description: "It's for your own health and smell.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the best way to prevent foot odor?",
      options: [
        {
          id: "c",
          text: "Wear shoes without socks",
          emoji: "👟",
          description: "That makes it worse!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Change socks daily",
          emoji: "🧦",
          description: "Clean socks keep feet dry.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spray perfume on shoes",
          emoji: "💨",
          description: "Masking the smell doesn't fix the bacteria.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When should you brush your teeth?",
      options: [
        {
          id: "b",
          text: "Once a week",
          emoji: "📅",
          description: "Yuck! Daily is needed.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Twice a day",
          emoji: "🪥",
          description: "Morning and night keeps teeth bright.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when eating candy",
          emoji: "🍬",
          description: "Food sticks to teeth every meal.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Is it okay to share a razor?",
      options: [
        {
          id: "c",
          text: "Yes, with friends",
          emoji: "🤝",
          description: "Never share razors!",
          isCorrect: false
        },
        {
          id: "b",
          text: "If you wash it",
          emoji: "🚿",
          description: "It's still risky for infections.",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, never",
          emoji: "🚫",
          description: "Sharing razors spreads germs and blood.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What causes acne?",
      options: [
        {
          id: "b",
          text: "Eating chocolate",
          emoji: "🍫",
          description: "Diet plays a role, but it's mostly oils.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Being dirty",
          emoji: "💩",
          description: "It's not just dirt, it's inside your skin.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Clogged pores and oil",
          emoji: "🧴",
          description: "Oil gets trapped and causes pimples.",
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
    navigate("/student/health-male/teens/reflex-smart-hygiene");
  };

  return (
    <GameShell
      title="Quiz on Hygiene Changes"
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

export default QuizHygieneChanges;
