// File: ReflexSequence.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, ArrowRight, Check, X } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const ReflexSequence = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-49";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [showSequence, setShowSequence] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levelLength = [3, 4, 5, 6, 7]; // Sequence length per level

  const colors = ['red', 'blue', 'green', 'yellow'];

  useEffect(() => {
    const len = levelLength[currentLevel - 1];
    const newSeq = Array.from({ length: len }, () => colors[Math.floor(Math.random() * colors.length)]);
    setSequence(newSeq);
    setUserInput([]);
    setShowSequence(true);
    setTimeout(() => setShowSequence(false), 3000);
  }, [currentLevel]);

  const handleClick = (color) => {
    const newInput = [...userInput, color];
    setUserInput(newInput);
    if (newInput.length === sequence.length) {
      if (newInput.every((c, i) => c === sequence[i])) {
        setFeedbackType("correct");
        setFeedbackMessage("Correct sequence!");
        setScore(prev => prev + 3);
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
          } else {
            setLevelCompleted(true);
          }
        }, 2000);
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage("Wrong sequence!");
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setUserInput([]);
          setShowSequence(true);
          setTimeout(() => setShowSequence(false), 3000);
        }, 2000);
      }
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Reflex Sequence"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-49"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Reflex Sequence</h3>
        <p className="text-white/80 mb-6 text-center">Remember and tap the sequence.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          {showSequence ? (
            <div className="flex justify-center space-x-2">
              {sequence.map((color, index) => (
                <div key={index} className={`w-8 h-8 rounded-full bg-${color}-500`}></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleClick(color)}
                  className={`w-16 h-16 rounded-full bg-${color}-500`}
                ></button>
              ))}
            </div>
          )}
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

export default ReflexSequence;