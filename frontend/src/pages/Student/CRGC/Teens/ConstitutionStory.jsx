import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ConstitutionStory = () => {
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
      text: "What is the book of rules for our country?",
      options: [
        {
          id: "a",
          text: "The Constitution",
          emoji: "📖",
          description: "That's right! The Constitution is the supreme law of the land that outlines the framework of government and citizens' rights.",
          isCorrect: true
        },
        {
          id: "b",
          text: "A novel",
          emoji: "📚",
          description: "That's not correct. While novels are books, the Constitution is a legal document that governs our nation.",
          isCorrect: false
        },
        {
          id: "c",
          text: "A recipe book",
          emoji: "🍳",
          description: "That's not right. Recipe books contain cooking instructions, not laws and governance principles.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is the Constitution important for citizens?",
      options: [
        {
          id: "a",
          text: "It protects our fundamental rights",
          emoji: "🛡️",
          description: "That's right! The Constitution guarantees fundamental rights like freedom of speech, equality, and protection from discrimination.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It tells us what to cook",
          emoji: "🍲",
          description: "That's not correct. The Constitution doesn't contain cooking instructions but rather legal protections and civic responsibilities.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's just for lawyers",
          emoji: "👨‍💼",
          description: "That's not right. The Constitution applies to all citizens and forms the basis of our rights and duties.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What does the Constitution say about equality?",
      options: [
        {
          id: "a",
          text: "All citizens are equal before the law",
          emoji: "⚖️",
          description: "That's right! The Constitution ensures equality by stating that all citizens have equal rights and opportunities regardless of background.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only rich people are equal",
          emoji: "💰",
          description: "That's not correct. The Constitution guarantees equality for all citizens regardless of economic status.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Equality doesn't matter",
          emoji: "❌",
          description: "That's not right. Equality is a fundamental principle enshrined in the Constitution as a basic right.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does the Constitution protect freedom of speech?",
      options: [
        {
          id: "a",
          text: "By guaranteeing the right to express opinions",
          emoji: "🗣️",
          description: "That's right! The Constitution protects citizens' right to freely express their opinions, ideas, and beliefs within legal boundaries.",
          isCorrect: true
        },
        {
          id: "b",
          text: "By banning all speech",
          emoji: "🤐",
          description: "That's not correct. The Constitution protects speech rights rather than restricting them unnecessarily.",
          isCorrect: false
        },
        {
          id: "c",
          text: "By allowing only government speech",
          emoji: "📢",
          description: "That's not right. The Constitution protects everyone's right to free speech, not just government communications.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What responsibility does the Constitution give citizens?",
      options: [
        {
          id: "a",
          text: "To respect the law and participate in democracy",
          emoji: "🗳️",
          description: "That's right! Citizens have the responsibility to follow laws, participate in democratic processes, and contribute to society.",
          isCorrect: true
        },
        {
          id: "b",
          text: "To ignore government",
          emoji: "🚫",
          description: "That's not correct. The Constitution establishes a framework for citizen participation in governance, not avoidance.",
          isCorrect: false
        },
        {
          id: "c",
          text: "To only think about personal interests",
          emoji: "👤",
          description: "That's not right. Citizenship involves both rights and responsibilities to contribute to the common good.",
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
      title="Constitution Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-71"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={71}
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

export default ConstitutionStory;