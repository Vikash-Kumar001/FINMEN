import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OnlineCareerStory = () => {
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
      text: "A girl posts videos and earns. What career is this?",
      options: [
        {
          id: "a",
          text: "Content Creator",
          emoji: "🎥",
          description: "Exactly! Content creators make videos, posts, and other digital content!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Teacher",
          emoji: "chalkboard",
          description: "Teachers work in schools, not primarily online!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Doctor",
          emoji: "⚕️",
          description: "Doctors provide medical care, not online content!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do content creators do?",
      options: [
        {
          id: "a",
          text: "Create videos, posts, and digital content",
          emoji: "📱",
          description: "Correct! They create various types of digital content!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only watch TV",
          emoji: "📺",
          description: "That's consumption, not creation!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sell physical products only",
          emoji: "🛍️",
          description: "Content creators focus on digital content, not physical products!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What platforms do content creators use?",
      options: [
        {
          id: "a",
          text: "YouTube, Instagram, TikTok",
          emoji: "🌐",
          description: "Perfect! These are popular content creation platforms!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only newspapers",
          emoji: "📰",
          description: "Newspapers are traditional media, not primary content creation platforms!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only radio",
          emoji: "📻",
          description: "Radio is traditional media, not the main content creation platform!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What skills are important for content creators?",
      options: [
        {
          id: "a",
          text: "Creativity, communication, tech skills",
          emoji: "💡",
          description: "Exactly! These skills are essential for content creation!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only cooking",
          emoji: "🍳",
          description: "Cooking is one niche, but content creation requires broader skills!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only sports",
          emoji: "⚽",
          description: "Sports can be content, but creators need broader skills!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can content creators earn money?",
      options: [
        {
          id: "a",
          text: "Ads, sponsorships, selling products",
          emoji: "💰",
          description: "Perfect! These are common ways content creators monetize!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only donations",
          emoji: "💸",
          description: "Donations are one way, but there are many more monetization methods!",
          isCorrect: false
        },
        {
          id: "c",
          text: "They don't earn money",
          emoji: "❌",
          description: "Professional content creators can earn substantial income!",
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
      title="Online Career Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-78"
      gameType="ehe"
      totalLevels={10}
      currentLevel={78}
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

export default OnlineCareerStory;