import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureStory = () => {
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
      text: "Friends push you to smoke once. Should you?",
      options: [
        {
          id: "a",
          text: "No, I don't want to risk my health",
          emoji: "❌",
          description: "Making your own healthy choices is important",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, to fit in with friends",
          emoji: "👥",
          description: "Real friends respect your health choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Maybe, just this one time",
          emoji: "🤔",
          description: "Even one time can start a harmful habit",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you handle peer pressure to use substances?",
      options: [
        {
          id: "a",
          text: "Stand firm in your decision not to use",
          emoji: "💪",
          description: "Self-confidence helps resist negative pressure",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give in to avoid conflict",
          emoji: "😰",
          description: "Short-term avoidance leads to long-term harm",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try to convince others not to use",
          emoji: "🗣️",
          description: "While good, focus first on protecting yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's a good response when pressured to use substances?",
      options: [
        {
          id: "a",
          text: "\"No thanks, I'm not interested\"",
          emoji: "🙅",
          description: "Direct, clear, and doesn't over-explain",
          isCorrect: true
        },
        {
          id: "b",
          text: "\"I'll try just a little\"",
          emoji: "小心翼",
          description: "This opens the door to more pressure",
          isCorrect: false
        },
        {
          id: "c",
          text: "\"My parents won't let me\"",
          emoji: "👨‍👩‍👧‍👦",
          description: "This invites challenges to your excuse",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if friends continue pressuring you?",
      options: [
        {
          id: "a",
          text: "Spend time with different friends",
          emoji: "🚶",
          description: "Your social circle affects your choices",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep trying to please them",
          emoji: "🥺",
          description: "This compromises your health and values",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use substances to stop the pressure",
          emoji: "😵",
          description: "This sacrifices health for temporary peace",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to resist peer pressure regarding substances?",
      options: [
        {
          id: "a",
          text: "To protect your health and future",
          emoji: "🛡️",
          description: "Substance use can cause lasting harm",
          isCorrect: true
        },
        {
          id: "b",
          text: "To prove you're cooler than friends",
          emoji: "😎",
          description: "True confidence comes from healthy choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "To avoid being different",
          emoji: "🐑",
          description: "Being different for health is admirable",
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
    navigate("/student/health-female/teens/quiz-dangers");
  };

  return (
    <GameShell
      title="Peer Pressure Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-81"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
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

export default PeerPressureStory;