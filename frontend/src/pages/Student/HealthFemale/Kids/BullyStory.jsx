import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BullyStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-65";

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A girl at school pushes you every day.",
      options: [
        {
          id: "a",
          text: "Push her back",
          emoji: "👊",
          description: "That makes you a bully too.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell a teacher or parent",
          emoji: "👩‍🏫",
          description: "Yes! Get help from an adult.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide in the bathroom",
          emoji: "🚽",
          description: "You shouldn't have to hide.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You see someone being mean to your friend.",
      options: [
        {
          id: "a",
          text: "Laugh along",
          emoji: "😂",
          description: "That hurts your friend.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Say 'Stop it' or get help",
          emoji: "✋",
          description: "Correct! Stand up for others.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Walk away",
          emoji: "🚶‍♀️",
          description: "Try to help if you can safely.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Is it tattling to report bullying?",
      options: [
        {
          id: "a",
          text: "No, telling keeps people safe",
          emoji: "🛡️",
          description: "Exactly! Reporting safety is good.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, you should be quiet",
          emoji: "🤐",
          description: "Never be quiet about safety.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It depends",
          emoji: "🤷‍♀️",
          description: "With bullying, always tell.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Someone sends mean messages online.",
      options: [
        {
          id: "a",
          text: "Reply with mean messages",
          emoji: "📱",
          description: "Don't fight fire with fire.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Show an adult and block them",
          emoji: "🚫",
          description: "Yes! Cyberbullying is serious.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Delete it and cry",
          emoji: "😢",
          description: "Save proof and tell someone.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What makes a bully stop?",
      options: [
        {
          id: "a",
          text: "Giving them your lunch money",
          emoji: "💸",
          description: "That rewards them.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Standing tall and getting help",
          emoji: "💪",
          description: "Correct! Confidence and support help.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Crying in front of them",
          emoji: "😭",
          description: "That might make them continue.",
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
      title="Bully Story"
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

export default BullyStory;