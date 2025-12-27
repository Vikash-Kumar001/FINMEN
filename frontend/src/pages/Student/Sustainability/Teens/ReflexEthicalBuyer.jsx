import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const ReflexEthicalBuyer = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-34");
  const gameId = gameData?.id || "sustainability-teens-34";
  
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexEthicalBuyer, using fallback ID");
  }
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
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
      console.log(`🎮 Reflex Ethical Buyer game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "Fair Trade Certified products",
      isEthical: true,
      emoji: "⚖️"
    },
    {
      id: 2,
      text: "Products made in sweatshops",
      isEthical: false,
      emoji: "⚠️"
    },
    {
      id: 3,
      text: "Locally made products",
      isEthical: true,
      emoji: "🏪"
    },
    {
      id: 4,
      text: "Products with unclear labor practices",
      isEthical: false,
      emoji: "❓"
    },
    {
      id: 5,
      text: "Organic and ethically sourced items",
      isEthical: true,
      emoji: "🌱"
    }
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (gameActive && timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(10);
    setScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
    setShowFeedback(false);
  };

  const handleAnswer = (isCorrect) => {
    if (!gameActive) return;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setFeedbackText("Correct! Ethical choice!");
      setFeedbackType("success");
    } else {
      setFeedbackText("Not ethical, but that's okay! Keep learning.");
      setFeedbackType("error");
    }
    
    setShowFeedback(true);
    setGameActive(false);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(10);
        setGameActive(true);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const handleTimeUp = () => {
    setFeedbackText("Time's up!");
    setFeedbackType("error");
    setShowFeedback(true);
    setGameActive(false);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(10);
        setGameActive(true);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Reflex Ethical Buyer"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
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
        {!showResult ? (
          <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                  <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-4xl">
                      {currentQuestionData?.emoji}
                    </div>
                    {gameActive && (
                      <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        timeLeft > 5 ? 'bg-green-500' : timeLeft > 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {timeLeft}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-white text-lg md:text-xl mb-6 text-center">
                  {currentQuestionData?.text}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(currentQuestionData?.isEthical === true)}
                    className="p-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105 transition-all transform"
                  >
                    <div className="text-2xl mb-2">✅</div>
                    <h4 className="font-bold text-base">Ethical Choice</h4>
                  </button>
                  
                  <button
                    onClick={() => handleAnswer(currentQuestionData?.isEthical === false)}
                    className="p-6 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105 transition-all transform"
                  >
                    <div className="text-2xl mb-2">❌</div>
                    <h4 className="font-bold text-base">Not Ethical</h4>
                  </button>
                </div>
                
                {showFeedback && (
                  <div className={`rounded-lg p-5 mt-6 text-center ${
                    feedbackType === "success" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}>
                    <p className="text-white">{feedbackText}</p>
                  </div>
                )}
              </div>
            </div>
            
            {!gameActive && !showFeedback && currentQuestion === 0 && (
              <div className="text-center">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Start Game
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-xl text-white">Your score: {score} out of {questions.length}</p>
            <div className="space-x-4">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexEthicalBuyer;