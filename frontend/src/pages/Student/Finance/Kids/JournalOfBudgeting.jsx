import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfBudgeting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [journalEntry, setJournalEntry] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [entries, setEntries] = useState([]);
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

  const stages = [
    {
      question: 'Write: "One time I planned my money wisely was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Budgeting helps me because ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I saved money for ___ and felt ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A smart budgeting tip I learned is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Planning my money makes me feel ___."',
      minLength: 10,
    },
  ];

  const examples = [
    "One time I planned my money wisely was when I saved ₹50 each week for a month to buy a bicycle.",
    "Budgeting helps me because I can see where my money goes and save for things I really want.",
    "I saved money for a new book and felt proud when I finally bought it with my savings.",
    "A smart budgeting tip I learned is to divide my money into needs, wants, and savings.",
    "Planning my money makes me feel confident and in control of my finances."
  ];

  const handleSubmit = () => {
    if (journalEntry.trim().length >= stages[currentStage].minLength) {
      const newEntries = [...entries, journalEntry];
      setEntries(newEntries);
      
      if (currentStage < stages.length - 1) {
        setCurrentStage(prev => prev + 1);
        setJournalEntry("");
        showCorrectAnswerFeedback(1, true);
      } else {
        // Update coins in real-time for completing the journal entry
        setCoins(prevCoins => prevCoins + 1);
        showCorrectAnswerFeedback(1, true);
        setTimeout(() => {
          setShowResult(true);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    navigate(resolvedBackPath);
  };

  const handleTryAgain = () => {
    setJournalEntry("");
    setCurrentStage(0);
    setShowResult(false);
    setCoins(0);
    setEntries([]);
    resetFeedback();
  };

  const isValidEntry = journalEntry.trim().length >= stages[currentStage].minLength;
  const allEntriesCompleted = entries.length === stages.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Journal Elements Background */}
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
            {['📖', '✍️', '📝', '💰'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {showResult && allEntriesCompleted && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-purple-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-purple-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-purple-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">📖</span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Journal of Budgeting</span>
              <span className="xs:hidden">Budgeting</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-purple-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">📖</span>
            <span className="text-purple-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Entry {currentStage + 1} of {stages.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {!showResult ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Journal Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-xl">
                {/* Journal Icon */}
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">📖</div>
                
                <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                  {stages[currentStage].question}
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <textarea
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      placeholder="Start writing your journal entry here... (minimum 10 characters)"
                      className="w-full h-28 sm:h-32 md:h-36 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white border-2 border-purple-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none text-sm sm:text-base"
                    />
                    
                    <div className="flex justify-between items-center mt-2 sm:mt-3">
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {journalEntry.length}/{stages[currentStage].minLength} characters
                      </span>
                      <button
                        onClick={handleSubmit}
                        disabled={!isValidEntry}
                        className={`py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all ${
                          isValidEntry
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {currentStage < stages.length - 1 ? "Next Entry" : "Submit Journal"}
                      </button>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <h4 className="font-bold text-purple-700 text-xs sm:text-sm mb-2 text-left">Example Entry:</h4>
                    <p className="text-gray-700 text-xs sm:text-sm text-left leading-relaxed">
                      {examples[currentStage]}
                    </p>
                  </div>
                </div>

                {/* Progress Indicator - Inside Card */}
                <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {stages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index < currentStage
                          ? "bg-green-500 w-5 sm:w-6"
                          : index === currentStage
                          ? "bg-purple-500 w-5 sm:w-6 animate-pulse"
                          : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-xl text-center">
                {allEntriesCompleted ? (
                  <div>
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">📖</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">✨</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Budgeting Pro!</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      You earned {entries.length} out of {stages.length} — awesome planning!
                      <br />
                      You've written great reflections on budgeting!
                    </p>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">💰</span>
                      <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                      Lesson: Budgeting makes your money work smarter!
                    </p>
                    {allEntriesCompleted && (
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                      >
                        <span className="hidden sm:inline">Continue to Next Level</span>
                        <span className="sm:hidden">Next Level</span> →
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">📝</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">📖</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Writing!</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      Try writing more about your budgeting experience. Write at least {stages[currentStage].minLength} characters.
                    </p>
                    <button
                      onClick={handleTryAgain}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                    >
                      Try Again 📖
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {showResult && allEntriesCompleted && (
        <GameOverModal
          score={5}
          gameId="finance-kids-27"
          gameType="finance"
          totalLevels={1}
          coinsPerLevel={5}
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

export default JournalOfBudgeting;
