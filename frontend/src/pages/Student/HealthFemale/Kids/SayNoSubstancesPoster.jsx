import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SayNoSubstancesPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-86";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which sign means 'No Smoking'?",
      options: [
        {
          id: "a",
          text: "A smiley face",
          emoji: "😀",
          description: "That means happy.",
          isCorrect: false
        },
        {
          id: "b",
          text: "A cigarette with a red circle and line",
          emoji: "🚭",
          description: "Correct! That symbol means NO.",
          isCorrect: true
        },
        {
          id: "c",
          text: "A thumbs up",
          emoji: "👍",
          description: "That means yes or good.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What slogan helps you say no?",
      options: [
        {
          id: "a",
          text: "Be cool, be safe, say NO!",
          emoji: "😎",
          description: "Yes! That is a strong message.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try everything",
          emoji: "🤷",
          description: "Some things are dangerous.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say maybe",
          emoji: "🤔",
          description: "Saying NO clearly is better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Who can you draw on your poster as a helper?",
      options: [
        {
          id: "a",
          text: "A superhero teacher",
          emoji: "🦸",
          description: "Teachers help keep you safe.",
          isCorrect: true
        },
        {
          id: "b",
          text: "A villain",
          emoji: "🦹",
          description: "Villains cause trouble.",
          isCorrect: false
        },
        {
          id: "c",
          text: "A monster",
          emoji: "👹",
          description: "Monsters are scary.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What image shows healthy lungs?",
      options: [
       
        {
          id: "b",
          text: "Black and smoky lungs",
          emoji: "🖤",
          description: "Those are sick lungs.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Lungs made of stone",
          emoji: "🪨",
          description: "Lungs are not stone.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Pink and happy lungs",
          emoji: "🩷",
          description: "Correct! Healthy lungs are pink.",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "The best choice is to be...",
      options: [
        
        {
          id: "b",
          text: "Very sleepy",
          emoji: "😴",
          description: "Sleep is good, but choose health first.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Drug Free",
          emoji: "🌟",
          description: "Yes! Stay clean and strong.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Angry",
          emoji: "😠",
          description: "Being angry isn't a choice for health.",
          isCorrect: false
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
      title="Poster: Say No to Substances"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={86}
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

export default SayNoSubstancesPoster;