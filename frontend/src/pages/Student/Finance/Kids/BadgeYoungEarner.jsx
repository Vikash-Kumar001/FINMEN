import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Coins, Sparkles, Star, Award, DollarSign } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeYoungEarner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
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
        "financial-literity": "financial-literacy",
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
      icon: <Sparkles className="w-7 h-7 text-yellow-400" />,
      title: "Helping at Home",
      text: "What is a good way to earn pocket money at home?",
      choices: [
        { id: "a", text: "Do chores like cleaning your room", correct: true },
        { id: "b", text: "Demand money for nothing", correct: false },
        { id: "c", text: "Take money from parents’ wallet", correct: false },
      ],
    },
    {
      id: 2,
      icon: <Star className="w-7 h-7 text-yellow-300" />,
      title: "Selling Old Items",
      text: "You have toys you don’t use. What is a smart idea?",
      choices: [
        { id: "a", text: "Sell them to earn money", correct: true },
        { id: "b", text: "Throw them in the trash", correct: false },
        { id: "c", text: "Keep them forever even if unused", correct: false },
      ],
    },
    {
      id: 3,
      icon: <Award className="w-7 h-7 text-emerald-400" />,
      title: "Teaching Skills",
      text: "You are good at drawing. How could you earn from this skill?",
      choices: [
        { id: "a", text: "Teach friends for a small fee", correct: true },
        { id: "b", text: "Keep all your skills secret", correct: false },
        { id: "c", text: "Copy other people’s work", correct: false },
      ],
    },
    {
      id: 4,
      icon: <Coins className="w-7 h-7 text-yellow-500" />,
      title: "Creative Projects",
      text: "A school fair is coming. What is a good way to earn?",
      choices: [
        { id: "a", text: "Make crafts or snacks and sell them", correct: true },
        { id: "b", text: "Do nothing and only watch others", correct: false },
        { id: "c", text: "Copy and sell someone else’s idea", correct: false },
      ],
    },
    {
      id: 5,
      icon: <DollarSign className="w-7 h-7 text-green-400" />,
      title: "Good Grades Reward",
      text: "Parents offer money for good grades. What should you do?",
      choices: [
        { id: "a", text: "Study hard and earn it fairly", correct: true },
        { id: "b", text: "Cheat on tests to get money", correct: false },
        { id: "c", text: "Make excuses instead of working", correct: false },
      ],
    },
  ];

  const currentQuestionData = questions[currentQuestion];

  const handleSelect = (choice) => {
    if (showResult || showBadge) return;

    setSelectedAnswerId(choice.id);
    const correct = choice.correct;
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
    }, correct ? 1000 : 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswerId(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
      if (correctCount === questions.length) {
        setShowBadge(true);
      }
    }
  };

  useEffect(() => {
    if (finalScore > 0) {
      setShowResult(true);
    }
  }, [finalScore]);

  const allQuestionsAnswered = answers.length === questions.length;
  const allCorrect = finalScore === questions.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-yellow-100 via-amber-50 to-emerald-100 flex flex-col relative overflow-hidden">
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
            {["💰", "🧹", "🎨", "🧸", "📚", "⭐"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/40 backdrop-blur-sm border-b border-amber-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-amber-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-amber-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500" />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Badge: Young Earner</span>
              <span className="xs:hidden">Young Earner</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-amber-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-amber-800 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && !showBadge && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-amber-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {showBadge ? (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-amber-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce">
                💰🏅
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700 mb-2 sm:mb-3">
                Young Earner Badge!
              </h3>
              <p className="text-amber-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You answered all {questions.length} questions correctly — you know many
                honest ways to earn!
                <br />
                You’re ready to be a smart and responsible earner as you grow. 🌟
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <button
                onClick={() => navigate(resolvedBackPath)}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:from-amber-600 hover:via-orange-600 hover:to-emerald-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-amber-200 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    {currentQuestionData.icon}
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-amber-700">
                      Earning Question {currentQuestion + 1}:{" "}
                      {currentQuestionData.title}
                    </span>
                  </div>
                  <p className="text-amber-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                    {currentQuestionData.text}
                  </p>

                  {/* Options - Single Row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    {currentQuestionData.choices.map((choice) => {
                      const isSelected = selectedAnswerId === choice.id;

                      return (
                        <button
                          key={choice.id}
                          onClick={() => handleSelect(choice)}
                          disabled={showResult}
                          className={`flex-1 min-w-[120px] sm:min-w-[150px] p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none ${
                            !showResult
                              ? "bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 hover:from-amber-500 hover:via-orange-500 hover:to-emerald-500 text-white border-2 border-white/40"
                              : isSelected && choice.correct
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 ring-4 ring-green-200"
                              : isSelected && !choice.correct
                              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 ring-4 ring-red-200"
                              : choice.correct && showResult
                              ? "bg-gradient-to-r from-green-500/60 to-emerald-600/60 text-white border-2 border-green-400/60"
                              : "bg-gradient-to-r from-amber-300/60 via-orange-300/60 to-emerald-300/60 text-amber-900 border-2 border-white/30"
                          }`}
                        >
                          <h3 className="font-bold text-xs sm:text-sm md:text-base">
                            {choice.text}
                          </h3>
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
                            ? "bg-amber-500 w-5 sm:w-6 animate-pulse"
                            : "bg-amber-200 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-amber-200 shadow-xl text-center">
                <div
                  className={`text-6xl sm:text-7xl md:text-8xl mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-2 sm:mb-4">
                  {isCorrect ? "Great Earning Choice!" : "Think About Earning"}
                </h3>
                <p className="text-lg sm:text-xl text-amber-900 mb-6 sm:mb-8 leading-relaxed px-1">
                  {isCorrect
                    ? "Nice! That shows an honest and smart way to earn money."
                    : "A better young earner choice is: " +
                      currentQuestionData.choices.find((opt) => opt.correct)?.text}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                >
                  {currentQuestion < questions.length - 1
                    ? "Next Question"
                    : "Finish"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-amber-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                💰🌟
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700 mb-2 sm:mb-3">
                Young Earner in Training!
              </h3>
              <p className="text-amber-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You scored {finalScore} out of {questions.length} — great job learning how
                to earn honestly!
                <br />
                Keep practicing these ideas to become a true Young Earner. 💼
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-amber-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Real earning comes from helping, using your talents, and working
                hard — not from shortcuts.
              </p>
              {allQuestionsAnswered && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:from-amber-600 hover:via-orange-600 hover:to-emerald-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
          totalQuestions={questions.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-80"
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

export default BadgeYoungEarner;