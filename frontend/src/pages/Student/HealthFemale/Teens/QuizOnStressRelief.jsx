import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnStressRelief = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which combination reduces stress effectively?",
      options: [
        {
          id: "a",
          text: "Yoga and adequate sleep",
          emoji: "🧘",
          description: "Both practices promote relaxation and mental well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "Worry more and avoid sleep",
          emoji: "😰",
          description: "This increases stress and harms physical health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Isolate yourself from others",
          emoji: "-alone",
          description: "Social connection is important for mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the benefit of deep breathing exercises?",
      options: [
        {
          id: "a",
          text: "Activates the body's relaxation response",
          emoji: "💨",
          description: "Slows heart rate and reduces tension",
          isCorrect: true
        },
        {
          id: "b",
          text: "Increases heart rate dramatically",
          emoji: "❤️",
          description: "This would increase stress rather than reduce it",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes you hold your breath longer",
          emoji: "憋",
          description: "This can cause dizziness and discomfort",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does regular exercise help with stress?",
      options: [
        {
          id: "a",
          text: "Releases endorphins and improves mood",
          emoji: "🏃",
          description: "Natural chemicals that promote feelings of well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "Exhausts the body completely",
          emoji: "😵",
          description: "Overexertion can increase stress and risk injury",
          isCorrect: false
        },
        {
          id: "c",
          text: "Creates more stress on the body",
          emoji: "💥",
          description: "Moderate exercise actually reduces stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is maintaining a consistent sleep schedule important?",
      options: [
        {
          id: "a",
          text: "Regulates mood and improves stress resilience",
          emoji: "😴",
          description: "Adequate sleep is essential for emotional regulation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes you sleep more during the day",
          emoji: "🌞",
          description: "Daytime sleeping can disrupt nighttime rest",
          isCorrect: false
        },
        {
          id: "c",
          text: "Allows you to stay up all night",
          emoji: "🌙",
          description: "Sleep deprivation increases stress and impairs function",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's a healthy way to express emotions?",
      options: [
        {
          id: "a",
          text: "Talk to trusted friends or family",
          emoji: "💬",
          description: "Sharing feelings provides support and perspective",
          isCorrect: true
        },
        {
          id: "b",
          text: "Suppress all emotions completely",
          emoji: "🤐",
          description: "Bottling up emotions can lead to mental health issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Express emotions aggressively",
          emoji: "😠",
          description: "Aggressive expression can harm relationships and self",
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
    navigate("/student/health-female/teens/reflex-stress-check");
  };

  return (
    <GameShell
      title="Quiz on Stress Relief"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-52"
      gameType="health-female"
      totalLevels={10}
      currentLevel={2}
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

export default QuizOnStressRelief;