import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexMoneyChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const timerRef = useRef(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Calculate back path
  const resolvedBackPath = useMemo(() => {
    if (location.state?.returnPath) {
      return location.state.returnPath;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "student" && pathSegments.length >= 3) {
      const categoryKey = pathSegments[1];
      const ageKey = pathSegments[2];

      const categorySlugMap = {
        finance: "financial-literacy",
        "financial-literacy": "financial-literacy",
      };

      const ageSlugMap = {
        kid: "kids",
        kids: "kids",
      };

      const mappedCategory = categorySlugMap[categoryKey] || categoryKey;
      const mappedAge = ageSlugMap[ageKey] || ageKey;

      return `/games/${mappedCategory}/${mappedAge}`;
    }

    return "/games";
  }, [location.pathname, location.state]);

  const handleGameOverClose = () => {
    navigate(resolvedBackPath);
  };

  const words = [
    { word: "DEPOSIT", isCorrect: true, emoji: "📥" },
    { word: "THROW AWAY", isCorrect: false, emoji: "🗑️" },
    { word: "SAVE", isCorrect: true, emoji: "💰" },
    { word: "WASTE", isCorrect: false, emoji: "❌" },
    { word: "BANK", isCorrect: true, emoji: "🏦" },
    { word: "SPEND", isCorrect: false, emoji: "💸" },
    { word: "INVEST", isCorrect: true, emoji: "📈" },
    { word: "LOSE", isCorrect: false, emoji: "📉" }
  ];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState("finished");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(30);
    setScore(0);
    setCoins(0);
    setCurrentWord("");
    resetFeedback();
    // Show first word after state updates
    setTimeout(() => {
      showNextWord();
    }, 100);
  };

  const showNextWord = () => {
    if (gameState !== "playing") return;
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  };

  const handleTap = (isSave) => {
    if (gameState !== "playing") return;
    
    if (isSave === currentWord.isCorrect) {
      setScore(prev => prev + 1);
      // Update coins in real-time for correct answers
      setCoins(prevCoins => prevCoins + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show next word after a short delay
    setTimeout(showNextWord, 300);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Floating Money Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-lg sm:text-2xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {['💰', '⚡', '🎯', '💸'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {gameState === "finished" && score > 0 && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-indigo-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-indigo-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-indigo-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">⚡</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Reflex Money Choice</span>
              <span className="xs:hidden">Money Choice</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-indigo-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-indigo-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">

        {/* Game Content */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center min-h-0">
          {gameState === "ready" && (
            <div className="space-y-3 sm:space-y-4">
              {/* Get Ready Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-indigo-300 shadow-xl">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">⚡</div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700 mb-3 sm:mb-4">Get Ready!</h3>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 text-left">
                  <div className="flex items-start gap-2 sm:gap-3 bg-indigo-50 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">📥</span>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                      Tap <span className="font-bold text-green-600">"DEPOSIT"</span> when you see words related to <span className="font-bold text-green-600">saving money</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3 bg-red-50 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🗑️</span>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                      Tap <span className="font-bold text-red-600">"THROW AWAY"</span> when you see words related to <span className="font-bold text-red-600">wasting money</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-2 sm:p-3 mb-4 sm:mb-5">
                  <p className="text-gray-800 text-xs sm:text-sm md:text-base font-semibold">
                    ⏱️ You have <span className="text-yellow-600 font-bold">30 seconds</span> to get as many correct as possible!
                  </p>
                </div>
                
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2.5 sm:py-3 md:py-3.5 px-6 sm:px-8 md:px-10 rounded-full text-sm sm:text-base md:text-lg font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Start Game ⚡
                </button>
              </div>
            </div>
          )}

          {gameState === "playing" && (
            <div className="space-y-3 sm:space-y-4">
              {/* Timer and Score */}
              <div className="flex justify-between items-center bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-indigo-300 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">⏱️</span>
                  <div className="text-indigo-700">
                    <span className="font-bold text-xs sm:text-sm md:text-base">Time:</span>{" "}
                    <span className="text-lg sm:text-xl md:text-2xl font-bold">{timeLeft}s</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🎯</span>
                  <div className="text-indigo-700">
                    <span className="font-bold text-xs sm:text-sm md:text-base">Score:</span>{" "}
                    <span className="text-lg sm:text-xl md:text-2xl font-bold">{score}</span>
                  </div>
                </div>
              </div>

              {/* Word Display */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border-2 border-indigo-300 shadow-xl">
                {currentWord && (
                  <>
                    <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4">{currentWord.emoji}</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-700 mb-4 sm:mb-6">
                      {currentWord.word}
                    </div>
                  </>
                )}
                
                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => handleTap(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 border-green-400"
                  >
                    <div className="text-3xl sm:text-4xl mb-2">📥</div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl">DEPOSIT</h3>
                  </button>
                  
                  <button
                    onClick={() => handleTap(false)}
                    className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 border-red-400"
                  >
                    <div className="text-3xl sm:text-4xl mb-2">🗑️</div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl">THROW AWAY</h3>
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameState === "finished" && (
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-indigo-300 shadow-xl text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🏆</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700 mb-3 sm:mb-4">Game Over!</h3>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
                You got <span className="font-bold text-indigo-600">{score}</span> correct answers!
              </p>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 sm:mb-5">
                Great job testing your money knowledge! 💰
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-4 sm:mb-5 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {gameState === "finished" && (
        <GameOverModal
          score={5}
          gameId="finance-kids-9"
          gameType="finance"
          totalLevels={10}
          coinsPerLevel={coinsPerLevel}
          isReplay={location?.state?.isReplay || false}
          onClose={handleGameOverClose}
        />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default ReflexMoneyChoice;