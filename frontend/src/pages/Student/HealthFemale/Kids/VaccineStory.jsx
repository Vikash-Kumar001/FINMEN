import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VaccineStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-71";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "It is time for your shot (vaccine) at the doctor's.",
      options: [
        {
          id: "a",
          text: "Run out of the office",
          emoji: "🏃‍♀️",
          description: "You need the shot to stay healthy.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Be brave and hold still",
          emoji: "🦸‍♀️",
          description: "Correct! It only hurts for a second.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Kick the doctor",
          emoji: "🦶",
          description: "Never hurt the doctor.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why do we get vaccines?",
      options: [
        {
          id: "a",
          text: "To get candy",
          emoji: "🍬",
          description: "That's a nice treat, but not the reason.",
          isCorrect: false
        },
        {
          id: "b",
          text: "To teach our body to fight germs",
          emoji: "🦠",
          description: "Yes! They make us strong against sickness.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Because it's fun",
          emoji: "🎉",
          description: "Shots usually aren't fun.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "After the shot, your arm might feel sore.",
      options: [
        {
          id: "b",
          text: "Put a cool cloth on it and rest",
          emoji: "🧊",
          description: "Correct! That helps the soreness.",
          isCorrect: true
        },
        {
          id: "a",
          text: "Cry all day",
          emoji: "😭",
          description: "It will feel better soon.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Hit it",
          emoji: "👊",
          description: "That will make it hurt more.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A friend says vaccines are scary.",
      options: [
        {
          id: "a",
          text: "Agree and get scared",
          emoji: "😨",
          description: "Don't be scared.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "scare them more",
          emoji: "👻",
          description: "That is not kind.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell them vaccines are like superhero shields",
          emoji: "🛡️",
          description: "Yes! They protect us.",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "The doctor gives you a sticker after.",
      options: [
        {
          id: "a",
          text: "Say 'Thank You'",
          emoji: "🙏",
          description: "Correct! Manners are important.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Throw it away",
          emoji: "🗑️",
          description: "You earned that sticker!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat it",
          emoji: "😋",
          description: "Stickers are not food.",
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
      title="Vaccine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={61}
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

export default VaccineStory;