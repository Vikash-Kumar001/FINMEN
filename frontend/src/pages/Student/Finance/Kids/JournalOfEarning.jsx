import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfEarning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

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
      title: "Ways I can earn",
      question: "Write one simple way you can earn money (at home or later in life).",
      placeholder: "Example: I can earn by walking the neighbor’s dog or by…",
      minLength: 20,
    },
    {
      id: 2,
      title: "How earning feels",
      question: "How does it feel when you earn money by helping or working?",
      placeholder: "Example: It feels good because…",
      minLength: 20,
    },
    {
      id: 3,
      title: "An earning moment",
      question:
        "Describe a time (real or imagined) when you earned money or a reward by helping.",
      placeholder: "Example: I helped by… and I learned that…",
      minLength: 20,
    },
    {
      id: 4,
      title: "Good things about earning",
      question: "What is one good thing about earning your own money?",
      placeholder: "Example: It helps me… or it teaches me…",
      minLength: 20,
    },
    {
      id: 5,
      title: "Earning and responsibility",
      question:
        "How does earning money teach you to be responsible with time, effort, and spending?",
      placeholder: "Example: It teaches me responsibility because…",
      minLength: 20,
    },
  ];

  const currentPrompt = prompts[currentEntryIndex];
  const currentText = entry ?? entries[currentPrompt.id] ?? "";
  const currentLength = currentText.trim().length;
  const minLength = currentPrompt.minLength;
  const isCurrentValid = currentLength >= minLength;

  const handleSubmit = () => {
    resetFeedback();
    if (!isCurrentValid) return;

    const updatedEntries = {
      ...entries,
      [currentPrompt.id]: currentText.trim(),
    };
    setEntries(updatedEntries);

    const newAnswers = [
      ...answers,
      { promptId: currentPrompt.id, completed: true },
    ];
    setAnswers(newAnswers);

    showCorrectAnswerFeedback(1, true);

    if (currentEntryIndex < prompts.length - 1) {
      setTimeout(() => {
        setCoins((prev) => prev + 1);
        setCurrentEntryIndex((prev) => prev + 1);
        setEntry(updatedEntries[prompts[currentEntryIndex + 1].id] || "");
      }, 600);
    } else {
      setTimeout(() => {
        const completedCount = newAnswers.filter((a) => a.completed).length;
        setFinalScore(completedCount);
        setCoins(5);
        setShowResult(true);
      }, 600);
    }
  };

  const allEntriesCompleted = answers.length === prompts.length;

  useEffect(() => {
    setEntry(entries[currentPrompt.id] || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEntryIndex]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-100 flex flex-col relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
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
            {["💸", "🧹", "📋", "💼", "⭐", "🏠"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/40 backdrop-blur-sm border-b border-sky-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-sky-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-sky-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-sky-500" />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Journal of Earning</span>
              <span className="xs:hidden">Earning Journal</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-sky-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-sky-800 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-sky-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Entry {currentEntryIndex + 1} of {prompts.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {!showResult ? (
            <div className="space-y-2 sm:space-y-3">
              {/* Journal Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-sky-200 shadow-xl text-left">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-sky-500" />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-sky-700">
                    Earning Journal Entry {currentEntryIndex + 1}: {currentPrompt.title}
                  </span>
                </div>
                <p className="text-sky-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                  {currentPrompt.question}
                </p>

                <textarea
                  value={currentText}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder={currentPrompt.placeholder}
                  className="w-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] p-3 sm:p-4 rounded-xl border-2 border-sky-200 bg-sky-50/60 text-sky-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-y text-xs sm:text-sm md:text-base"
                />

                {/* Character counter */}
                <div className="flex items-center justify-between mt-2 sm:mt-3 text-[11px] sm:text-xs md:text-sm text-sky-800">
                  <span>
                    {currentLength}/{minLength} characters (min.)
                  </span>
                  {!isCurrentValid && (
                    <span className="text-red-500">
                      Write a bit more to complete this entry.
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isCurrentValid}
                  className="mt-3 sm:mt-4 px-8 sm:px-10 py-2.5 sm:py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold text-sm sm:text-base md:text-lg transition-all hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {currentEntryIndex < prompts.length - 1
                    ? "Save Entry & Continue"
                    : "Finish Journal"}
                </button>

                {/* Progress Indicator - Inside Card */}
                <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {prompts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index < currentEntryIndex
                          ? "bg-green-500 w-5 sm:w-6"
                          : index === currentEntryIndex
                          ? "bg-sky-500 w-5 sm:w-6 animate-pulse"
                          : "bg-sky-200 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-sky-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                💸✨
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-700 mb-2 sm:mb-3">
                Earning Expert!
              </h3>
              <p className="text-sky-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You completed {finalScore} out of {prompts.length} reflections — awesome
                ideas about earning!
                <br />
                Your journal shows you understand that earning takes effort, honesty, and
                responsibility. 💼
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-sky-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: When you earn money yourself, you learn to value time, effort, and
                every rupee you spend.
              </p>
              {allEntriesCompleted && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 hover:from-sky-600 hover:via-blue-600 hover:to-emerald-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
      {finalScore > 0 && coins === 5 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={prompts.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-77"
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

export default JournalOfEarning;