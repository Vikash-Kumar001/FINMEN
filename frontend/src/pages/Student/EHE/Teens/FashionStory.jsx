import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FashionStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A 16-year-old notices that school uniforms don't reflect students' personalities. What should she consider first?",
      options: [
        {
          id: "a",
          text: "Start a clothing line without research",
          emoji: "✂️",
          description: "Jumping in without research can lead to missed opportunities and problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Research school dress codes and student needs",
          emoji: "🔍",
          description: "Perfect! Understanding regulations and customer needs is essential for success",
          isCorrect: true
        },
        {
          id: "c",
          text: "Copy existing fashion brands exactly",
          emoji: "📋",
          description: "Copying without innovation doesn't create unique value",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "She finds that students want customizable uniforms. What's the best approach to test this idea?",
      options: [
        {
          id: "a",
          text: "Create a small sample and get feedback",
          emoji: "🧪",
          description: "Excellent! Prototyping and feedback help validate ideas before full investment",
          isCorrect: true
        },
        {
          id: "b",
          text: "Invest all savings in mass production",
          emoji: "💰",
          description: "Mass production without validation is risky and can lead to significant losses",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore feedback and proceed with her vision",
          emoji: "🙈",
          description: "Customer feedback is crucial for creating products that meet real needs",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Her prototype gets positive feedback. What should she focus on next?",
      options: [
        {
          id: "a",
          text: "Building a business plan and cost analysis",
          emoji: "📊",
          description: "Exactly! Financial planning ensures sustainable growth and profitability",
          isCorrect: true
        },
        {
          id: "b",
          text: "Immediately hiring many employees",
          emoji: "👥",
          description: "Scaling too quickly without proper planning can lead to financial problems",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spending lavishly on marketing",
          emoji: "📢",
          description: "Marketing is important but should be balanced with other business needs",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "She needs funding to grow her business. What's a smart approach?",
      options: [
        {
          id: "a",
          text: "Create a pitch for family, friends, or school programs",
          emoji: "プレゼンテーション",
          description: "Perfect! Starting with trusted networks reduces risk and builds support",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take dangerous loans with high interest",
          emoji: "💸",
          description: "High-interest loans can create financial burdens that harm the business",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up because funding is hard",
          emoji: "🏳️",
          description: "Persistence and creative problem-solving are key entrepreneurial traits",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Her business grows and she wants to expand. What should guide her decisions?",
      options: [
        {
          id: "a",
          text: "Customer feedback and market trends",
          emoji: "📈",
          description: "Exactly! Customer needs and market trends should drive business expansion",
          isCorrect: true
        },
        {
          id: "b",
          text: "Whatever seems fun or trendy",
          emoji: "🎉",
          description: "While passion is important, business decisions should be based on data and needs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying competitors exactly",
          emoji: "📋",
          description: "Differentiation is key to standing out in competitive markets",
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
    navigate("/student/ehe/teens/debate-too-young-start");
  };

  return (
    <GameShell
      title="Fashion Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-45"
      gameType="ehe"
      totalLevels={50}
      currentLevel={45}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">👗</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Fashion Entrepreneur</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default FashionStory;