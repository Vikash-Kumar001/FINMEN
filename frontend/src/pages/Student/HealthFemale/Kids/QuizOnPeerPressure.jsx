import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPeerPressure = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-62";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What is peer pressure?",
      options: [
        {
          id: "a",
          text: "When friends push you to do something",
          emoji: "👉",
          description: "Yes! It can be good or bad.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Playing alone",
          emoji: "🧍‍♀️",
          description: "That is just being by yourself.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Doing homework",
          emoji: "📝",
          description: "Homework is a responsibility.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is all peer pressure bad?",
      options: [
        {
          id: "a",
          text: "Yes, always",
          emoji: "😈",
          description: "Not always! Friends can encourage good things.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, friends can encourage you to do good",
          emoji: "😇",
          description: "Correct! Like studying or playing sports.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only on Tuesdays",
          emoji: "📅",
          description: "It can happen any day.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What if 'everyone' is doing something unsafe?",
      options: [
        {
          id: "a",
          text: "You should do it too",
          emoji: "🐏",
          description: "Just because everyone does it doesn't make it safe.",
          isCorrect: false
        },
        {
          id: "b",
          text: "You should still say No",
          emoji: "🛑",
          description: "Yes! Safety first.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Take a picture",
          emoji: "📸",
          description: "Focus on keeping yourself safe.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps you resist peer pressure?",
      options: [
        {
          id: "a",
          text: "Confidence in yourself",
          emoji: "😎",
          description: "Correct! Trust your own feelings.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Being mean",
          emoji: "😠",
          description: "You don't have to be mean.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eating candy",
          emoji: "🍬",
          description: "Candy doesn't help with pressure.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "If you feel uncomfortable, you should...",
      options: [
        {
          id: "a",
          text: "Stay quiet",
          emoji: "😶",
          description: "Speak up for yourself.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Listen to your gut and leave",
          emoji: "🏃‍♀️",
          description: "Exactly! Your feelings warn you.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Laugh nervously",
          emoji: "😅",
          description: "Don't just laugh it off, take action.",
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
      title="Quiz on Peer Pressure"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={62}
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

export default QuizOnPeerPressure;