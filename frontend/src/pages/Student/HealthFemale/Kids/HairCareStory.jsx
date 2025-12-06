import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const HairCareStory = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-8";

  const [currentScene, setCurrentScene] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const scenes = [
    {
      id: 1,
      background: '💇‍♀️',
      text: "Your hair looks a bit oily and doesn't feel fresh. What should you do?",
      options: [
        {
          id: 'a',
          text: "Wash hair with shampoo",
          feedback: "Great choice! Washing with shampoo cleans your hair and scalp.",
          isCorrect: true
        },
        {
          id: 'b',
          text: "Wear a hat to cover it",
          feedback: "That only hides the problem! Let's fix it properly.",
          isCorrect: false
        },
        {
          id: 'c',
          text: "Spray perfume on your hair",
          feedback: "Perfume doesn't clean hair - it just covers up the smell!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      background: '🚿',
      text: "How often should you wash your hair?",
      options: [
        {
          id: 'a',
          text: "Once a month",
          feedback: "That's not often enough for clean, healthy hair!",
          isCorrect: false
        },
        {
          id: 'b',
          text: "Every day",
          feedback: "For most kids, that's too often! It can make hair dry.",
          isCorrect: false
        },
        {
          id: 'c',
          text: "2-3 times a week",
          feedback: "Perfect! This keeps hair clean without drying it out.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      background: '🪮',
      text: "What should you use to detangle wet hair?",
      options: [
        {
          id: 'a',
          text: "A fine-tooth comb",
          feedback: "Fine teeth can pull and break wet hair.",
          isCorrect: false
        },
        {
          id: 'b',
          text: "A wide-tooth comb",
          feedback: "Yes! Wide-tooth combs are gentle on wet hair.",
          isCorrect: true
        },
        {
          id: 'c',
          text: "Your fingers",
          feedback: "Fingers can help, but a wide-tooth comb works better!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      background: '🧴',
      text: "What's the right way to apply shampoo?",
      options: [
        {
          id: 'a',
          text: "A quarter-sized amount, massaged into scalp",
          feedback: "Perfect! Focus on the roots where oil builds up.",
          isCorrect: true
        },
        {
          id: 'b',
          text: "A big handful on top of your head",
          feedback: "Too much shampoo can dry out your hair.",
          isCorrect: false
        },
        {
          id: 'c',
          text: "Just water, no shampoo",
          feedback: "Water alone won't remove oil and dirt effectively.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      background: '💆‍♀️',
      text: "After washing, you should:",
      options: [
        {
          id: 'a',
          text: "Rub hair roughly with a towel",
          feedback: "Be gentle! Rubbing can cause breakage.",
          isCorrect: false
        },
        {
          id: 'b',
          text: "Let it air dry without touching",
          feedback: "It's good to gently remove excess water first.",
          isCorrect: false
        },
        {
          id: 'c',
          text: "Gently squeeze out water with a towel",
          feedback: "Yes! This is the gentlest way to dry your hair.",
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

  const currentSceneData = scenes[currentScene];

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Hair Care Story"
      subtitle={`Question ${currentScene + 1} of ${scenes.length}`}
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
            <div className="bg-purple-500/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">Question {currentScene + 1}/{scenes.length}</span>
            </div>
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <span className="text-yellow-400 font-bold">Coins: {score}/{totalCoins}</span>
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
            {currentSceneData.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.isCorrect;

              let buttonStyle = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-transparent";
              if (showFeedback) {
                if (isCorrect) buttonStyle = "bg-green-500 border-green-400";
                else if (isSelected) buttonStyle = "bg-red-500 border-red-400";
                else buttonStyle = "bg-white/10 opacity-50";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-6 rounded-2xl shadow-lg transition-all transform border-2 ${buttonStyle}`}
                >
                  <div className="font-medium text-lg text-white">
                    {option.text}
                  </div>
                  {showFeedback && (isSelected || isCorrect) && (
                    <div className="mt-2 text-sm text-white/90 bg-black/20 p-2 rounded">
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

export default HairCareStory;
