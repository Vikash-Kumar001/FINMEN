// File: QuickCalmReflex.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Smile, Frown, Clock } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const QuickCalmReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-69";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentAction, setCurrentAction] = useState('');
  const [isPositive, setIsPositive] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timer, setTimer] = useState(5);

  const levelActions = [
    { positive: ['Smile', 'Hug'], negative: ['Yell', 'Frown'] },
    { positive: ['Laugh', 'Dance'], negative: ['Cry', 'Sulk'] },
    { positive: ['Share', 'Help'], negative: ['Fight', 'Ignore'] },
    { positive: ['Thank', 'Compliment'], negative: ['Complain', 'Blame'] },
    { positive: ['Breathe', 'Relax'], negative: ['Rush', 'Panic'] }
  ];

  useEffect(() => {
    const levelData = levelActions[currentLevel - 1];
    const allActions = [...levelData.positive, ...levelData.negative].sort(() => Math.random() - 0.5);
    let index = 0;
    const interval = setInterval(() => {
      if (index < allActions.length) {
        setCurrentAction(allActions[index]);
        setIsPositive(null);
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
    if (timer > 0 && currentAction) {
      const countdown = setTimeout(() => setTimer(prev => prev - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && isPositive === null) {
      setFeedbackType("wrong");
      setFeedbackMessage("Too slow!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  }, [timer, currentAction, isPositive]);

  const handleResponse = (response) => {
    const levelData = levelActions[currentLevel - 1];
    const correct = levelData.positive.includes(currentAction);
    if (response === correct) {
      setFeedbackType("correct");
      setFeedbackMessage("Quick calm!");
      setScore(prev => prev + 3);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Not calm!");
    }
    setIsPositive(response);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Reflex Quick Calm"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-69"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Quick Calm</h3>
        <p className="text-white/80 mb-6 text-center">Tap for positive calm actions.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-4">
            <Clock className="w-8 h-8 inline" /> {timer}s
          </div>
          <h4 className="text-xl text-white mb-4">{currentAction}</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleResponse(true)} className="p-4 bg-green-500 rounded-lg text-white">Calm</button>
            <button onClick={() => handleResponse(false)} className="p-4 bg-red-500 rounded-lg text-white">Not Calm</button>
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

export default QuickCalmReflex;