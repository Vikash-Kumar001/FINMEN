import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const HairCareStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScene, setCurrentScene] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const scenes = [
    {
      id: 1,
      background: '💇‍♀️',
      text: "Your hair looks a bit oily and doesn't feel fresh. What should you do?",
      options: [
        {
          text: "Wear a hat to cover it",
          feedback: "That only hides the problem! Let's fix it properly.",
          isCorrect: false,
          points: 0
        },
        {
          text: "Wash hair with shampoo",
          feedback: "Great choice! Washing with shampoo cleans your hair and scalp.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Spray perfume on your hair",
          feedback: "Perfume doesn't clean hair - it just covers up the smell!",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 2,
      background: '🚿',
      text: "How often should you wash your hair?",
      options: [
        {
          text: "Every day",
          feedback: "For most kids, that's too often! It can make hair dry.",
          isCorrect: false,
          points: 0
        },
        {
          text: "2-3 times a week",
          feedback: "Perfect! This keeps hair clean without drying it out.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Once a month",
          feedback: "That's not often enough for clean, healthy hair!",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 3,
      background: '🪮',
      text: "What should you use to detangle wet hair?",
      options: [
        {
          text: "A wide-tooth comb",
          feedback: "Yes! Wide-tooth combs are gentle on wet hair.",
          isCorrect: true,
          points: 1
        },
        {
          text: "A fine-tooth comb",
          feedback: "Fine teeth can pull and break wet hair.",
          isCorrect: false,
          points: 0
        },
        {
          text: "Your fingers",
          feedback: "Fingers can help, but a wide-tooth comb works better!",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 4,
      background: '🧴',
      text: "What's the right way to apply shampoo?",
      options: [
        {
          text: "A big handful on top of your head",
          feedback: "Too much shampoo can dry out your hair.",
          isCorrect: false,
          points: 0
        },
        {
          text: "A quarter-sized amount, massaged into scalp",
          feedback: "Perfect! Focus on the roots where oil builds up.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Just water, no shampoo",
          feedback: "Water alone won't remove oil and dirt effectively.",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 5,
      background: '💆‍♀️',
      text: "After washing, you should:",
      options: [
        {
          text: "Rub hair roughly with a towel",
          feedback: "Be gentle! Rubbing can cause breakage.",
          isCorrect: false,
          points: 0
        },
        {
          text: "Let it air dry without touching",
          feedback: "It's good to gently remove excess water first.",
          isCorrect: false,
          points: 0
        },
        {
          text: "Gently squeeze out water with a towel",
          feedback: "Yes! This is the gentlest way to dry your hair.",
          isCorrect: true,
          points: 1
        }
      ]
    }
  ];

  const handleChoice = (option) => {
    if (option.isCorrect) {
      const newScore = score + option.points;
      setScore(newScore);
      showCorrectAnswerFeedback(option.points, true);
    }
    
    if (currentScene < scenes.length - 1) {
      setTimeout(() => {
        setCurrentScene(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setGameCompleted(true);
        showAnswerConfetti();
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const restartGame = () => {
    setCurrentScene(0);
    setScore(0);
    setGameCompleted(false);
  };

  const currentSceneData = scenes[currentScene];

  if (!gameStarted) {
    return (
      <GameShell
        title="Hair Care Story"
        subtitle="Loading..."
        backPath="/games/health-female/kids"
      
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">💇‍♀️</div>
            <p className="text-white">Getting your hair care story ready...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  if (gameCompleted) {
    return (
      <GameShell
        title="Hair Care Story"
        subtitle="Story Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={score}
        gameId="health-female-kids-8"
        gameType="health-female"
        totalLevels={10}
        currentLevel={8}
        showConfetti={true}
        backPath="/games/health-female/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-2xl font-bold mb-4 text-white">Great Job!</h2>
          <p className="text-white/90 mb-6 text-lg">
            You scored {score} out of {scenes.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-xl mb-6">
            You've earned +5 Coins!
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-white/10">
            <p className="text-white/90">Now you know how to take care of your hair!</p>
          </div>
          <button
            onClick={restartGame}
            className="mt-8 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Hair Care Story"
      subtitle={`Question ${currentScene + 1} of ${scenes.length}`}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-purple-500/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">Score: {score}/{scenes.length}</span>
            </div>
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <span className="text-yellow-400 font-bold">Coins: {score * 5}</span>
            </div>
          </div>
          
          <div className="text-center my-8">
            <div className="text-8xl mb-6 transform hover:scale-110 transition-transform">
              {currentSceneData.background}
            </div>
            <h3 className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              {currentSceneData.text}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {currentSceneData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option)}
                className='w-full text-left p-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
              >
                <div className="font-medium text-lg text-white">
                  {option.text}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center text-sm text-white/60">
            <span>Tip: Keep your hair clean and healthy!</span>
            <span>{currentScene + 1} of {scenes.length}</span>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default HairCareStory;
