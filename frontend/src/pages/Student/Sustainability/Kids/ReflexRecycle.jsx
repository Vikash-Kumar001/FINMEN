import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 5;

const words = [
  { word: "RECYCLE", isCorrect: true },
  { word: "TRASH", isCorrect: false },
  { word: "REUSE", isCorrect: true },
  { word: "WASTE", isCorrect: false },
  { word: "COMPOST", isCorrect: true },
  { word: "LITTER", isCorrect: false },
  { word: "CLEAN", isCorrect: true },
  { word: "POLLUTE", isCorrect: false }
];

const ReflexRecycle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-3";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentWord, setCurrentWord] = useState(null);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);
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
    if (gameState === "finished") {
      console.log(`🎮 Reflex Recycle game completed! Score: ${score}/${TOTAL_ROUNDS}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameState, score, gameId, nextGamePath, nextGameId]);

  // Shuffle array function
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const showNextWord = useCallback(() => {
    try {
      if (gameState !== "playing") return;
      if (!words || words.length === 0) return;
      
      // Separate words into correct (RECYCLE) and incorrect (TRASH) arrays
      const correctWords = words.filter(w => w.isCorrect === true);
      const incorrectWords = words.filter(w => w.isCorrect === false);
      
      // Shuffle both arrays
      const shuffledCorrect = shuffleArray(correctWords);
      const shuffledIncorrect = shuffleArray(incorrectWords);
      
      // Determine which type of word to show based on round number
      // Round 1, 3, 5 = correct (RECYCLE words)
      // Round 2, 4 = incorrect (TRASH words)
      let selectedWord;
      if (currentRound % 2 === 1) {
        // Odd rounds (1, 3, 5) - show RECYCLE words
        const roundIndex = Math.floor((currentRound - 1) / 2);
        selectedWord = shuffledCorrect[roundIndex % shuffledCorrect.length];
      } else {
        // Even rounds (2, 4) - show TRASH words
        const roundIndex = Math.floor((currentRound - 2) / 2);
        selectedWord = shuffledIncorrect[roundIndex % shuffledIncorrect.length];
      }
      
      if (selectedWord) {
        setCurrentWord(selectedWord);
      }
    } catch (error) {
      console.error("Error showing next word:", error);
    }
  }, [gameState, currentRound, shuffleArray]);

  const startGame = () => {
    resetFeedback();
    setGameState("playing");
    setScore(0);
    setCurrentRound(1);
    currentRoundRef.current = 1;
    setTimeLeft(ROUND_TIME);
    startTimeRef.current = Date.now();
    showNextWord();
  };

  const handleTap = () => {
    if (gameState !== "playing" || !currentWord) return;
    
    // Odd rounds (1, 3, 5) - should tap (correct words)
    // Even rounds (2, 4) - should NOT tap (incorrect words)
    const shouldTap = currentRound % 2 === 1;
    const isCorrect = shouldTap && currentWord.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next round
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      currentRoundRef.current = currentRoundRef.current + 1;
      setTimeLeft(ROUND_TIME);
      setTimeout(() => showNextWord(), 500);
    } else {
      // Game finished
      setGameState("finished");
      if (score + (isCorrect ? 1 : 0) >= TOTAL_ROUNDS - 1) {
        showAnswerConfetti();
      }
    }
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (gameState === "playing" && timeLeft === 0) {
      // Time's up, move to next round
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
        currentRoundRef.current = currentRoundRef.current + 1;
        setTimeLeft(ROUND_TIME);
        setTimeout(() => showNextWord(), 500);
      } else {
        setGameState("finished");
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, timeLeft, currentRound, showNextWord]);

  const handleNext = () => {
    navigate("/student/sustainability/kids/puzzle-sort-waste");
  };

  const finalScore = score;
  const coins = finalScore;

  return (
    <GameShell
      title="Reflex Recycle"
      subtitle={gameState === "ready" ? "Tap quickly for 'Recycle' words, avoid 'Trash' words!" : gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS} - Time: ${timeLeft}s` : "Game Complete!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={score}
      showGameOver={gameState === "finished"}
      gameId={gameId}
      gameType="sustainability"
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished" && score === TOTAL_ROUNDS}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      {gameState === "ready" && (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Play?</h3>
          <p className="text-gray-300 mb-6">
            Tap when you see RECYCLE words (like RECYCLE, REUSE, COMPOST)
            <br />
            Don't tap for TRASH words (like TRASH, WASTE, LITTER)
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameState === "playing" && currentWord && (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 border border-yellow-400/30">
            <div className="text-8xl font-extrabold text-white mb-4">
              {currentWord.word}
            </div>
            <p className="text-gray-300 mb-6">
              {currentRound % 2 === 1 ? "Tap if this is a RECYCLE word!" : "Don't tap - this is a TRASH word!"}
            </p>
            <button
              onClick={handleTap}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-12 py-6 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-cyan-700 transition-all transform active:scale-95"
            >
              TAP!
            </button>
          </div>
        </div>
      )}
      
      {gameState === "finished" && (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white">Game Over!</h3>
          <p className="text-gray-300">
            You scored {finalScore} out of {TOTAL_ROUNDS}!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Great reflexes! ⚡
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default ReflexRecycle;

