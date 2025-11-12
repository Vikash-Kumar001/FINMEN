import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, RefreshCw, XCircle, Clock } from 'lucide-react';

const TryAgainReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
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
    { good: ['Retry', 'Keep Going'], bad: ['Quit', 'Give Up'] },
    { good: ['Try Again', 'Push Forward'], bad: ['Stop', 'Lose Hope'] },
    { good: ['Start Over', 'Stay Strong'], bad: ['Give Up', 'Walk Away'] },
    { good: ['Try Harder', 'Keep At It'], bad: ['Quit Now', 'No Try'] },
    { good: ['Bounce Back', 'Try Once More'], bad: ['Stop Trying', 'Give In'] }
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
      setFeedbackMessage("Resilient choice!");
      setScore(prev => prev + 3);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Keep trying!");
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
      title="Reflex Try Again"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-183"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Try Again</h3>
        <p className="text-white/80 mb-6 text-center">Tap for resilient actions.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-4">
            <Clock className="w-8 h-8 inline" /> {timer}s
          </div>
          <h4 className="text-xl text-white mb-4">{currentItem}</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleResponse(true)} className="p-4 bg-green-500 rounded-lg text-white">Resilient</button>
            <button onClick={() => handleResponse(false)} className="p-4 bg-red-500 rounded-lg text-white">Give Up</button>
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

export default TryAgainReflex;