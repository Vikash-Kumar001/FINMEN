import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const AIMistakeReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-56";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const items = [
    { id: 1, question: "AI says: 2+2=5", correctAction: "correct", type: "mistake" },
    { id: 2, question: "AI says: Sun rises in the west", correctAction: "correct", type: "mistake" },
    { id: 3, question: "AI says: Water boils at 100°C", correctAction: "ignore", type: "correct" },
    { id: 4, question: "AI says: Earth is flat", correctAction: "correct", type: "mistake" },
    { id: 5, question: "AI says: 10-5=5", correctAction: "ignore", type: "correct" },
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timeLeft and answered when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRoundRef.current < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, answered, timeLeft, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleChoice = (choice) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentItemData = items[currentRound - 1];
    const isCorrect =
      (choice === "correct" && currentItemData.correctAction === "correct") ||
      (choice === "ignore" && currentItemData.correctAction === "ignore");
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 500);
  };

  const finalScore = score;
  const currentItemData = items[currentRound - 1];
  const accuracy = Math.round((score / TOTAL_ROUNDS) * 100);

  return (
    <GameShell
      title="AI Mistake Reflex"
      subtitle={gameState === "playing" ? `Item ${currentRound}/${TOTAL_ROUNDS}: Did AI make a mistake?` : "Test your ability to identify AI mistakes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && accuracy >= 60}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="ai"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      backPath="/games/ai-for-all/teens"
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Identify if the AI made a mistake!<br />
              You have {ROUND_TIME} seconds for each item.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} items with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentItemData && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Item:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-6 text-center">
                Did AI make a mistake?
              </h3>

              <div className="bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-xl p-12 mb-6">
                <p className="text-3xl font-bold text-center">{currentItemData.question}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice("correct")}
                  disabled={answered}
                  className="w-full min-h-[80px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <div className="text-3xl mr-2">✔️</div>
                  <div className="text-white font-bold text-xl">Correct it</div>
                </button>
                <button
                  onClick={() => handleChoice("ignore")}
                  disabled={answered}
                  className="w-full min-h-[80px] bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <div className="text-3xl mr-2">❌</div>
                  <div className="text-white font-bold text-xl">Ignore</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIMistakeReflex;