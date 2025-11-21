import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Building2, Landmark, CreditCard, Lock, Users, Trophy } from "lucide-react";

const BadgeBankExplorer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
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
      text: "What is the main job of a bank?",
      icon: <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />,
      choices: [
        { id: "a", text: "To keep money safe and help it grow", emoji: "🏦", correct: true },
        { id: "b", text: "To give free toys", emoji: "🧸", correct: false },
        { id: "c", text: "Only for adults to visit", emoji: "🧍‍♂️", correct: false },
      ],
    },
    {
      id: 2,
      text: "What happens when you put money in a savings account?",
      icon: <Landmark className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />,
      choices: [
        { id: "a", text: "It stays safe and can earn interest", emoji: "💰", correct: true },
        { id: "b", text: "The bank spends it on toys", emoji: "🧸", correct: false },
        { id: "c", text: "It disappears forever", emoji: "🌫️", correct: false },
      ],
    },
    {
      id: 3,
      text: "What should you NEVER do with your ATM card and PIN?",
      icon: <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />,
      choices: [
        { id: "a", text: "Share your PIN with someone", emoji: "❌", correct: true },
        { id: "b", text: "Keep the card in a safe place", emoji: "📦", correct: false },
        { id: "c", text: "Use it with a parent nearby", emoji: "👨‍👩‍👧", correct: false },
      ],
    },
    {
      id: 4,
      text: "Why do banks have guards and cameras?",
      icon: <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />,
      choices: [
        { id: "a", text: "To protect people's money", emoji: "🛡️", correct: true },
        { id: "b", text: "To scare children", emoji: "👻", correct: false },
        { id: "c", text: "Just for decoration", emoji: "🎀", correct: false },
      ],
    },
    {
      id: 5,
      text: "Which is a helpful service banks give to families?",
      icon: <Users className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500" />,
      choices: [
        { id: "a", text: "Loans to buy homes or start businesses", emoji: "🏠", correct: true },
        { id: "b", text: "Free holidays", emoji: "🏖️", correct: false },
        { id: "c", text: "Magic money machines", emoji: "🪄", correct: false },
      ],
    },
  ];

  const handleSelect = (choice) => {
    if (showResult || showBadge) return;
    setSelectedAnswer(choice.id);
    const correct = choice.correct;
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
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
      if (correctCount === questions.length) {
        setShowBadge(true);
      }
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
  const allCorrect = finalScore === questions.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col relative overflow-hidden">
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
            {["🏦", "💳", "💰", "🔒", "🏆", "🎯"][i % 6]}
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
              🏆
            </span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Badge: Bank Explorer</span>
              <span className="xs:hidden">Bank Explorer</span>
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
        {!showResult && finalScore === 0 && !showBadge && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {showBadge ? (
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl text-center max-w-2xl w-full">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-4 animate-bounce">
                🏆
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-3 sm:mb-4">
                Bank Explorer Badge!
              </h3>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-1">
                Amazing! You answered all {questions.length} questions about banks
                correctly.
                <br />
                You truly understand how banks work and how they help people! 🎯
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-4 sm:mb-6 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <button
                onClick={() => navigate(resolvedBackPath)}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
                <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {currentQuestionData.icon}
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-blue-600">
                      Bank Basics Question {currentQuestion + 1}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-semibold leading-relaxed px-1">
                    {currentQuestionData.text}
                  </p>

                  {/* Options - Single Row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    {currentQuestionData.choices.map((choice) => {
                      const isSelected = selectedAnswer === choice.id;

                      return (
                        <button
                          key={choice.id}
                          onClick={() => handleSelect(choice)}
                          disabled={showResult}
                          className={`flex-1 min-w-[120px] sm:min-w-[150px] p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none ${
                            !showResult
                              ? "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white border-2 border-white/30"
                              : isSelected && choice.correct
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 ring-4 ring-green-200"
                              : isSelected && !choice.correct
                              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 ring-4 ring-red-200"
                              : choice.correct && showResult
                              ? "bg-gradient-to-r from-green-500/50 to-emerald-600/50 text-white border-2 border-green-400/50"
                              : "bg-gradient-to-r from-blue-400/50 via-indigo-400/50 to-purple-400/50 text-white/70 border-2 border-white/20"
                          }`}
                        >
                          <div className="text-2xl sm:text-3xl md:text-4xl mb-2">
                            {choice.emoji}
                          </div>
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
                            ? "bg-blue-500 w-5 sm:w-6 animate-pulse"
                            : "bg-gray-300 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl text-center">
                <div
                  className={`text-6xl sm:text-7xl md:text-8xl mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
                  {isCorrect
                    ? "Great job! You understand this bank idea well!"
                    : "The correct answer is: " +
                      currentQuestionData.choices.find((opt) => opt.correct)?.text}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                >
                  {currentQuestion < questions.length - 1
                    ? "Next Question"
                    : "Finish"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 inline text-yellow-500" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-2 sm:mb-3">
                Great Effort!
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You scored {finalScore} out of {questions.length}!
                <br />
                {allCorrect
                  ? "You earned the Bank Explorer badge!"
                  : "Keep practicing to earn the Bank Explorer badge!"}
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Banks keep money safe, help it grow, and support families with
                useful services.
              </p>
              {allQuestionsAnswered && (
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
      {finalScore > 0 && coins === 5 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={questions.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-50"
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

export default BadgeBankExplorer;