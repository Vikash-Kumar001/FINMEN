import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Puzzle } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleHonestVsFraud = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // Back path calculation
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

  const questions = [
    {
      id: 1,
      prompt: "Match the honest shop to the right outcome.",
      questionTitle: "Fair Shop → ?",
      options: [
        {
          text: "Fair Shop = Trust 🤝",
          description: "You feel safe buying here again and again.",
          correct: true,
        },
        {
          text: "Fair Shop = Loss 😞",
          description: "You always lose money here.",
          correct: false,
        },
        {
          text: "Fair Shop = Scam 🚨",
          description: "They try to cheat customers.",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      prompt: "Think about a cheating shop.",
      questionTitle: "Cheat Shop → ?",
      options: [
        {
          text: "Cheat Shop = Loss 😞",
          description: "You lose money because prices are not fair.",
          correct: true,
        },
        {
          text: "Cheat Shop = Trust 🤝",
          description: "You happily shop here again.",
          correct: false,
        },
        {
          text: "Cheat Shop = Gain 💰",
          description: "You always get extra money here.",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      prompt: "Match the honest seller to what they do.",
      questionTitle: "Honest Seller → ?",
      options: [
        {
          text: "Honest Seller = Fair Price 💸",
          description: "They charge the right amount every time.",
          correct: true,
        },
        {
          text: "Honest Seller = Overcharge 📈",
          description: "They secretly raise the price.",
          correct: false,
        },
        {
          text: "Honest Seller = No Sale 🛑",
          description: "They never sell anything.",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      prompt: "Match the fraud shop to what it does.",
      questionTitle: "Fraud Shop → ?",
      options: [
        {
          text: "Fraud Shop = Scam 🚨",
          description: "They trick people and steal money.",
          correct: true,
        },
        {
          text: "Fraud Shop = Trust 🤝",
          description: "Everyone trusts them fully.",
          correct: false,
        },
        {
          text: "Fraud Shop = Savings 💰",
          description: "They help you save money safely.",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      prompt: "Why is shopping at honest stores important?",
      questionTitle: "Honest Stores → ?",
      options: [
        {
          text: "Builds trust and saves money 📚",
          description: "You feel safe and keep your money protected.",
          correct: true,
        },
        {
          text: "Gets you more toys 🧸",
          description: "You always get extra toys for free.",
          correct: false,
        },
        {
          text: "Makes shopping fun 🎉",
          description: "It is only about fun, not safety or money.",
          correct: false,
        },
      ],
    },
  ];

  const currentData = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleOptionClick = (option, index) => {
    if (showResult) return;

    const correct = option.correct;
    setSelectedOptionIndex(index);
    setIsCorrect(correct);

    const newAnswers = [...answers, { questionId: currentData.id, correct }];
    setAnswers(newAnswers);

    resetFeedback();
    if (correct) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setShowResult(true);
    }, correct ? 900 : 0);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
    }
  };

  const allQuestionsAnswered = answers.length === totalQuestions;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-violet-100 via-fuchsia-50 to-rose-100 flex flex-col relative overflow-hidden">
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
            {["🧩", "🤝", "🚨", "💰", "🛍️", "✅"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/40 backdrop-blur-sm border-b border-violet-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-violet-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-violet-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <Puzzle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-violet-500" />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Puzzle: Honest vs Fraud</span>
              <span className="xs:hidden">Honest vs Fraud</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-violet-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-violet-800 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {/* Question Counter (outside card) */}
        {finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-violet-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        )}

        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Puzzle Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-violet-200 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Puzzle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-500" />
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-violet-700">
                      Match the honest and fraud clues
                    </span>
                  </div>
                  <p className="text-violet-950 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 font-semibold leading-relaxed px-1">
                    {currentData.prompt}
                  </p>
                  <p className="text-violet-800 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-bold px-1">
                    {currentData.questionTitle}
                  </p>

                  {/* Options in single row / responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                    {currentData.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(option, index)}
                        disabled={showResult}
                        className={`group relative flex flex-col items-start text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all shadow-sm bg-violet-50/70 hover:bg-violet-100 ${
                          selectedOptionIndex === index && showResult
                            ? option.correct
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-rose-500 bg-rose-50"
                            : "border-violet-200"
                        }`}
                      >
                        <span className="font-semibold text-xs sm:text-sm md:text-base text-violet-900">
                          {option.text}
                        </span>
                        <span className="mt-1 text-[11px] sm:text-xs md:text-sm text-violet-700 leading-snug">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Progress Dots inside card */}
                  <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index < currentQuestion
                            ? "bg-emerald-500 w-5 sm:w-6"
                            : index === currentQuestion
                            ? "bg-violet-500 w-5 sm:w-6 animate-pulse"
                            : "bg-violet-200 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-violet-200 shadow-xl text-center max-w-2xl w-full">
                <div
                  className={`text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-800 mb-2 sm:mb-3">
                  {isCorrect ? "Perfect Match!" : "Not the Best Match"}
                </h3>
                <p className="text-violet-900 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-1">
                  {isCorrect
                    ? "You matched the honest clue correctly. Great job spotting fairness!"
                    : `The safer match is: "${currentData.options.find((o) => o.correct)?.text}".`}
                </p>
                <button
                  onClick={handleNext}
                  className="px-8 sm:px-10 py-2.5 sm:py-3.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 shadow-lg"
                >
                  {currentQuestion < totalQuestions - 1 ? "Next Puzzle" : "See Result"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-violet-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                🧩🤝🚨
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-700 mb-2 sm:mb-3">
                Honesty Puzzle Master!
              </h3>
              <p className="text-violet-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You solved {finalScore} out of {totalQuestions} honesty puzzles.
                <br />
                Honest shops build trust, while fraud shops cause loss and problems.
              </p>
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-violet-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Choose honest places to keep your money and trust safe.
              </p>
              {allQuestionsAnswered && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-rose-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
      {finalScore > 0 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={totalQuestions}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-84"
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

export default PuzzleHonestVsFraud;