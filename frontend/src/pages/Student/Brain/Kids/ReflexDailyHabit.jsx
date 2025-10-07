import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Book, Gamepad2, Dumbbell, Coffee, Brain, Zap } from 'lucide-react';

const ReflexDailyHabit = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentHabit, setCurrentHabit] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0); // Track total correct answers

  const habits = [
    { id: 1, text: 'Read Book', type: 'good', icon: <Book className="w-6 h-6" /> },
    { id: 2, text: 'Skip Homework', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 3, text: 'Exercise', type: 'good', icon: <Dumbbell className="w-6 h-6" /> },
    { id: 4, text: 'Play Video Games', type: 'bad', icon: <Gamepad2 className="w-6 h-6" /> },
    { id: 5, text: 'Study', type: 'good', icon: <Brain className="w-6 h-6" /> },
    { id: 6, text: 'Sleep Late', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 7, text: 'Drink Water', type: 'good', icon: <Zap className="w-6 h-6" /> },
    { id: 8, text: 'Eat Junk Food', type: 'bad', icon: <Coffee className="w-6 h-6" /> }
  ];

  // Timer countdown
  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'active') {
      setGameState('finished');
      setLevelCompleted(true);
    }
  }, [gameState, timeLeft]);

  // Generate new habit
  useEffect(() => {
    if (gameState === 'active') {
      const habitTimer = setTimeout(() => {
        if (timeLeft > 0) {
          const randomHabit = habits[Math.floor(Math.random() * habits.length)];
          setCurrentHabit(randomHabit);
        }
      }, 1000);
      return () => clearTimeout(habitTimer);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('active');
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setTotalCorrect(0);
    setLevelCompleted(false);
    const randomHabit = habits[Math.floor(Math.random() * habits.length)];
    setCurrentHabit(randomHabit);
  };

  const handleHabitTap = (habitType) => {
    if (!currentHabit || gameState !== 'active') return;

    const isCorrect = habitType === 'good';
    
    if (isCorrect) {
      const points = 1 + Math.min(streak, 5); // More points for longer streaks
      setScore(score + points);
      setStreak(streak + 1);
      setFeedbackMessage(`+${points} points!`);
      setShowFeedback(true);
      setTotalCorrect(totalCorrect + 1); // Track correct answers
    } else {
      setStreak(0);
      setFeedbackMessage("That's not a good daily habit!");
      setShowFeedback(true);
    }

    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 1000);

    // Generate next habit
    const randomHabit = habits[Math.floor(Math.random() * habits.length)];
    setCurrentHabit(randomHabit);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  // Calculate coins based on correct answers (max 15 coins)
  const calculateTotalCoins = () => {
    return Math.min(totalCorrect * 0.5, 15); // 0.5 coins per correct answer, max 15
  };

  return (
    <GameShell
      title="Daily Habit Reflex"
      score={score}
      currentLevel={1}
      totalLevels={1}
      gameId="reflex-daily-habit"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        {gameState === 'waiting' && (
          <div 
            className="text-center cursor-pointer hover:opacity-90 transition duration-200"
            onClick={startGame}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Build Good Habits!</h3>
            <p className="text-white/80 mb-6">Tap quickly for good daily habits, avoid bad ones</p>
            <div className="text-3xl font-bold text-yellow-300 mb-4">Tap to Start</div>
            <p className="text-white/60">You'll have 30 seconds to get as many points as possible</p>
          </div>
        )}
        
        {gameState === 'active' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-bold text-white">Score: <span className="text-yellow-300">{score}</span></div>
              <div className="text-xl font-bold text-red-400">{timeLeft}s</div>
              <div className="text-xl font-bold text-green-400">Streak: {streak}</div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-white/80 mb-4">Tap if it's a good daily habit!</p>
              {currentHabit ? (
                <div className="inline-block p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <div className="text-white">
                    {currentHabit.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{currentHabit.text}</div>
                </div>
              ) : (
                <div className="text-white/60">Get ready...</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleHabitTap('good')}
                className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Zap className="w-8 h-8 mb-2" />
                <span className="font-bold">Good Habit!</span>
              </button>
              
              <button
                onClick={() => handleHabitTap('bad')}
                className="p-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Coffee className="w-8 h-8 mb-2" />
                <span className="font-bold">Bad Habit!</span>
              </button>
            </div>
            
            {showFeedback && (
              <FeedbackBubble 
                message={feedbackMessage}
                type={feedbackMessage.includes('points') ? "correct" : "wrong"}
              />
            )}
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Game Complete!</h3>
            <div className="text-5xl font-bold text-yellow-300 mb-6">{score} Points</div>
            <p className="text-white/80 mb-6 text-lg">
              {score >= 20 ? 'Great job! You know your good habits!' : 
               score >= 10 ? 'Good effort! Keep practicing to improve!' : 
               'Keep practicing to build better daily habits!'}
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:opacity-90 transition"
              >
                Play Again
              </button>
              
              <button
                onClick={handleGameComplete}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full font-semibold shadow-md hover:opacity-90 transition"
              >
                Finish Game
              </button>
            </div>
          </div>
        )}
      </GameCard>
    </GameShell>
  );
};

export default ReflexDailyHabit;