import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const BathTimeStory = () => {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: '' });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  // Start the game automatically when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const scenes = [
    {
      id: 1,
      background: '🏠',
      text: "Mom says, 'It's time for your bath!', but you're having so much fun playing. What do you do?",
      options: [
        {
          text: "Ignore mom and keep playing",
          feedback: "Bath time is important to stay clean and healthy!",
          isCorrect: false,
          points: 0
        },
        {
          text: "Say 'Okay mom!' and go take a bath",
          feedback: "Great choice! Staying clean is important for your health.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Ask if you can take a bath later",
          feedback: "It's good to take a bath at the same time every day to build a routine.",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 2,
      background: '🛁',
      text: "You're in the bathroom. What's the first thing you should do?",
      options: [
        {
          text: "Jump right into the bath",
          feedback: "Not quite! First, you should check the water temperature.",
          isCorrect: false,
          points: 0
        },
        {
          text: "Check the water temperature with your hand",
          feedback: "Perfect! Always make sure the water isn't too hot or cold.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Call for mom to test the water",
          feedback: "It's good to learn to check the water yourself!",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 3,
      background: '🧴',
      text: "Which items should you use to clean your body?",
      options: [
        {
          text: "Soap and water",
          feedback: "Great job! Soap helps remove dirt and germs when you wash.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Just water",
          feedback: "Water alone doesn't remove all the dirt and oil from your skin.",
          isCorrect: false,
          points: 0
        },
        {
          text: "Perfume",
          feedback: "Perfume just covers up smells, it doesn't clean you!",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 4,
      background: '🚿',
      text: "How often should you wash your hair?",
      options: [
        {
          text: "Every day",
          feedback: "Washing hair every day can make it dry. 2-3 times a week is usually enough!",
          isCorrect: false,
          points: 0
        },
        {
          text: "2-3 times a week",
          feedback: "Perfect! This keeps your hair clean without drying it out.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Once a month",
          feedback: "That's not often enough! Your hair needs regular washing.",
          isCorrect: false,
          points: 0
        }
      ]
    },
    {
      id: 5,
      background: '🧖‍♀️',
      text: "After your bath, what should you do?",
      options: [
        {
          text: "Put on clean clothes without drying off",
          feedback: "You should dry yourself completely before dressing to stay comfortable.",
          isCorrect: false,
          points: 0
        },
        {
          text: "Dry off with a clean towel and put on clean clothes",
          feedback: "Excellent! This keeps you clean and fresh after your bath.",
          isCorrect: true,
          points: 1
        },
        {
          text: "Put on the same clothes you were wearing",
          feedback: "Always wear clean clothes after bathing to stay fresh!",
          isCorrect: false,
          points: 0
        }
      ]
    }
  ];

  const handleChoice = (option) => {
    // Show feedback immediately
    setFeedback({
      correct: option.isCorrect,
      message: option.feedback
    });
    
    // If answer is correct, update score and show confetti
    if (option.isCorrect) {
      const newScore = score + option.points;
      setScore(newScore);
      showCorrectAnswerFeedback(option.points, true);
    }
    
    // Show feedback
    setShowFeedback(true);
    
    // Move to next question or complete game after a delay
    setTimeout(() => {
      setShowFeedback(false);
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setGameCompleted(true);
        showAnswerConfetti();
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const restartGame = () => {
    setCurrentScene(0);
    setScore(0);
    setGameCompleted(false);
    setShowFeedback(false);
  };

  const currentSceneData = scenes[currentScene];

  if (!gameStarted) {
    return (
      <GameShell
        title="Bath Time Story"
        subtitle="Loading..."
        backPath="/games/health-female/kids"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">🛁</div>
            <p className="text-white">Getting your bath time story ready...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  if (gameCompleted) {
    return (
      <GameShell
        title="Bath Time Story"
        subtitle="Story Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={score}
        gameId="health-female-kids-5"
        gameType="health-female"
        totalLevels={10}
        currentLevel={5}
        showConfetti={true}
        backPath="/games/health-female/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4 text-white">Great Job!</h2>
          <p className="text-white/90 mb-6 text-lg">
            You scored {score} out of {scenes.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-xl">
            You're a bath time expert now! 🛁✨
          </div>
          <button
            onClick={restartGame}
            className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Bath Time Story"
      subtitle={`Question ${currentScene + 1} of ${scenes.length}`}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-blue-500/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">Score: {score}/{scenes.length}</span>
            </div>
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <span className="text-yellow-400 font-bold">Coins: {score}</span>
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
            {currentSceneData.options.map((option, index) => {
              const isSelected = showFeedback && (option.isCorrect || feedback.message === option.feedback);
              const isCorrect = option.isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => handleChoice(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-6 rounded-2xl shadow-lg transition-all transform ${
                    !showFeedback
                      ? 'hover:scale-[1.02] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                      : isCorrect
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 scale-100'
                        : feedback.message === option.feedback
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 scale-100'
                          : 'opacity-70 bg-gradient-to-r from-blue-500/50 to-indigo-600/50'
                  }`}
                >
                  <div className="font-medium text-lg text-white">
                    {option.text}
                    {isSelected && (
                      <span className="ml-2">
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                  {showFeedback && isSelected && (
                    <div className="text-sm text-white/80 mt-2">
                      {option.feedback}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 flex justify-between items-center text-sm text-white/60">
            <span>Tip: Read each option carefully before choosing!</span>
            <span>{currentScene + 1} of {scenes.length}</span>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BathTimeStory;