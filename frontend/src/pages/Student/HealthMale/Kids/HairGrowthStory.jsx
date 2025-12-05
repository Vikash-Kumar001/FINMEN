import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HairGrowthStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-28";
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
      text: "You see new hair on your face. What does it mean?",
      options: [
        {
          id: "b",
          text: "I'm sick",
          emoji: "🤒",
          description: "New facial hair is a normal sign of puberty",
          isCorrect: false
        },
        {
          id: "a",
          text: "Puberty",
          emoji: "🌱",
          description: "Body hair growth is a normal part of growing up",
          isCorrect: true
        },
        {
          id: "c",
          text: "I ate something wrong",
          emoji: "😕",
          description: "Hair growth is a natural body change",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You notice hair growing on your arms and legs. Should you worry?",
      options: [
        {
          id: "a",
          text: "No, it's normal growth",
          emoji: "✨",
          description: "Body hair is a normal part of development",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, remove it all",
          emoji: "🪒",
          description: "Body hair is natural and doesn't need removal",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hide it from friends",
          emoji: "🙈",
          description: "Body hair is nothing to be ashamed of",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your armpit hair is growing. What should you do?",
      options: [
        {
          id: "c",
          text: "Never shower there",
          emoji: "🚫",
          description: "Regular hygiene is important for all body areas",
          isCorrect: false
        },
        {
          id: "b",
          text: "Try to pull it out",
          emoji: "🤏",
          description: "Hair removal should be done safely if desired",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep it clean",
          emoji: "🧼",
          description: "Good hygiene is important as body changes",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You see chest hair starting to grow. How do you feel?",
      options: [
        {
          id: "b",
          text: "Embarrassed",
          emoji: "😳",
          description: "Body hair is normal and happens to all boys",
          isCorrect: false
        },
        {
          id: "c",
          text: "Confused",
          emoji: "😕",
          description: "Understanding puberty helps you feel normal",
          isCorrect: false
        },
        {
          id: "a",
          text: "It's normal",
          emoji: "😊",
          description: "All boys experience body hair growth during puberty",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Friends ask about your growing body hair. What do you say?",
      options: [
        {
          id: "b",
          text: "I don't know",
          emoji: "🤷",
          description: "Understanding puberty helps explain changes",
          isCorrect: false
        },
        {
          id: "a",
          text: "It's part of growing up",
          emoji: "🌱",
          description: "Explaining puberty helps friends understand too",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stop asking questions",
          emoji: "😠",
          description: "Questions about puberty are normal",
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
      title="Hair Growth Story"
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
      currentLevel={28}
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
            <div className="text-5xl mb-4">🧔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Body Hair Changes</h3>
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
                className={`bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${choices.some(c => c.question === currentQuestion) ? 'opacity-75 cursor-not-allowed' : ''
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

export default HairGrowthStory;
