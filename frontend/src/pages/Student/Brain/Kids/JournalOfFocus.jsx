import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const JournalOfFocus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentEntry, setCurrentEntry] = useState(0);
  const [journalEntries, setJournalEntries] = useState(Array(5).fill(''));
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const journalPrompts = [
    {
      id: 1,
      prompt: "Write: \"One thing that distracts me is ___\"",
      guidance: "Think about what makes it hard for you to concentrate during school or homework."
    },
    {
      id: 2,
      prompt: "Describe a time when you were able to focus really well. What helped you?",
      guidance: "Consider your environment, mindset, or preparation that contributed to good focus."
    },
    {
      id: 3,
      prompt: "What is one strategy you could try to improve your focus?",
      guidance: "Think about techniques like taking breaks, organizing your space, or setting goals."
    },
    {
      id: 4,
      prompt: "Write about how good focus helps you in school or activities.",
      guidance: "Consider how concentration improves your learning, performance, or results."
    },
    {
      id: 5,
      prompt: "What new focus habit would you like to develop this week?",
      guidance: "Choose something specific and achievable, like turning off distractions during study time."
    }
  ];

  const handleEntryChange = (e) => {
    const newEntries = [...journalEntries];
    newEntries[currentEntry] = e.target.value;
    setJournalEntries(newEntries);
  };

  const handleSubmitEntry = () => {
    if (journalEntries[currentEntry].trim().length > 10) {
      setScore(score + 3); // 3 coins per completed entry (max 15 coins for 5 entries)
      setSubmitted(true);
      
      // Auto-advance to next entry after delay
      setTimeout(() => {
        if (currentEntry < journalPrompts.length - 1) {
          setCurrentEntry(currentEntry + 1);
          setSubmitted(false);
        } else {
          setLevelCompleted(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentEntry < journalPrompts.length - 1) {
      setCurrentEntry(currentEntry + 1);
      setSubmitted(false);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  const currentPrompt = journalPrompts[currentEntry];

  return (
    <GameShell
      title="Focus Journal"
      score={score}
      currentLevel={currentEntry + 1}
      totalLevels={journalPrompts.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-17"
      gameType="brain-health"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentEntry < journalPrompts.length - 1}
      nextLabel="Next"
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6">Journal Prompt:</h3>
        <p className="mb-6 text-white/90 text-lg">{currentPrompt.prompt}</p>
        
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-300 mb-2">Guidance:</h4>
          <p className="text-blue-200 text-sm">{currentPrompt.guidance}</p>
        </div>
        
        <textarea
          value={journalEntries[currentEntry]}
          onChange={handleEntryChange}
          placeholder="Write your journal entry here..."
          className="w-full h-40 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={submitted}
        />
        
        <button
          onClick={handleSubmitEntry}
          disabled={!journalEntries[currentEntry].trim() || submitted}
          className={`mt-4 px-6 py-3 rounded-lg font-medium transition duration-200 ${
            journalEntries[currentEntry].trim() && !submitted
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitted ? 'Submitted!' : 'Submit Entry'}
        </button>
        
        {submitted && (
          <FeedbackBubble 
            message="Great job! 🎉"
            type="correct"
          />
        )}
      </GameCard>
    </GameShell>
  );
};

export default JournalOfFocus;