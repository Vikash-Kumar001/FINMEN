import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PreventionFirstPoster = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-76";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which slogan is best for staying healthy?",
      options: [
        {
          id: "a",
          text: "Never Wash Hands!",
          emoji: "🦠",
          description: "That would spread germs!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Prevention is Power!",
          emoji: "💪",
          description: "Yes! Stopping stickness is best.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eat Dirt!",
          emoji: "🌱",
          description: "Dirt is not food.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What picture shows 'Healthy Habits'?",
      options: [
        {
          id: "a",
          text: "Sleeping late and eating candy",
          emoji: "🍭",
          description: "Not very healthy habits.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Watching TV all day",
          emoji: "📺",
          description: "Too much TV isn't good.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eating fruits and playing outside",
          emoji: "🍎",
          description: "Correct! Good food and exercise.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Where should 'Safety Gear' go on the poster?",
      options: [
        {
          id: "a",
          text: "On a bike rider wearing a helmet",
          emoji: "🚴‍♀️",
          description: "Yes! Always gear up.",
          isCorrect: true
        },
        {
          id: "b",
          text: "On a dog",
          emoji: "🐕",
          description: "Dogs don't ride bikes.",
          isCorrect: false
        },
        {
          id: "c",
          text: "In the trash",
          emoji: "🗑️",
          description: "Keep gear, don't trash it.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What does 'Vaccines Save Lives' mean?",
      options: [
        {
          id: "a",
          text: "Vaccines are dangerous",
          emoji: "🚫",
          description: "Vaccines protect us.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Shots protect us from bad sickness",
          emoji: "🛡️",
          description: "Correct! They are vital.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Vaccines are candy",
          emoji: "🍬",
          description: "They are medicine.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who helps us stay healthy on our poster?",
      options: [
        {
          id: "b",
          text: "Clowns",
          emoji: "🤡",
          description: "Clowns are for fun.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Aliens",
          emoji: "👽",
          description: "Aliens are not real doctors here.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Doctors and Nurses",
          emoji: "👩‍⚕️",
          description: "Yes! They are health helpers.",
          isCorrect: true
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
      title="Poster: Prevention First"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={66}
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

export default PreventionFirstPoster;