import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Moon, Gamepad, Clock } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const SleepHabitsReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-123";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentItem, setCurrentItem] = useState('');
  const [isGoodHabit, setIsGoodHabit] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timer, setTimer] = useState(5);

  const levelItems = [
    { good: ['Bedtime', 'Sleep Routine'], bad: ['Late Gaming', 'All-night Chat'] },
    { good: ['Early Sleep', 'Nap'], bad: ['Late Movies', 'Midnight Snacks'] },
    { good: ['Quiet Time', 'No Screens'], bad: ['Loud Music', 'Phone at Bed'] },
    { good: ['Rest Early', 'Dark Room'], bad: ['Late Homework', 'Bright Lights'] },
    { good: ['Sleep Schedule', 'Calm Night'], bad: ['All-night Party', 'Late Calls'] }
  ];

  useEffect(() => {
    const levelData = levelItems[currentLevel - 1];
    const allItems = [...levelData.good, ...levelData.bad].sort(() => Math.random() - 0.5);
    let index = 0;
    const interval = setInterval(() => {
      if (index < allItems.length) {
        setCurrentItem(allItems[index]);
        setIsGoodHabit(null);
        setTimer(5);
        index++;
      } else {
        clearInterval(interval);
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
        } else {
          setLevelCompleted(true);
        }
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [currentLevel]);

  useEffect(() => {
    if (timer > 0 && currentItem) {
      const countdown = setTimeout(() => setTimer(prev => prev - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && isGoodHabit === null) {
      setFeedbackType("wrong");
      setFeedbackMessage("Time's up!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  }, [timer, currentItem, isGoodHabit]);

  const handleResponse = (response) => {
    const levelData = levelItems[currentLevel - 1];
    const correct = levelData.good.includes(currentItem);
    if (response === correct) {
      setFeedbackType("correct");
      setFeedbackMessage("Good sleep habit!");
      setScore(prev => prev + 1);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Bad for sleep!");
    }
    setIsGoodHabit(response);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Reflex Sleep Habits"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-123"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Sleep Habits</h3>
        <p className="text-white/80 mb-6 text-center">Tap for good sleep habits.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-4">
            <Clock className="w-8 h-8 inline" /> {timer}s
          </div>
          <h4 className="text-xl text-white mb-4">{currentItem}</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleResponse(true)} className="p-4 bg-green-500 rounded-lg text-white">Good Habit</button>
            <button onClick={() => handleResponse(false)} className="p-4 bg-red-500 rounded-lg text-white">Bad Habit</button>
          </div>
        </div>
        
        {showFeedback && (
          <FeedbackBubble 
            message={feedbackMessage}
            type={feedbackType}
          />
        )}
      </GameCard>
    </GameShell>
  );
};

export default SleepHabitsReflex;