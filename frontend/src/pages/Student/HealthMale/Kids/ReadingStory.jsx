import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReadingStory = () => {
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
      text: "Your teacher says 'Read for 20 minutes every day.' Why is daily reading important?",
      options: [
        {
          id: "b",
          text: "It makes you tired",
          emoji: "😴",
          description: "Reading actually improves your brain and imagination",
          isCorrect: false
        },
        {
          id: "a",
          text: "It improves knowledge and mind",
          emoji: "🧠",
          description: "Daily reading builds vocabulary and helps you learn new things",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's just busy work",
          emoji: "📋",
          description: "Reading helps you understand the world better",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You find a book that interests you. What should you do?",
      options: [
        {
          id: "c",
          text: "Put it down and watch TV",
          emoji: "📺",
          description: "Reading interesting books helps you learn and grow",
          isCorrect: false
        },
        {
          id: "a",
          text: "Read it and learn something new",
          emoji: "📖",
          description: "Books open your mind to new ideas and knowledge",
          isCorrect: true
        },
        {
          id: "b",
          text: "Read just the pictures",
          emoji: "🖼️",
          description: "Reading the words helps you understand the full story",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend says 'Reading is boring.' How do you respond?",
      options: [
        {
          id: "b",
          text: "Agree and stop reading",
          emoji: "😞",
          description: "Share what you love about reading instead",
          isCorrect: false
        },
        {
          id: "a",
          text: "Show them an exciting book",
          emoji: "📚",
          description: "Good books can be exciting adventures for your mind",
          isCorrect: true
        },
        {
          id: "c",
          text: "Say they're right",
          emoji: "👍",
          description: "Reading helps you in school and life",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What happens when you read books regularly?",
      options: [
        {
          id: "c",
          text: "You forget how to play",
          emoji: "🎮",
          description: "Reading and playing can both be part of a balanced life",
          isCorrect: false
        },
        {
          id: "a",
          text: "You learn new words and ideas",
          emoji: "💡",
          description: "Reading expands your vocabulary and understanding",
          isCorrect: true
        },
        {
          id: "b",
          text: "You become too serious",
          emoji: "😐",
          description: "Reading helps you become more knowledgeable and creative",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How does reading help you in school?",
      options: [
        {
          id: "b",
          text: "It makes school harder",
          emoji: "😩",
          description: "Reading helps you understand lessons better",
          isCorrect: false
        },
        {
          id: "a",
          text: "It helps you understand lessons",
          emoji: "✅",
          description: "Reading improves comprehension and learning skills",
          isCorrect: true
        },
        {
          id: "c",
          text: "It doesn't help at all",
          emoji: "❌",
          description: "Reading is a key skill for all school subjects",
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
    navigate("/student/health-male/kids/reflex-habit-alert");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Reading Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-98"
      gameType="health-male"
      totalLevels={100}
      currentLevel={98}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
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

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default ReadingStory;
