import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterBanksHelp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [choice, setChoice] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
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

  const questions = [
    {
      id: 1,
      text: 'Choose a poster: "Bank = Safe Money."',
      options: [
        {
          id: 1,
          title: "Bank = Safe Money",
          design: "🏦",
          message: "Keeping money in a bank keeps it safe and protected",
          isCorrect: true,
          color: "from-blue-500 to-indigo-600",
          borderColor: "border-blue-400",
        },
        {
          id: 2,
          title: "Spend Fast",
          design: "🛍️",
          message: "Use all your money quickly on shopping",
          isCorrect: false,
          color: "from-red-500 to-rose-600",
          borderColor: "border-red-400",
        },
        {
          id: 3,
          title: "Hide Money at Home",
          design: "🏺",
          message: "Keep money in jars and boxes at home",
          isCorrect: false,
          color: "from-gray-500 to-slate-600",
          borderColor: "border-gray-400",
        },
      ],
    },
    {
      id: 2,
      text: 'Choose a poster: "Banks Keep Money Safe."',
      options: [
        {
          id: 4,
          title: "Banks Keep Money Safe",
          design: "🔒",
          message: "Banks use strong security to protect your savings",
          isCorrect: true,
          color: "from-sky-500 to-blue-600",
          borderColor: "border-sky-400",
        },
        {
          id: 5,
          title: "Spend All Now",
          design: "🎉",
          message: "Use all the money today on fun things",
          isCorrect: false,
          color: "from-red-500 to-pink-600",
          borderColor: "border-red-400",
        },
        {
          id: 6,
          title: "Money Under Bed",
          design: "🛏️",
          message: "Hide money under your bed instead of in a bank",
          isCorrect: false,
          color: "from-gray-500 to-slate-600",
          borderColor: "border-gray-400",
        },
      ],
    },
    {
      id: 3,
      text: 'Choose a poster: "Save in Bank, Grow Money."',
      options: [
        {
          id: 7,
          title: "Save in Bank, Grow Money",
          design: "📈",
          message: "Saving in a bank helps your money grow over time",
          isCorrect: true,
          color: "from-indigo-500 to-purple-600",
          borderColor: "border-indigo-400",
        },
        {
          id: 8,
          title: "Buy Toys Now",
          design: "🧸",
          message: "Spend on toys instead of saving for bigger goals",
          isCorrect: false,
          color: "from-orange-500 to-amber-600",
          borderColor: "border-orange-400",
        },
        {
          id: 9,
          title: "Give Money Away",
          design: "🎁",
          message: "Give all your money away without any plan",
          isCorrect: false,
          color: "from-red-500 to-pink-600",
          borderColor: "border-red-400",
        },
      ],
    },
    {
      id: 4,
      text: 'Choose a poster: "Banks Protect Your Savings."',
      options: [
        {
          id: 10,
          title: "Banks Protect Your Savings",
          design: "💰",
          message: "Banks keep your saved money safe from loss or theft",
          isCorrect: true,
          color: "from-teal-500 to-cyan-600",
          borderColor: "border-teal-400",
        },
        {
          id: 11,
          title: "Spend Without Plan",
          design: "🛒",
          message: "Buy anything you see without thinking",
          isCorrect: false,
          color: "from-red-500 to-rose-600",
          borderColor: "border-red-400",
        },
        {
          id: 12,
          title: "Keep Cash in Pocket",
          design: "🎒",
          message: "Carry all your money with you all the time",
          isCorrect: false,
          color: "from-gray-500 to-slate-600",
          borderColor: "border-gray-400",
        },
      ],
    },
    {
      id: 5,
      text: "Why do posters about banks help kids?",
      options: [
        {
          id: 13,
          title: "Teach Safe Money Habits",
          design: "📚",
          message: "They help kids learn to use banks and save safely",
          isCorrect: true,
          color: "from-green-500 to-emerald-600",
          borderColor: "border-green-400",
        },
        {
          id: 14,
          title: "Make Banks Just Fun",
          design: "🎉",
          message: "They only show banks as fun places to play",
          isCorrect: false,
          color: "from-orange-500 to-amber-600",
          borderColor: "border-orange-400",
        },
        {
          id: 15,
          title: "Get More Toys",
          design: "🧸",
          message: "They tell kids to use money only for toys",
          isCorrect: false,
          color: "from-red-500 to-pink-600",
          borderColor: "border-red-400",
        },
      ],
    },
  ];

  const handleChoice = (selectedPosterId) => {
    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(
      (opt) => opt.id === selectedPosterId
    );
    const isCorrect = selectedOption?.isCorrect || false;

    setChoice(selectedPosterId);

    // Save the answer
    const newChoices = [
      ...choices,
      {
        questionId: currentQ.id,
        choice: selectedPosterId,
        isCorrect,
      },
    ];
    setChoices(newChoices);

    if (isCorrect) {
      // Update coins in real-time for correct answers
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Show result, then move to next question or finish
    setTimeout(() => {
      setShowResult(true);
    }, isCorrect ? 1000 : 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setChoice(null);
      setShowResult(false);
      resetFeedback();
    } else {
      // Calculate final score
      const correctAnswers = choices.filter((c) => c.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    setChoice(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate(resolvedBackPath);
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const currentQuestionData = getCurrentQuestion();
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = choices.length === questions.length;
  const isCorrect =
    choice &&
    currentQuestionData?.options.find((opt) => opt.id === choice)?.isCorrect;
  const selectedPosterData = currentQuestionData?.options.find(
    (opt) => opt.id === choice
  );

  // Calculate final score when all questions are answered
  useEffect(() => {
    if (allQuestionsAnswered && finalScore === 0 && choices.length > 0) {
      const correctCount = choices.filter((c) => c.isCorrect).length;
      setFinalScore(correctCount);
    }
  }, [allQuestionsAnswered, choices, finalScore]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Bank Elements Background */}
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
            {["🏦", "💳", "💰", "🔒"][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {allQuestionsAnswered && finalScore >= 3 && <Confetti />}

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
              🎨
            </span>
            <span className="bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Poster: Banks Help</span>
              <span className="xs:hidden">Banks Help</span>
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

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!allQuestionsAnswered && !showResult && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}
        {allQuestionsAnswered && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Activity Complete!
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {!allQuestionsAnswered && !showResult && currentQuestionData ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Question Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-blue-300 shadow-lg">
                <p className="text-gray-800 text-xs sm:text-sm md:text-base font-semibold text-center mb-3 sm:mb-4">
                  {currentQuestionData.text}
                </p>

                {/* Poster Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {currentQuestionData.options.map((poster) => (
                    <button
                      key={poster.id}
                      onClick={() => handleChoice(poster.id)}
                      disabled={showResult}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 border-2 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:from-blue-600 hover:via-sky-600 hover:to-indigo-600 border-blue-400 text-white`}
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 text-center">
                        {poster.design}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm md:text-base text-white mb-1 sm:mb-2 text-center">
                        {poster.title}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm text-center">
                        {poster.message}
                      </p>
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
                          ? "bg-blue-500 w-5 sm:w-6 animate-pulse"
                          : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : !allQuestionsAnswered && showResult ? (
            <>
              {/* Question Result */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-blue-300 shadow-xl text-center">
                {isCorrect ? (
                  <div>
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">
                      🎯
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">
                      🏦✨
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">
                      Great Choice!
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      "{selectedPosterData?.title}" is a smart poster about banks!
                    </p>
                    <button
                      onClick={handleNextQuestion}
                      className="bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:from-blue-600 hover:via-sky-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                    >
                      {isLastQuestion ? "See Results" : "Next Question"} →
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">
                      😔
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">
                      🏦
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">
                      Think About It!
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      "{selectedPosterData?.title}" is not the best message about using banks
                      safely.
                    </p>
                    <button
                      onClick={handleNextQuestion}
                      className="bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:from-blue-600 hover:via-sky-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                    >
                      {isLastQuestion ? "See Results" : "Next Question"} →
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Final Results Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-blue-300 shadow-xl text-center">
                {finalScore >= 3 ? (
                  <div>
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">
                      🎉
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">
                      🏦✨
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">
                      Bank Poster Pro!
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      You got{" "}
                      <span className="font-bold text-green-600">
                        {finalScore}
                      </span>{" "}
                      out of{" "}
                      <span className="font-bold">{questions.length}</span>{" "}
                      posters right!
                      <br />
                      You understand how banks help keep money safe. 🎯
                    </p>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">💰</span>
                      <span className="text-base sm:text-lg md:text-xl font-bold">
                        +5 Coins
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                      You can now design posters that teach others how banks help with
                      saving and safety!
                    </p>
                    {finalScore >= 3 && (
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:from-blue-600 hover:via-sky-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                      >
                        <span className="hidden sm:inline">
                          Continue to Next Level
                        </span>
                        <span className="sm:hidden">Next Level</span> →
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">
                      😔
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">
                      🏦
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">
                      Keep Learning!
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      You got{" "}
                      <span className="font-bold text-blue-600">
                        {finalScore}
                      </span>{" "}
                      out of{" "}
                      <span className="font-bold">{questions.length}</span>{" "}
                      posters correct.
                      <br />
                      Remember, good bank posters teach saving, safety, and smart money
                      habits!
                    </p>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">💰</span>
                      <span className="text-base sm:text-lg md:text-xl font-bold">
                        +5 Coins
                      </span>
                    </div>
                    <button
                      onClick={handleTryAgain}
                      className="bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:from-blue-600 hover:via-sky-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                    >
                      Try Again 🎨
                    </button>
                    <p className="text-gray-600 text-xs sm:text-sm px-1">
                      Try to choose posters that show banks as safe places to save and
                      protect money.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {allQuestionsAnswered && finalScore >= 3 && (
        <GameOverModal
          score={5}
          gameId="finance-kids-46"
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

export default PosterBanksHelp;