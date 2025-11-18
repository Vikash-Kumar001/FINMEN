import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JunkFoodStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Friends buy chips every day at school. They ask you to join. What do you say?",
      options: [
        {
          id: "b",
          text: "Yes, I want chips too",
          emoji: "🍟",
          description: "Chips every day is not healthy for your body",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, I brought healthy snacks",
          emoji: "🥕",
          description: "Bringing your own healthy snacks is smart",
          isCorrect: true
        },
        {
          id: "c",
          text: "Maybe tomorrow",
          emoji: "⏰",
          description: "It's better to choose healthy snacks today",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "At birthday party, everyone eats candy. You want some too. What do you do?",
      options: [
        {
          id: "a",
          text: "Take one piece, then stop",
          emoji: "🍬",
          description: "One piece is okay, but don't eat too much",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eat as much as I want",
          emoji: "🍭",
          description: "Too much candy can make you feel sick",
          isCorrect: false
        },
        {
          id: "c",
          text: "Don't eat any",
          emoji: "❌",
          description: "One piece is okay as a treat",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend shares soda with you during break. Should you drink it?",
      options: [
        {
          id: "c",
          text: "Drink the whole bottle",
          emoji: "🥤",
          description: "Soda has lots of sugar, drink water instead",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, soda is tasty",
          emoji: "😋",
          description: "Soda is okay sometimes, but not every day",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, I'll drink water",
          emoji: "💧",
          description: "Water is much healthier than sugary soda",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Classmates buy ice cream after school. They invite you. What do you choose?",
      options: [
        {
          id: "b",
          text: "Buy ice cream every day",
          emoji: "🍦",
          description: "Ice cream every day is too much sugar",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never eat ice cream",
          emoji: "😔",
          description: "Ice cream is okay as an occasional treat",
          isCorrect: false
        },
        {
          id: "a",
          text: "Sometimes as a treat",
          emoji: "🎉",
          description: "Ice cream is fine as an occasional treat",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Your best friend always chooses junk food. How do you stay healthy?",
      options: [
        {
          id: "b",
          text: "Always eat what friend eats",
          emoji: "👫",
          description: "It's okay to make your own healthy choices",
          isCorrect: false
        },
        {
          id: "a",
          text: "Suggest healthy options together",
          emoji: "🥗",
          description: "Sharing healthy choices with friends is great",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stop being friends",
          emoji: "😠",
          description: "You can stay friends and make healthy choices",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(5, true);
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
    navigate("/student/health-male/kids/reflex-food-alert");
  };

  return (
    <GameShell
      title="Junk Food Story"
      subtitle={`Scenario ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-kids-18"
      gameType="health-male"
      totalLevels={20}
      currentLevel={18}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 5}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Peer Pressure Choices</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default JunkFoodStory;
