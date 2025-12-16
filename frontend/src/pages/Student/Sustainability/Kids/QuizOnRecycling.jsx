import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const QuizOnRecycling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-2";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Quiz on Recycling game completed! Score: ${finalScore}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, finalScore, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "What goes in recycling?",
      options: [
        { 
          id: "a", 
          text: "Plastic bottle", 
          emoji: "🥤", 
          description: "Can be recycled into new products",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Banana peel", 
          emoji: "🍌", 
          description: "Goes in compost, not recycling",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Broken toy", 
          emoji: "🧸", 
          description: "Usually goes in trash",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which item can be recycled?",
      options: [
        { 
          id: "b", 
          text: "Food scraps", 
          emoji: "🍎", 
          description: "Food goes in compost",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Glass bottle", 
          emoji: "🍾", 
          description: "Glass can be recycled many times",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Used tissue", 
          emoji: "🧻", 
          description: "Cannot be recycled",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What does recycling help?",
      options: [
        { 
          id: "b", 
          text: "Makes more trash", 
          emoji: "🗑️", 
          description: "Recycling reduces trash",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Does nothing", 
          emoji: "😐", 
          description: "Recycling helps a lot!",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Saves our planet", 
          emoji: "🌍", 
          description: "Reduces waste and pollution",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Which can be recycled?",
      options: [
        { 
          id: "b", 
          text: "Dirty pizza box", 
          emoji: "🍕", 
          description: "Too dirty to recycle",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Plastic bag", 
          emoji: "🛍️", 
          description: "Usually not recyclable in regular bins",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Aluminum can", 
          emoji: "🥫", 
          description: "Metal cans are recyclable",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why should we recycle?",
      options: [
        { 
          id: "b", 
          text: "To make more trash", 
          emoji: "🗑️", 
          description: "Recycling reduces trash",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "It doesn't matter", 
          emoji: "😕", 
          description: "Recycling matters a lot!",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "To protect animals", 
          emoji: "🐾", 
          description: "Recycling helps wildlife",
          isCorrect: true
        }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (showResult) return;
    
    const newChoices = [...choices, option];
    setChoices(newChoices);
    
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setFinalScore(newChoices.filter(c => c.isCorrect).length);
        setShowResult(true);
        if (newChoices.filter(c => c.isCorrect).length === questions.length) {
          showAnswerConfetti();
        }
      }
    }, 1500);
  };

  return (
    <GameShell
      title="Quiz on Recycling"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}: Test your recycling knowledge!` : "Quiz Complete!"}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={finalScore}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={questions.length}
      showConfetti={showResult && finalScore === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      {!showResult ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {questions[currentQuestion].text}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{option.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{option.text}</div>
                      <div className="text-sm text-gray-300">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">♻️</div>
          <h3 className="text-2xl font-bold text-white">Great job!</h3>
          <p className="text-gray-300">
            You got {finalScore} out of {questions.length} questions correct!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep learning about recycling! 🌍
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default QuizOnRecycling;

