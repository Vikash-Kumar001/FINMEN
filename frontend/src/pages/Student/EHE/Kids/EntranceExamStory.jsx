import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EntranceExamStory = () => {
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
      text: "Some careers need entrance exams. Should you prepare?",
      options: [
        {
          id: "a",
          text: "Yes, preparation is important",
          emoji: "✅",
          description: "Exactly! Preparation increases your chances of success!",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, just take it without studying",
          emoji: "❌",
          description: "Entrance exams require serious preparation!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if it's easy",
          emoji: "🤔",
          description: "All entrance exams require proper preparation regardless of difficulty!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do to prepare for entrance exams?",
      options: [
        {
          id: "a",
          text: "Study regularly and practice",
          emoji: "📚",
          description: "Perfect! Regular study and practice are key to success!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cram everything the night before",
          emoji: "🌙",
          description: "Last-minute cramming is not effective for entrance exams!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the exam completely",
          emoji: "🚫",
          description: "Ignoring the exam won't help you achieve your goals!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why are entrance exams important?",
      options: [
        {
          id: "a",
          text: "They assess your knowledge and skills",
          emoji: "🧠",
          description: "Correct! Entrance exams evaluate your readiness for specific programs!",
          isCorrect: true
        },
        {
          id: "b",
          text: "They're just for fun",
          emoji: "🎉",
          description: "Entrance exams are serious assessments, not just for fun!",
          isCorrect: false
        },
        {
          id: "c",
          text: "They don't matter at all",
          emoji: "🤷",
          description: "Entrance exams are important for career selection!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's a good study strategy for entrance exams?",
      options: [
        {
          id: "a",
          text: "Create a study schedule and follow it",
          emoji: "📅",
          description: "Exactly! A structured study plan helps you cover all topics!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Study only what you like",
          emoji: "😊",
          description: "You need to study all required subjects, not just favorites!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Study for 24 hours straight",
          emoji: "⏰",
          description: "Taking breaks is important for effective learning!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you manage exam stress?",
      options: [
        {
          id: "a",
          text: "Practice relaxation techniques",
          emoji: "🧘",
          description: "Perfect! Relaxation techniques help manage stress effectively!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Panic and worry constantly",
          emoji: "😰",
          description: "Panic increases stress and affects performance!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid preparing altogether",
          emoji: "😴",
          description: "Avoiding preparation increases anxiety!",
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
      title="Entrance Exam Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-65"
      gameType="ehe"
      totalLevels={10}
      currentLevel={65}
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

export default EntranceExamStory;