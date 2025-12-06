import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SickDayStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-75";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You wake up feeling hot and tired (fever).",
      options: [
        {
          id: "a",
          text: "Go to school anyway",
          emoji: "🏫",
          description: "You might make others sick.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell a parent and stay home",
          emoji: "🛌",
          description: "Correct! Rest helps you heal.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Play outside in the cold",
          emoji: "❄️",
          description: "That could make you worse.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your doctor gives you medicine.",
      options: [
        {
          id: "a",
          text: "Take it exactly as told",
          emoji: "💊",
          description: "Yes! Follow the doctor's rules.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide it under the bed",
          emoji: "🛏️",
          description: "Medicine helps you get better.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give it to your pet",
          emoji: "🐶",
          description: "Medicine is only for you.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You are bored in bed.",
      options: [
        {
          id: "a",
          text: "Jump on the bed",
          emoji: "🤸‍♀️",
          description: "You need to save energy.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Run laps around the house",
          emoji: "🏃‍♀️",
          description: "Rest your body.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Read a book or sleep",
          emoji: "📚",
          description: "Correct! Quiet activities are best.",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "You need to throw up.",
      options: [
        {
          id: "a",
          text: "Do it on the floor",
          emoji: "🤢",
          description: "Try to get to a bathroom.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Go to the bathroom or use a bucket",
          emoji: "🚽",
          description: "Yes! Keep things clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hold it in forever",
          emoji: "🤐",
          description: "Better to let it out safely.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "When can you go back to school?",
      options: [
        {
          id: "b",
          text: "When you feel better and doctor says okay",
          emoji: "😊",
          description: "Correct! No germs for friends.",
          isCorrect: true
        },
        {
          id: "a",
          text: "When you still have a fever",
          emoji: "🤒",
          description: "Wait until the fever is gone.",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Never",
          emoji: "🛑",
          description: "You'll go back when well.",
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
      title="Sick Day Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={65}
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

export default SickDayStory;