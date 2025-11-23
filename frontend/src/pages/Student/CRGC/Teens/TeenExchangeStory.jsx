import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenExchangeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen meets student from another country. Should she share cultures?",
      options: [
        {
          id: "a",
          text: "Yes, cultural exchange enriches both",
          emoji: "🌐",
          description: "That's right! Sharing cultures helps build understanding and appreciation for diversity, enriching both individuals.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, keep cultures separate",
          emoji: "🔒",
          description: "That's not ideal. While respecting cultural boundaries is important, sharing cultures can promote harmony and understanding.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if it benefits me",
          emoji: "💼",
          description: "That's not the spirit of cultural exchange. Sharing cultures should be about mutual learning and respect, not personal gain.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the benefit of learning about other cultures?",
      options: [
        {
          id: "a",
          text: "Develops empathy and global perspective",
          emoji: "🤝",
          description: "That's right! Learning about other cultures develops empathy, broadens perspectives, and helps build a more inclusive worldview.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Creates confusion about identity",
          emoji: "😵",
          description: "That's not accurate. Learning about other cultures actually strengthens one's own identity while fostering appreciation for diversity.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes you forget your own culture",
          emoji: "❓",
          description: "That's not true. Learning about other cultures enhances rather than replaces your own cultural understanding and appreciation.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you approach cultural differences?",
      options: [
        {
          id: "a",
          text: "With curiosity and respect",
          emoji: "🔍",
          description: "That's right! Approaching cultural differences with curiosity and respect helps build bridges and promotes understanding.",
          isCorrect: true
        },
        {
          id: "b",
          text: "With judgment and criticism",
          emoji: "😠",
          description: "That's not appropriate. Judging cultural differences creates division and prevents meaningful cross-cultural connections.",
          isCorrect: false
        },
        {
          id: "c",
          text: "By ignoring them completely",
          emoji: "🙈",
          description: "That's not helpful. Ignoring cultural differences misses opportunities for learning and building meaningful relationships.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What can cultural exchange teach us?",
      options: [
        {
          id: "a",
          text: "That there are multiple ways to live and think",
          emoji: "🧠",
          description: "That's right! Cultural exchange teaches us that there are multiple valid ways to live, think, and approach problems.",
          isCorrect: true
        },
        {
          id: "b",
          text: "That other cultures are inferior",
          emoji: "👇",
          description: "That's not right. Cultural exchange should promote appreciation for diversity, not superiority of one culture over another.",
          isCorrect: false
        },
        {
          id: "c",
          text: "That all cultures are exactly the same",
          emoji: "🔄",
          description: "That's not accurate. Cultural exchange highlights both similarities and differences, showing that cultures are diverse yet connected.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is cultural awareness important in a globalized world?",
      options: [
        {
          id: "a",
          text: "It helps navigate interconnected global relationships",
          emoji: "🤝",
          description: "That's right! Cultural awareness is essential for navigating our interconnected world and building positive international relationships.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's only important for travel",
          emoji: "✈️",
          description: "That's too limited. Cultural awareness is important not just for travel but for all aspects of our interconnected global society.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's not really necessary",
          emoji: "😴",
          description: "That's not true. In our globalized world, cultural awareness is essential for effective communication and cooperation.",
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Teen Exchange Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-85"
      gameType="civic-responsibility"
      totalLevels={90}
      currentLevel={85}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
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

export default TeenExchangeStory;