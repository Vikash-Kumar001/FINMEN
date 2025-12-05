import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getDcosTeenGames } from '../../../../pages/Games/GameCategories/DCOS/teenGamesData';

const DeepfakeQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-72";
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
      text: "AI video shows politician saying false words. Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real - politicians say things", 
          emoji: "✅", 
          description: "AI-generated videos of politicians can be very convincing deepfakes",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Fake - verify with official sources", 
          emoji: "⚠️", 
          description: "AI videos showing politicians saying false words are likely deepfakes - always verify with official sources",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Share it - it's interesting", 
          emoji: "📤", 
          description: "Never share unverified videos of public figures - they may be deepfakes",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "An AI-generated video shows a celebrity doing something they never did. Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real - it looks real", 
          emoji: "✅", 
          description: "Deepfakes can look very real - always verify with official sources",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Fake - it's a deepfake", 
          emoji: "⚠️", 
          description: "AI-generated videos showing people doing things they never did are deepfakes",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - check later", 
          emoji: "🤔", 
          description: "Always verify immediately before sharing or believing",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A video shows someone's face moving unnaturally. Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real - people move weird", 
          emoji: "✅", 
          description: "Unnatural face movements are a sign of deepfake manipulation",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Fake - unnatural movements indicate deepfake", 
          emoji: "⚠️", 
          description: "Unnatural face movements are a key indicator of deepfake videos",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Not sure - share anyway", 
          emoji: "📤", 
          description: "Never share videos you're unsure about - verify first",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "An AI video shows a news anchor saying something controversial. Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real - news anchors say things", 
          emoji: "✅", 
          description: "AI videos of news anchors can be deepfakes - verify with official news sources",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Fake - verify with official news sources", 
          emoji: "⚠️", 
          description: "Always verify news videos with official news sources - they may be deepfakes",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Share it - it's news", 
          emoji: "📤", 
          description: "Never share unverified news videos - check official sources first",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A video shows someone saying words that don't match their lip movements. Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real - technical glitch", 
          emoji: "✅", 
          description: "Mismatched lip movements are a sign of deepfake manipulation, not a glitch",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Fake - mismatched lips indicate deepfake", 
          emoji: "⚠️", 
          description: "Mismatched lip movements are a clear indicator of deepfake videos",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - depends on quality", 
          emoji: "🤔", 
          description: "Mismatched lips always indicate manipulation, regardless of video quality",
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
      console.log(`🎮 Deepfake Quiz game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Deepfake Quiz"
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
                  You know about deepfakes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  You understand that AI videos showing people saying false words are deepfakes. Always verify videos with official sources before believing or sharing - deepfakes can be very convincing!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, AI videos showing false words are deepfakes - always verify with official sources!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to identify signs of deepfakes and remember to always verify videos with official sources.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DeepfakeQuiz;
