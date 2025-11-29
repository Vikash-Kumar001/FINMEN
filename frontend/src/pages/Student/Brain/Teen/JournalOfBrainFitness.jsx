import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const JournalOfBrainFitness = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-7";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
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
      setScore(prevScore => prevScore + 1); // 1 coin per entry
      
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Journal of Brain Fitness game completed! Score: ${score}/${prompts.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [levelCompleted, score, gameId, nextGamePath, nextGameId, prompts.length]);

  return (
    <GameShell
      title="Journal of Brain Fitness"
      score={score}
      currentLevel={currentPrompt + 1}
      totalLevels={prompts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      maxScore={prompts.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!levelCompleted && currentPromptData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Brain Fitness Journal</h3>
              <div className="rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 bg-white/10 backdrop-blur-sm">
                <h4 className="text-lg md:text-xl font-semibold mb-4 text-white">Journal Prompt:</h4>
                <p className="mb-4 text-white/90 text-base md:text-lg">"{currentPromptData.text}"</p>
                
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 md:p-4 mb-6">
                  <h5 className="font-medium text-blue-300 mb-2 text-sm md:text-base">Guidance:</h5>
                  <p className="text-white/80 text-xs md:text-sm">{currentPromptData.guidance}</p>
                </div>
                
                <textarea
                  value={currentEntry}
                  onChange={handleEntryChange}
                  placeholder="Write your journal entry here..."
                  className="w-full h-32 md:h-40 p-3 md:p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm md:text-base"
                  disabled={isSubmitted}
                />
                
                <button
                  onClick={handleSubmitEntry}
                  disabled={!currentEntry.trim() || isSubmitted}
                  className={`mt-4 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold transition duration-200 text-sm md:text-base ${
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
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default JournalOfBrainFitness;