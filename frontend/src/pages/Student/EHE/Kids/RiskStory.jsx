import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RiskStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You want to try a new school club. Should you?",
      options: [
        {
          id: "a",
          text: "Yes, it builds courage and new skills",
          emoji: "💪",
          description: "Perfect! Trying new things helps you grow!",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it might be scary",
          emoji: "😨",
          description: "Fear can hold you back from new opportunities!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if all your friends join",
          emoji: "👥",
          description: "Don't let others decide your choices!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have an idea for a school fundraiser. What's the smart way to proceed?",
      options: [
        {
          id: "c",
          text: "Never try because you might fail",
          emoji: "🚫",
          description: "Fear of failure shouldn't stop good ideas!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Plan carefully and ask for advice",
          emoji: "📝",
          description: "Great! Smart risk-taking involves preparation!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Jump in without planning",
          emoji: "🤪",
          description: "Rushing in can lead to problems!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend suggests starting a small business. How should you evaluate this?",
      options: [
        {
          id: "c",
          text: "Say no because all businesses fail",
          emoji: "悲观",
          description: "That's not true! Many businesses succeed with good planning!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Say yes immediately without thinking",
          emoji: "⚡",
          description: "Impulsive decisions can lead to problems!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Research and consider the risks and rewards",
          emoji: "🔍",
          description: "Exactly! Smart entrepreneurs evaluate opportunities!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You made a small mistake in your project. What should you do?",
      options: [
        {
          id: "c",
          text: "Give up on the whole project",
          emoji: "🏳️",
          description: "One mistake doesn't ruin everything!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Learn from it and make improvements",
          emoji: "📚",
          description: "Perfect! Mistakes are learning opportunities!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide it and hope no one notices",
          emoji: "🙈",
          description: "Hiding mistakes usually makes them worse!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best approach to taking smart risks?",
      options: [
        {
          id: "c",
          text: "Take huge risks without thinking",
          emoji: "🤯",
          description: "Reckless risks can cause serious problems!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Calculate risks and learn from outcomes",
          emoji: "🧮",
          description: "Exactly! Smart risk-taking involves learning and growth!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid all risks completely",
          emoji: "🛡️",
          description: "No growth comes from avoiding all risks!",
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
      title="Risk Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-18"
      gameType="ehe"
      totalLevels={10}
      currentLevel={18}
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

export default RiskStory;