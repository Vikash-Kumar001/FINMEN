import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JunkFoodStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-18";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friends buy chips every day at lunch. They offer to share. What do you do?",
      options: [
        {
          id: "a",
          text: "Take some chips",
          emoji: "🍟",
          description: "Chips don't have good nutrients.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eat your healthy lunch",
          emoji: "🍱",
          description: "Smart! Healthy food fuels your body.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Your friends say healthy food is boring. How do you respond?",
      options: [
        {
          id: "b",
          text: "Say it gives energy!",
          emoji: "💪",
          description: "Perfect! Explain the benefits.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Agree and get junk",
          emoji: "😞",
          description: "Don't give up! Healthy food is tasty too.",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 3,
      text: "You're at a party with lots of snacks. What do you choose?",
      options: [
        {
          id: "a",
          text: "Only sweets & chips",
          emoji: "🍰",
          description: "Too much sugar isn't good.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Mix of healthy & treat",
          emoji: "🥗",
          description: "Balance is key!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Friends tease you for bringing fruit. What do you do?",
      options: [
        {
          id: "b",
          text: "Explain it's delicious",
          emoji: "😊",
          description: "Confidence helps you stay healthy.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Hide the fruit",
          emoji: "😢",
          description: "Be proud of your healthy choice!",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 5,
      text: "You see a new colorful candy everyone is eating. Do you?",
      options: [
        {
          id: "a",
          text: "Eat it just to fit in",
          emoji: "🍭",
          description: "Make choices for YOU, not others.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip or have a tiny bit",
          emoji: "🤔",
          description: "You're in control of what you eat.",
          isCorrect: true
        }
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
      title="Junk Food Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={18}
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

export default JunkFoodStory;