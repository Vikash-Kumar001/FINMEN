import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const BathTimeStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-5";

  const [currentScene, setCurrentScene] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const scenes = [
    {
      id: 1,
      background: '🏠',
      text: "Mom says, 'It's time for your bath!', but you're having so much fun playing. What do you do?",
      options: [
        {
          id: 'a',
          text: "Ignore mom and keep playing",
          feedback: "Bath time is important to stay clean and healthy!",
          isCorrect: false
        },
        {
          id: 'b',
          text: "Say 'Okay mom!' and go take a bath",
          feedback: "Great choice! Staying clean is important for your health.",
          isCorrect: true
        },
        {
          id: 'c',
          text: "Ask if you can take a bath later",
          feedback: "It's good to take a bath at the same time every day to build a routine.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      background: '🛁',
      text: "You're in the bathroom. What's the first thing you should do?",
      options: [
        {
          id: 'a',
          text: "Check the water temperature with your hand",
          feedback: "Perfect! Always make sure the water isn't too hot or cold.",
          isCorrect: true
        },
        {
          id: 'b',
          text: "Jump right into the bath",
          feedback: "Not quite! First, you should check the water temperature.",
          isCorrect: false
        },
        {
          id: 'c',
          text: "Call for mom to test the water",
          feedback: "It's good to learn to check the water yourself!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      background: '🧴',
      text: "Which items should you use to clean your body?",
      options: [
        {
          id: 'a',
          text: "Just water",
          feedback: "Water alone doesn't remove all the dirt and oil from your skin.",
          isCorrect: false
        },
        {
          id: 'b',
          text: "Perfume",
          feedback: "Perfume just covers up smells, it doesn't clean you!",
          isCorrect: false
        },
        {
          id: 'c',
          text: "Soap and water",
          feedback: "Great job! Soap helps remove dirt and germs when you wash.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      background: '🚿',
      text: "How often should you wash your hair?",
      options: [
        {
          id: 'a',
          text: "2-3 times a week",
          feedback: "Perfect! This keeps your hair clean without drying it out.",
          isCorrect: true
        },
        {
          id: 'b',
          text: "Every day",
          feedback: "Washing hair every day can make it dry. 2-3 times a week is usually enough!",
          isCorrect: false
        },
        {
          id: 'c',
          text: "Once a month",
          feedback: "That's not often enough! Your hair needs regular washing.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      background: '🧖‍♀️',
      text: "After your bath, what should you do?",
      options: [
        {
          id: 'a',
          text: "Put on clean clothes without drying off",
          feedback: "You should dry yourself completely before dressing to stay comfortable.",
          isCorrect: false
        },
        {
          id: 'b',
          text: "Put on the same clothes you were wearing",
          feedback: "Always wear clean clothes after bathing to stay fresh!",
          isCorrect: false
        },
        {
          id: 'c',
          text: "Dry off with a clean towel and put on clean clothes",
          feedback: "Excellent! This keeps you clean and fresh after your bath.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (option) => {
    if (showFeedback) return;

    setSelectedOptionId(option.id);
    setShowFeedback(true);

    if (option.isCorrect) {
      setScore(prev => prev + coinsPerLevel);
      showCorrectAnswerFeedback(coinsPerLevel, true);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOptionId(null);
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setGameCompleted(true);
        showAnswerConfetti();
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const currentSceneData = scenes[currentScene];

  return (
    <GameShell
      title="Bath Time Story"
      subtitle={`Scene ${currentScene + 1} of ${scenes.length}`}
      onNext={handleNext}
      nextEnabled={gameCompleted}
      showGameOver={gameCompleted}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={scenes.length}
      currentLevel={currentScene + 1}
      showConfetti={gameCompleted}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-blue-500/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">Question: {currentScene + 1}/{scenes.length}</span>
            </div>
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <span className="text-yellow-400 font-bold">Coins: {score}/{totalCoins}</span>
            </div>
          </div>

          <div className="text-center my-8">
            <div className="text-8xl mb-6 transform hover:scale-110 transition-transform">
              {currentSceneData.background}
            </div>
            <h3 className="text-2xl text-white font-semibold leading-relaxed max-w-2xl mx-auto">
              {currentSceneData.text}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {currentSceneData.options.map((option) => {
              // Determine if this specific option should show feedback state
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.isCorrect;

              let buttonStyle = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-transparent";

              if (showFeedback) {
                if (isCorrect) {
                  buttonStyle = "bg-green-500 border-green-400";
                } else if (isSelected && !isCorrect) {
                  buttonStyle = "bg-red-500 border-red-400";
                } else {
                  buttonStyle = "bg-white/10 opacity-50";
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-6 rounded-2xl shadow-lg transition-all transform border-2 ${buttonStyle}`}
                >
                  <div className="font-medium text-lg text-white flex justify-between items-center">
                    <span>{option.text}</span>
                    {showFeedback && (isCorrect || isSelected) && (
                      <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                    )}
                  </div>
                  {showFeedback && (isSelected || isCorrect) && (
                    <div className="text-sm text-white/90 mt-2 bg-black/20 p-2 rounded">
                      {option.feedback}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BathTimeStory;