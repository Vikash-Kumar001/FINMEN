import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble, LevelCompleteHandler } from '../../Finance/GameShell';

const JournalOfAttention = () => {
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
      text: "One trick that helps me concentrate is ___",
      guidance: "Think about specific techniques that help you focus better, such as time management methods, environmental changes, or mental strategies."
    },
    {
      id: 2,
      text: "Today I noticed my attention was strongest during ___",
      guidance: "Reflect on when you feel most focused during the day. Consider time of day, activities, environment, or your mental state."
    },
    {
      id: 3,
      text: "My biggest distraction is ___ and I can manage it by ___",
      guidance: "Identify your main distractions and brainstorm specific strategies to minimize their impact on your focus."
    },
    {
      id: 4,
      text: "When I lose focus, I can get back on track by ___",
      guidance: "Think about recovery techniques that work for you when you've lost concentration, such as breathing exercises or short breaks."
    },
    {
      id: 5,
      text: "This week I improved my attention by ___",
      guidance: "Celebrate your progress! Reflect on specific actions or changes that helped you focus better this week."
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
      setScore(prevScore => prevScore + 5); // 5 coins per entry
      
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

  return (
    <GameShell
      title="Journal of Attention"
      score={score}
      currentLevel={currentPrompt + 1}
      totalLevels={prompts.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-teens-17"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/teens"
    >
      <LevelCompleteHandler
        gameId="brain-teens-17"
        gameType="brain-health"
        levelNumber={currentPrompt + 1}
        levelScore={5}
        maxLevelScore={5}
      >
        <GameCard>
          <h3 className="text-2xl font-bold text-white mb-4">Attention Journal</h3>
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
      </LevelCompleteHandler>
    </GameShell>
  );
};

export default JournalOfAttention;