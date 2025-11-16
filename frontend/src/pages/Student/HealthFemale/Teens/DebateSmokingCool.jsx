import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateSmokingCool = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Does smoking make you cool?",
      options: [
        {
          id: "a",
          text: "No, it harms health and appearance",
          emoji: "❌",
          description: "Smoking causes bad breath, stained teeth, and health problems",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, it looks mature and stylish",
          emoji: "😎",
          description: "True maturity comes from making healthy choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "It depends on the brand of cigarettes",
          emoji: "🏷️",
          description: "All cigarettes are harmful regardless of brand",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the reality of smoking addiction?",
      options: [
        {
          id: "a",
          text: "Most smokers want to quit but struggle",
          emoji: "😖",
          description: "Nicotine is highly addictive and quitting is extremely difficult",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's easy to smoke occasionally without becoming addicted",
          emoji: "😌",
          description: "Even occasional smoking can lead to addiction",
          isCorrect: false
        },
        {
          id: "c",
          text: "Addiction only happens to weak people",
          emoji: "🦺",
          description: "Addiction is a medical condition, not a character flaw",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does smoking affect physical fitness?",
      options: [
        {
          id: "a",
          text: "Reduces stamina and athletic performance",
          emoji: "🏃",
          description: "Smoking decreases oxygen in the blood and impairs performance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Improves focus and endurance",
          emoji: "🎯",
          description: "Smoking actually impairs focus and physical endurance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Has no effect on fitness levels",
          emoji: "😐",
          description: "Smoking significantly impacts cardiovascular and respiratory fitness",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is the financial cost of smoking?",
      options: [
        {
          id: "a",
          text: "Thousands of dollars annually plus health costs",
          emoji: "💸",
          description: "Smoking is expensive and leads to costly health problems",
          isCorrect: true
        },
        {
          id: "b",
          text: "Minimal cost, especially for occasional smokers",
          emoji: "💰",
          description: "Even occasional smoking adds up to significant expenses",
          isCorrect: false
        },
        {
          id: "c",
          text: "Free if friends provide cigarettes",
          emoji: "🆓",
          description: "Accepting cigarettes still contributes to the habit",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How does smoking affect social relationships?",
      options: [
        {
          id: "a",
          text: "Causes bad breath and smell that others notice",
          emoji: "👃",
          description: "Smoking affects personal hygiene and social interactions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes you more popular and attractive",
          emoji: "🌟",
          description: "Most people prefer non-smokers for close relationships",
          isCorrect: false
        },
        {
          id: "c",
          text: "Has no effect on how others perceive you",
          emoji: "🧐",
          description: "Smoking affects how others view your health and habits",
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
    navigate("/student/health-female/teens/journal-awareness");
  };

  return (
    <GameShell
      title="Debate: Is Smoking Cool?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-86"
      gameType="health-female"
      totalLevels={10}
      currentLevel={6}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
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

export default DebateSmokingCool;