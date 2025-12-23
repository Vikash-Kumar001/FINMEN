import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getDcosTeenGames } from '../../../../pages/Games/GameCategories/DCOS/teenGamesData';

const FreedomVsAbuseQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-82";
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
      text: "Is calling names freedom of speech?",
      options: [
        { 
          id: "a", 
          text: "Yes - free speech allows it", 
          emoji: "🗣️", 
          description: "Calling names is harassment, not protected free speech",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it's harassment and abuse", 
          emoji: "❌", 
          description: "Calling names is harassment and abuse, not protected by free speech",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - depends on context", 
          emoji: "🤔", 
          description: "Calling names is always harassment, regardless of context",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is spreading false rumors about someone free speech?",
      options: [
        { 
          id: "a", 
          text: "Yes - you can say anything", 
          emoji: "🗣️", 
          description: "Spreading false rumors is defamation, not protected free speech",
          isCorrect: false
        },
        
        { 
          id: "c", 
          text: "Maybe - if it's true", 
          emoji: "🤔", 
          description: "False rumors are always harmful, regardless of intent",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it's defamation and harmful", 
          emoji: "❌", 
          description: "Spreading false rumors is defamation and causes real harm - not free speech",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Is threatening someone online free speech?",
      options: [
        { 
          id: "a", 
          text: "Yes - it's just words", 
          emoji: "🗣️", 
          description: "Threats are illegal and not protected by free speech",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - threats are illegal", 
          emoji: "❌", 
          description: "Threatening someone is illegal and not protected by free speech",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - if it's a joke", 
          emoji: "😏", 
          description: "Threats are illegal regardless of whether they're meant as jokes",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Is cyberbullying protected as free speech?",
      options: [
         { 
          id: "b", 
          text: "No - it causes real harm", 
          emoji: "❌", 
          description: "Cyberbullying causes real psychological harm and is not protected by free speech",
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Yes - it's just online", 
          emoji: "🗣️", 
          description: "Cyberbullying causes real harm and is not protected by free speech",
          isCorrect: false
        },
       
        { 
          id: "c", 
          text: "Maybe - depends on severity", 
          emoji: "🤔", 
          description: "All cyberbullying is harmful, regardless of severity",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is hate speech protected as free speech?",
      options: [
        { 
          id: "a", 
          text: "Yes - free speech protects everything", 
          emoji: "🗣️", 
          description: "Hate speech causes real harm and is not protected by free speech",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it causes harm and is not protected", 
          emoji: "❌", 
          description: "Hate speech causes real harm to individuals and communities - it's not protected free speech",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - if it's your opinion", 
          emoji: "🤔", 
          description: "Hate speech is harmful regardless of whether it's someone's opinion",
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
      console.log(`🎮 Freedom vs Abuse Quiz game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Freedom vs Abuse Quiz"
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
                  You know the difference between free speech and abuse!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  You understand that calling names, spreading false rumors, threats, cyberbullying, and hate speech are NOT free speech - they're abuse that causes real harm!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, calling names, threats, and hate speech are abuse, not free speech!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to understand the difference between protected free speech and harmful abuse that causes real damage.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FreedomVsAbuseQuiz;
