import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OpportunityStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen notices friends need healthy snacks at school. Should she start a snack stall?",
      options: [
        {
          id: "a",
          text: "Yes, identify the need and create a solution",
          emoji: "✅",
          description: "Excellent! Entrepreneurs recognize opportunities and create solutions to meet needs",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, someone else will do it",
          emoji: "❌",
          description: "Missed opportunities prevent entrepreneurial growth and community problem-solving",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the need completely",
          emoji: "🙈",
          description: "Ignoring community needs doesn't help anyone and misses entrepreneurial potential",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the first step in starting a snack stall business?",
      options: [
        {
          id: "a",
          text: "Research what snacks are popular and allowed",
          emoji: "🔍",
          description: "Perfect! Research helps understand market demand and school regulations",
          isCorrect: true
        },
        {
          id: "b",
          text: "Start buying snacks without any planning",
          emoji: "🛒",
          description: "Jumping in without research can lead to unsellable inventory and policy violations",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain about the lack of snacks",
          emoji: "😠",
          description: "Complaining doesn't solve problems; entrepreneurship requires action",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should the teen fund her snack stall?",
      options: [
        {
          id: "a",
          text: "Save money, ask family for support, or find investors",
          emoji: "💰",
          description: "Great! Multiple funding sources reduce risk and increase chances of success",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend all her savings immediately",
          emoji: "💸",
          description: "Spending all savings creates financial risk and limits future opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Expect others to fund it without effort",
          emoji: "🤔",
          description: "Successful ventures require personal investment of time, effort, and sometimes money",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's important for running a successful snack stall?",
      options: [
        {
          id: "a",
          text: "Quality products, fair prices, and good customer service",
          emoji: "🌟",
          description: "Exactly! These elements build customer loyalty and business reputation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Highest prices to maximize profit",
          emoji: "💸",
          description: "Overpricing drives customers away and damages business reputation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Selling anything without quality control",
          emoji: "🤢",
          description: "Poor quality products harm customers and destroy business credibility",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can this experience help the teen in the future?",
      options: [
        {
          id: "a",
          text: "Develop business skills and confidence",
          emoji: "📈",
          description: "Perfect! Early entrepreneurial experiences build valuable life skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make her never try anything again",
          emoji: "😰",
          description: "Positive experiences encourage future innovation and risk-taking",
          isCorrect: false
        },
        {
          id: "c",
          text: "Prove she's only good at selling snacks",
          emoji: "🥜",
          description: "Entrepreneurial skills transfer to many areas of life and work",
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
    navigate("/student/ehe/teens/quiz-entrepreneur-traits");
  };

  return (
    <GameShell
      title="Opportunity Story"
      subtitle={`Level 11 of 20`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-11"
      gameType="ehe"
      totalLevels={20}
      currentLevel={11}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 11/20</span>
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

export default OpportunityStory;