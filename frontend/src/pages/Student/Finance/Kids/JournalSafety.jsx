import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalSafety = () => {
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
      title: "Avoiding cheats",
      question: "Write one clear way you can avoid being cheated with money.",
      placeholder: "Example: I can avoid being cheated by always checking the bill before I pay…",
      minLength: 20,
    },
    {
      id: 2,
      title: "Staying safe with money",
      question: "How do you stay safe with money in shops or online?",
      placeholder: "Example: I stay safe by not sharing card or bank details with strangers…",
      minLength: 20,
    },
    {
      id: 3,
      title: "A scam I avoided",
      question:
        "Describe a time (real or imagined) when you or someone avoided a money scam.",
      placeholder: "Example: I saw a fake message and I checked with my parents before…",
      minLength: 20,
    },
    {
      id: 4,
      title: "What I learned about safety",
      question: "What is one important thing you learned about keeping money safe?",
      placeholder: "Example: I learned that I should never share OTP or PIN because…",
      minLength: 20,
    },
    {
      id: 5,
      title: "How safety feels",
      question: "How does it feel when you make a safe and smart money choice?",
      placeholder: "Example: I feel proud and relaxed because…",
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
    <div className="h-screen w-full bg-gradient-to-br from-rose-100 via-red-50 to-amber-100 flex flex-col relative overflow-hidden">
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
            {["🔒", "🛡️", "📱", "💳", "⚠️", "👨‍👩‍👧"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/40 backdrop-blur-sm border-b border-rose-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-rose-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-rose-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-rose-500" />
            <span className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Journal of Safety</span>
              <span className="xs:hidden">Safety Journal</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-rose-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-rose-800 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-rose-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Entry {currentEntryIndex + 1} of {prompts.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {!showResult ? (
            <div className="space-y-2 sm:space-y-3">
              {/* Journal Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-rose-200 shadow-xl text-left">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-xl md:text-2xl">🔒</span>
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-rose-700">
                    Safety Journal Entry {currentEntryIndex + 1}: {currentPrompt.title}
                  </span>
                </div>
                <p className="text-rose-950 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                  {currentPrompt.question}
                </p>

                <textarea
                  value={currentText}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder={currentPrompt.placeholder}
                  className="w-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] p-3 sm:p-4 rounded-xl border-2 border-rose-200 bg-rose-50/70 text-rose-900 placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-y text-xs sm:text-sm md:text-base"
                />

                {/* Character counter */}
                <div className="flex items-center justify-between mt-2 sm:mt-3 text-[11px] sm:text-xs md:text-sm text-rose-800">
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
                  className="mt-3 sm:mt-4 px-8 sm:px-10 py-2.5 sm:py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-sm sm:text-base md:text-lg transition-all hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
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
                          ? "bg-rose-500 w-5 sm:w-6 animate-pulse"
                          : "bg-rose-200 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                🔒🛡️✨
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-700 mb-2 sm:mb-3">
                Safety Star!
              </h3>
              <p className="text-rose-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You completed {finalScore} out of {prompts.length} safety reflections — great
                thinking about scams and money safety!
                <br />
                Your journal shows you know how to protect yourself and ask adults for help
                when something looks wrong.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-rose-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Money safety means checking messages, bills, and offers — and never
                sharing private details with strangers.
              </p>
              {allEntriesCompleted && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:from-rose-600 hover:via-red-600 hover:to-amber-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
          gameId="finance-kids-87"
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

export default JournalSafety;