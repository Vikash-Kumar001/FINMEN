// File: QuickEmotionReflex.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Smile, Star, Clock } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const QuickEmotionReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-89";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentItem, setCurrentItem] = useState('');
  const [isEmotion, setIsEmotion] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timer, setTimer] = useState(5);

  const levelItems = [
    { emotions: ['Joy', 'Fear'], objects: ['Desk', 'Cup'] },
    { emotions: ['Love', 'Anger'], objects: ['Phone', 'Hat'] },
    { emotions: ['Pride', 'Sadness'], objects: ['Lamp', 'Shoe'] },
    { emotions: ['Excitement', 'Worry'], objects: ['Book', 'Pen'] },
    { emotions: ['Calm', 'Surprise'], objects: ['Table', 'Ball'] }
  ];

  useEffect(() => {
    const levelData = levelItems[currentLevel - 1];
    const allItems = [...levelData.emotions, ...levelData.objects].sort(() => Math.random() - 0.5);
    let index = 0;
    const interval = setInterval(() => {
      if (index < allItems.length) {
        setCurrentItem(allItems[index]);
        setIsEmotion(null);
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
    } else if (timer === 0 && isEmotion === null) {
      setFeedbackType("wrong");
      setFeedbackMessage("Too slow!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  }, [timer, currentItem, isEmotion]);

  const handleResponse = (response) => {
    const levelData = levelItems[currentLevel - 1];
    const correct = levelData.emotions.includes(currentItem);
    if (response === correct) {
      setFeedbackType("correct");
      setFeedbackMessage("Quick emotion!");
      setScore(prev => prev + 1);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("That’s an object!");
    }
    setIsEmotion(response);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Reflex Quick Emotion"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-89"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Quick Emotion</h3>
        <p className="text-white/80 mb-6 text-center">Tap for emotion words, avoid objects.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-4">
            <Clock className="w-8 h-8 inline" /> {timer}s
          </div>
          <h4 className="text-xl text-white mb-4">{currentItem}</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleResponse(true)} className="p-4 bg-green-500 rounded-lg text-white">Emotion</button>
            <button onClick={() => handleResponse(false)} className="p-4 bg-red-500 rounded-lg text-white">Object</button>
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

export default QuickEmotionReflex;