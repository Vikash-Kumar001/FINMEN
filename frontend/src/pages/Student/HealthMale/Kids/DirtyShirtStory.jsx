import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DirtyShirtStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showCoinFeedback, setShowCoinFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You wore the same sweaty shirt for 3 days. What happens?",
      options: [
        {
          id: "a",
          text: "Shirt smells bad",
          emoji: "🤢",
          description: "Sweat creates bad odors over time",
          isCorrect: true
        },
        {
          id: "b",
          text: "Shirt becomes stronger",
          emoji: "💪",
          description: "Dirty clothes get weaker, not stronger",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing changes",
          emoji: "😊",
          description: "Dirt and sweat build up over time",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends say 'You smell!' What do you do?",
      options: [
        {
          id: "a",
          text: "Take a bath and change shirt",
          emoji: "🛁",
          description: "Clean clothes and body fix the smell",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spray perfume",
          emoji: "🌸",
          description: "Perfume only covers smell, doesn't clean",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore them",
          emoji: "😤",
          description: "Clean habits are important for health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You keep wearing dirty clothes. What happens to your skin?",
      options: [
        {
          id: "a",
          text: "Skin gets rashes",
          emoji: "🤕",
          description: "Germs and dirt can cause skin problems",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skin becomes tougher",
          emoji: "🛡️",
          description: "Dirty skin is more likely to get infections",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing happens",
          emoji: "👍",
          description: "Dirty clothes affect skin health",
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
      setShowCoinFeedback(true);
      setTimeout(() => setShowCoinFeedback(false), 1500);
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
    navigate("/student/health-male/kids/germ-buster-reflex");
  };

  return (
    <GameShell
      title="Dirty Shirt Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-kids-8"
      gameType="health-male"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative">
          {showCoinFeedback && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-bounce">
                +1
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
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

export default DirtyShirtStory;
