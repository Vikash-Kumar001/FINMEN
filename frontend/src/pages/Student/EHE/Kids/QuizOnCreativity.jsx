import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCreativity = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is innovation?",
      options: [
        {
          id: "a",
          text: "Solving problems in new ways",
          emoji: "💡",
          description: "Correct! Innovation means finding new solutions to problems!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Copying others",
          emoji: "📋",
          description: "That's imitation, not innovation!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Doing nothing",
          emoji: "😴",
          description: "That's not innovation at all!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What helps creativity?",
      options: [
        {
          id: "c",
          text: "Being afraid to try",
          emoji: "😨",
          description: "Fear blocks creativity!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Asking 'what if?' questions",
          emoji: "🤔",
          description: "Perfect! Curiosity fuels creativity!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Following the same routine",
          emoji: "🔁",
          description: "Routine can limit new ideas!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When you make a mistake in a project, what should you do?",
      options: [
        {
          id: "b",
          text: "Give up immediately",
          emoji: "🏳️",
          description: "That's not how innovators think!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hide it from others",
          emoji: "🙈",
          description: "Hiding mistakes prevents learning!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Learn from it and try a different approach",
          emoji: "📚",
          description: "Exactly! Mistakes are learning opportunities!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What's the benefit of brainstorming with friends?",
      options: [
        {
          id: "b",
          text: "To prove you're smarter",
          emoji: "👑",
          description: "That's not the purpose of teamwork!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To copy their ideas",
          emoji: "📸",
          description: "That's not real collaboration!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To combine different perspectives",
          emoji: "🤝",
          description: "Perfect! Different viewpoints spark creativity!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is creativity important in entrepreneurship?",
      options: [
        {
          id: "c",
          text: "To avoid all risks",
          emoji: "🛡️",
          description: "Entrepreneurship involves calculated risks!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To do everything alone",
          emoji: "👤",
          description: "That's not the benefit of creativity!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To find unique solutions and opportunities",
          emoji: "🚀",
          description: "Exactly! Creativity drives business innovation!",
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
      title="Quiz on Creativity"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-32"
      gameType="ehe"
      totalLevels={10}
      currentLevel={32}
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

export default QuizOnCreativity;