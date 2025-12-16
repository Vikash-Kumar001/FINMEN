import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 5;

const habits = [
  { word: "BIKE TO SCHOOL", isCorrect: true },
  { word: "DRIVE EVERYWHERE", isCorrect: false },
  { word: "USE REUSABLE BAG", isCorrect: true },
  { word: "USE PLASTIC BAGS", isCorrect: false },
  { word: "TURN OFF LIGHTS", isCorrect: true },
  { word: "LEAVE LIGHTS ON", isCorrect: false },
  { word: "EAT LOCAL FOOD", isCorrect: true },
  { word: "WASTE FOOD", isCorrect: false }
];

const ReflexGreenHabits = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-9");
  const gameId = gameData?.id || "sustainability-teens-9";
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [currentHabit, setCurrentHabit] = useState(null);
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
    if (gameState === "finished") {
      console.log(`🎮 Reflex Green Habits game completed! Score: ${score}/${TOTAL_ROUNDS}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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

  const showNextHabit = useCallback(() => {
    if (gameState !== "playing") return;
    const shuffled = shuffleArray(habits);
    setCurrentHabit(shuffled[0]);
    startTimeRef.current = Date.now();
    setTimeLeft(ROUND_TIME);
  }, [gameState, shuffleArray]);

  const startGame = () => {
    resetFeedback();
    setGameState("playing");
    setScore(0);
    setCurrentRound(1);
    currentRoundRef.current = 1;
    showNextHabit();
  };

  const handleTap = () => {
    if (gameState !== "playing" || !currentHabit) return;
    if (currentHabit.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    clearInterval(timerRef.current);
    currentRoundRef.current += 1;
    if (currentRoundRef.current <= TOTAL_ROUNDS) {
      setCurrentRound(currentRoundRef.current);
      showNextHabit();
    } else {
      setGameState("finished");
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (currentHabit && currentHabit.isCorrect) {
              showCorrectAnswerFeedback(0, false);
            }
            currentRoundRef.current += 1;
            if (currentRoundRef.current <= TOTAL_ROUNDS) {
              setCurrentRound(currentRoundRef.current);
              showNextHabit();
            } else {
              setGameState("finished");
            }
            return ROUND_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, currentHabit, showNextHabit, showCorrectAnswerFeedback]);

  return (
    <GameShell
      title="Reflex Green Habits"
      score={score}
      subtitle={gameState === "ready" ? "Tap on green habits quickly!" : gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : "Game Over!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={gameState === "finished"}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished" && score === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl">
            Start Game
          </button>
        )}
        {gameState === "playing" && currentHabit && (
          <div onClick={handleTap} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 cursor-pointer">
            <div className="text-4xl font-bold text-white mb-4">{currentHabit.word}</div>
            <p className="text-lg text-white/80">Time Left: {timeLeft}s</p>
            <p className="text-sm text-white/60 mt-2">Tap if it's a green habit!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexGreenHabits;

