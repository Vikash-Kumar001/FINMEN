import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MobilePressureStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Friends force you to use phone secretly. Do you?",
      options: [
        {
          id: "a",
          text: "No, I follow rules and talk to adults about phone use",
          emoji: "📱",
          description: "Exactly! Following rules and communicating with adults about phone use shows responsibility and respect.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, I don't want to disappoint friends",
          emoji: "😈",
          description: "While you want to be a good friend, following rules and being honest with adults is more important for your safety.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends pressure you to share inappropriate content online. What do you do?",
      options: [
        {
          id: "a",
          text: "Refuse and explain why it's not okay",
          emoji: "🙅‍♀️",
          description: "Great choice! Standing up against inappropriate content protects you and others from potential harm.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Share it to fit in with the group",
          emoji: "📲",
          description: "Sharing inappropriate content can get you in trouble and harm others. True friends respect your values.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Friends dare you to stay up all night on your phone. How do you respond?",
      options: [
        {
          id: "a",
          text: "Say no and explain you need sleep for school",
          emoji: "😴",
          description: "Perfect! Prioritizing your health and responsibilities shows maturity. Good friends understand this.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay up to prove you're part of the group",
          emoji: "🌙",
          description: "Lack of sleep affects your health, mood, and school performance. Your wellbeing is more important than proving anything.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Friends pressure you to lie to parents about phone usage. What should you do?",
      options: [
        {
          id: "a",
          text: "Be honest with parents about phone activities",
          emoji: "🙋‍♀️",
          description: "Wonderful! Honesty builds trust with parents and helps create healthy boundaries around technology use.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Lie to avoid getting in trouble",
          emoji: "🤥",
          description: "Lying breaks down trust and can lead to bigger problems. Being honest, even when it's difficult, is the right choice.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Friends want you to cyberbully someone online. Do you participate?",
      options: [
        {
          id: "a",
          text: "Refuse and report the behavior if needed",
          emoji: "🛡️",
          description: "Excellent! Standing against cyberbullying protects others and shows moral courage. Reporting helps stop harmful behavior.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join in to avoid being targeted yourself",
          emoji: "😨",
          description: "Participating in cyberbullying hurts others and can get you in serious trouble. Being an upstander makes a positive difference.",
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Mobile Pressure Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-68"
      gameType="health-female"
      totalLevels={70}
      currentLevel={68}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
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

export default MobilePressureStory;