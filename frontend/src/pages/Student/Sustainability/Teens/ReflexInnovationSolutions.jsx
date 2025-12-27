import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexInnovationSolutions = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const gameId = "sustainability-teens-94";
  const games = getSustainabilityTeenGames({});
  const currentGameIndex = games.findIndex(game => game.id === gameId);
  const nextGame = games[currentGameIndex + 1];
  const nextGamePath = nextGame ? nextGame.path : "/games/sustainability/teens";
  const nextGameId = nextGame ? nextGame.id : null;

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  const questions = [
    {
      id: 1,
      text: "Which innovation solves water scarcity?",
      options: [
        { id: 'a', text: "Desalination Tech", emoji: "💧", isCorrect: true },
        { id: 'b', text: "Coal Plant", emoji: "🏭", isCorrect: false },
        { id: 'c', text: "Plastic Bottles", emoji: "🥤", isCorrect: false },
        { id: 'd', text: "Gas Car", emoji: "⛽", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which technology addresses climate change?",
      options: [
        { id: 'a', text: "Carbon Capture", emoji: "🌱", isCorrect: true },
        { id: 'b', text: "Oil Refinery", emoji: "🛢️", isCorrect: false },
        { id: 'c', text: "Coal Mine", emoji: "⛏️", isCorrect: false },
        { id: 'd', text: "Plastic Factory", emoji: "🏭", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Which innovation helps food security?",
      options: [
        { id: 'a', text: "Vertical Farming", emoji: "🌱", isCorrect: true },
        { id: 'b', text: "Deforestation", emoji: "🪚", isCorrect: false },
        { id: 'c', text: "Overfishing", emoji: "🎣", isCorrect: false },
        { id: 'd', text: "Soil Erosion", emoji: "🌍", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Which technology reduces waste?",
      options: [
        { id: 'a', text: "Plastic Recycling", emoji: "♻️", isCorrect: true },
        { id: 'b', text: "Landfill Expansion", emoji: "🗑️", isCorrect: false },
        { id: 'c', text: "Incineration", emoji: "🔥", isCorrect: false },
        { id: 'd', text: "Single Use", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Which innovation improves air quality?",
      options: [
        { id: 'a', text: "Electric Public Transit", emoji: "🚌", isCorrect: true },
        { id: 'b', text: "Gas Stations", emoji: "⛽", isCorrect: false },
        { id: 'c', text: "Coal Plants", emoji: "🏭", isCorrect: false },
        { id: 'd', text: "Traffic Jams", emoji: "🚗", isCorrect: false }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !answered) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !answered) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, timeLeft, answered]);

  useEffect(() => {
    if (gameState === "playing") {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
      resetFeedback();
    }
  }, [currentRound, gameState]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentRound(1);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (gameState !== "playing" || answered) return;

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  };

  const handleTimeUp = () => {
    if (answered) return; // Prevent double handling if answer was just submitted
    
    setAnswered(true);
    resetFeedback();
    showCorrectAnswerFeedback(0, false);
    
    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Innovation Solutions"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: React fast!` : "Quickly identify green technology solutions to problems!"}
      onNext={() => navigate(nextGamePath)}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      maxScore={TOTAL_ROUNDS}
      showConfetti={gameState === "finished"}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] max-w-4xl mx-auto px-4 py-4">
        {gameState === "ready" && (
          <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 w-full max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Innovation Solutions Challenge</h2>
            <p className="text-white/90 mb-6">Test your reflexes to identify green technology solutions!</p>
            <p className="text-white/70 mb-2">• {TOTAL_ROUNDS} rounds</p>
            <p className="text-white/70 mb-6">• {ROUND_TIME} seconds per round</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-6 w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Round {currentRound}/{TOTAL_ROUNDS}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-yellow-400 font-bold">Score: {score}</span>
                  <div className={`text-xl font-bold px-3 py-1 rounded-lg ${
                    timeLeft > 5 ? 'text-green-400' : timeLeft > 2 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              <p className="text-white text-xl mb-6 text-center">
                {currentQuestion.text}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-center">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 w-full max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Game Complete!</h2>
            <p className="text-white/90 mb-2">Your score: {score}/{TOTAL_ROUNDS}</p>
            <p className="text-white/70 mb-6">Great reflexes identifying innovation solutions!</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(nextGamePath)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Next Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexInnovationSolutions;