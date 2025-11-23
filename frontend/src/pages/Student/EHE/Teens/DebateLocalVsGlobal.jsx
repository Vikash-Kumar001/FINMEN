import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateLocalVsGlobal = () => {
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
      text: "Is studying abroad better than studying locally?",
      options: [
        {
          id: "a",
          text: "Yes, always better",
          emoji: "✅",
          description: "International education has benefits but isn't automatically superior in all cases",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, always worse",
          emoji: "❌",
          description: "Local education has advantages but isn't automatically inferior in all cases",
          isCorrect: false
        },
        {
          id: "c",
          text: "Both have value depending on individual goals",
          emoji: "⚖️",
          description: "Exactly! The best choice depends on personal circumstances, goals, and opportunities",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What's an advantage of studying locally?",
      options: [
        {
          id: "a",
          text: "Lower cost and family support",
          emoji: "💰",
          description: "Perfect! Financial savings and family connections are significant advantages",
          isCorrect: true
        },
        {
          id: "b",
          text: "No quality education available",
          emoji: "🚫",
          description: "Many local institutions offer excellent education and research opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Limited career prospects",
          emoji: "📉",
          description: "Local degrees from reputable institutions have strong career value",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's an advantage of studying abroad?",
      options: [
        {
          id: "a",
          text: "Global perspective and cultural exposure",
          emoji: "🌍",
          description: "Exactly! International experience broadens horizons and enhances adaptability",
          isCorrect: true
        },
        {
          id: "b",
          text: "No language barriers",
          emoji: "🔇",
          description: "Language learning is often part of the international study experience",
          isCorrect: false
        },
        {
          id: "c",
          text: "Less challenging",
          emoji: "😴",
          description: "International study often involves significant academic and personal challenges",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should guide the decision between local and international education?",
      options: [
        {
          id: "a",
          text: "Personal goals, financial situation, and career plans",
          emoji: "🎯",
          description: "Perfect! A holistic evaluation of personal factors leads to the best decision",
          isCorrect: true
        },
        {
          id: "b",
          text: "What's trendy among peers",
          emoji: "👥",
          description: "Following trends may not align with personal circumstances or goals",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only the cost factor",
          emoji: "🏷️",
          description: "Financial considerations are important but shouldn't be the sole factor",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can students maximize value from either local or international education?",
      options: [
        {
          id: "a",
          text: "Engage actively, build networks, and pursue opportunities",
          emoji: "🤝",
          description: "Exactly! Active participation and networking create value in any educational setting",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid all extracurricular activities",
          emoji: "📚",
          description: "Extracurricular engagement enhances learning and career prospects",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focus only on grades",
          emoji: "💯",
          description: "Holistic development is more valuable than academic performance alone",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/ehe/teens/journal-teen-goals");
  };

  return (
    <GameShell
      title="Debate: Local vs Global"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-66"
      gameType="ehe"
      totalLevels={70}
      currentLevel={66}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Local vs Global Education Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default DebateLocalVsGlobal;