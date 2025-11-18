import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanParkStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You see litter in the park. What should you do?",
      options: [
        {
          id: "a",
          text: "Pick it up and throw it in the trash",
          emoji: "🗑️",
          description: "That's right! Keeping our environment clean helps everyone enjoy the park.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it and walk away",
          emoji: "🚶",
          description: "That's not helpful. Ignoring litter makes the park dirtier for everyone.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friends are throwing trash on the ground. What should you do?",
      options: [
        {
          id: "a",
          text: "Join them because it's fun",
          emoji: "🤪",
          description: "That's not the right choice. Throwing trash harms the environment.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell them to stop and explain why it's wrong",
          emoji: "✋",
          description: "Perfect! Educating others about keeping the environment clean is important.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "You find a lot of trash in the park. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Tell a park ranger or adult",
          emoji: "👮",
          description: "Great idea! Adults can help organize a proper cleanup effort.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try to clean it all by yourself",
          emoji: "💪",
          description: "That's not safe. Some trash might be dangerous, and it's better to get help.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "There's no trash can nearby. What should you do with your trash?",
      options: [
        {
          id: "a",
          text: "Carry it with you until you find a trash can",
          emoji: "🎒",
          description: "That's right! It's better to carry trash than to litter.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Leave it on the ground",
          emoji: "🗑️",
          description: "That's not okay. Leaving trash harms the environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you encourage others to keep the park clean?",
      options: [
        {
          id: "a",
          text: "Lead by example and participate in cleanups",
          emoji: " volunte️",
          description: "Excellent! Being a role model inspires others to care for the environment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yell at people who litter",
          emoji: "😠",
          description: "That's not effective. Yelling might make people defensive instead of changing their behavior.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Clean Park Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-51"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={51}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
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

export default CleanParkStory;