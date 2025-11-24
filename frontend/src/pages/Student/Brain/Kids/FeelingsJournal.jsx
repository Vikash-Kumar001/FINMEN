// File: FeelingsJournal.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, PenTool, Check, X } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const FeelingsJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-87";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levels = [
    { id: 1, prompt: "Today I felt ___ because ___." },
    { id: 2, prompt: "One time I felt happy was when ___." },
    { id: 3, prompt: "I felt sad because ___." },
    { id: 4, prompt: "I was angry when ___." },
    { id: 5, prompt: "A time I felt excited was ___." }
  ];

  const currentLevelData = levels[currentLevel - 1];

  const handleChange = (e) => {
    setJournalEntry(e.target.value);
  };

  const handleSubmit = () => {
    if (journalEntry.trim()) {
      setIsSubmitted(true);
      setFeedbackType("correct");
      setFeedbackMessage("Great job sharing your feelings!");
      setScore(prev => prev + 5);
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          setJournalEntry('');
          setIsSubmitted(false);
        } else {
          setLevelCompleted(true);
        }
      }, 2000);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Write about your feelings!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Journal of Feelings"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-87"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Journal of Feelings</h3>
        <p className="text-white/80 mb-6 text-center">{currentLevelData.prompt}</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <textarea
            value={journalEntry}
            onChange={handleChange}
            className="w-full h-32 p-4 rounded-lg bg-white/20 text-white placeholder-white/50"
            placeholder="Write about your feelings here..."
          />
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className={`px-8 py-3 rounded-full font-bold transition duration-200 text-lg ${
                !isSubmitted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
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

export default FeelingsJournal;