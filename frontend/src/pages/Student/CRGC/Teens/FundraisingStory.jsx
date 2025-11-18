import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FundraisingStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen organizes bake sale for charity. What is this?",
      options: [
        {
          id: "a",
          text: "Just a way to make money",
          emoji: "💰",
          description: "That's not right. A bake sale for charity is about raising funds to help others, not personal profit.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Volunteering with impact",
          emoji: "🧁",
          description: "That's right! Organizing a bake sale for charity combines volunteering time and effort with raising funds for a cause.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Wasting time that could be spent studying",
          emoji: "📚",
          description: "That's not accurate. Community service activities like fundraising teach valuable life skills and social responsibility.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should she promote her bake sale?",
      options: [
        {
          id: "a",
          text: "Only tell close friends to keep it small",
          emoji: "🤫",
          description: "That's not ideal. To maximize impact for the charity, it's better to reach a wider audience through appropriate channels.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Use social media and school announcements appropriately",
          emoji: "📢",
          description: "Perfect! Using appropriate promotional channels helps reach more potential supporters while maintaining professionalism.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pressure classmates to buy items",
          emoji: "😤",
          description: "That's not right. Fundraising should be about voluntary support, not pressure tactics that might make people uncomfortable.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "She has extra baked goods at the end of the sale. What should she do?",
      options: [
        {
          id: "a",
          text: "Take them home for her family",
          emoji: "🏠",
          description: "That's not the best choice. Since these were made for charity, finding another way to contribute them would be more appropriate.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Donate them to a local shelter or food bank",
          emoji: "🎁",
          description: "That's right! Donating leftover items to those in need extends the charitable impact of her fundraising effort.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Leave them for others to take without permission",
          emoji: "🙃",
          description: "That's not responsible. Food safety and property rules should be respected even with good intentions.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "She raised more money than expected. How should she handle the funds?",
      options: [
        {
          id: "a",
          text: "Use some for herself as reward for her effort",
          emoji: "_SELF_",
          description: "That's not appropriate. Funds raised for charity should be fully donated to the intended cause.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Donate all proceeds to the designated charity",
          emoji: "💝",
          description: "Perfect! Maintaining integrity by donating all funds ensures the charitable purpose is fully achieved.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Keep detailed records and submit to charity with a report",
          emoji: "📋",
          description: "That's also excellent! In addition to donating all proceeds, providing documentation shows accountability and builds trust.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What skills has she likely developed through this fundraising experience?",
      options: [
        {
          id: "a",
          text: "Leadership, organization, and community engagement",
          emoji: "🌟",
          description: "That's right! Fundraising develops many valuable life skills including planning, communication, and social responsibility.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Baking and cooking skills only",
          emoji: "👩‍🍳",
          description: "That's not complete. While baking skills are involved, fundraising encompasses many broader skills beyond just cooking.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only financial management skills",
          emoji: "📊",
          description: "That's not comprehensive. Fundraising involves financial aspects but also develops many other important skills.",
          isCorrect: false
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Fundraising Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-55"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={55}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default FundraisingStory;