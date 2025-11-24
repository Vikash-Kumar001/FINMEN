import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, BookOpen, XCircle, Clock } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const GrowthThinkingReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-189";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentItem, setCurrentItem] = useState('');
  const [isGoodChoice, setIsGoodChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timer, setTimer] = useState(5);

  const levelItems = [
    { good: ['Learn', 'Grow Stronger'], bad: ['Quit', 'Give Up'] },
    { good: ['Study More', 'Try Harder'], bad: ['Stop', 'Lose Hope'] },
    { good: ['Improve', 'Keep Learning'], bad: ['Give In', 'No Effort'] },
    { good: ['Practice', 'Stay Resilient'], bad: ['Quit Now', 'Avoid'] },
    { good: ['Get Better', 'Learn Again'], bad: ['Stop Trying', 'Give Up'] }
  ];

  useEffect(() => {
    const levelData = levelItems[currentLevel - 1];
    const allItems = [...levelData.good, ...levelData.bad].sort(() => Math.random() - 0.5);
    let index = 0;
    const interval = setInterval(() => {
      if (index < allItems.length) {
        setCurrentItem(allItems[index]);
        setIsGoodChoice(null);
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
    } else if (timer === 0 && isGoodChoice === null) {
      setFeedbackType("wrong");
      setFeedbackMessage("Too slow!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  }, [timer, currentItem, isGoodChoice]);

  const handleResponse = (response) => {
    const levelData = levelItems[currentLevel - 1];
    const correct = levelData.good.includes(currentItem);
    if (response === correct) {
      setFeedbackType("correct");
      setFeedbackMessage("Growth mindset choice!");
      setScore(prev => prev + 3);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Keep learning!");
    }
    setIsGoodChoice(response);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Reflex Growth Thinking"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-189"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Growth Thinking</h3>
        <p className="text-white/80 mb-6 text-center">Tap for growth actions.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-4">
            <Clock className="w-8 h-8 inline" /> {timer}s
          </div>
          <h4 className="text-xl text-white mb-4">{currentItem}</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleResponse(true)} className="p-4 bg-green-500 rounded-lg text-white">Growth</button>
            <button onClick={() => handleResponse(false)} className="p-4 bg-red-500 rounded-lg text-white">Quit</button>
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

export default GrowthThinkingReflex;