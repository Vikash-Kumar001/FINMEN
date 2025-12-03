import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const StrongPasswordReflex = () => {
  const location = useLocation();
  
  const gameId = "dcos-kids-1";
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
      const games = getDcosKidsGames({});
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
  const [selectedAction, setSelectedAction] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Password: '12345'",
      password: "12345",
      isStrong: false,
      correctAction: "weak"
    },
    {
      id: 2,
      text: "Password: 'Tiger@2025'",
      password: "Tiger@2025",
      isStrong: true,
      correctAction: "strong"
    },
    {
      id: 3,
      text: "Password: 'password'",
      password: "password",
      isStrong: false,
      correctAction: "weak"
    },
    {
      id: 4,
      text: "Password: 'Star#123!'",
      password: "Star#123!",
      isStrong: true,
      correctAction: "strong"
    },
    {
      id: 5,
      text: "Password: 'Secure$99'",
      password: "Secure$99",
      isStrong: true,
      correctAction: "strong"
    }
  ];

  const handleAction = (action) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedAction(action);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const isCorrect = action === currentQuestionData.correctAction;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAction(null);
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
      title="Strong Password Reflex"
      subtitle={levelCompleted ? "Reflex Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="dcos"
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
              
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-8 mb-6">
                <p className="text-white text-3xl md:text-4xl font-mono font-bold text-center">
                  {currentQuestionData.password}
                </p>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center font-semibold">
                Is this password strong or weak?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleAction("strong")}
                  disabled={answered}
                  className={`py-6 px-8 rounded-2xl font-bold text-white text-lg transition-all transform ${
                    answered && selectedAction === "strong"
                      ? currentQuestionData.correctAction === "strong"
                        ? "bg-green-500 border-4 border-green-300 ring-4 ring-green-400 scale-105"
                        : "bg-red-500/50 border-2 border-red-400 opacity-75"
                      : "bg-green-500 hover:bg-green-600 hover:scale-105 border-2 border-green-300"
                  } ${answered ? "cursor-not-allowed" : ""}`}
                >
                  <div className="text-4xl mb-2">✓</div>
                  <div>Strong</div>
                </button>
                <button
                  onClick={() => handleAction("weak")}
                  disabled={answered}
                  className={`py-6 px-8 rounded-2xl font-bold text-white text-lg transition-all transform ${
                    answered && selectedAction === "weak"
                      ? currentQuestionData.correctAction === "weak"
                        ? "bg-green-500 border-4 border-green-300 ring-4 ring-green-400 scale-105"
                        : "bg-red-500/50 border-2 border-red-400 opacity-75"
                      : "bg-red-500 hover:bg-red-600 hover:scale-105 border-2 border-red-300"
                  } ${answered ? "cursor-not-allowed" : ""}`}
                >
                  <div className="text-4xl mb-2">✗</div>
                  <div>Weak</div>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default StrongPasswordReflex;
