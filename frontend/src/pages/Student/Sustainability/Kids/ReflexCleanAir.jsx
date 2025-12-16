import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 5;

const words = [
  { word: "CLEAN AIR", isCorrect: true },
  { word: "POLLUTION", isCorrect: false },
  { word: "PLANT TREES", isCorrect: true },
  { word: "SMOKE", isCorrect: false },
  { word: "WALK", isCorrect: true },
  { word: "CAR FUMES", isCorrect: false },
  { word: "BIKE", isCorrect: true },
  { word: "FACTORY SMOKE", isCorrect: false }
];

const ReflexCleanAir = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "sustainability-kids-23";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentWord, setCurrentWord] = useState(null);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
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

  useEffect(() => {
    if (gameState === "finished") {
      console.log(`🎮 Reflex Clean Air game completed! Score: ${score}/${TOTAL_ROUNDS}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameState, score, gameId, nextGamePath, nextGameId]);

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const showNextWord = useCallback(() => {
    if (gameState !== "playing") return;
    if (!words || words.length === 0) return;
    
    const correctWords = words.filter(w => w.isCorrect === true);
    const incorrectWords = words.filter(w => w.isCorrect === false);
    const shuffledWords = shuffleArray([...correctWords, ...incorrectWords]);
    const randomWord = shuffledWords[Math.floor(Math.random() * shuffledWords.length)];
    
    setCurrentWord(randomWord);
    setTimeLeft(ROUND_TIME);
    startTimeRef.current = Date.now();
  }, [gameState, shuffleArray]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentRound(0);
    currentRoundRef.current = 0;
    showNextWord();
  };

  const handleWordClick = (isCorrect) => {
    if (gameState !== "playing" || !currentWord) return;
    
    resetFeedback();
    
    if (isCorrect === currentWord.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const newRound = currentRoundRef.current + 1;
    currentRoundRef.current = newRound;
    setCurrentRound(newRound);
    
    if (newRound >= TOTAL_ROUNDS) {
      setGameState("finished");
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      setTimeout(() => {
        showNextWord();
      }, 500);
    }
  };

  useEffect(() => {
    if (gameState === "playing" && currentWord) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            const newRound = currentRoundRef.current + 1;
            currentRoundRef.current = newRound;
            setCurrentRound(newRound);
            
            if (newRound >= TOTAL_ROUNDS) {
              setGameState("finished");
              return 0;
            } else {
              setTimeout(() => {
                showNextWord();
              }, 500);
              return ROUND_TIME;
            }
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [gameState, currentWord, showNextWord]);

  return (
    <GameShell
      title="Reflex Clean Air"
      score={score}
      subtitle={gameState === "ready" ? "Get Ready!" : gameState === "playing" ? `Round ${currentRound + 1} of ${TOTAL_ROUNDS}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={gameState === "finished"}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound + 1}
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished" && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
            <p className="text-white/80 mt-4">Tap for 'Clean Air' actions, avoid 'Pollution' actions</p>
          </div>
        )}
        
        {gameState === "playing" && currentWord && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-white mb-4">{currentWord.word}</div>
              <div className="text-2xl text-yellow-400 font-bold">Time: {timeLeft}s</div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleWordClick(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Clean Air ✅
              </button>
              <button
                onClick={() => handleWordClick(false)}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Pollution ❌
              </button>
            </div>
            <div className="mt-6 text-white/80">
              Score: {score}/{TOTAL_ROUNDS}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexCleanAir;

