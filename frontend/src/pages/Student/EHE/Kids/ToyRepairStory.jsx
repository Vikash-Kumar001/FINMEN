import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ToyRepairStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A boy repairs toys for friends. What skill is he using?",
      options: [
        {
          id: "b",
          text: "Avoiding challenges",
          emoji: "🚫",
          description: "He's facing challenges by fixing things!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying others' work",
          emoji: "📋",
          description: "He's solving unique problems for each toy!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Problem-solving",
          emoji: "🧩",
          description: "Perfect! He's identifying and fixing problems!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Why might friends ask him to repair their toys?",
      options: [
        {
          id: "c",
          text: "To avoid learning themselves",
          emoji: "😴",
          description: "That's not the main reason!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To make him do all their work",
          emoji: "💼",
          description: "They're seeking his specific skill!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Because he has technical skills",
          emoji: "🔧",
          description: "Exactly! They recognize his abilities!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What should he do before starting a repair?",
      options: [
        {
          id: "b",
          text: "Start fixing without looking",
          emoji: "⚡",
          description: "That could make things worse!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Charge maximum money upfront",
          emoji: "💰",
          description: "That's not customer-focused!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Examine the toy and understand the problem",
          emoji: "🔍",
          description: "Perfect! Diagnosis is key to successful repair!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How can he improve his toy repair service?",
      options: [
        {
          id: "c",
          text: "Never ask for feedback",
          emoji: "🤐",
          description: "Feedback helps improve services!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Charge more without better service",
          emoji: "💸",
          description: "Value should match price!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Learn new repair techniques and tools",
          emoji: "🎓",
          description: "Exactly! Continuous learning improves services!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What can he learn from toy repair experiences?",
      options: [
        {
          id: "b",
          text: "To avoid all technical challenges",
          emoji: "🛡️",
          description: "That's not what he's learning!",
          isCorrect: false
        },
        {
          id: "c",
          text: "That friends don't value his work",
          emoji: "😔",
          description: "His friends are seeking his help because they value it!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Technical skills and customer service",
          emoji: "📈",
          description: "Exactly! Both are valuable life skills!",
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
      title="Toy Repair Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-48"
      gameType="ehe"
      totalLevels={10}
      currentLevel={48}
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

export default ToyRepairStory;