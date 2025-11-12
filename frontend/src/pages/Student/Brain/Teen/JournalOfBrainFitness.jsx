import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';

const JournalOfBrainFitness = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [journalEntries, setJournalEntries] = useState({});
  const [currentEntry, setCurrentEntry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const prompts = [
    {
      id: 1,
      text: "One way I will keep my brain fit daily is ___",
      guidance: "Think about activities that challenge your mind, improve focus, or support brain health. Be specific about what you'll do and when."
    },
    {
      id: 2,
      text: "Today I challenged my brain by ___",
      guidance: "Reflect on specific activities that required mental effort today, such as learning something new, solving problems, or practicing skills."
    },
    {
      id: 3,
      text: "My brain feels most energized after ___",
      guidance: "Identify activities or habits that boost your mental energy and cognitive performance, such as exercise, healthy meals, or adequate sleep."
    },
    {
      id: 4,
      text: "I can improve my memory by ___",
      guidance: "Think about specific techniques or habits that could help you remember information better, such as repetition, visualization, or organization."
    },
    {
      id: 5,
      text: "This week I grew my brain power by ___",
      guidance: "Celebrate your progress! Reflect on specific actions or achievements that contributed to your cognitive development this week."
    }
  ];

  const currentPromptData = prompts[currentPrompt];

  // Load existing entry when prompt changes
  useEffect(() => {
    setCurrentEntry(journalEntries[currentPrompt] || '');
    setIsSubmitted(false);
    setShowFeedback(false);
  }, [currentPrompt]);

  const handleEntryChange = (e) => {
    setCurrentEntry(e.target.value);
  };

  const handleSubmitEntry = () => {
    if (currentEntry.trim().length > 10) {
      // Save entry
      setJournalEntries(prev => ({
        ...prev,
        [currentPrompt]: currentEntry
      }));
      
      setIsSubmitted(true);
      setFeedbackType("correct");
      setFeedbackMessage("Great journal entry!");
      setShowFeedback(true);
      setScore(prevScore => prevScore + 3); // 3 coins per entry (max 15 coins for 5 entries)
      
      // Move to next prompt or complete
      setTimeout(() => {
        setShowFeedback(false);
        if (currentPrompt < prompts.length - 1) {
          setCurrentPrompt(prev => prev + 1);
        } else {
          setLevelCompleted(true);
        }
      }, 1500);
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

  const handleGameComplete = () => {
    navigate('/games/brain-health/teens');
  };

  // Calculate coins based on completed entries (max 15 coins for 5 entries)
  const calculateTotalCoins = () => {
    const completedEntries = Object.keys(journalEntries).length + (isSubmitted ? 1 : 0);
    return completedEntries * 3;
  };

  return (
    <GameShell
      title="Journal of Brain Fitness"
      score={score}
      currentLevel={currentPrompt + 1}
      totalLevels={prompts.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-teens-7"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/teens"
    >
      {/* Removed LevelCompleteHandler */}
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4">Brain Fitness Journal</h3>
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <h4 className="text-xl font-semibold mb-4 text-white">Journal Prompt:</h4>
          <p className="mb-4 text-white/90 text-lg">"{currentPromptData.text}"</p>
          
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
            <h5 className="font-medium text-blue-300 mb-2">Guidance:</h5>
            <p className="text-white/80 text-sm">{currentPromptData.guidance}</p>
          </div>
          
          <textarea
            value={currentEntry}
            onChange={handleEntryChange}
            placeholder="Write your journal entry here..."
            className="w-full h-40 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            disabled={isSubmitted}
          />
          
          <button
            onClick={handleSubmitEntry}
            disabled={!currentEntry.trim() || isSubmitted}
            className={`mt-4 px-6 py-3 rounded-full font-bold transition duration-200 ${
              currentEntry.trim() && !isSubmitted
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            {isSubmitted ? 'Entry Submitted!' : 'Submit Entry'}
          </button>
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

export default JournalOfBrainFitness;