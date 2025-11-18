import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexGrowthCheck = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: '' });
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Quick! Tap 🛌 for 'Sleep Well' or ❌ for 'Stay Up All Night'",
      correctAnswer: '🛌',
      feedback: {
        correct: "Great job! Good sleep helps your body grow and repair itself!",
        incorrect: "Remember, sleep is when your body grows and repairs itself!"
      }
    },
    {
      id: 2,
      text: "Tap 🥗 for 'Eat Nutritious Food' or ❌ for 'Skip Meals'",
      correctAnswer: '🥗',
      feedback: {
        correct: "Excellent! Nutritious food gives your body the building blocks it needs!",
        incorrect: "Your body needs nutrients to grow properly!"
      }
    },
    {
      id: 3,
      text: "Quick! Tap 🏃‍♀️ for 'Exercise Regularly' or ❌ for 'Be Sedentary'",
      correctAnswer: '🏃‍♀️',
      feedback: {
        correct: "Perfect! Exercise strengthens muscles and bones for healthy growth!",
        incorrect: "Regular exercise is important for strong muscles and bones!"
      }
    },
    {
      id: 4,
      text: "Tap 💧 for 'Drink Water' or ❌ for 'Drink Soda'",
      correctAnswer: '💧',
      feedback: {
        correct: "Well done! Water keeps your body hydrated for optimal growth!",
        incorrect: "Water is essential for all body functions, including growth!"
      }
    },
    {
      id: 5,
      text: "Quick! Tap 🧘 for 'Manage Stress' or ❌ for 'Ignore Stress'",
      correctAnswer: '🧘',
      feedback: {
        correct: "Awesome! Managing stress helps your body grow properly!",
        incorrect: "Too much stress can interfere with healthy growth!"
      }
    }
  ];

  // Start the game automatically when component mounts
  useEffect(() => {
    if (!gameStarted) {
      startGame();
    }
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } 
  }, [timeLeft, gameStarted, showFeedback]);

  const startGame = () => {
    setGameStarted(true);
  };

  const handleAnswer = (answer) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setFeedback({ correct: true, message: currentQ.feedback.correct });
    } else {
      setFeedback({ correct: false, message: currentQ.feedback.incorrect });
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(5);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  // Show loading state while game starts
  if (!gameStarted) {
    return (
      <GameShell
        title="Reflex Growth Check"
        subtitle="Loading..."
        backPath="/games/health-female/kids"
      >
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <p className="text-white">Starting game...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  if (gameFinished) {
    return (
      <GameShell
        title="Reflex Growth Check"
        subtitle="Game Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="health-female-kids-23"
        gameType="health-female"
        totalLevels={30}
        currentLevel={23}
        showConfetti={true}
        backPath="/games/health-female/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg">
            Keep making healthy choices for growth!
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Reflex Growth Check"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      backPath="/games/health-female/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="flex justify-between items-center w-full mb-8">
              <div className="bg-blue-500/20 px-4 py-2 rounded-full">
                <span className="text-white font-bold">{timeLeft}s</span>
              </div>
              <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
                <span className="text-yellow-400 font-bold">Score: {coins}</span>
              </div>
            </div>
            
            <div className="text-center mb-10">
              <div className="text-6xl mb-6 bg-white/10 p-6 rounded-2xl inline-block">
                <span className="text-white">{getCurrentQuestion().text.split(' ')[0]}</span>
              </div>
              <p className="text-xl text-white mt-4">
                {getCurrentQuestion().text.split(' ').slice(1).join(' ')}
              </p>
            </div>
            
            {showFeedback ? (
              <div className={`p-6 rounded-2xl text-center mb-8 w-full max-w-md mx-auto ${
                feedback.correct 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <p className={`text-lg ${feedback.correct ? 'text-green-300' : 'text-red-300'}`}>
                  {feedback.message}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
                {['🛌', '🥗', '🏃‍♀️', '💧', '🧘', '❌'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAnswer(emoji)}
                    disabled={showFeedback}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-4xl p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-white"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-8 w-full max-w-md">
              <div className="bg-white/10 rounded-full h-3 w-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(timeLeft / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-white/70 text-sm mt-2">
                Time remaining: {timeLeft}s
              </p>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexGrowthCheck;