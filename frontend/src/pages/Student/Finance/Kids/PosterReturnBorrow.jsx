import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterReturnBorrow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const questions = [
    {
      id: 1,
      text: 'Choose a poster that sends the best message: "Always Return Borrowed."',
      options: [
        {
          id: 1,
          title: "Always Return Borrowed",
          emoji: "🤝",
          message: "If you borrow, you must give it back.",
          correct: true,
        },
        {
          id: 2,
          title: "Keep Borrowed Things",
          emoji: "📦",
          message: "Once you borrow, keep it forever.",
          correct: false,
        },
        {
          id: 3,
          title: "Borrow More Stuff",
          emoji: "🎒",
          message: "Borrow as much as you can.",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      text: 'Choose a poster: "Return What You Borrow."',
      options: [
        {
          id: 4,
          title: "Return What You Borrow",
          emoji: "✅",
          message: "Give back books, toys, and money you borrowed.",
          correct: true,
        },
        {
          id: 5,
          title: "Never Return",
          emoji: "🙈",
          message: "Forget what you borrowed.",
          correct: false,
        },
        {
          id: 6,
          title: "Lose Borrowed Items",
          emoji: "😞",
          message: "It’s okay to lose things from others.",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      text: 'Choose a poster: "Honest Borrowing Wins."',
      options: [
        {
          id: 7,
          title: "Honest Borrowing Wins",
          emoji: "😊",
          message: "Ask, use carefully, and return on time.",
          correct: true,
        },
        {
          id: 8,
          title: "Borrow Without Returning",
          emoji: "💸",
          message: "Use and forget about it.",
          correct: false,
        },
        {
          id: 9,
          title: "Take Without Asking",
          emoji: "🤫",
          message: "Take things even if they’re not yours.",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      text: 'Choose a poster: "Return On Time, Be Kind."',
      options: [
        {
          id: 10,
          title: "Return On Time, Be Kind",
          emoji: "⏰",
          message: "Return things when you promised.",
          correct: true,
        },
        {
          id: 11,
          title: "Keep Items Forever",
          emoji: "🧸",
          message: "Keep your friend’s things always.",
          correct: false,
        },
        {
          id: 12,
          title: "Borrow More Money",
          emoji: "💰",
          message: "Keep borrowing without paying back.",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      text: "Why do posters about returning borrowed things help kids?",
      options: [
        {
          id: 13,
          title: "Teach honesty and trust",
          emoji: "📚",
          message: "They remind us to be fair and return what we use.",
          correct: true,
        },
        {
          id: 14,
          title: "Encourage borrowing more",
          emoji: "🎒",
          message: "They tell us to keep borrowing everything.",
          correct: false,
        },
        {
          id: 15,
          title: "Make keeping items fun",
          emoji: "🎉",
          message: "They say it’s fun to never return things.",
          correct: false,
        },
      ],
    },
  ];

  const handleSelect = (poster) => {
    if (showResult) return;
    setSelectedPoster(poster.id);
    const correct = poster.correct;
    setIsCorrect(correct);

    const newAnswers = [
      ...answers,
      { questionId: questions[currentQuestion].id, correct },
    ];
    setAnswers(newAnswers);

    if (correct) {
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setShowResult(true);
    }, correct ? 1000 : 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedPoster(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
      setCoins(5);
    }
  };

  useEffect(() => {
    if (finalScore > 0 && coins === 5) {
      setShowResult(true);
    }
  }, [finalScore, coins]);

  const currentQuestionData = questions[currentQuestion];
  const allQuestionsAnswered = answers.length === questions.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col relative overflow-hidden">
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
            {["🧾", "🤝", "📚", "💰", "✅", "🎯"][i % 6]}
          </div>
        ))}
      </div>

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
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">
              🧾
            </span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Poster: Return What You Borrow</span>
              <span className="xs:hidden">Return Borrow</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-purple-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-purple-700 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-3 sm:space-y-4">
                {/* Question Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-lg">
                  <p className="text-gray-800 text-xs sm:text-sm md:text-base font-semibold text-center mb-3 sm:mb-4">
                    {currentQuestionData.text}
                  </p>

                  {/* Poster Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {currentQuestionData.options.map((poster) => {
                      const isSelected = selectedPoster === poster.id;

                      return (
                        <button
                          key={poster.id}
                          onClick={() => handleSelect(poster)}
                          disabled={showResult}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 border-2 ${
                            !showResult
                              ? "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 border-purple-400 text-white"
                              : isSelected && poster.correct
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white ring-2 ring-yellow-300"
                              : isSelected && !poster.correct
                              ? "bg-gradient-to-r from-red-500 to-rose-600 border-red-400 text-white opacity-80"
                              : poster.correct && showResult
                              ? "bg-gradient-to-r from-green-500/70 to-emerald-600/70 border-green-400/70 text-white"
                              : "bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-indigo-400/60 border-purple-300/60 text-white/80"
                          } ${showResult ? "cursor-default" : ""}`}
                        >
                          <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 text-center">
                            {poster.emoji}
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 text-center">
                            {poster.title}
                          </h3>
                          <p className="text-white/90 text-[10px] sm:text-xs text-center leading-snug">
                            {poster.message}
                          </p>
                        </button>
                      );
                    })}
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
                            ? "bg-purple-500 w-5 sm:w-6 animate-pulse"
                            : "bg-gray-300 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-xl text-center">
                <div
                  className={`text-6xl sm:text-7xl md:text-8xl mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                  {isCorrect ? "Correct!" : "Not Quite"}
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                  {isCorrect
                    ? "Great pick! That poster teaches honest borrowing."
                    : "The best poster message is: " +
                      currentQuestionData.options.find((opt) => opt.correct)?.title}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                >
                  {currentQuestion < questions.length - 1
                    ? "Next Poster"
                    : "Finish"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 shadow-xl text-center max-w-2xl w-full">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 animate-bounce">
                🏆
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2 sm:mb-3">
                Borrowing Poster Star!
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You scored {finalScore} out of {questions.length} — amazing poster choices!
                <br />
                You understand that returning and repaying builds honesty and trust. 🎯
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Good posters remind us — if you borrow something, always return it
                on time and in good condition.
              </p>
              {allQuestionsAnswered && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
          totalQuestions={questions.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-56"
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

export default PosterReturnBorrow;