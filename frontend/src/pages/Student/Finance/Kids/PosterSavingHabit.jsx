import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterSavingHabit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
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

  const posters = [
    {
      id: 1,
      title: "Save First, Spend Later",
      description: "A poster showing a piggy bank first, then fun activities",
      emoji: "💰→🎉",
      isCorrect: true,
      color: "from-green-500 to-emerald-600",
      borderColor: "border-green-400"
    },
    {
      id: 2,
      title: "Spend First, Save Later",
      description: "A poster showing fun activities first, then piggy bank",
      emoji: "🎉→💰",
      isCorrect: false,
      color: "from-orange-500 to-amber-600",
      borderColor: "border-orange-400"
    },
    {
      id: 3,
      title: "Save Nothing, Just Spend",
      description: "A poster showing only spending activities",
      emoji: "🛍️❌🏦",
      isCorrect: false,
      color: "from-red-500 to-pink-600",
      borderColor: "border-red-400"
    }
  ];

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster.id);
    
    if (poster.isCorrect) {
      // Update coins in real-time for correct answers
      setCoins(prevCoins => prevCoins + 1);
      showCorrectAnswerFeedback(1, true);
      
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    } else {
      // Show result immediately for incorrect
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/journal-of-saving");
  };

  const handleTryAgain = () => {
    setSelectedPoster(null);
    setShowResult(false);
    setCoins(0);
    resetFeedback();
  };

  const isCorrect = selectedPoster && posters.find(p => p.id === selectedPoster)?.isCorrect;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Art Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-lg sm:text-2xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {['🎨', '🖼️', '✨', '📌'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {showResult && isCorrect && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-cyan-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-cyan-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-cyan-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🎨</span>
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Poster: Saving Habit</span>
              <span className="xs:hidden">Saving Habit</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-cyan-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🎨</span>
            <span className="text-cyan-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Create a poster that promotes good saving habits!
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {!showResult ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Question Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-cyan-300 shadow-lg">
                <p className="text-gray-800 text-xs sm:text-sm md:text-base font-semibold text-center">
                  Which poster best promotes good saving habits?
                </p>
              </div>
              
              {/* Poster Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {posters.map(poster => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 ${
                      showResult && selectedPoster === poster.id
                        ? poster.isCorrect
                          ? `ring-2 ring-yellow-400 bg-gradient-to-r ${poster.color} border-2 border-yellow-400`
                          : `ring-2 ring-red-400 bg-gradient-to-r ${poster.color} border-2 border-red-400 opacity-75`
                        : showResult && !poster.isCorrect && selectedPoster !== poster.id
                        ? `bg-gradient-to-r ${poster.color} border-2 ${poster.borderColor} opacity-50`
                        : `bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 border-2 border-cyan-400`
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 text-center">{poster.emoji}</div>
                    <h3 className="font-bold text-xs sm:text-sm md:text-base text-white mb-1 sm:mb-2 text-center">{poster.title}</h3>
                    <p className="text-white/90 text-xs sm:text-sm text-center">{poster.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Results Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-cyan-300 shadow-xl text-center">
              {isCorrect ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎨</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">✨</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Creative Choice!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    "Save First, Spend Later" is the best message for building good financial habits!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                    This poster reminds us to save money first before spending on wants!
                  </p>
                  {isCorrect && (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                    >
                      <span className="hidden sm:inline">Continue to Next Level</span>
                      <span className="sm:hidden">Next Level</span> →
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">🤔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🎨</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Think About It!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    The best saving habit is to save money first, then spend on wants.
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 🎨
                  </button>
                  <p className="text-gray-600 text-xs sm:text-sm px-1">
                    Look for the poster that promotes saving before spending.
                  </p>
                </div>
              )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {showResult && isCorrect && (
        <GameOverModal
          score={coins}
          gameId="finance-kids-6"
          gameType="finance"
          totalLevels={1}
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

export default PosterSavingHabit;