import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CookingStory = () => {
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
      text: "A boy learns cooking from his grandmother. Is this learning?",
      options: [
        {
          id: "a",
          text: "No, only school teaches real learning",
          emoji: "📚",
          description: "Learning happens in many places, not just school!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, learning happens everywhere",
          emoji: "👨‍🍳",
          description: "Great choice! Learning can happen anywhere - from family, experiences, and life!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What skills does the boy develop by learning to cook?",
      options: [
        {
          id: "a",
          text: "Measurement, planning, and creativity",
          emoji: "🧠",
          description: "Exactly! Cooking develops many valuable life skills!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing useful",
          emoji: "❌",
          description: "Actually, cooking teaches important practical and cognitive skills!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Learning from his grandmother helps the boy:",
      options: [
        {
          id: "a",
          text: "Connect with family and preserve traditions",
          emoji: "👨‍👩‍👦",
          description: "Perfect! Intergenerational learning strengthens family bonds and preserves knowledge!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Waste time that could be spent on homework",
          emoji: "😴",
          description: "Learning from family is valuable and complements formal education!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "This type of learning is important because:",
      options: [
        {
          id: "a",
          text: "It teaches practical life skills and cultural knowledge",
          emoji: "🌍",
          description: "Right! Informal learning provides essential life skills and cultural understanding!",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's only for entertainment",
          emoji: "🎮",
          description: "This learning has real value beyond entertainment!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why should the boy continue learning cooking skills?",
      options: [
        {
          id: "a",
          text: "For independence, health, and cultural connection",
          emoji: "🌟",
          description: "Excellent! Cooking skills provide independence, health benefits, and cultural connection!",
          isCorrect: true
        },
        {
          id: "b",
          text: "He should stop once he can buy food",
          emoji: "🛒",
          description: "Learning to cook has lasting benefits beyond just getting food!",
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
      title="Cooking Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-98"
      gameType="ehe"
      totalLevels={10}
      currentLevel={98}
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

export default CookingStory;