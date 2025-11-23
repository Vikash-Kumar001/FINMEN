import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CollegeStory61 = () => {
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
      text: "After school, some students go to college. What is college for?",
      options: [
        {
          id: "a",
          text: "Learning advanced subjects",
          emoji: "📚",
          description: "Perfect! College helps students specialize in advanced subjects!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only playing games",
          emoji: "🎮",
          description: "College is for serious learning, not just games!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just hanging out with friends",
          emoji: "👥",
          description: "Socializing is part of college, but learning is the main purpose!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What can you study in college?",
      options: [
        {
          id: "a",
          text: "Medicine, Engineering, Arts",
          emoji: "🎓",
          description: "Exactly! College offers diverse fields of study!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only cooking",
          emoji: "🍳",
          description: "Colleges offer much more than just cooking!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing useful",
          emoji: "❌",
          description: "College education is very useful for career development!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why do students go to college?",
      options: [
        {
          id: "a",
          text: "To gain specialized knowledge",
          emoji: "🧠",
          description: "Correct! College provides specialized knowledge for careers!",
          isCorrect: true
        },
        {
          id: "b",
          text: "To avoid working",
          emoji: "😴",
          description: "College requires hard work and dedication!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just to get a certificate",
          emoji: "📄",
          description: "Certificates are important, but knowledge is the real value!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What skills can you develop in college?",
      options: [
        {
          id: "a",
          text: "Critical thinking and problem solving",
          emoji: "💡",
          description: "Exactly! College develops critical thinking skills!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only sleeping",
          emoji: "😴",
          description: "College is about active learning, not sleeping!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding responsibilities",
          emoji: "🚫",
          description: "College teaches responsibility, not avoidance!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the benefit of college education?",
      options: [
        {
          id: "a",
          text: "Better career opportunities",
          emoji: "💼",
          description: "Perfect! College opens doors to better career opportunities!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Free food forever",
          emoji: "🍕",
          description: "College doesn't provide free food forever!",
          isCorrect: false
        },
        {
          id: "c",
          text: "No need to study anymore",
          emoji: "🎉",
          description: "Learning is a lifelong process, even after college!",
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
      title="College Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-61"
      gameType="ehe"
      totalLevels={10}
      currentLevel={61}
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

export default CollegeStory61;