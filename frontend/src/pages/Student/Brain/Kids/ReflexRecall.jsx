// File: ReflexRecall.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Clock, Check, X } from 'lucide-react';

const ReflexRecall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentLevel, setCurrentLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isNew, setIsNew] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timer, setTimer] = useState(5);

  const levelWords = [
    { seen: ['apple', 'ball'], new: ['cat', 'dog'] },
    { seen: ['elephant', 'fish'], new: ['grape', 'house'] },
    { seen: ['ice', 'juice'], new: ['kite', 'lemon'] },
    { seen: ['moon', 'nest'], new: ['orange', 'pen'] },
    { seen: ['queen', 'rain'], new: ['sun', 'tree'] }
  ];

  useEffect(() => {
    const levelData = levelWords[currentLevel - 1];
    setWords([...levelData.seen]);
    const allWords = [...levelData.seen, ...levelData.new].sort(() => Math.random() - 0.5);
    let index = 0;
    const interval = setInterval(() => {
      if (index < allWords.length) {
        setCurrentWord(allWords[index]);
        setIsNew(null);
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
    if (timer > 0 && currentWord) {
      const countdown = setTimeout(() => setTimer(prev => prev - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && isNew === null) {
      setFeedbackType("wrong");
      setFeedbackMessage("Time's up!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  }, [timer, currentWord, isNew]);

  const handleResponse = (response) => {
    const levelData = levelWords[currentLevel - 1];
    const correct = levelData.new.includes(currentWord) ? true : false;
    if (response === correct) {
      setFeedbackType("correct");
      setFeedbackMessage("Good reflex!");
      setScore(prev => prev + 3);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Oops!");
    }
    setIsNew(response);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Reflex Recall"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-43"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Recall</h3>
        <p className="text-white/80 mb-6 text-center">Tap if the word is new or seen before.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-4">
            <Clock className="w-8 h-8 inline" /> {timer}s
          </div>
          <h4 className="text-xl text-white mb-4">{currentWord}</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleResponse(false)} className="p-4 bg-green-500 rounded-lg text-white">Seen</button>
            <button onClick={() => handleResponse(true)} className="p-4 bg-red-500 rounded-lg text-white">New</button>
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

export default ReflexRecall;