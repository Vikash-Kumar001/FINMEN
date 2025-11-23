// File: RecallJournal.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, PenTool, Check, X } from 'lucide-react';

const RecallJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentLevel, setCurrentLevel] = useState(1);
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levels = [
    { id: 1, prompt: "One time I remembered something important was ___." },
    { id: 2, prompt: "My favorite memory from school is ___." },
    { id: 3, prompt: "I recall a fun day when ___." },
    { id: 4, prompt: "Something I never forget is ___." },
    { id: 5, prompt: "A happy recall is ___." }
  ];

  const currentLevelData = levels[currentLevel - 1];

  const handleChange = (e) => {
    setJournalEntry(e.target.value);
  };

  const handleSubmit = () => {
    if (journalEntry.trim()) {
      setIsSubmitted(true);
      setFeedbackType("correct");
      setFeedbackMessage("Great journal entry!");
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
      setFeedbackMessage("Write something!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Journal of Recall"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-47"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Journal of Recall</h3>
        <p className="text-white/80 mb-6 text-center">{currentLevelData.prompt}</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <textarea
            value={journalEntry}
            onChange={handleChange}
            className="w-full h-32 p-4 rounded-lg bg-white/20 text-white placeholder-white/50"
            placeholder="Write your journal entry here..."
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

export default RecallJournal;