import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyRoutineKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-100";
  const currentLevel = 100;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "To earn the 'Morning Star' badge:",
      options: [
        {
          id: "a",
          text: "Sleep until noon",
          emoji: "😴",
          description: "That makes you miss the morning!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wake up, brush, and eat breakfast",
          emoji: "🌅",
          description: "Correct! A star morning routine.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Watch TV immediately",
          emoji: "📺",
          description: "Move your body first!",
          isCorrect: false
        },
      
      ]
    },
    {
      id: 2,
      text: "To earn the 'Water Warrior' badge:",
      options: [
        {
          id: "a",
          text: "Drink only soda",
          emoji: "🥤",
          description: "Soda has too much sugar.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Drink mud water",
          emoji: "🚱",
          description: "Yuck! Keep it clean.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Drink 8 glasses of water a day",
          emoji: "💧",
          description: "Yes! Hydration is power.",
          isCorrect: true
        },
        
      ]
    },
    {
      id: 3,
      text: "To earn the 'Golden Sleep' badge:",
      options: [
        {
          id: "a",
          text: "Go to bed on time every night",
          emoji: "🛌",
          description: "Correct! Routine brings golden rest.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sleep with shoes on",
          emoji: "👟",
          description: "Not very comfortable.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay up late on phones",
          emoji: "📱",
          description: "Blue light steals your sleep.",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 4,
      text: "To earn the 'Clean Machine' badge:",
      options: [
        {
          id: "a",
          text: "Shower only once a year",
          emoji: "🦨",
          description: "Please shower more often!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wear dirty clothes",
          emoji: "👕",
          description: "Clean clothes feel better.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Bathe regularly and wash hands",
          emoji: "🚿",
          description: "Yes! Stay fresh and clean.",
          isCorrect: true
        },
       
      ]
    },
    {
      id: 5,
      text: "The Ultimate 'Healthy Kid' Badge requires...",
      options: [
        {
          id: "a",
          text: "Only one good habit",
          emoji: "☝️",
          description: "You need more than one.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Doing healthy things consistently",
          emoji: "🔁",
          description: "Correct! Consistency is key.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eating candy for dinner",
          emoji: "🍬",
          description: "Not a healthy choice.",
          isCorrect: false
        },
        
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (selectedOptionId) return;

    setSelectedOptionId(optionId);
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setSelectedOptionId(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Badge: Healthy Routine Kid"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={currentLevel}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {questions[currentQuestion].text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => {
              const isSelected = selectedOptionId === option.id;
              const showFeedback = selectedOptionId !== null;

              let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700";

              if (showFeedback && isSelected) {
                buttonClass = option.isCorrect
                  ? "bg-green-500 ring-4 ring-green-300"
                  : "bg-red-500 ring-4 ring-red-300";
              } else if (showFeedback && !isSelected) {
                buttonClass = "bg-white/10 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${buttonClass}`}
                >
                  <div className="flex items-center">
                    <div className="text-4xl mr-6">{option.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 text-white">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white font-medium mt-2 animate-fadeIn">{option.description}</p>
                      )}
                    </div>
                    {showFeedback && isSelected && (
                      <div className="text-3xl ml-4">
                        {option.isCorrect ? "✅" : "❌"}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default HealthyRoutineKidBadge;