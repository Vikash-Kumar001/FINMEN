import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HandwashHero = () => {
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
      text: "What should you do after playing outside?",
      options: [
        {
          id: "b",
          text: "Just wipe on clothes",
          emoji: "👕",
          description: "Clothes spread germs instead of removing them",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash hands with soap",
          emoji: "🧼",
          description: "Clean hands remove dirt and germs from playing",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing, hands are fine",
          emoji: "👍",
          description: "Dirty hands can make you sick",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "When should you wash your hands?",
      options: [
        {
          id: "c",
          text: "Once a week is enough",
          emoji: "📅",
          description: "Hands need washing many times a day",
          isCorrect: false
        },
        {
          id: "a",
          text: "Only when they look dirty",
          emoji: "👀",
          description: "Germs are invisible, you can't see them",
          isCorrect: false
        },
        {
          id: "b",
          text: "After using bathroom and before eating",
          emoji: "✋",
          description: "These are important times to stay clean",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How long should you wash your hands?",
      options: [
        {
          id: "b",
          text: "20 seconds, sing happy birthday",
          emoji: "🎵",
          description: "Perfect time to clean hands thoroughly",
          isCorrect: true
        },
        {
          id: "a",
          text: "5 seconds quickly",
          emoji: "⚡",
          description: "Not enough time to remove all germs",
          isCorrect: false
        },
        {
          id: "c",
          text: "1 minute or more",
          emoji: "⏰",
          description: "20 seconds is just right, longer wastes water",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What happens if you don't wash hands?",
      options: [
        {
          id: "c",
          text: "Hands become stronger",
          emoji: "💪",
          description: "Clean hands are healthy hands",
          isCorrect: false
        },
        {
          id: "a",
          text: "You might get sick",
          emoji: "🤒",
          description: "Germs on hands can make you ill",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing bad happens",
          emoji: "😊",
          description: "Germs can spread and cause sickness",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to dry hands?",
      options: [
        {
          id: "b",
          text: "Shake water off",
          emoji: "💧",
          description: "Wet hands can still spread germs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wipe on clothes",
          emoji: "👕",
          description: "This can dirty your clothes",
          isCorrect: false
        },
        {
          id: "a",
          text: "Use a clean towel",
          emoji: "🧺",
          description: "Clean towel keeps hands hygienic",
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
        // Game finished - trigger GameOverModal
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Handwash Hero"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-1"
      gameType="health-male"
      totalLevels={10}
      currentLevel={1}
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

export default HandwashHero;
