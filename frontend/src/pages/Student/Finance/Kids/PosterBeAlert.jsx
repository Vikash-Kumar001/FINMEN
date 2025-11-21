import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterBeAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPosterId, setSelectedPosterId] = useState(null);
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
      text: 'Choose a poster that clearly says: "Stop Scams."',
      options: [
        {
          id: 1,
          title: "Stop Scams",
          emoji: "🚨",
          message: "Be careful. Some offers are tricks.",
          correct: true,
        },
        {
          id: 2,
          title: "Trust Everyone",
          emoji: "🤝",
          message: "Believe all people with money offers.",
          correct: false,
        },
        {
          id: 3,
          title: "Spend Freely",
          emoji: "🛍️",
          message: "Buy anything without checking.",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      text: 'Choose a poster: "Check Before You Pay."',
      options: [
        {
          id: 4,
          title: "Check Before You Pay",
          emoji: "🔍",
          message: "Always read the bill and amount first.",
          correct: true,
        },
        {
          id: 5,
          title: "Pay Without Checking",
          emoji: "💸",
          message: "Give money quickly without looking.",
          correct: false,
        },
        {
          id: 6,
          title: "Give Money Away",
          emoji: "🎁",
          message: "Give money to anyone who asks.",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      text: 'Choose a poster: "Be Alert, Stay Safe."',
      options: [
        {
          id: 7,
          title: "Be Alert, Stay Safe",
          emoji: "🛡️",
          message: "Think before you click, share, or pay.",
          correct: true,
        },
        {
          id: 8,
          title: "Share Money Easily",
          emoji: "😊",
          message: "Send money whenever someone asks.",
          correct: false,
        },
        {
          id: 9,
          title: "Ignore Warnings",
          emoji: "⚠️",
          message: "Don’t listen to safety messages.",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      text: 'Choose a poster: "Don’t Fall for Tricks."',
      options: [
        {
          id: 10,
          title: "Don’t Fall for Tricks",
          emoji: "🕵️",
          message: "Scammers hide behind sweet words.",
          correct: true,
        },
        {
          id: 11,
          title: "Believe All Offers",
          emoji: "🎉",
          message: "Every offer is safe and true.",
          correct: false,
        },
        {
          id: 12,
          title: "Buy Everything",
          emoji: "🛒",
          message: "Buy fast before you think.",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      text: "Why do anti-scam posters help kids and families?",
      options: [
        {
          id: 13,
          title: "Teach kids to stay safe",
          emoji: "🛡️",
          message: "They remind us to slow down, check, and think.",
          correct: true,
        },
        {
          id: 14,
          title: "Make scams fun",
          emoji: "🎭",
          message: "They make tricks look exciting.",
          correct: false,
        },
        {
          id: 15,
          title: "Get more money",
          emoji: "💰",
          message: "They help scammers earn more.",
          correct: false,
        },
      ],
    },
  ];

  const handleSelect = (poster) => {
    if (showResult) return;
    setSelectedPosterId(poster.id);

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
      setSelectedPosterId(null);
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
            {["🚨", "🛡️", "📢", "🔍", "⚠️", "💳"][i % 6]}
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
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-rose-500" />
            <span className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Poster: Be Alert</span>
              <span className="xs:hidden">Be Alert</span>
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

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-rose-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-3 sm:space-y-4">
                {/* Poster Question Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-rose-200 shadow-xl">
                  <p className="text-rose-950 text-xs sm:text-sm md:text-base font-semibold text-center mb-3 sm:mb-4 leading-relaxed px-1">
                    {currentQuestionData.text}
                  </p>

                  {/* Poster Options - 3 cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {currentQuestionData.options.map((poster) => {
                      const isSelected = selectedPosterId === poster.id;

                      return (
                        <button
                          key={poster.id}
                          onClick={() => handleSelect(poster)}
                          disabled={showResult}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 border-2 ${
                            !showResult
                              ? "bg-gradient-to-br from-rose-100 via-red-50 to-amber-100 hover:from-rose-200 hover:via-red-100 hover:to-amber-100 border-rose-200 text-rose-900"
                              : isSelected && poster.correct
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white ring-2 ring-yellow-300"
                              : isSelected && !poster.correct
                              ? "bg-gradient-to-br from-red-500 to-rose-600 border-red-400 text-white opacity-90"
                              : poster.correct && showResult
                              ? "bg-gradient-to-br from-green-500/80 to-emerald-600/80 border-green-400/80 text-white"
                              : "bg-gradient-to-br from-rose-100 via-red-50 to-amber-100 border-rose-100 text-rose-800"
                          } ${showResult ? "cursor-default" : ""}`}
                        >
                          <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 text-center">
                            {poster.emoji}
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 text-center">
                            {poster.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-center leading-snug text-rose-900/80">
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
                            ? "bg-rose-500 w-5 sm:w-6 animate-pulse"
                            : "bg-rose-200 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-rose-200 shadow-xl text-center max-w-2xl w-full">
                  <div
                    className={`text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                    }`}
                  >
                    {isCorrect ? "✅" : "❌"}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-800 mb-2 sm:mb-3">
                    {isCorrect ? "Great Poster Pick!" : "Try a Safer Poster"}
                  </h3>
                  <p className="text-rose-900 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-1">
                    {isCorrect
                      ? "Nice! That poster clearly warns others to stay alert about scams."
                      : "The best poster message is: " +
                        currentQuestionData.options.find((opt) => opt.correct)?.title}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 sm:px-10 py-3 sm:py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                  >
                    {currentQuestion < questions.length - 1
                      ? "Next Poster"
                      : "Finish"}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                🏅🚨🛡️
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-700 mb-2 sm:mb-3">
                Scam-Stopper Poster Star!
              </h3>
              <p className="text-rose-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You picked {finalScore} out of {questions.length} strong “Be Alert” posters.
                <br />
                Your posters warn others to check bills, avoid tricks, and stay safe from
                scams.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-rose-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Clear posters help everyone remember — stop, think, and check
                before trusting money offers.
              </p>
              {allQuestionsAnswered && (
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
          totalQuestions={questions.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-86"
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

export default PosterBeAlert;