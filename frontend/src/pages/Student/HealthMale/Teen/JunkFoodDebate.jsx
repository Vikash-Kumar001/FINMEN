import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JunkFoodDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Friend says: 'Junk food is okay every day!' What do you think?",
      options: [
        {
          id: "b",
          text: "Completely agree",
          emoji: "👍",
          description: "Daily junk food isn't healthy for growing bodies",
          isCorrect: false
        },
        {
          id: "a",
          text: "Sometimes okay, but not daily",
          emoji: "🤔",
          description: "Moderation is key - treats are fine occasionally",
          isCorrect: true
        },
        {
          id: "c",
          text: "Never eat junk food",
          emoji: "❌",
          description: "Being too strict can make healthy eating harder",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Parent says: 'No junk food ever!' How do you respond?",
      options: [
        {
          id: "c",
          text: "Argue and demand junk food",
          emoji: "😠",
          description: "Communication and compromise work better",
          isCorrect: false
        },
        {
          id: "a",
          text: "Suggest healthy alternatives",
          emoji: "💡",
          description: "Finding balance helps everyone eat better",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide and eat junk food secretly",
          emoji: "🤫",
          description: "Honesty about food choices is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "At party: 'Everyone eats chips and soda!' What's your choice?",
      options: [
        {
          id: "a",
          text: "Choose veggies and water instead",
          emoji: "🥕",
          description: "You can make healthy choices even at parties",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eat everything to fit in",
          emoji: "👥",
          description: "True friends respect your healthy choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave party early",
          emoji: "🚪",
          description: "You can stay and make healthy choices",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Teacher asks: 'Is fast food completely bad?' Your response?",
      options: [
        {
          id: "b",
          text: "Yes, always avoid it",
          emoji: "🚫",
          description: "Fast food can be convenient but should be limited",
          isCorrect: false
        },
        {
          id: "a",
          text: "It's okay sometimes, choose wisely",
          emoji: "⚖️",
          description: "Balance and making smart choices is the key",
          isCorrect: true
        },
        {
          id: "c",
          text: "No, eat it whenever",
          emoji: "🍔",
          description: "Regular fast food isn't good for health",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Friend says: 'Healthy food tastes boring!' What do you say?",
      options: [
        {
          id: "c",
          text: "Agree, keep eating junk",
          emoji: "😔",
          description: "Healthy food can be delicious with right preparation",
          isCorrect: false
        },
        {
          id: "a",
          text: "Show tasty healthy options",
          emoji: "😋",
          description: "Many healthy foods taste great when prepared well",
          isCorrect: true
        },
        {
          id: "b",
          text: "Force them to eat healthy",
          emoji: "👊",
          description: "People choose healthy eating when they understand benefits",
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
    navigate("/student/health-male/teens/diet-change-journal");
  };

  return (
    <GameShell
      title="Debate: Junk Food in Moderation?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 10}
      gameId="health-male-teen-16"
      gameType="health-male"
      totalLevels={100}
      currentLevel={16}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 16/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 10}</span>
          </div>

          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl mb-4">
              <p className="font-bold">💬 Debate Topic</p>
            </div>
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

export default JunkFoodDebate;
