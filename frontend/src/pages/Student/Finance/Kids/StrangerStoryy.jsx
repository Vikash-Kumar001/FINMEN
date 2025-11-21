import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StrangerStoryy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
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
      situation:
        "A stranger offers you a free toy if you tell them your home address.",
      prompt: "What is the safest thing to do?",
      options: [
        {
          text: "Refuse",
          description: "Say no and walk away. Do not share your address.",
          correct: true,
        },
        {
          text: "Accept",
          description: "Take the toy and share your personal details.",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      situation: "Someone online asks for your bank or card details.",
      prompt: "What should you do?",
      options: [
        {
          text: "Say No",
          description: "Refuse and tell a trusted adult immediately.",
          correct: true,
        },
        {
          text: "Give Info",
          description: "Share your card or bank details with them.",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      situation:
        "A stranger offers a big money deal if you act quickly without thinking.",
      prompt: "What is safer?",
      options: [
        {
          text: "Walk Away",
          description: "Leave the situation and avoid talking more.",
          correct: true,
        },
        {
          text: "Engage",
          description: "Stay and talk more about the money deal.",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      situation:
        "You see a message that looks fake or like a trick to get money.",
      prompt: "What should you do next?",
      options: [
        {
          text: "Tell Adult",
          description: "Show it to a parent or teacher you trust.",
          correct: true,
        },
        {
          text: "Stay Quiet",
          description: "Ignore it and keep the message to yourself.",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      situation:
        "You get a strange link on your phone from an unknown number.",
      prompt: "What is the best action?",
      options: [
        {
          text: "Ignore",
          description: "Don’t click the link and block or delete the message.",
          correct: true,
        },
        {
          text: "Reply",
          description: "Click the link and reply to see what it is.",
          correct: false,
        },
      ],
    },
  ];

  const currentData = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleChoice = (option) => {
    if (showResult) return;

    const correct = option.correct;
    setSelectedOption(option.text);
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
      setSelectedOption(null);
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
            {["🚫", "🛡️", "📵", "📱", "👀", "👨‍👩‍👧"][i % 6]}
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
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-sky-500" />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Stranger Story</span>
              <span className="xs:hidden">Stranger Safety</span>
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
        {/* Question Counter (outside card) */}
        {finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-sky-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        )}

        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Story Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-sky-200 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl md:text-2xl">🛡️</span>
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-sky-700">
                      Stay Safe with Strangers
                    </span>
                  </div>
                  <p className="text-sky-950 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 font-semibold leading-relaxed px-1">
                    {currentData.situation}
                  </p>
                  <p className="text-sky-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-bold px-1">
                    {currentData.prompt}
                  </p>

                  {/* Options in one responsive row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    {currentData.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleChoice(option)}
                        disabled={showResult}
                        className={`flex-1 min-w-[130px] sm:min-w-[150px] px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl border-2 transition-all shadow-md bg-sky-50 hover:bg-sky-100 ${
                          selectedOption === option.text && showResult
                            ? option.correct
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-rose-500 bg-rose-50"
                            : "border-sky-200"
                        }`}
                      >
                        <div className="flex flex-col items-start text-left w-full">
                          <span className="font-semibold text-xs sm:text-sm md:text-base text-sky-900">
                            {option.text}
                          </span>
                          <span className="mt-1 text-[11px] sm:text-xs md:text-sm text-sky-700 leading-snug">
                            {option.description}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Progress dots inside card */}
                  <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index < currentQuestion
                            ? "bg-emerald-500 w-5 sm:w-6"
                            : index === currentQuestion
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
                <div
                  className={`text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                  }`}
                >
                  {isCorrect ? "✅" : "⚠️"}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-800 mb-2 sm:mb-3">
                  {isCorrect ? "Safe Choice!" : "Try the Safer Option"}
                </h3>
                <p className="text-sky-900 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-1">
                  {isCorrect
                    ? "Great! You picked the safe action. Keep protecting yourself from strangers."
                    : `The safer choice is: "${
                        currentData.options.find((o) => o.correct)?.text
                      }".`}
                </p>
                <button
                  onClick={handleNext}
                  className="px-8 sm:px-10 py-2.5 sm:py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 shadow-lg"
                >
                  {currentQuestion < totalQuestions - 1 ? "Next Story" : "See Result"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-sky-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                🛡️📵👨‍👩‍👧
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-700 mb-2 sm:mb-3">
                Safety Star!
              </h3>
              <p className="text-sky-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You chose the safe option in {finalScore} out of {totalQuestions} stranger
                situations.
                <br />
                Remember: never share personal details, and always tell a trusted adult
                about strange offers or messages.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-sky-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Be careful with strangers online and offline — safety comes first.
              </p>
              {allQuestionsAnswered && (
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
      {finalScore > 0 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={totalQuestions}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-85"
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

export default StrangerStoryy;