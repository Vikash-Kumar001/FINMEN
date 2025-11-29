import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const JournalOfAttention = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-17";
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [entry, setEntry] = useState("");
  const [answered, setAnswered] = useState(false);

  const stages = [
    { 
      id: 1, 
      prompt: "One trick that helps me concentrate is ___.", 
      minLength: 10,
      guidance: "Think about specific techniques that help you focus better, such as time management methods, environmental changes, or mental strategies."
    },
    { 
      id: 2, 
      prompt: "Today I noticed my attention was strongest during ___.", 
      minLength: 10,
      guidance: "Reflect on when you feel most focused during the day. Consider time of day, activities, environment, or your mental state."
    },
    { 
      id: 3, 
      prompt: "My biggest distraction is ___ and I can manage it by ___.", 
      minLength: 10,
      guidance: "Identify your main distractions and brainstorm specific strategies to minimize their impact on your focus."
    },
    { 
      id: 4, 
      prompt: "When I lose focus, I can get back on track by ___.", 
      minLength: 10,
      guidance: "Think about recovery techniques that work for you when you've lost concentration, such as breathing exercises or short breaks."
    },
    { 
      id: 5, 
      prompt: "This week I improved my attention by ___.", 
      minLength: 10,
      guidance: "Celebrate your progress! Reflect on specific actions or changes that helped you focus better this week."
    }
  ];

  const handleSubmit = () => {
    if (answered) return;
    
    const currentPrompt = stages[currentStage];
    if (entry.trim().length < currentPrompt.minLength) {
      showCorrectAnswerFeedback(0, false);
      return;
    }
    
    setAnswered(true);
    resetFeedback();
    setScore(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);

    const isLastStage = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
        setScore(stages.length); // Ensure score matches total for GameOverModal
      } else {
        setCurrentStage(prev => prev + 1);
        setEntry("");
        setAnswered(false);
      }
    }, 1500);
  };

  const handleInputChange = (e) => {
    setEntry(e.target.value);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Journal of Attention game completed! Score: ${score}/${stages.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, stages.length]);

  const characterCount = entry.length;
  const minLength = stages[currentStage]?.minLength || 10;

  return (
    <GameShell
      title="Journal of Attention"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-2xl mx-auto px-4">
        {!showResult && stages[currentStage] ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
              <span className="text-white/80 text-sm md:text-base">Entry {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{stages.length}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <PenSquare className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              <h3 className="text-lg md:text-xl font-bold text-white">Journal Entry</h3>
            </div>
            
            <p className="text-white text-base md:text-lg mb-4 md:mb-6">
              {stages[currentStage].prompt}
            </p>
            
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-white/90 text-xs md:text-sm">
                <span className="font-semibold text-blue-300">💡 Tip:</span> {stages[currentStage].guidance}
              </p>
            </div>
            
            <textarea
              value={entry}
              onChange={handleInputChange}
              placeholder="Write your journal entry here..."
              disabled={answered}
              className="w-full h-32 md:h-40 p-3 md:p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-sm md:text-base"
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2 mb-4 md:mb-6">
              <span className={`text-xs md:text-sm ${characterCount < minLength ? 'text-red-400' : 'text-green-400'}`}>
                {characterCount < minLength 
                  ? `Minimum ${minLength} characters (${minLength - characterCount} more needed)`
                  : '✓ Minimum length reached'}
              </span>
              <span className="text-white/60 text-xs md:text-sm">{characterCount} characters</span>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < minLength || answered}
              className={`w-full py-3 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base ${
                entry.trim().length >= minLength && !answered
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                  : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
              }`}
            >
              {answered ? 'Submitted!' : 'Submit Entry'}
            </button>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default JournalOfAttention;
