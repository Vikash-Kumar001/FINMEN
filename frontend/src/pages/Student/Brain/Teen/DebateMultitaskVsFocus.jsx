import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const DebateMultitaskVsFocus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-16";
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({});

  const debateTopics = [
    {
      id: 1,
      question: "Is multitasking effective for productivity?",
      options: [
        { id: 'yes', text: 'Yes, multitasking is effective' },
        { id: 'no', text: 'No, focus on one task' },
        { id: 'sometimes', text: 'Sometimes it depends' }
      ],
      correct: "no",
      explanation: "Research shows that multitasking actually reduces productivity by up to 40%. Focusing on one task at a time (single-tasking) is much more effective!"
    },
    {
      id: 2,
      question: "Is it better to study with background music or in silence?",
      options: [
        { id: 'music', text: 'Music helps with studying' },
        { id: 'silence', text: 'Silence is better for focus' },
        { id: 'depends', text: 'Depends on the type of music' }
      ],
      correct: "depends",
      explanation: "The effectiveness of background music depends on the type of music and task. Instrumental music can help with repetitive tasks, but lyrical music can interfere with reading comprehension!"
    },
    {
      id: 3,
      question: "Should you study the same subject for hours or switch subjects?",
      options: [
        { id: 'same', text: 'Study same subject for hours' },
        { id: 'switch', text: 'Switch between different subjects' },
        { id: 'either', text: 'Either approach works equally well' }
      ],
      correct: "switch",
      explanation: "Switching between different subjects (interleaving) can improve learning and retention. It helps strengthen memory connections and enhances problem-solving skills by varying the types of material!"
    },
    {
      id: 4,
      question: "Is it better to take short breaks or study for long periods?",
      options: [
        { id: 'short', text: 'Take frequent short breaks' },
        { id: 'long', text: 'Study for long periods without breaks' },
        { id: 'no', text: 'Don\'t take any breaks at all' }
      ],
      correct: "short",
      explanation: "Taking frequent short breaks during study sessions improves focus and prevents mental fatigue. The brain needs rest periods to consolidate information and maintain optimal performance!"
    },
    {
      id: 5,
      question: "Is digital note-taking or handwriting more effective for learning?",
      options: [
        { id: 'digital', text: 'Digital note-taking is more effective' },
        { id: 'hand', text: 'Handwriting notes is more effective' },
        { id: 'both', text: 'Both methods work equally well' }
      ],
      correct: "hand",
      explanation: "Handwriting notes is more effective for learning because it engages the brain more actively. The slower pace of writing forces you to process and summarize information, leading to better retention!"
    }
  ];

  const currentTopic = debateTopics[currentQuestion];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === currentTopic.correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    resetFeedback();
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Auto-move to next question or complete after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < debateTopics.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setLevelCompleted(true);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Debate: Multitask vs Focus game completed! Score: ${score}/${debateTopics.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [levelCompleted, score, gameId, nextGamePath, nextGameId, debateTopics.length]);

  return (
    <GameShell
      title="Debate: Multitask vs Focus"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      maxScore={debateTopics.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!levelCompleted && currentTopic ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 text-center">Debate Topic</h3>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
              <p className="text-base md:text-lg lg:text-xl font-semibold text-white text-center">"{currentTopic.question}"</p>
            </div>
            
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Choose your position:</h4>
              {currentTopic.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const showCorrect = showFeedback && option.id === currentTopic.correct;
                const showIncorrect = showFeedback && isSelected && !showCorrect;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={!!selectedOption}
                    className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl transition-all transform text-left ${
                      showCorrect
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 scale-105"
                        : showIncorrect
                        ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                        : isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                    } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <div className="text-white font-bold text-sm md:text-base">{option.text}</div>
                  </button>
                );
              })}
            </div>
            
            {showFeedback && feedbackType === "wrong" && (
              <div className="mt-4 md:mt-6 text-white/90 text-center text-sm md:text-base">
                <p>💡 {currentTopic.explanation}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DebateMultitaskVsFocus;