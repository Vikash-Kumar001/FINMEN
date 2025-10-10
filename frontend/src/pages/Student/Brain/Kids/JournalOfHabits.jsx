import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble, LevelCompleteHandler } from '../../Finance/GameShell';

const JournalOfHabits = () => {
  const navigate = useNavigate();
  const [currentEntry, setCurrentEntry] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);
  const [journalEntries, setJournalEntries] = useState(Array(5).fill(''));
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const journalPrompts = [
    {
      id: 1,
      prompt: "Write: \"One habit that keeps my brain strong is ___\"",
      guidance: "Think about activities that help you learn, concentrate, or feel mentally sharp."
    },
    {
      id: 2,
      prompt: "Describe a time when you felt your brain was working really well. What were you doing?",
      guidance: "Consider activities like reading, solving puzzles, or learning something new."
    },
    {
      id: 3,
      prompt: "What is one thing you could change to help your brain stay healthy?",
      guidance: "Think about sleep, diet, exercise, or learning activities."
    },
    {
      id: 4,
      prompt: "Write about your favorite way to relax and how it helps your brain.",
      guidance: "Consider activities like reading, drawing, listening to music, or spending time in nature."
    },
    {
      id: 5,
      prompt: "What new brain-healthy habit would you like to try this week?",
      guidance: "Choose something specific and achievable, like drinking more water or reading for 15 minutes daily."
    }
  ];

  const handleEntryChange = (e) => {
    const newEntries = [...journalEntries];
    newEntries[currentEntry] = e.target.value;
    setJournalEntries(newEntries);
  };

  const handleSubmitEntry = () => {
    if (journalEntries[currentEntry].trim().length > 10) {
      const newCompleted = [...completedEntries, currentEntry];
      setCompletedEntries(newCompleted);
      setFeedbackType("correct");
      setFeedbackMessage("Great journal entry!");
      setShowFeedback(true);
      setScore(score + 20);
      
      // Check if all entries are completed
      if (newCompleted.length === journalPrompts.length) {
        setTimeout(() => {
          setLevelCompleted(true);
        }, 1500);
      } else {
        // Move to next entry after delay
        setTimeout(() => {
          setCurrentEntry(currentEntry + 1);
          setShowFeedback(false);
        }, 1500);
      }
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Please write a more detailed entry (at least 10 words)");
      setShowFeedback(true);
      
      // Hide feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const calculateTotalScore = () => {
    return completedEntries.length * 20;
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  const isEntryCompleted = (index) => {
    return completedEntries.includes(index);
  };

  return (
    <GameShell
      title="Brain Health Journal"
      score={calculateTotalScore()}
      currentLevel={completedEntries.length + 1}
      totalLevels={journalPrompts.length}
      gameId="brain-kids-7"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <LevelCompleteHandler
        gameId="brain-kids-7"
        gameType="brain-health"
        levelNumber={completedEntries.length + 1}
        levelScore={20}
        maxLevelScore={20}
      >
        <GameCard>
          <h3 className="text-2xl font-bold text-white mb-4">Brain Health Journal</h3>
          <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
            <h4 className="text-xl font-semibold mb-4 text-white">Journal Prompt:</h4>
            <p className="mb-4 text-white/90">{journalPrompts[currentEntry].prompt}</p>
            
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
              <h5 className="font-medium text-blue-300 mb-2">Guidance:</h5>
              <p className="text-white/80 text-sm">{journalPrompts[currentEntry].guidance}</p>
            </div>
            
            <textarea
              value={journalEntries[currentEntry]}
              onChange={handleEntryChange}
              placeholder="Write your journal entry here..."
              className="w-full h-40 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            
            <button
              onClick={handleSubmitEntry}
              disabled={!journalEntries[currentEntry].trim()}
              className={`mt-4 px-6 py-3 rounded-full font-bold transition duration-200 ${
                journalEntries[currentEntry].trim()
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              Submit Entry
            </button>
          </div>
          
          {showFeedback && (
            <FeedbackBubble 
              message={feedbackMessage}
              type={feedbackType}
            />
          )}
          
          <div className="flex justify-between items-center text-white mt-4">
            <span>
              Entry {completedEntries.length + 1} of {journalPrompts.length}
            </span>
            <span className="font-bold text-yellow-300">
              Completed: {calculateTotalScore()}
            </span>
          </div>
        </GameCard>
      </LevelCompleteHandler>
    </GameShell>
  );
};

export default JournalOfHabits;