import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ClarifyReflex = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-63";
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
  
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      text: "Statement: 'The thing is kinda big.' Does this need clarification?",
      options: [
        { id: "a", text: "Needs Clarification - Vague terms like 'kinda' and 'big'", emoji: "❓", description: "Unclear what 'thing' and 'big' mean", isCorrect: true },
        { id: "b", text: "Clear - Everyone understands", emoji: "✅", description: "Actually vague and ambiguous", isCorrect: false },
        { id: "c", text: "Perfectly specific", emoji: "📝", description: "Lacks specificity", isCorrect: false },
        { id: "d", text: "No clarification needed", emoji: "👍", description: "Uses vague language", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Statement: 'The sky is blue.' Does this need clarification?",
      options: [
        { id: "b", text: "Needs Clarification - What's blue?", emoji: "❓", description: "This statement is actually clear", isCorrect: false },
        { id: "a", text: "Clear - Specific and unambiguous", emoji: "☁️", description: "Factual and clear statement", isCorrect: true },
        { id: "c", text: "Vague and confusing", emoji: "🤷", description: "It's a clear fact", isCorrect: false },
        { id: "d", text: "Ambiguous statement", emoji: "🔄", description: "Not ambiguous at all", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Statement: 'It's sort of okay.' Does this need clarification?",
      options: [
        { id: "a", text: "Needs Clarification - 'Sort of' and 'okay' are vague", emoji: "❓", description: "Unclear what 'it' is and what 'okay' means", isCorrect: true },
        { id: "b", text: "Clear and specific", emoji: "✅", description: "Uses vague qualifiers", isCorrect: false },
        { id: "c", text: "Perfectly clear", emoji: "📝", description: "Ambiguous phrasing", isCorrect: false },
        { id: "d", text: "No questions needed", emoji: "👍", description: "Requires clarification", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Statement: '2 + 2 = 4.' Does this need clarification?",
      options: [
        { id: "b", text: "Needs Clarification - What does '=' mean?", emoji: "❓", description: "Mathematical statement is clear", isCorrect: false },
        { id: "c", text: "Vague and unclear", emoji: "🤷", description: "It's a clear mathematical fact", isCorrect: false },
        { id: "a", text: "Clear - Precise mathematical statement", emoji: "🔢", description: "Specific and unambiguous", isCorrect: true },
        { id: "d", text: "Ambiguous math", emoji: "🔄", description: "Not ambiguous", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Statement: 'Maybe tomorrow.' Does this need clarification?",
      options: [
        { id: "a", text: "Needs Clarification - What is 'maybe' about and what's happening 'tomorrow'?", emoji: "❓", description: "Very vague, missing context", isCorrect: true },
        { id: "b", text: "Clear - Everyone knows what this means", emoji: "✅", description: "Lacks context and specificity", isCorrect: false },
        { id: "c", text: "Specific and detailed", emoji: "📝", description: "Completely vague", isCorrect: false },
        { id: "d", text: "No clarification needed", emoji: "👍", description: "Highly ambiguous", isCorrect: false }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

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

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
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
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Clarify Reflex"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Detect vague statements!` : "Spot statements that need clarification!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="uvls"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="text-center text-white space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quickly identify statements that need clarification!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-lg font-bold text-white transition-transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Round {currentRound}/{TOTAL_ROUNDS}</span>
              <span className="text-yellow-400 font-bold text-lg">⏱️ {timeLeft}s</span>
              <span className="text-white/80">Score: {finalScore}/{TOTAL_ROUNDS}</span>
            </div>
            
            <p className="text-white text-lg md:text-xl mb-6 text-center">
              {currentQuestion.text}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map(option => {
                const showCorrect = answered && option.isCorrect;
                const showIncorrect = answered && !option.isCorrect;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                      showCorrect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : showIncorrect
                        ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h4 className="font-bold text-base mb-2">{option.text}</h4>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-4">Reflex Test Complete!</h3>
            <p className="text-white/90 text-xl mb-6">
              Score: {finalScore} / {TOTAL_ROUNDS}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              {finalScore >= 3 ? "Great Clarification Skills!" : "Keep Practicing!"}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClarifyReflex;
