import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const DebateBrainVsBody = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-6";
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
      question: "Is brain health more important than body health?",
      options: [
        { id: 'both', text: 'Both are equally important' },
        { id: 'brain', text: 'Brain health is more important' },
        { id: 'body', text: 'Body health is more important' }
      ],
      correct: "both",
      explanation: "Both brain and body health are equally important and interconnected. A healthy body supports brain function, and a healthy brain helps maintain body wellness!"
    },
    {
      id: 2,
      question: "Is multitasking effective for studying?",
      options: [
        { id: 'yes', text: 'Yes, multitasking boosts productivity' },
        { id: 'no', text: 'No, multitasking reduces efficiency' },
        { id: 'sometimes', text: 'Sometimes, depends on the tasks' }
      ],
      correct: "no",
      explanation: "Multitasking actually reduces efficiency and learning. The brain needs focused attention on one task at a time for optimal performance and retention!"
    },
    {
      id: 3,
      question: "Is it better to study for long hours or take breaks?",
      options: [
        { id: 'long', text: 'Study for long hours without breaks' },
        { id: 'both', text: 'Both approaches work equally well' },
        { id: 'breaks', text: 'Take regular breaks during study' }
      ],
      correct: "breaks",
      explanation: "Taking regular breaks during study sessions improves focus and retention. The brain needs rest periods to consolidate information and prevent mental fatigue!"
    },
    {
      id: 4,
      question: "Does listening to music help with concentration?",
      options: [
        { id: 'depends', text: 'Depends on the type of music and task' },
        { id: 'help', text: 'Yes, music always helps concentration' },
        { id: 'hurt', text: 'No, music always hurts concentration' }
      ],
      correct: "depends",
      explanation: "The effect of music on concentration depends on the task and music type. Instrumental music can help with repetitive tasks, but lyrical music can interfere with reading and writing!"
    },
    {
      id: 5,
      question: "Is it better to study the same subject every day or vary subjects?",
      options: [
        { id: 'same', text: 'Study the same subject every day' },
        { id: 'either', text: 'Either approach works the same' },
        { id: 'vary', text: 'Vary subjects during study sessions' }
      ],
      correct: "vary",
      explanation: "Varying subjects during study sessions can improve learning through interleaving. Switching between different types of material helps strengthen memory and problem-solving skills!"
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
      setScore(prevScore => prevScore + 1);
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
    }, 2000);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Debate Brain vs Body game completed! Score: ${score}/${debateTopics.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Debate: Brain vs Body"
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
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">Debate Topic</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-lg md:text-xl font-semibold text-white text-center">"{currentTopic.question}"</p>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-6">
                <h4 className="text-base md:text-lg font-semibold text-white mb-4">Choose your position:</h4>
                {currentTopic.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && isSelected && option.id === currentTopic.correct;
                  const showIncorrect = showFeedback && isSelected && option.id !== currentTopic.correct;
                  
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
                      } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-white font-bold text-sm md:text-base`}
                    >
                      {option.text}
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
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DebateBrainVsBody;