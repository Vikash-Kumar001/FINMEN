import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Zap, Dumbbell, Coffee, Brain } from 'lucide-react';

const ReflexBrainBoost = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0); // Track total correct answers

  const words = [
    { id: 1, text: 'Exercise', type: 'good', icon: <Dumbbell className="w-6 h-6" /> },
    { id: 2, text: 'Laziness', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 3, text: 'Reading', type: 'good', icon: <Brain className="w-6 h-6" /> },
    { id: 4, text: 'Sleep', type: 'good', icon: <Zap className="w-6 h-6" /> },
    { id: 5, text: 'Junk Food', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 6, text: 'Water', type: 'good', icon: <Zap className="w-6 h-6" /> },
    { id: 7, text: 'TV', type: 'bad', icon: <Coffee className="w-6 h-6" /> },
    { id: 8, text: 'Meditation', type: 'good', icon: <Brain className="w-6 h-6" /> }
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

  // Generate new word
  useEffect(() => {
    if (gameState === 'active') {
      const wordTimer = setTimeout(() => {
        if (timeLeft > 0) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          setCurrentWord(randomWord);
        }
      }, 1000);
      return () => clearTimeout(wordTimer);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('active');
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setTotalCorrect(0);
    setLevelCompleted(false);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  };

  const handleWordTap = (wordType) => {
    if (!currentWord || gameState !== 'active') return;

    const isCorrect = wordType === 'good';
    
    if (isCorrect) {
      const points = 1 + Math.min(streak, 5); // More points for longer streaks
      setScore(score + points);
      setStreak(streak + 1);
      setFeedbackMessage(`+${points} points!`);
      setShowFeedback(true);
      setTotalCorrect(totalCorrect + 1); // Track correct answers
    } else {
      setStreak(0);
      setFeedbackMessage("That's not good for your brain!");
      setShowFeedback(true);
    }

    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 1000);

    // Generate next word
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
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
      title="Brain Boost Reflex"
      score={score}
      currentLevel={1}
      totalLevels={1}
      gameId="reflex-brain-boost"
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
            <h3 className="text-2xl font-bold text-white mb-4">Boost Your Brain!</h3>
            <p className="text-white/80 mb-6">Tap quickly for brain-boosting activities, avoid harmful ones</p>
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
              <p className="text-white/80 mb-4">Tap if it's good for your brain!</p>
              {currentWord ? (
                <div className="inline-block p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <div className="text-white">
                    {currentWord.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{currentWord.text}</div>
                </div>
              ) : (
                <div className="text-white/60">Get ready...</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleWordTap('good')}
                className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Zap className="w-8 h-8 mb-2" />
                <span className="font-bold">Good for Brain!</span>
              </button>
              
              <button
                onClick={() => handleWordTap('bad')}
                className="p-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition duration-200 flex flex-col items-center shadow-lg"
              >
                <Coffee className="w-8 h-8 mb-2" />
                <span className="font-bold">Bad for Brain!</span>
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
              {score >= 20 ? 'Great job! Your brain reflexes are sharp!' : 
               score >= 10 ? 'Good effort! Keep practicing to improve!' : 
               'Keep practicing to boost your brain reflexes!'}
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

export default ReflexBrainBoost;