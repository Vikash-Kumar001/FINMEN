import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolProjectStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You're asked to make a science model. Should you copy or create your own?",
      options: [
        {
          id: "c",
          text: "Copy exactly from the internet",
          emoji: "📋",
          description: "That's plagiarism and doesn't help you learn!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Create your own with inspiration",
          emoji: "✨",
          description: "Perfect! Learn from others but make it your own!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Do nothing and let others do it",
          emoji: "😴",
          description: "That won't help you learn or succeed!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How can you make your project stand out?",
      options: [
        {
          id: "b",
          text: "Use the same idea as everyone else",
          emoji: "👥",
          description: "That won't make your project special!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make it overly complicated",
          emoji: "🤯",
          description: "Complexity doesn't always mean better!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Add your unique perspective",
          emoji: "🌟",
          description: "Exactly! Your unique ideas make projects special!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What should you do if your first design doesn't work?",
      options: [
        {
          id: "a",
          text: "Learn from it and try again",
          emoji: "🔄",
          description: "Perfect! Iteration is key to innovation!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give up and copy someone else",
          emoji: "🏳️",
          description: "That's not how innovators think!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame your materials",
          emoji: "😠",
          description: "That doesn't solve the problem!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is it valuable to present your own work?",
      options: [
        {
          id: "c",
          text: "To prove you're better than others",
          emoji: "👑",
          description: "Learning and growth are more important than competition!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To avoid doing any work",
          emoji: "🛋️",
          description: "Presenting requires effort and preparation!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To show your learning and creativity",
          emoji: "🎓",
          description: "Exactly! Presenting demonstrates your growth!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What's the benefit of working on a project independently?",
      options: [
        {
          id: "b",
          text: "To never ask for help",
          emoji: "🤐",
          description: "Asking for help when needed is smart!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To finish faster by skipping steps",
          emoji: "⏩",
          description: "Rushing often leads to poor results!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To develop problem-solving skills",
          emoji: "🧩",
          description: "Exactly! Independent work builds your abilities!",
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
      title="School Project Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-35"
      gameType="ehe"
      totalLevels={10}
      currentLevel={35}
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

export default SchoolProjectStory;