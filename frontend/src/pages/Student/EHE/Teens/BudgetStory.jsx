import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BudgetStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen earns ₹500. Should she spend all or make a budget?",
      options: [
        {
          id: "a",
          text: "Make a budget to manage money wisely",
          emoji: "📋",
          description: "Correct! Budgeting helps allocate money for needs, wants, and savings.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend all immediately on fun things",
          emoji: "🎉",
          description: "Spending all money at once leaves nothing for emergencies or future goals.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hide the money and forget about it",
          emoji: "🙈",
          description: "Ignoring money doesn't make it grow or help achieve financial goals.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best approach to budgeting for a teen?",
      options: [
        {
          id: "a",
          text: "Track income and expenses, set spending limits",
          emoji: "📊",
          description: "Exactly! Tracking helps understand spending patterns and make informed decisions.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend whatever feels right in the moment",
          emoji: "💸",
          description: "Impulse spending without a plan often leads to financial stress.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask parents to handle all financial decisions",
          emoji: "👨‍👩‍👧‍👦",
          description: "Learning to budget is an important life skill for financial independence.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should be the first step in creating a budget?",
      options: [
        {
          id: "a",
          text: "List all sources of income",
          emoji: "📥",
          description: "Great! Knowing how much money is coming in is essential for budgeting.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Buy the most expensive item first",
          emoji: "🛍️",
          description: "Prioritizing purchases before understanding income leads to overspending.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spend money on entertainment",
          emoji: "🎬",
          description: "Entertainment is important but should be planned within the budget.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to save money even as a teen?",
      options: [
        {
          id: "a",
          text: "Builds financial security and good habits",
          emoji: "🏦",
          description: "Perfect! Saving early helps with emergencies and teaches financial discipline.",
          isCorrect: true
        },
        {
          id: "b",
          text: "To avoid ever spending money again",
          emoji: "🔒",
          description: "Saving doesn't mean never spending - it's about balancing spending and saving.",
          isCorrect: false
        },
        {
          id: "c",
          text: "To show off to friends",
          emoji: "炫耀",
          description: "Financial decisions should be based on personal goals, not peer pressure.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's a good rule of thumb for teen budgeting?",
      options: [
        {
          id: "a",
          text: "Save some, spend some, give some if possible",
          emoji: "🎯",
          description: "Correct! The 50/30/20 rule (needs/wants/savings) is a good starting point.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend everything on wants first",
          emoji: "🛒",
          description: "Prioritizing wants over needs and savings can lead to financial problems.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never spend money on anything",
          emoji: "🚫",
          description: "Money is meant to be used for value, not hoarded without purpose.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/ehe/teens/debate-save-or-spend");
  };

  return (
    <GameShell
      title="Budget Story"
      subtitle={`Level 25 of 30`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-25"
      gameType="ehe"
      totalLevels={30}
      currentLevel={25}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 25/30</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BudgetStory;