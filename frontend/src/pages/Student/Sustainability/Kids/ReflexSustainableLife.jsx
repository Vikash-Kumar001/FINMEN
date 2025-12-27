import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexSustainableLife = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-88";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(1);
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
      console.log(`🎮 Reflex Sustainable Life game completed! Score: ${score}/${TOTAL_ROUNDS}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameState, score, gameId, nextGamePath, nextGameId]);

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !answered) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing' && !answered) {
      handleAnswer({ isCorrect: false }, true); // Timeout answer
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameState, answered]);

  const questions = [
    {
      id: 1,
      text: "Tap for 'Sustainable,' avoid 'Wasteful'",
      options: [
        { id: 'b', text: "Wasteful", emoji: "🗑️", isCorrect: false },
        { id: 'c', text: "Indifferent", emoji: "🤷", isCorrect: false },
        { id: 'a', text: "Sustainable", emoji: "🌱", isCorrect: true },
        { id: 'd', text: "Unsure", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Choose 'Save Energy' or avoid 'Waste Energy'",
      options: [
        { id: 'a', text: "Save Energy", emoji: "💡", isCorrect: true },
        { id: 'b', text: "Waste Energy", emoji: "⚡", isCorrect: false },
        { id: 'c', text: "It's OK", emoji: "🆗", isCorrect: false },
        { id: 'd', text: "No Choice", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Tap for 'Help Community,' avoid 'Ignore Community'",
      options: [
        { id: 'b', text: "Ignore Community", emoji: "🙈", isCorrect: false },
        { id: 'a', text: "Help Community", emoji: "🤝", isCorrect: true },
        { id: 'c', text: "Maybe Later", emoji: "⏰", isCorrect: false },
        { id: 'd', text: "Not My Problem", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Choose 'Protect Nature' or avoid 'Harm Nature'",
      options: [
        { id: 'b', text: "Harm Nature", emoji: "🔥", isCorrect: false },
        { id: 'c', text: "Not Important", emoji: "🤷", isCorrect: false },
        { id: 'a', text: "Protect Nature", emoji: "🌿", isCorrect: true },
        { id: 'd', text: "Don't Care", emoji: "😑", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Tap for 'Recycle' or avoid 'Throw Away'",
      options: [
        { id: 'b', text: "Throw Away", emoji: "🗑️", isCorrect: false },
        { id: 'c', text: "Ignore", emoji: "🙈", isCorrect: false },
        { id: 'd', text: "Don't Know", emoji: "🤔", isCorrect: false },
        { id: 'a', text: "Recycle", emoji: "♻️", isCorrect: true },
      ]
    }
  ];

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
  };

  const handleAnswer = (option, isTimeout = false) => {
    if (answered || gameState !== 'playing') return;
    
    setAnswered(true);
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else if (!isTimeout) {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentRoundRef.current < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
        setTimeLeft(ROUND_TIME);
        setAnswered(false);
        resetFeedback();
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Sustainable Life"
      subtitle={gameState === "playing" ? `Round ${currentRound} of ${TOTAL_ROUNDS}` : gameState === "finished" ? "Game Complete!" : "Act fast!"}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalLevels={TOTAL_ROUNDS}
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished" && score >= 3}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/80 mb-6 text-lg">Choose the sustainable action quickly! You have {ROUND_TIME} seconds per round</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
            <p className="text-white/60 mt-4">You'll have {ROUND_TIME} seconds per round</p>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className="text-white">
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}/{TOTAL_ROUNDS}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.text}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !answered && handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {TOTAL_ROUNDS} rounds correct!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Sustainable choices help protect our environment and community!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {TOTAL_ROUNDS} rounds correct.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Making sustainable choices helps our planet and community!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexSustainableLife;