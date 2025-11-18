import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const IdeaStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You want to sell lemonade in your neighborhood. What should you do first?",
      options: [
        {
          id: "b",
          text: "Start making lemonade right away",
          emoji: "🍋",
          description: "Not the best first step! You need to plan first.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Think of a plan for your lemonade stand",
          emoji: "📝",
          description: "Perfect! Planning is the first step to any successful venture!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask friends to buy your lemonade",
          emoji: "👥",
          description: "Good to think about customers, but you need a plan first!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the most important thing to include in your lemonade stand plan?",
      options: [
        {
          id: "c",
          text: "How much you'll charge for lemonade",
          emoji: "💰",
          description: "Pricing is important, but not the most important thing!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Where you'll set up your stand",
          emoji: "📍",
          description: "Great! Location is key to getting customers!",
          isCorrect: true
        },
        {
          id: "b",
          text: "What color cup to use",
          emoji: "🎨",
          description: "Details matter, but location is more important!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You've chosen a spot for your lemonade stand. What should you do next?",
      options: [
        {
          id: "b",
          text: "Make a sign to attract customers",
          emoji: "📣",
          description: "Good idea, but you need supplies first!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Invite all your friends to come",
          emoji: "👥",
          description: "Marketing is important, but you need product first!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Buy supplies like lemons, sugar, and cups",
          emoji: "🛒",
          description: "Exactly! You need ingredients before you can sell!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your lemonade stand is ready! How can you make it more successful?",
      options: [
        {
          id: "c",
          text: "Keep your prices very high",
          emoji: "💸",
          description: "High prices might scare customers away!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only sell when it's hot outside",
          emoji: "🌞",
          description: "Weather helps, but there are better strategies!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Offer good service and smile at customers",
          emoji: "😊",
          description: "Excellent! Good service builds loyal customers!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "At the end of the day, you made some money. What should you do with it?",
      options: [
        {
          id: "c",
          text: "Hide it under your pillow",
          emoji: "🛏️",
          description: "Safe, but not the best way to grow your money!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save some and reinvest some in better supplies",
          emoji: "🏦",
          description: "Smart! Saving and reinvesting helps your business grow!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend it all on candy",
          emoji: "🍬",
          description: "Fun, but not the best use of your earnings!",
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
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Idea Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-11"
      gameType="ehe"
      totalLevels={10}
      currentLevel={11}
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

export default IdeaStory;