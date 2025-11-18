import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CraftStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A girl makes friendship bands to sell at school fair. What is she?",
      options: [
        {
          id: "b",
          text: "Just a student with a hobby",
          emoji: "📚",
          description: "She's doing more than just having a hobby!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Someone copying others",
          emoji: "📋",
          description: "She's being creative, not copying!",
          isCorrect: false
        },
        {
          id: "a",
          text: "A young entrepreneur",
          emoji: "💼",
          description: "Perfect! She's creating and selling a product!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What skill is she demonstrating by making friendship bands?",
      options: [
        {
          id: "c",
          text: "Following instructions exactly",
          emoji: "📋",
          description: "That's not the main skill she's showing!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Waiting for others to act",
          emoji: "⏳",
          description: "She's taking initiative, not waiting!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Creativity and craftsmanship",
          emoji: "🎨",
          description: "Exactly! She's being creative and making something with her hands!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Why might she choose to sell at a school fair?",
      options: [
        {
          id: "b",
          text: "To avoid interacting with customers",
          emoji: "🤫",
          description: "Selling requires customer interaction!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To lose money on materials",
          emoji: "💸",
          description: "That wouldn't be a good business decision!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To reach her target audience",
          emoji: "🎯",
          description: "Exactly! School fairs have many potential customers!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What should she do with money earned from selling?",
      options: [
        {
          id: "c",
          text: "Spend it all immediately on treats",
          emoji: "🍭",
          description: "That's not a wise financial decision!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hide it where no one can find",
          emoji: "🕵️",
          description: "That's not safe or helpful for growing money!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save some, spend some wisely, reinvest some",
          emoji: "💰",
          description: "Perfect! This balanced approach helps build financial skills!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What can she learn from this experience?",
      options: [
        {
          id: "b",
          text: "To avoid all future business activities",
          emoji: "🚫",
          description: "This experience is valuable for learning!",
          isCorrect: false
        },
        {
          id: "c",
          text: "That customers don't matter",
          emoji: "👥",
          description: "Customers are essential for business success!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Business, customer service, and money management",
          emoji: "📈",
          description: "Exactly! These are valuable life skills!",
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
      title="Craft Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-45"
      gameType="ehe"
      totalLevels={10}
      currentLevel={45}
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

export default CraftStory;