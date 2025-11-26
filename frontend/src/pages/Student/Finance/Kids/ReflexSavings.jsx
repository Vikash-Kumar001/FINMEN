import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 5;

const words = [
  { word: "SAVE", isCorrect: true },
  { word: "WASTE", isCorrect: false },
  { word: "SECURE", isCorrect: true },
  { word: "SPEND", isCorrect: false },
  { word: "SAFE", isCorrect: true },
  { word: "LOSE", isCorrect: false },
  { word: "PRESERVE", isCorrect: true },
  { word: "THROW", isCorrect: false }
];

const ReflexSavings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-3";
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
      
      // Separate words into correct (SAVE) and incorrect (WASTE) arrays
      const correctWords = words.filter(w => w.isCorrect === true);
      const incorrectWords = words.filter(w => w.isCorrect === false);
      
      // Shuffle both arrays
      const shuffledCorrect = shuffleArray(correctWords);
      const shuffledIncorrect = shuffleArray(incorrectWords);
      
      // Determine which type of word to show based on round number
      // Round 1, 3, 5 = correct (SAVE words)
      // Round 2, 4 = incorrect (WASTE words)
      let selectedWord;
      if (currentRound % 2 === 1) {
        // Odd rounds (1, 3, 5) - show SAVE words
        const roundIndex = Math.floor((currentRound - 1) / 2);
        selectedWord = shuffledCorrect[roundIndex % shuffledCorrect.length];
      } else {
        // Even rounds (2, 4) - show WASTE words
        const roundIndex = Math.floor((currentRound - 2) / 2);
        selectedWord = shuffledIncorrect[roundIndex % shuffledIncorrect.length];
      }
      
      if (selectedWord) {
        setCurrentWord(selectedWord);
        startTimeRef.current = Date.now();
      }
    } catch (error) {
      console.error("Error in showNextWord:", error);
    }
  }, [gameState, currentRound, shuffleArray]);

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer and show word when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      showNextWord();
    }
  }, [currentRound, gameState, showNextWord]);

  // Timer effect - only depends on gameState
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check if game should be finished
    if (currentRoundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      return;
    }

    // Start timer for current round
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this round
          if (currentRoundRef.current >= TOTAL_ROUNDS) {
            setGameState("finished");
            return 0;
          } else {
            // Move to next round automatically
            setCurrentRound(prevRound => {
              const nextRound = prevRound + 1;
              if (nextRound > TOTAL_ROUNDS) {
                setGameState("finished");
                return prevRound;
              }
              return nextRound;
            });
            return ROUND_TIME;
          }
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    resetFeedback();
  };

  const handleTap = (isSave) => {
    try {
      if (gameState !== "playing" || !currentWord || currentRound > TOTAL_ROUNDS) return;
      
      if (isSave === currentWord.isCorrect) {
        setScore(prev => prev + 1);
        showCorrectAnswerFeedback(1, true);
      }
      
      // Move to next round after a short delay
      setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          // Game finished after this click
          setGameState("finished");
        } else {
          // Move to next round (timer will reset automatically via useEffect)
          setCurrentRound(prev => prev + 1);
        }
      }, 500);
    } catch (error) {
      console.error("Error in handleTap:", error);
    }
  };


  return (
    <GameShell
      title="Reflex Savings"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Tap quickly for 'Save' words, avoid 'Waste' words!` : "Tap quickly for 'Save' words, avoid 'Waste' words!"}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId="finance-kids-3"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalLevels={5}
      maxScore={5}
      showConfetti={gameState === "finished" && score === 5}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Tap the "SAVE" button when you see "SAVE" words.<br />
              Don't tap when you see "WASTE" words.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} rounds with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className="text-white">
                <span className="font-bold">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
              <div className="text-6xl font-bold text-white mb-8">
                {currentWord?.word || "..."}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleTap(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="font-bold text-xl mb-2">SAVE</h3>
                </button>
                
                <button
                  onClick={() => handleTap(false)}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">🗑️</div>
                  <h3 className="font-bold text-xl mb-2">WASTE</h3>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </GameShell>
  );
};

export default ReflexSavings;