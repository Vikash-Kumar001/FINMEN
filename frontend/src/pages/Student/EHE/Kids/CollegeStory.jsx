import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CollegeStory = () => {
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
      text: "After school, many students go to college. What do they study there?",
      options: [
        {
          id: "b",
          text: "Only play games all day",
          emoji: "🎮",
          description: "College is for serious learning!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only watch movies",
          emoji: "🎬",
          description: "That's not what college is for!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Specialized subjects",
          emoji: "📚",
          description: "Perfect! College helps students specialize in their chosen fields!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Why do students choose different colleges?",
      options: [
        {
          id: "c",
          text: "To avoid making friends",
          emoji: "🤫",
          description: "College is a great place to make friends!",
          isCorrect: false
        },
        {
          id: "a",
          text: "For different programs and interests",
          emoji: "🎯",
          description: "Exactly! Different colleges offer different specializations!",
          isCorrect: true
        },
        {
          id: "b",
          text: "To sleep all day",
          emoji: "😴",
          description: "College requires hard work and dedication!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's an important benefit of college education?",
      options: [
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
          description: "Learning is a lifelong process!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deeper knowledge in chosen field",
          emoji: "🧠",
          description: "Perfect! College provides specialized knowledge and skills!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What should students do in college to succeed?",
      options: [
        {
          id: "c",
          text: "Skip all classes",
          emoji: "🚫",
          description: "Skipping classes leads to failure!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Copy others' work",
          emoji: "📋",
          description: "Plagiarism is not the way to succeed!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Attend classes and study regularly",
          emoji: "📖",
          description: "Exactly! Regular attendance and study are key to success!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How can college help with future careers?",
      options: [
        {
          id: "b",
          text: "By providing free money",
          emoji: "💰",
          description: "College doesn't provide free money!",
          isCorrect: false
        },
        {
          id: "c",
          text: "By doing all work for students",
          emoji: "🤖",
          description: "Students must do their own work!",
          isCorrect: false
        },
        {
          id: "a",
          text: "By building knowledge and networks",
          emoji: "🤝",
          description: "Perfect! College builds both knowledge and professional networks!",
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
      title="College Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-51"
      gameType="ehe"
      totalLevels={10}
      currentLevel={51}
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

export default CollegeStory;