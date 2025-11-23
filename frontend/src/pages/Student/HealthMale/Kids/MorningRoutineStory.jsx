import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MorningRoutineStory = () => {
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
      text: "You wake up in the morning and your mom says 'Time to brush teeth and wash face!' What do you do?",
      options: [
        {
          id: "b",
          text: "Skip and go play",
          emoji: "🎮",
          description: "Morning hygiene keeps you clean and healthy all day",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brush teeth and wash face",
          emoji: "🧼",
          description: "Morning routines help you start the day fresh and healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Say you'll do it later",
          emoji: "⏰",
          description: "Starting your day with good habits sets a positive tone",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "After brushing, your dad says 'Make your bed before breakfast.' What's the smart choice?",
      options: [
        {
          id: "c",
          text: "Leave it messy for later",
          emoji: "🛏️",
          description: "Making your bed creates order and starts your day organized",
          isCorrect: false
        },
        {
          id: "a",
          text: "Make your bed neatly",
          emoji: "✅",
          description: "A made bed makes your room look nice and you feel accomplished",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ask someone else to do it",
          emoji: "🙏",
          description: "Doing your own chores builds responsibility",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your parents say 'Get dressed before eating breakfast.' Why is this important?",
      options: [
        {
          id: "b",
          text: "It doesn't matter what order",
          emoji: "🤷",
          description: "Getting dressed first helps you feel ready for the day",
          isCorrect: false
        },
        {
          id: "a",
          text: "It helps you feel ready for the day",
          emoji: "🌅",
          description: "Morning routines help you feel prepared and confident",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just eat in pajamas",
          emoji: "😴",
          description: "Getting dressed shows you're ready to start your day properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your mom reminds you to comb your hair before leaving. What should you do?",
      options: [
        {
          id: "c",
          text: "Rush out without combing",
          emoji: "🏃",
          description: "Taking care of your appearance shows self-respect",
          isCorrect: false
        },
        {
          id: "a",
          text: "Comb hair and look neat",
          emoji: "💇",
          description: "Good grooming habits make you feel confident",
          isCorrect: true
        },
        {
          id: "b",
          text: "Say hair looks fine messy",
          emoji: "😊",
          description: "Neat appearance helps you feel good about yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How does following a morning routine make you feel?",
      options: [
        {
          id: "b",
          text: "Tired and grumpy",
          emoji: "😠",
          description: "Good routines actually give you energy and confidence",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ready and confident for the day",
          emoji: "💪",
          description: "Morning routines help you feel prepared and positive",
          isCorrect: true
        },
        {
          id: "c",
          text: "Bored and unmotivated",
          emoji: "😑",
          description: "Healthy routines create good feelings and energy",
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
    navigate("/student/health-male/kids/quiz-daily-habits");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Morning Routine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-91"
      gameType="health-male"
      totalLevels={100}
      currentLevel={91}
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

export default MorningRoutineStory;
