import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getDcosTeenGames } from '../../../../pages/Games/GameCategories/DCOS/teenGamesData';

const PhishingEmailQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-42";
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
      text: "An email says 'Click link to win lottery.' Is it safe?",
      options: [
        { 
          id: "a", 
          text: "Yes - click the link", 
          emoji: "✅", 
          description: "Lottery win emails are common phishing scams - never click the link",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it's a phishing scam", 
          emoji: "🚫", 
          description: "Emails promising lottery wins are phishing scams designed to steal your information",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - check first", 
          emoji: "🤔", 
          description: "Lottery win emails are always scams - don't click or check anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "An email asks you to verify your account by clicking a link. Safe?",
      options: [
        { 
          id: "a", 
          text: "Yes - click to verify", 
          emoji: "✅", 
          description: "Account verification emails can be phishing scams - go to official site directly",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it's phishing, go to official site", 
          emoji: "🚫", 
          description: "Never click links in verification emails - go to the official website directly",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Check the sender first", 
          emoji: "👀", 
          description: "Even if sender looks legitimate, go to official site directly to be safe",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "An email claims you won a prize and asks for personal info. Safe?",
      options: [
        { 
          id: "a", 
          text: "Yes - provide the info", 
          emoji: "✅", 
          description: "Never provide personal information to unsolicited prize emails",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it's a phishing scam", 
          emoji: "🚫", 
          description: "Emails asking for personal information to claim prizes are phishing scams",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask for more details", 
          emoji: "❓", 
          description: "Don't engage with suspicious prize emails - delete them",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "An email says 'Urgent: Update your password now!' Is it safe?",
      options: [
        { 
          id: "a", 
          text: "Yes - click and update", 
          emoji: "✅", 
          description: "Urgent password update emails are often phishing scams",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - go to official website directly", 
          emoji: "🚫", 
          description: "Never click links in password update emails - go to official website directly",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Check the email address first", 
          emoji: "📧", 
          description: "Even if email looks legitimate, go to official site directly to be safe",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "An email offers free gift cards if you click a link. Safe?",
      options: [
        { 
          id: "a", 
          text: "Yes - click for free gift", 
          emoji: "✅", 
          description: "Free gift card offers in emails are phishing scams",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - it's a phishing scam", 
          emoji: "🚫", 
          description: "Emails offering free gift cards are phishing scams designed to steal your information",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Forward to friends first", 
          emoji: "➡️", 
          description: "Never forward suspicious emails - delete them immediately",
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
      console.log(`🎮 Phishing Email Quiz game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Phishing Email Quiz"
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
                  You know about phishing emails!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  You understand that phishing emails try to trick you into clicking links or sharing personal information. Never click links in suspicious emails - go to official websites directly!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, never click links in suspicious emails - go to official websites directly!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to identify common phishing email tactics and remember to always go to official websites directly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PhishingEmailQuiz;
