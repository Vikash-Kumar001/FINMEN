import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexSavings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const [reactionTime, setReactionTime] = useState(0);
  const startTimeRef = useRef(0);
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
    { word: "SAVE", isCorrect: true },
    { word: "WASTE", isCorrect: false },
    { word: "SAVE", isCorrect: true },
    { word: "SPEND", isCorrect: false },
    { word: "SAVE", isCorrect: true },
    { word: "LOSE", isCorrect: false },
    { word: "SAVE", isCorrect: true },
    { word: "THROW", isCorrect: false }
  ];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState("finished");
      // Award 5 coins when game finishes
      setCoins(5);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(30);
    setScore(0);
    showNextWord();
  };

  const showNextWord = () => {
    if (gameState !== "playing") return;
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    startTimeRef.current = Date.now();
  };

  const handleTap = (isSave) => {
    if (gameState !== "playing") return;
    
    const endTime = Date.now();
    const reaction = endTime - startTimeRef.current;
    setReactionTime(reaction);
    
    if (isSave === currentWord.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show next word after a short delay
    setTimeout(showNextWord, 500);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/puzzle-save-or-spend");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 flex flex-col relative overflow-hidden">
      {/* Floating Speed Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
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
            {['⚡', '💨', '🎯', '🔥'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {gameState === "finished" && score > 0 && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-orange-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-orange-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-orange-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">⚡</span>
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Reflex Savings</span>
              <span className="xs:hidden">Reflex Save</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-orange-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">⚡</span>
            <span className="text-orange-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {gameState === "ready" && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Tap quickly for 'Save' words, avoid 'Waste' words!
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center min-h-0">
          {gameState === "ready" && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-orange-300 shadow-xl text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-5 animate-bounce">⚡</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-4 sm:mb-5">Get Ready!</h3>
              
              <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">💰</div>
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed pt-1">
                    Tap the <span className="font-bold text-green-600">"SAVE"</span> button when you see <span className="font-bold text-green-600">"SAVE"</span> words.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">🗑️</div>
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed pt-1">
                    Don't tap when you see <span className="font-bold text-red-600">"WASTE"</span> words.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 border-2 border-orange-200">
                <p className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold">
                  ⏱️ You have <span className="text-orange-600 font-bold">30 seconds</span> to get as many correct as possible!
                </p>
              </div>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                Start Game ⚡
              </button>
            </div>
          )}

          {gameState === "playing" && (
            <div className="space-y-2 sm:space-y-3">
              {/* Timer and Score */}
              <div className="flex justify-between items-center bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 border-2 border-orange-300 shadow-lg">
                <div className="text-gray-800">
                  <span className="font-bold text-xs sm:text-sm md:text-base">Time:</span>{" "}
                  <span className={`text-sm sm:text-base md:text-lg font-bold ${
                    timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-orange-600"
                  }`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="text-gray-800">
                  <span className="font-bold text-xs sm:text-sm md:text-base">Score:</span>{" "}
                  <span className="text-sm sm:text-base md:text-lg font-bold text-green-600">{score}</span>
                </div>
              </div>

              {/* Word Display */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-orange-300 shadow-xl text-center">
                <div className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 ${
                  currentWord.isCorrect ? "text-green-600" : "text-red-600"
                } animate-pulse`}>
                  {currentWord.word}
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <button
                    onClick={() => handleTap(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 border-green-400"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">💰</div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl">SAVE</h3>
                  </button>
                  
                  <button
                    onClick={() => handleTap(false)}
                    className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 border-red-400"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">🗑️</div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl">WASTE</h3>
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameState === "finished" && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-orange-300 shadow-xl text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">🏆</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mb-2 sm:mb-3">Game Over!</h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                You got <span className="font-bold text-green-600">{score}</span> correct answers!
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Great job testing your reflexes!
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
              </div>
              {score > 0 && (
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                >
                  <span className="hidden sm:inline">Continue to Next Level</span>
                  <span className="sm:hidden">Next Level</span> →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {gameState === "finished" && score > 0 && (
        <GameOverModal
          score={5}
          gameId="finance-kids-3"
          gameType="finance"
          totalLevels={1}
          coinsPerLevel={1}
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

export default ReflexSavings;