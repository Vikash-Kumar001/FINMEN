import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSocialImpact = () => {
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
      text: "Social entrepreneurship means?",
      options: [
        {
          id: "a",
          text: "Helping society + business",
          emoji: "🤝",
          description: "Correct! Using business skills to solve social problems!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only money",
          emoji: "💰",
          description: "Social entrepreneurship focuses on social impact, not just profit!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a social enterprise?",
      options: [
        {
          id: "a",
          text: "Business that solves social problems",
          emoji: "🏢",
          description: "Exactly! A business with a social mission!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only charity organization",
          emoji: "💝",
          description: "Social enterprises use business models, not just donations!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is social impact?",
      options: [
        {
          id: "a",
          text: "Positive effect on society",
          emoji: "🌟",
          description: "Perfect! Making a positive difference in people's lives!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only financial profit",
          emoji: "📈",
          description: "Financial profit is one measure, but social impact is broader!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What do social entrepreneurs focus on?",
      options: [
        {
          id: "a",
          text: "Solving social problems",
          emoji: "🔧",
          description: "Exactly! They create solutions for social challenges!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only personal gain",
          emoji: "👤",
          description: "Social entrepreneurs focus on community benefit!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is social entrepreneurship important?",
      options: [
        {
          id: "a",
          text: "Creates sustainable solutions",
          emoji: "♻️",
          description: "Perfect! Sustainable change through innovative approaches!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only creates jobs",
          emoji: "💼",
          description: "Job creation is one benefit, but sustainable solutions are key!",
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
      title="Quiz on Social Impact"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-82"
      gameType="ehe"
      totalLevels={10}
      currentLevel={82}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
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

export default QuizOnSocialImpact;