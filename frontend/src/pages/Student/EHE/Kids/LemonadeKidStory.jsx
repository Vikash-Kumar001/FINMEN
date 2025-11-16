import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LemonadeKidStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A 10-year-old sells lemonade in summer. Why?",
      options: [
        {
          id: "c",
          text: "To avoid playing with friends",
          emoji: "😴",
          description: "That's not the main reason for selling lemonade!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To earn money and learn business",
          emoji: "💰",
          description: "Perfect! Earning money and learning business skills are great reasons!",
          isCorrect: true
        },
        {
          id: "b",
          text: "To give all money to parents",
          emoji: "👨‍👩‍👧‍👦",
          description: "While sharing is good, the main reason is to learn!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should the lemonade seller do with earnings?",
      options: [
        {
          id: "b",
          text: "Spend all on candy immediately",
          emoji: "🍬",
          description: "That's not a wise use of earnings!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hide money under the bed",
          emoji: "🛏️",
          description: "That's not safe or helpful for growing money!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save some and spend some wisely",
          emoji: "🏦",
          description: "Perfect! It's good to save some money and spend some on needs.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How can the lemonade stand be more successful?",
      options: [
        {
          id: "c",
          text: "Charge very high prices",
          emoji: "💸",
          description: "That might scare customers away!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Make it dirty and uninviting",
          emoji: "🧹",
          description: "That would drive customers away!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep it clean and offer good service",
          emoji: "✨",
          description: "Exactly! A clean stand with good service attracts customers!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What's an important cost in running a lemonade stand?",
      options: [
        {
          id: "b",
          text: "Free lemons from trees",
          emoji: "🌳",
          description: "Even free lemons have a value!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Having fun with friends",
          emoji: "🎉",
          description: "That's a benefit, not a cost!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Buying lemons, sugar, and cups",
          emoji: "🛒",
          description: "Correct! These are expenses you need to pay for.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to count money at the end of the day?",
      options: [
        {
          id: "c",
          text: "To show off to friends",
          emoji: "炫耀",
          description: "That's not the important reason!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To spend it immediately",
          emoji: "🛍️",
          description: "Not the main reason for counting!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To know how much was earned and plan for tomorrow",
          emoji: "📊",
          description: "Exactly! Counting helps you track your business success!",
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
      title="Lemonade Kid Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-41"
      gameType="ehe"
      totalLevels={10}
      currentLevel={41}
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

export default LemonadeKidStory;