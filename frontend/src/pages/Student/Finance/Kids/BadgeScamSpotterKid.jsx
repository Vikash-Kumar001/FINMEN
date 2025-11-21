import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Shield, AlertTriangle, Eye, Phone, Mail } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeScamSpotterKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
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
      icon: <Phone className="w-7 h-7 text-red-400" />,
      tag: "Too Good To Be True",
      text: "A stranger says, “Win FREE phone! Just give your parent’s number.” What should you do?",
      options: [
        {
          text: "Say NO and tell your parents immediately",
          correct: true,
        },
        {
          text: "Share your parent’s number for the gift",
          correct: false,
        },
        {
          text: "Ask friends to share their numbers",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      icon: <Eye className="w-7 h-7 text-rose-400" />,
      tag: "Fake Website",
      text: "A website looks like your favorite game but asks for card details. What is safest?",
      options: [
        {
          text: "Stop and check with parents — it could be fake",
          correct: true,
        },
        {
          text: "Type the card to unlock levels",
          correct: false,
        },
        {
          text: "Trust it because the logo looks right",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      icon: <AlertTriangle className="w-7 h-7 text-yellow-400" />,
      tag: "Urgent Message",
      text: "You get a message: “Your friend is stuck, send money now!” What should you do?",
      options: [
        {
          text: "Call your friend or parents to check first",
          correct: true,
        },
        {
          text: "Send money quickly to be helpful",
          correct: false,
        },
        {
          text: "Forward the message to other friends",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      icon: <Mail className="w-7 h-7 text-sky-400" />,
      tag: "Phishing Email",
      text: "An email says, “You won 1 Lakh rupees! Click link and enter OTP.” What now?",
      options: [
        {
          text: "Delete it and show it to parents",
          correct: true,
        },
        {
          text: "Click link and type the OTP to claim prize",
          correct: false,
        },
        {
          text: "Reply with your bank details",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      icon: <Shield className="w-7 h-7 text-emerald-400" />,
      tag: "Info Theft",
      text: "An online stranger offers “Easy money, just share your school details.” Best response?",
      options: [
        {
          text: "Block them and tell a parent or teacher",
          correct: true,
        },
        {
          text: "Share school details for quick money",
          correct: false,
        },
        {
          text: "Ask for more info about the money first",
          correct: false,
        },
      ],
    },
  ];

  const currentQuestionData = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleSelect = (option, index) => {
    if (showResult || showBadge) return;

    setSelectedAnswerIndex(index);
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
      setSelectedAnswerIndex(null);
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
            {["⚠️", "🛡️", "💳", "📱", "✉️", "👀"][i % 6]}
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
              <span className="hidden xs:inline">Badge: Scam Spotter Kid</span>
              <span className="xs:hidden">Scam Spotter</span>
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
        {!showResult && !showBadge && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-rose-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        )}

        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {showBadge ? (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce">
                🛡️🏆
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-700 mb-2 sm:mb-3">
                Scam Spotter Kid Badge!
              </h3>
              <p className="text-rose-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You answered all {totalQuestions} scam questions correctly — amazing scam
                spotting skills!
                <br />
                You know how to slow down, check, and protect yourself from tricky offers.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <button
                onClick={() => navigate(resolvedBackPath)}
                className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:from-rose-600 hover:via-red-600 hover:to-amber-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-rose-200 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    {currentQuestionData.icon}
                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-full border border-rose-200">
                      ⚠️ {currentQuestionData.tag}
                    </span>
                  </div>
                  <p className="text-rose-950 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                    {currentQuestionData.text}
                  </p>

                  {/* Options - Single Row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    {currentQuestionData.options.map((option, index) => {
                      const isSelected = selectedAnswerIndex === index;

                      return (
                        <button
                          key={index}
                          onClick={() => handleSelect(option, index)}
                          disabled={showResult}
                          className={`flex-1 min-w-[130px] sm:min-w-[150px] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none ${
                            !showResult
                              ? "bg-gradient-to-r from-rose-400 via-red-400 to-amber-400 hover:from-rose-500 hover:via-red-500 hover:to-amber-500 text-white border-2 border-white/40"
                              : isSelected && option.correct
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 ring-4 ring-green-200"
                              : isSelected && !option.correct
                              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 ring-4 ring-red-200"
                              : option.correct && showResult
                              ? "bg-gradient-to-r from-green-500/70 to-emerald-600/70 text-white border-2 border-green-400/70"
                              : "bg-gradient-to-r from-rose-200/70 via-red-200/70 to-amber-200/70 text-rose-900 border-2 border-white/40"
                          }`}
                        >
                          <span className="font-bold text-xs sm:text-sm md:text-base">
                            {option.text}
                          </span>
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
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-xl text-center max-w-2xl w-full">
                  <div
                    className={`text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 ${
                      isCorrect ? "animate-bounce" : ""
                    }`}
                  >
                    {isCorrect ? "✅" : "⚠️"}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-800 mb-2 sm:mb-3">
                    {isCorrect ? "You Spotted the Scam!" : "Look Closer Next Time"}
                  </h3>
                  <p className="text-rose-900 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-1">
                    {isCorrect
                      ? "Great job! You chose the safest way to handle this scam."
                      : "A safer scam-spotter choice is: " +
                        currentQuestionData.options.find((opt) => opt.correct)?.text}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 sm:px-10 py-2.5 sm:py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 shadow-lg"
                  >
                    {currentQuestion < totalQuestions - 1 ? "Next Question" : "Finish"}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                🛡️⚠️
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-700 mb-2 sm:mb-3">
                Scam Spotter in Training!
              </h3>
              <p className="text-rose-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You scored {finalScore} out of {totalQuestions} — strong scam awareness!
                <br />
                Keep checking messages, links, and offers with adults to become a true
                Scam Spotter Kid.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-rose-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: If something feels too good, too urgent, or asks for secrets — stop
                and check with a trusted adult.
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
      {finalScore > 0 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={totalQuestions}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-90"
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

export default BadgeScamSpotterKid;