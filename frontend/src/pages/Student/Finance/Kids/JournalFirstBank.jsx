import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalFirstBank = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [entries, setEntries] = useState(Array(5).fill(""));
  const [showResult, setShowResult] = useState(false);
  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

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

  const prompts = [
    {
      id: 1,
      text: "If you visit a bank for the first time, what is one thing you would like to see or learn there?",
      minLength: 10,
    },
    {
      id: 2,
      text: "How do you think a bank helps people and families in real life?",
      minLength: 10,
    },
    {
      id: 3,
      text: "Imagine you save your money in a bank. How would that make you feel, and why?",
      minLength: 10,
    },
    {
      id: 4,
      text: "What is one rule you would follow to keep your money safe when you visit a bank?",
      minLength: 10,
    },
    {
      id: 5,
      text: "After visiting a bank, what is one important thing you would remember about money and safety?",
      minLength: 10,
    },
  ];

  const examples = [
    "If I visit a bank for the first time, I want to see how people deposit money and how the machines count it.",
    "A bank helps people by keeping their money safe and letting them take it out when they really need it.",
    "Saving my money in a bank would make me feel proud and relaxed because I know it is safe and not getting lost.",
    "One rule I would follow is to never share my PIN or password with anyone, not even close friends.",
    "After visiting a bank, I would remember that money should be saved carefully and not shared with strangers."
  ];

  const handleSubmit = () => {
    if (
      entries[currentEntry].trim().length >=
      prompts[currentEntry].minLength
    ) {
      if (currentEntry < prompts.length - 1) {
        setCurrentEntry((prev) => prev + 1);
      } else {
        setCoins(5);
        setShowResult(true);
      }
    }
  };

  const handleTextChange = (value) => {
    const newEntries = [...entries];
    newEntries[currentEntry] = value;
    setEntries(newEntries);
  };

  const allEntriesCompleted = entries.every(
    (entry, index) =>
      entry.trim().length >= prompts[index].minLength
  );

  useEffect(() => {
    if (showResult && allEntriesCompleted) {
      showCorrectAnswerFeedback(1, true);
    }
  }, [showResult, allEntriesCompleted, showCorrectAnswerFeedback]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
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
            {["📝", "🏦", "💳", "💰", "🔒", "🎯"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-blue-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-blue-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-blue-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">
              📝
            </span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Journal of First Bank Visit</span>
              <span className="xs:hidden">First Bank Visit</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-blue-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-blue-700 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Entry {currentEntry + 1} of {prompts.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {!showResult ? (
            <div className="space-y-2 sm:space-y-3">
              {/* Journal Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
                  🏦
                </div>
                <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-semibold leading-relaxed px-1">
                  {prompts[currentEntry].text}
                </p>

                {/* Textarea + Example */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <textarea
                      value={entries[currentEntry]}
                      onChange={(e) => handleTextChange(e.target.value)}
                      placeholder="Write your journal entry here... (minimum 10 characters)"
                      className="w-full p-3 sm:p-4 rounded-xl text-gray-800 text-sm sm:text-base bg-white border-2 border-blue-200 focus:border-blue-400 focus:outline-none resize-none"
                      rows={6}
                    />
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      {entries[currentEntry].length} /{" "}
                      {prompts[currentEntry].minLength} characters minimum
                    </p>
                  </div>

                  {/* Example block */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-2 sm:p-3 text-left">
                    <h4 className="font-bold text-blue-700 text-xs sm:text-sm mb-2">
                      Example Entry:
                    </h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {examples[currentEntry]}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    entries[currentEntry].trim().length <
                    prompts[currentEntry].minLength
                  }
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all hover:scale-105 shadow-lg"
                >
                  {currentEntry < prompts.length - 1
                    ? "Next Entry"
                    : "Finish Journal"}
                </button>

                {/* Progress Indicator - Inside Card */}
                <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {prompts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index < currentEntry
                          ? "bg-green-500 w-5 sm:w-6"
                          : index === currentEntry
                          ? "bg-blue-500 w-5 sm:w-6 animate-pulse"
                          : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                📝🏦
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">
                Bank Journal Star!
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You completed all {prompts.length} journal entries!
                <br />
                Great reflection on how banks keep money safe and help people! 🎯
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Visiting a bank teaches you to save safely, follow rules, and
                protect your money.
              </p>
              {allEntriesCompleted && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                >
                  <span className="hidden sm:inline">
                    Continue to Next Level
                  </span>
                  <span className="sm:hidden">Next Level</span> →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confetti and Score Flash */}
      {showAnswerConfetti && <Confetti duration={2000} />}
      {flashPoints > 0 && <ScoreFlash points={flashPoints} />}

      {/* Game Over Modal */}
      {showResult && coins === 5 && (
        <GameOverModal
          score={5}
          totalQuestions={prompts.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-47"
          gameType="finance"
          showConfetti={true}
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

export default JournalFirstBank;