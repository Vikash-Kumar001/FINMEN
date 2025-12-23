import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getDcosTeenGames } from '../../../../pages/Games/GameCategories/DCOS/teenGamesData';

const DeepfakeVideoQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-32";
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
      text: "You see a video of your favorite celebrity saying something shocking. The video has slight lighting inconsistencies around their face. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Share it immediately - it's breaking news!", 
          description: "Never share unverified videos, especially of celebrities",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Check for signs of deepfake and verify with official sources", 
          description: "Lighting inconsistencies can be a sign of deepfake manipulation",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore it - celebrities often do strange things",
          description: "It's important to learn how to identify deepfakes, not ignore them",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You receive a video of a friend asking for money urgently. The audio and video seem slightly out of sync. What should you do?",
      options: [
         { 
          id: "b", 
          text: "Call your friend directly to verify if they sent this video", 
          description: "Out of sync audio/video can indicate deepfake or other manipulation",
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Send the money immediately - they need help!", 
          description: "Always verify identity through another channel when asked for money",
          isCorrect: false
        },
       
        { 
          id: "c", 
          text: "Ignore it - probably spam",
          description: "While it might be spam, it's important to verify identity properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see a video of a natural disaster in your area that wasn't reported by local news. The video shows unusual shadows and lighting. What's the best approach?",
      options: [
        { 
          id: "a", 
          text: "Share it to warn others about the disaster",
          description: "Sharing unverified disaster information can cause panic and misinformation",
          isCorrect: false
        },
        
        { 
          id: "b", 
          text: "Assume it's fake since it wasn't on the news",
          description: "While verification is important, don't assume all unreported videos are fake",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Check multiple reliable news sources to confirm the event",
          description: "Unusual shadows and lighting could indicate video manipulation",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "You find a video of a scientific breakthrough that seems too good to be true. The video has minor artifacts around the edges and the audio doesn't match the speaker's lip movements. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Share it with your science class - it's revolutionary!",
          description: "Always verify scientific claims with reputable sources before sharing",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Look for peer-reviewed research papers on the topic",
          description: "Artifacts and lip-sync issues are common signs of deepfake manipulation",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Assume it's real since it's about science",
          description: "Even science-related videos can be manipulated or taken out of context",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see a video of your school principal making an announcement that seems odd. The video has inconsistent lighting on the face and unusual eye reflections. What's the best action?",
      options: [
        { 
          id: "a", 
          text: "Forward it to all your friends",
          description: "Never forward potentially fake videos without verification",
          isCorrect: false
        },
        
        { 
          id: "b", 
          text: "Assume it's fake because it seems odd",
          description: "Always verify with official sources rather than making assumptions",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Check your school's official website or contact them directly",
          description: "Inconsistent lighting and eye reflections are common signs of deepfakes",
          isCorrect: true
        },
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
      console.log(`🎮 Deepfake Video Quiz game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Deepfake Video Quiz"
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
                  You understand that deepfakes are manipulated videos that look real but are fake. Always verify videos with official sources before believing or sharing!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, always verify videos with official sources - deepfakes can be very convincing!
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

export default DeepfakeVideoQuiz;
