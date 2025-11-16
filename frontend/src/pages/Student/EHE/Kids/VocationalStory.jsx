import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VocationalStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A student learns carpentry skills. What is this?",
      options: [
        {
          id: "b",
          text: "Wasting time",
          emoji: "⏳",
          description: "Learning skills is never a waste of time!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Playing games",
          emoji: "🎮",
          description: "This is serious skill development!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Vocational training",
          emoji: "🔧",
          description: "Perfect! Learning carpentry is vocational training!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What's the main focus of vocational training?",
      options: [
        {
          id: "c",
          text: "Only theoretical knowledge",
          emoji: "📚",
          description: "Vocational training is more hands-on!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only playing sports",
          emoji: "⚽",
          description: "That's not the focus of vocational training!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Practical skills for specific jobs",
          emoji: "🛠️",
          description: "Exactly! Vocational training focuses on practical, job-specific skills!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How can vocational training benefit someone?",
      options: [
        {
          id: "b",
          text: "By providing free money",
          emoji: "💰",
          description: "Vocational training doesn't provide free money!",
          isCorrect: false
        },
        {
          id: "c",
          text: "By avoiding all work",
          emoji: "🛋️",
          description: "Vocational training prepares you for work!",
          isCorrect: false
        },
        {
          id: "a",
          text: "By preparing for specific careers",
          emoji: "🎯",
          description: "Perfect! Vocational training prepares you for specific careers!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What type of jobs can vocational training lead to?",
      options: [
        {
          id: "c",
          text: "Only office jobs",
          emoji: "🏢",
          description: "Vocational training leads to many types of jobs!",
          isCorrect: false
        },
        {
          id: "b",
          text: "No jobs at all",
          emoji: "❌",
          description: "Vocational training helps people find jobs!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Skilled trades and technical roles",
          emoji: "🔧",
          description: "Exactly! Vocational training leads to skilled trades and technical roles!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is vocational training valuable?",
      options: [
        {
          id: "b",
          text: "It's only for people who can't do anything else",
          emoji: "😔",
          description: "Vocational training is valuable for everyone!",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's not real education",
          emoji: "❌",
          description: "Vocational training is real and valuable education!",
          isCorrect: false
        },
        {
          id: "a",
          text: "It provides practical skills for employment",
          emoji: "✅",
          description: "Perfect! Vocational training provides practical skills for employment!",
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
      title="Vocational Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-55"
      gameType="ehe"
      totalLevels={10}
      currentLevel={55}
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

export default VocationalStory;