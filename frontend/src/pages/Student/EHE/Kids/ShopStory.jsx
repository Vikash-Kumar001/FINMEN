import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShopStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You have ₹50. Ice cream = ₹40, Toy = ₹60. What can you buy?",
      options: [
        {
          id: "c",
          text: "Both items",
          emoji: "🍨",
          description: "Not possible - you don't have enough money for both!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only the toy",
          emoji: "トイ",
          description: "The toy costs ₹60, but you only have ₹50!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Only the ice cream",
          emoji: "🍨",
          description: "Correct! You can afford the ice cream with your ₹50.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "After buying the ice cream, how much money do you have left?",
      options: [
        {
          id: "b",
          text: "₹20",
          emoji: "₹20",
          description: "Not quite! ₹50 - ₹40 = ₹10.",
          isCorrect: false
        },
        {
          id: "c",
          text: "₹0",
          emoji: "₹0",
          description: "No, you spent ₹40, so you have some left!",
          isCorrect: false
        },
        {
          id: "a",
          text: "₹10",
          emoji: "₹10",
          description: "Exactly! ₹50 - ₹40 = ₹10 left.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What should you do with the ₹10 you have left?",
      options: [
        {
          id: "b",
          text: "Throw it away",
          emoji: "🗑️",
          description: "No! That would be wasteful.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spend it immediately on candy",
          emoji: "🍬",
          description: "You could, but saving might be better!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save it for something else",
          emoji: "🏦",
          description: "Perfect! Saving helps you buy bigger items later.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Next week, you get another ₹50. What's the smartest choice?",
      options: [
        {
          id: "c",
          text: "Spend all ₹100 immediately",
          emoji: "💸",
          description: "That's not a good plan for financial health!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Save all ₹100 under your pillow",
          emoji: "🛏️",
          description: "Better to save in a bank where it can grow!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save some in bank, spend some on needs",
          emoji: "🏦",
          description: "Exactly! Balance saving and spending wisely!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to compare prices before buying?",
      options: [
        {
          id: "b",
          text: "To spend more money",
          emoji: "💸",
          description: "No, comparing prices helps you spend LESS!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To make shopping take longer",
          emoji: "⏱️",
          description: "That's not the main reason!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To get the best value for your money",
          emoji: "💡",
          description: "Exactly! Comparing prices helps you save money!",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Shop Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-28"
      gameType="ehe"
      totalLevels={10}
      currentLevel={28}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
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

export default ShopStory;