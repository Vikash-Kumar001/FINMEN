import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateSaveOrSpend = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is saving money more important than spending it?",
      options: [
        {
          id: "a",
          text: "Balance is best - save for goals, spend mindfully",
          emoji: "⚖️",
          description: "Correct! Financial health comes from both saving for future needs and enjoying present moments.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Saving is always better - never spend",
          emoji: "🔒",
          description: "Extreme saving without any spending misses opportunities and life enjoyment.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spending is always better - enjoy now",
          emoji: "🎉",
          description: "Uncontrolled spending leads to financial stress and inability to handle emergencies.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the benefit of saving money as a teen?",
      options: [
        {
          id: "a",
          text: "Builds emergency fund and good financial habits",
          emoji: "🏦",
          description: "Exactly! Early saving creates a safety net and develops lifelong financial discipline.",
          isCorrect: true
        },
        {
          id: "b",
          text: "To never buy anything ever again",
          emoji: "🚫",
          description: "Saving is about planning, not deprivation - it enables future purchases.",
          isCorrect: false
        },
        {
          id: "c",
          text: "To show off wealth to friends",
          emoji: "炫耀",
          description: "Financial decisions should be based on personal goals, not peer pressure.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When is it appropriate to spend money as a teen?",
      options: [
        {
          id: "a",
          text: "On needs, planned wants, and meaningful experiences",
          emoji: "🎯",
          description: "Perfect! Thoughtful spending on value-aligned purchases contributes to well-being.",
          isCorrect: true
        },
        {
          id: "b",
          text: "On anything that looks interesting in the moment",
          emoji: "🛒",
          description: "Impulse purchases often lead to regret and financial stress.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only on the most expensive items available",
          emoji: "💎",
          description: "Status-driven spending doesn't lead to lasting satisfaction or financial health.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the danger of only focusing on spending?",
      options: [
        {
          id: "a",
          text: "No emergency fund, debt risk, no future security",
          emoji: "⚠️",
          description: "Correct! Excessive spending without saving creates financial vulnerability.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Missing out on all life's pleasures",
          emoji: "😢",
          description: "Mindful spending enhances life - the issue is with uncontrolled spending.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Becoming too financially knowledgeable",
          emoji: "📚",
          description: "Financial knowledge is beneficial regardless of spending habits.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the danger of only focusing on saving?",
      options: [
        {
          id: "a",
          text: "Missing opportunities, no life enjoyment, social isolation",
          emoji: "😞",
          description: "Correct! Extreme saving without any spending leads to a diminished quality of life.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Becoming too financially secure",
          emoji: "🛡️",
          description: "Financial security is beneficial - the issue is with extreme approaches.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spending all money on unnecessary things",
          emoji: "💸",
          description: "That's the opposite of extreme saving - the issue is with unbalanced approaches.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/ehe/teens/journal-business-money");
  };

  return (
    <GameShell
      title="Debate: Save or Spend?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="ehe-teen-26"
      gameType="ehe"
      totalLevels={30}
      currentLevel={26}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Save vs Spend Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default DebateSaveOrSpend;