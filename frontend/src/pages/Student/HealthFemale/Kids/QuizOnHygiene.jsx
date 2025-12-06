import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnHygiene = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-42";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "How often should you take a bath or shower?",
      options: [
        {
          id: "a",
          text: "Once a month",
          emoji: "📅",
          description: "That's not enough to stay clean.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every day or regularly",
          emoji: "🚿",
          description: "Yes! Daily washing keeps you fresh.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when mom says so",
          emoji: "🗣️",
          description: "It should be your own healthy habit.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do you need to wash your hands properly?",
      options: [
        {
          id: "a",
          text: "Just water",
          emoji: "💧",
          description: "Water alone doesn't kill germs.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Soap and Water",
          emoji: "🧼",
          description: "Correct! Soap fights the germs.",
          isCorrect: true
        },
        {
          id: "c",
          text: "A towel only",
          emoji: "🧖‍♀️",
          description: "A towel dries, but doesn't clean.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When should you brush your teeth?",
      options: [
        {
          id: "a",
          text: "Before breakfast",
          emoji: "🌅",
          description: "Good start, but do it twice a day.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Morning and Night",
          emoji: "🦷",
          description: "Perfect! Twice a day keeps cavities away.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if you ate candy",
          emoji: "🍬",
          description: "You need to brush every day regardless.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why do we wear clean underwear every day?",
      options: [
        {
          id: "a",
          text: "To stop germs and odors",
          emoji: "🩲",
          description: "Exactly! It keeps your private parts healthy.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Because it looks nice",
          emoji: "👀",
          description: "Hygiene is the main reason.",
          isCorrect: false
        },
        {
          id: "c",
          text: "We don't need to",
          emoji: "🚫",
          description: "You should change it daily!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do after using the toilet?",
      options: [
        {
          id: "a",
          text: "Wash your hands",
          emoji: "👐",
          description: "Yes! Always wash hands after the toilet.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Run away fast",
          emoji: "🏃‍♀️",
          description: "Don't forget to wash up!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Touch your face",
          emoji: "🤦‍♀️",
          description: "Yuck! Wash your hands first.",
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
      title="Quiz on Hygiene"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={42}
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

export default QuizOnHygiene;