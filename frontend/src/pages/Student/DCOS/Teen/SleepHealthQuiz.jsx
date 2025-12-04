import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getDcosTeenGames } from '../../../../pages/Games/GameCategories/DCOS/teenGamesData';

const SleepHealthQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-22";
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
      const games = getDcosTeenGames({});
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
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "Using mobile at midnight affects sleep. Is this healthy?",
      options: [
        { 
          id: "a", 
          text: "Yes - it helps me relax", 
          emoji: "😴", 
          description: "Screens before bed actually disrupt sleep, not help you relax",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - screens before bed disrupt sleep", 
          emoji: "❌", 
          description: "Blue light from screens disrupts your sleep cycle and makes it harder to fall asleep",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - depends on the person", 
          emoji: "🤔", 
          description: "Screens before bed disrupt sleep for everyone, regardless of individual differences",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is it okay to use your phone right before sleeping?",
      options: [
        { 
          id: "a", 
          text: "Yes - it's fine", 
          emoji: "😐", 
          description: "Using phones before bed disrupts sleep quality",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - blue light affects sleep quality", 
          emoji: "❌", 
          description: "Blue light from phones suppresses melatonin and disrupts your natural sleep cycle",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Sometimes - not a big deal", 
          emoji: "🤷", 
          description: "Even occasional phone use before bed can significantly disrupt sleep",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Does screen time before bed affect your sleep schedule?",
      options: [
        { 
          id: "a", 
          text: "No - it doesn't matter", 
          emoji: "😑", 
          description: "Screen time before bed significantly affects your sleep schedule",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Yes - it disrupts your sleep cycle", 
          emoji: "✅", 
          description: "Screen time before bed disrupts your circadian rhythm and sleep cycle",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only if you use it for hours", 
          emoji: "🤔", 
          description: "Even short screen time before bed can disrupt your sleep cycle",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Should you check notifications right before bed?",
      options: [
        { 
          id: "a", 
          text: "Yes - to stay updated", 
          emoji: "📱", 
          description: "Checking notifications before bed can keep you awake and disrupt sleep",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it can keep you awake", 
          emoji: "❌", 
          description: "Notifications can trigger alertness and make it harder to fall asleep",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Only important ones", 
          emoji: "🤷", 
          description: "Even checking important notifications can disrupt your sleep preparation",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is using devices in bed good for sleep hygiene?",
      options: [
        { 
          id: "a", 
          text: "Yes - it's comfortable", 
          emoji: "😴", 
          description: "Using devices in bed disrupts the association between bed and sleep",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - bed should be for sleep only", 
          emoji: "✅", 
          description: "Bed should be reserved for sleep to maintain good sleep hygiene and better rest",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Sometimes - not harmful", 
          emoji: "😐", 
          description: "Using devices in bed can harm sleep quality even if done occasionally",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Sleep Health Quiz game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, finalScore, gameId, nextGamePath, nextGameId, questions.length]);

  return (
    <GameShell
      title="Sleep Health Quiz"
      score={coins}
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl md:text-3xl mr-3 md:mr-4">{option.emoji}</div>
                      <div>
                        <h3 className="font-bold text-base md:text-xl mb-1">{option.text}</h3>
                        <p className="text-white/90 text-xs md:text-sm">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You know about sleep health!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  You understand that screens before bed disrupt sleep, blue light affects sleep quality, and bed should be for sleep only!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, turn off screens 1 hour before bed for better sleep!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to identify which habits support healthy sleep and which disrupt it.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SleepHealthQuiz;
