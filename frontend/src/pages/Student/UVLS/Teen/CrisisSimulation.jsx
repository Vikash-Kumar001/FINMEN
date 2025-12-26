import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const CrisisSimulation = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-94";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getUvlsTeenGames({});
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
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Task: Review notes for an important exam tomorrow. How do you prioritize this?",
      options: [
        { 
          id: "a", 
          text: "High priority - Review systematically tonight", 
          emoji: "📝",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Low priority - Skip it", 
          emoji: "😴",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Medium priority - Quick glance only", 
          emoji: "👀",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "No priority - Cram in the morning", 
          emoji: "⏰",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Task: Practice problems for math exam. How do you prioritize this?",
      options: [
        { 
          id: "b", 
          text: "Low priority - Theory is enough", 
          emoji: "📚",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "High priority - Practice builds understanding", 
          emoji: "🧮",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Medium priority - Do a few problems", 
          emoji: "✏️",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "No priority - Skip practice", 
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Task: Sleep early before exam. How do you prioritize this?",
      options: [
        { 
          id: "a", 
          text: "High priority - Adequate sleep improves performance", 
          emoji: "🛏️",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Low priority - Study all night", 
          emoji: "🌙",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Medium priority - Sleep a little less", 
          emoji: "😴",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "No priority - Pull an all-nighter", 
          emoji: "☕",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Task: Eat healthy meals during exam week. How do you prioritize this?",
      options: [
        { 
          id: "b", 
          text: "Low priority - Fast food is fine", 
          emoji: "🍔",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Medium priority - Eat when convenient", 
          emoji: "🍕",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "High priority - Nutrition supports brain function", 
          emoji: "🍎",
          isCorrect: true
        },
        { 
          id: "d", 
          text: "No priority - Skip meals to study", 
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Task: Take relaxation breaks during study sessions. How do you prioritize this?",
      options: [
        { 
          id: "a", 
          text: "High priority - Breaks improve retention and reduce stress", 
          emoji: "😌",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Low priority - Study continuously", 
          emoji: "📖",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Medium priority - Take breaks only when tired", 
          emoji: "⏸️",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "No priority - No breaks needed", 
          emoji: "💪",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Crisis Simulation"
      subtitle={levelCompleted ? "Simulation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="uvls"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CrisisSimulation;
