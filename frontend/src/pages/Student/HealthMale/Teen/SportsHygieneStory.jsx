import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SportsHygieneStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-5";
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
      text: "You just finished a football match. You are soaked in sweat. What now?",
      options: [
        {
          id: "b",
          text: "Go straight to bed",
          emoji: "🛌",
          description: "Sleeping in sweat causes rashes.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Shower immediately",
          emoji: "🚿",
          description: "Wash away sweat and bacteria.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Spray perfume",
          emoji: "💨",
          description: "Perfume doesn't clean you.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What about your gym clothes?",
      options: [
        {
          id: "c",
          text: "Wear them tomorrow",
          emoji: "👕",
          description: "They are full of bacteria!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash them",
          emoji: "🧺",
          description: "Clean clothes prevent skin infections.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Leave them in bag",
          emoji: "🎒",
          description: "They will mold and smell terrible.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your feet are itchy after sports. What could it be?",
      options: [
        {
          id: "b",
          text: "Mosquito bite",
          emoji: "🦟",
          description: "Possible, but between toes usually means fungus.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Dry skin",
          emoji: "🌵",
          description: "Sweaty feet aren't usually dry.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Athlete's Foot",
          emoji: "🦶",
          description: "Fungus loves damp, sweaty shoes.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How do you prevent Athlete's Foot?",
      options: [
        {
          id: "c",
          text: "Wear tight shoes",
          emoji: "👞",
          description: "Tight shoes trap moisture.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep feet dry and clean",
          emoji: "✨",
          description: "Change socks and air out shoes.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never wash feet",
          emoji: "🚫",
          description: "That guarantees infection!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You have a small cut from playing. What do you do?",
      options: [
        {
          id: "b",
          text: "Ignore it",
          emoji: "🤷",
          description: "It could get infected.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Rub dirt on it",
          emoji: "🌱",
          description: "That introduces germs!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Clean and cover it",
          emoji: "🩹",
          description: "First aid prevents infection.",
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
    navigate("/student/health-male/teens/hygiene-confidence-debate");
  };

  return (
    <GameShell
      title="Sports Hygiene Story"
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

export default SportsHygieneStory;
