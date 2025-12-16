import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const EcoSortStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("sustainability-kids-1");
  const gameId = gameData?.id || "sustainability-kids-1";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for EcoSortStory, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
      const games = getSustainabilityKidsGames({});
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

  const questions = [
    {
      id: 1,
      text: "You see trash on the ground. What would you like to do?",
      options: [
        { 
          id: "pickup", 
          text: "Pick it up", 
          emoji: "🌱", 
          description: "Put it in the trash bin",
          isCorrect: true
        },
        { 
          id: "leave", 
          text: "Leave it", 
          emoji: "😕", 
          description: "Ignore it and walk away",
          isCorrect: false
        },
        { 
          id: "tell", 
          text: "Tell an adult", 
          emoji: "👨‍👩‍👧", 
          description: "Ask a grown-up to help",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "You finish eating a snack. What do you do with the wrapper?",
      options: [
        { 
          id: "bin", 
          text: "Find a bin", 
          emoji: "♻️", 
          description: "Put it in the trash can",
          isCorrect: true
        },
        { 
          id: "throw", 
          text: "Throw on ground", 
          emoji: "🗑️", 
          description: "Drop it anywhere",
          isCorrect: false
        },
        { 
          id: "pocket", 
          text: "Keep in pocket", 
          emoji: "👖", 
          description: "Save it for later disposal",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "You see a plastic bottle on the playground. What's the best action?",
      options: [
        { 
          id: "recycle", 
          text: "Put in recycling", 
          emoji: "♻️", 
          description: "Help recycle it",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😐", 
          description: "Not my problem",
          isCorrect: false
        },
        { 
          id: "kick", 
          text: "Kick it away", 
          emoji: "⚽", 
          description: "Move it somewhere else",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your friend drops a candy wrapper. What should you do?",
      options: [
        { 
          id: "pickup", 
          text: "Pick it up yourself", 
          emoji: "🤲", 
          description: "Help keep the place clean",
          isCorrect: true
        },
        { 
          id: "remind", 
          text: "Remind them to pick it up", 
          emoji: "💬", 
          description: "Help them remember",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😶", 
          description: "Say nothing",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see lots of trash in the park. What's the best thing to do?",
      options: [
        { 
          id: "help", 
          text: "Help clean it up", 
          emoji: "🧹", 
          description: "Make the park beautiful",
          isCorrect: true
        },
        { 
          id: "tell", 
          text: "Tell a teacher or parent", 
          emoji: "👨‍🏫", 
          description: "Get help from adults",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😑", 
          description: "Not my responsibility",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Eco Sort Story game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Eco Sort Story"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default EcoSortStory;
