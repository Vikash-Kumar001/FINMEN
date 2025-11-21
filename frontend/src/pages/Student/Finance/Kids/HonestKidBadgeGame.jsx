import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Star } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HonestKidBadgeGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
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

  const questions = [
    {
      id: 1,
      situation: "You see your friend drop a ₹10 note on the playground.",
      prompt: "What is the honest choice?",
      options: [
        {
          text: "Give it to a teacher so it can be returned",
          correct: true,
        },
        {
          text: "Keep it for yourself",
          correct: false,
        },
        {
          text: "Spend it on snacks",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      situation: "At a shop, the cashier gives you extra change by mistake.",
      prompt: "What should you do?",
      options: [
        {
          text: "Return the extra change",
          correct: true,
        },
        {
          text: "Buy more candy with it",
          correct: false,
        },
        {
          text: "Say nothing and leave",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      situation: "Your friend asks to borrow ₹5 for school snacks.",
      prompt: "What is a fair money decision?",
      options: [
        {
          text: "Lend and agree when they will return it",
          correct: true,
        },
        {
          text: "Give it without caring about return",
          correct: false,
        },
        {
          text: "Refuse even if you can help",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      situation: "You accidentally break a toy worth ₹20 at home or school.",
      prompt: "What is the honest thing to do?",
      options: [
        {
          text: "Tell an adult and offer to help fix or pay",
          correct: true,
        },
        {
          text: "Hide the broken toy",
          correct: false,
        },
        {
          text: "Blame someone else",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      situation: "You often face choices about money with family and friends.",
      prompt: "Why does honesty with money matter?",
      options: [
        {
          text: "It earns trust and respect from others",
          correct: true,
        },
        {
          text: "It helps you get more money",
          correct: false,
        },
        {
          text: "It lets you spend more things faster",
          correct: false,
        },
      ],
    },
  ];

  const currentQuestionData = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleChoice = (option, index) => {
    if (showResult || showBadge) return;

    setSelectedIndex(index);
    const correct = option.correct;
    setIsCorrect(correct);

    const newAnswers = [
      ...answers,
      { questionId: currentQuestionData.id, correct },
    ];
    setAnswers(newAnswers);

    if (correct) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setShowResult(true);
    }, correct ? 900 : 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedIndex(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
      if (correctCount === totalQuestions) {
        setShowBadge(true);
      }
    }
  };

  useEffect(() => {
    if (finalScore > 0) {
      setShowResult(true);
    }
  }, [finalScore]);

  const allQuestionsAnswered = answers.length === totalQuestions;
  const allCorrect = finalScore === totalQuestions;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-emerald-100 via-sky-50 to-indigo-100 flex flex-col relative overflow-hidden">
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
            {["💰", "🤝", "⭐", "📚", "✅", "🏅"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/40 backdrop-blur-sm border-b border-emerald-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-emerald-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500" />
            <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Badge: Honest Kid</span>
              <span className="xs:hidden">Honest Kid</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-emerald-800 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && !showBadge && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-emerald-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {showBadge ? (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce">
                🏅💚
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3">
                Honest Kid Badge Earned!
              </h3>
              <p className="text-emerald-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You answered all {totalQuestions} honesty questions correctly — you’re a
                true Honest Kid!
                <br />
                Your choices show that you return money, tell the truth, and treat friends
                fairly.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <button
                onClick={() => navigate(resolvedBackPath)}
                className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 hover:from-emerald-600 hover:via-sky-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
              >
                <span className="hidden sm:inline">
                  Continue to Next Level
                </span>
                <span className="sm:hidden">Next Level</span> →
              </button>
            </div>
          ) : finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Question Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-emerald-200 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400" />
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-emerald-700">
                      Honest Kid Question {currentQuestion + 1}
                    </span>
                  </div>
                  <p className="text-emerald-950 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 font-semibold leading-relaxed px-1">
                    {currentQuestionData.situation}
                  </p>
                  <p className="text-emerald-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-bold px-1">
                    {currentQuestionData.prompt}
                  </p>

                  {/* Options - Single Row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    {currentQuestionData.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleChoice(option, index)}
                        disabled={showResult}
                        className={`flex-1 min-w-[130px] sm:min-w-[150px] p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none ${
                          !showResult
                            ? "bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 hover:from-emerald-500 hover:via-sky-500 hover:to-indigo-500 text-white border-2 border-white/40"
                            : selectedIndex === index && option.correct
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 ring-4 ring-green-200"
                            : selectedIndex === index && !option.correct
                            ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 ring-4 ring-red-200"
                            : option.correct && showResult
                            ? "bg-gradient-to-r from-green-500/60 to-emerald-600/60 text-white border-2 border-green-400/60"
                            : "bg-gradient-to-r from-emerald-300/60 via-sky-300/60 to-indigo-300/60 text-emerald-900 border-2 border-white/30"
                        }`}
                      >
                        <h3 className="font-bold text-xs sm:text-sm md:text-base">
                          {option.text}
                        </h3>
                      </button>
                    ))}
                  </div>

                  {/* Progress Indicator - Inside Card */}
                  <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index < currentQuestion
                            ? "bg-green-500 w-5 sm:w-6"
                            : index === currentQuestion
                            ? "bg-emerald-500 w-5 sm:w-6 animate-pulse"
                            : "bg-emerald-200 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200 shadow-xl text-center">
                <div
                  className={`text-6xl sm:text-7xl md:text-8xl mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 mb-2 sm:mb-4">
                  {isCorrect ? "Great Honest Choice!" : "Think About Honesty"}
                </h3>
                <p className="text-lg sm:text-xl text-emerald-900 mb-6 sm:mb-8 leading-relaxed px-1">
                  {isCorrect
                    ? "Nice! That shows a truly honest way to handle money."
                    : "A more Honest Kid choice is: " +
                      currentQuestionData.options.find((opt) => opt.correct)?.text}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                >
                  {currentQuestion < totalQuestions - 1 ? "Next Question" : "Finish"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                💰🌟
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3">
                Honest Kid in Training!
              </h3>
              <p className="text-emerald-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You scored {finalScore} out of {totalQuestions} — strong honest money
                decisions!
                <br />
                Keep choosing honesty with money to fully earn your Honest Kid badge.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-emerald-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Honest kids don’t just talk about fairness — they live it in every
                rupee they touch.
              </p>
              {allQuestionsAnswered && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 hover:from-emerald-600 hover:via-sky-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
          gameId="finance-kids-100"
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

export default HonestKidBadgeGame;