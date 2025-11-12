// File: ReflexCalm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Wind, AlertTriangle, Clock } from 'lucide-react';

const ReflexCalm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentAction, setCurrentAction] = useState('');
  const [isCalm, setIsCalm] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timer, setTimer] = useState(5);

  const levelActions = [
    { calm: ['Breathe Slow', 'Count to 10'], panic: ['Panic', 'Yell'] },
    { calm: ['Relax', 'Meditate'], panic: ['Stress', 'Worry'] },
    { calm: ['Walk', 'Listen Music'], panic: ['Run', 'Shout'] },
    { calm: ['Talk Friend', 'Draw'], panic: ['Isolate', 'Cry'] },
    { calm: ['Stretch', 'Drink Water'], panic: ['Fidget', 'Bite Nails'] }
  ];

  useEffect(() => {
    const levelData = levelActions[currentLevel - 1];
    const allActions = [...levelData.calm, ...levelData.panic].sort(() => Math.random() - 0.5);
    let index = 0;
    const interval = setInterval(() => {
      if (index < allActions.length) {
        setCurrentAction(allActions[index]);
        setIsCalm(null);
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
    } else if (timer === 0 && isCalm === null) {
      setFeedbackType("wrong");
      setFeedbackMessage("Time out!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  }, [timer, currentAction, isCalm]);

  const handleResponse = (response) => {
    const levelData = levelActions[currentLevel - 1];
    const correct = levelData.calm.includes(currentAction);
    if (response === correct) {
      setFeedbackType("correct");
      setFeedbackMessage("Good choice!");
      setScore(prev => prev + 3);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Not calm!");
    }
    setIsCalm(response);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Reflex Calm"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-63"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Calm</h3>
        <p className="text-white/80 mb-6 text-center">Tap for calm actions, avoid panic.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-4">
            <Clock className="w-8 h-8 inline" /> {timer}s
          </div>
          <h4 className="text-xl text-white mb-4">{currentAction}</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleResponse(true)} className="p-4 bg-green-500 rounded-lg text-white">Calm</button>
            <button onClick={() => handleResponse(false)} className="p-4 bg-red-500 rounded-lg text-white">Panic</button>
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

export default ReflexCalm;