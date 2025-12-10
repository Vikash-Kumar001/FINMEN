import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const PatternMusicReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-11";
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
  const [userPattern, setUserPattern] = useState([]);
  const [showPattern, setShowPattern] = useState(true);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const patterns = [
    { id: 1, pattern: ["👏", "👏", "⏸️"], display: "Clap-Clap-Pause" },
    { id: 2, pattern: ["👏", "⏸️", "👏", "👏"], display: "Clap-Pause-Clap-Clap" },
    { id: 3, pattern: ["👏", "👏", "👏", "⏸️", "⏸️"], display: "Clap-Clap-Clap-Pause-Pause" },
    { id: 4, pattern: ["⏸️", "👏", "⏸️", "👏"], display: "Pause-Clap-Pause-Clap" },
    { id: 5, pattern: ["👏", "⏸️", "👏", "⏸️", "👏"], display: "Clap-Pause-Clap-Pause-Clap" }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timeLeft and answered when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
      setUserPattern([]);
      setShowPattern(true);
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
    if (gameState === "playing" && !answered && !showPattern && timeLeft > 0) {
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
  }, [gameState, answered, showPattern, timeLeft, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    setUserPattern([]);
    setShowPattern(true);
    resetFeedback();
  };

  const handleStartRepeating = () => {
    setShowPattern(false);
    // Reset timer when starting to repeat
    setTimeLeft(ROUND_TIME);
  };

  const handleClapPause = (action) => {
    if (answered || gameState !== "playing" || showPattern) return;
    
    const newPattern = [...userPattern, action];
    setUserPattern(newPattern);
    
    const currentPatternData = patterns[currentRound - 1];
    
    if (newPattern.length === currentPatternData.pattern.length) {
      setAnswered(true);
      resetFeedback();
      
      const isCorrect = JSON.stringify(newPattern) === JSON.stringify(currentPatternData.pattern);
      
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
      }, 800);
    }
  };

  const finalScore = score;
  const currentPatternData = patterns[currentRound - 1];

  return (
    <GameShell
      title="Pattern Music Reflex"
      subtitle={gameState === "playing" ? `Pattern ${currentRound}/${TOTAL_ROUNDS}: ${showPattern ? "Watch the rhythm pattern!" : "Repeat it now!"}` : "Test your pattern recognition skills!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
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
            <div className="text-5xl mb-6">🎵</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Watch and repeat rhythm patterns!<br />
              You have {ROUND_TIME} seconds for each pattern.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} patterns with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentPatternData && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Pattern:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              {!showPattern && (
                <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                  <span className="text-white">Time:</span> {timeLeft}s
                </div>
              )}
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-6 text-center">
                {showPattern ? "Watch the rhythm pattern!" : "Repeat it now!"}
              </h3>
              
              {showPattern ? (
                <>
                  <div className="bg-purple-500/20 rounded-xl p-8 mb-6">
                    <div className="flex justify-center items-center gap-3 mb-4">
                      {currentPatternData.pattern.map((item, idx) => (
                        <div key={idx} className="text-6xl">{item}</div>
                      ))}
                    </div>
                    <p className="text-white text-xl font-bold text-center">{currentPatternData.display}</p>
                  </div>
                  <button
                    onClick={handleStartRepeating}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:opacity-90 transition"
                  >
                    Start Repeating! 🎵
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                    <p className="text-white text-center">
                      Your pattern: {userPattern.length > 0 ? userPattern.join(" ") : "Start tapping!"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleClapPause("👏")}
                      disabled={userPattern.length >= currentPatternData.pattern.length || answered}
                      className="w-full min-h-[80px] bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <div className="text-3xl mr-2">👏</div> CLAP
                    </button>
                    <button
                      onClick={() => handleClapPause("⏸️")}
                      disabled={userPattern.length >= currentPatternData.pattern.length || answered}
                      className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <div className="text-3xl mr-2">⏸️</div> PAUSE
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PatternMusicReflex;