import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SweatStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-41";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice sweating more during play. What should you do?",
      options: [
        {
          id: "b",
          text: "Ignore it",
          emoji: "😅",
          description: "Sweating shows your body is working hard",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take a bath",
          emoji: "🧼",
          description: "Bathing after sweating keeps you fresh and clean",
          isCorrect: true
        },
        {
          id: "c",
          text: "Put on more clothes",
          emoji: "👕",
          description: "Bathing is the best way to handle sweat",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You sweat a lot during sports. What's the right response?",
      options: [
        {
          id: "a",
          text: "Drink water and rest",
          emoji: "💧",
          description: "Stay hydrated and cool down after sweating",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop playing forever",
          emoji: "😞",
          description: "Sweating is normal during physical activity",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wear tight clothes",
          emoji: "👔",
          description: "Loose clothes and hydration help with sweat",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your shirt gets sweaty at school. What do you do?",
      options: [
        {
          id: "c",
          text: "Keep wearing it all day",
          emoji: "👕",
          description: "Change clothes or clean up when sweaty",
          isCorrect: false
        },
        {
          id: "b",
          text: "Spray perfume to hide smell",
          emoji: "🌸",
          description: "Cleaning your body is better than covering smells",
          isCorrect: false
        },
        {
          id: "a",
          text: "Change shirt after school",
          emoji: "🧺",
          description: "Fresh clothes help you feel comfortable",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You sweat during a test at school. Should you worry?",
      options: [
        {
          id: "b",
          text: "Yes, it's embarrassing",
          emoji: "😳",
          description: "Sweating is normal when you're thinking hard",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell everyone about it",
          emoji: "📢",
          description: "Sweating is a normal body response",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, it's normal",
          emoji: "😊",
          description: "Body sweats to cool down and stay healthy",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "After playing outside, you feel sticky. Best action?",
      options: [
        {
          id: "b",
          text: "Wait until tomorrow",
          emoji: "⏰",
          description: "Clean up right after sweating",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take a cool shower",
          emoji: "🚿",
          description: "Shower helps remove sweat and feel fresh",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just wipe with towel",
          emoji: "🧻",
          description: "Full shower is best after heavy sweating",
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Sweat Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={41}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Story {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-2xl font-bold text-white mb-2">Sweat Management</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${choices.some(c => c.question === currentQuestion) ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
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

export default SweatStory;
