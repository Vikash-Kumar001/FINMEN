import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ApprenticeshipStory = () => {
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
      text: "A girl joins a tailoring apprenticeship. What is she doing?",
      options: [
        {
          id: "b",
          text: "Wasting time",
          emoji: "⏳",
          description: "An apprenticeship is valuable learning experience!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Playing games",
          emoji: "🎮",
          description: "An apprenticeship is serious skill development!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Learning a trade",
          emoji: "🧵",
          description: "Perfect! An apprenticeship is learning a trade through hands-on experience!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What's the main benefit of an apprenticeship?",
      options: [
        {
          id: "c",
          text: "Only classroom learning",
          emoji: "📚",
          description: "Apprenticeships combine classroom and hands-on learning!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only playing sports",
          emoji: "⚽",
          description: "That's not what apprenticeships are about!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Hands-on experience with mentorship",
          emoji: "🛠️",
          description: "Exactly! Apprenticeships provide hands-on experience with mentorship!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How can apprenticeships help with future careers?",
      options: [
        {
          id: "b",
          text: "By providing free money",
          emoji: "💰",
          description: "Apprenticeships don't provide free money!",
          isCorrect: false
        },
        {
          id: "c",
          text: "By avoiding all work",
          emoji: "🛋️",
          description: "Apprenticeships prepare you for work!",
          isCorrect: false
        },
        {
          id: "a",
          text: "By building practical skills and networks",
          emoji: "🤝",
          description: "Perfect! Apprenticeships build practical skills and professional networks!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What type of jobs commonly offer apprenticeships?",
      options: [
        {
          id: "c",
          text: "Only office jobs",
          emoji: "🏢",
          description: "Apprenticeships are common in many fields!",
          isCorrect: false
        },
        {
          id: "b",
          text: "No jobs at all",
          emoji: "❌",
          description: "Many jobs offer apprenticeships!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Skilled trades and crafts",
          emoji: "🔧",
          description: "Exactly! Skilled trades and crafts commonly offer apprenticeships!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why are apprenticeships valuable?",
      options: [
        {
          id: "b",
          text: "They're only for people who can't do anything else",
          emoji: "😔",
          description: "Apprenticeships are valuable for everyone!",
          isCorrect: false
        },
        {
          id: "c",
          text: "They're not real education",
          emoji: "❌",
          description: "Apprenticeships are real and valuable education!",
          isCorrect: false
        },
        {
          id: "a",
          text: "They provide paid learning and job readiness",
          emoji: "✅",
          description: "Perfect! Apprenticeships provide paid learning and job readiness!",
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
      title="Apprenticeship Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-58"
      gameType="ehe"
      totalLevels={10}
      currentLevel={58}
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

export default ApprenticeshipStory;