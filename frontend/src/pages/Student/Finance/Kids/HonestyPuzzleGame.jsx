import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Puzzle } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HonestyPuzzleGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
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
      text: "Match: Return Money → ?",
      options: [
        {
          text: "Good 😊",
          description: "You give money back to the right person.",
          correct: true,
        },
        {
          text: "Wrong 😞",
          description: "You keep what is not yours.",
          correct: false,
        },
        {
          text: "Neutral 😐",
          description: "You don’t really care what happens.",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      text: "Match: Keep Extra Change → ?",
      options: [
        {
          text: "Wrong 😞",
          description: "You know it’s not yours but keep it.",
          correct: true,
        },
        {
          text: "Good 😊",
          description: "You think it’s a reward for you.",
          correct: false,
        },
        {
          text: "Neutral 😐",
          description: "You feel it doesn’t matter.",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      text: "Match: Tell Truth About Spending → ?",
      options: [
        {
          text: "Good 😊",
          description: "You clearly say how you used the money.",
          correct: true,
        },
        {
          text: "Wrong 😞",
          description: "You hide or change the story.",
          correct: false,
        },
        {
          text: "Neutral 😐",
          description: "You avoid answering honestly.",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      text: "Match: Borrow Without Asking → ?",
      options: [
        {
          text: "Wrong 😞",
          description: "You take money or things without permission.",
          correct: true,
        },
        {
          text: "Good 😊",
          description: "You think it’s okay since you know them.",
          correct: false,
        },
        {
          text: "Neutral 😐",
          description: "You will ‘maybe’ return it later.",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      text: "Match: Save Honestly for Goals → ?",
      options: [
        {
          text: "Good 😊",
          description: "You use your own saved money for goals.",
          correct: true,
        },
        {
          text: "Wrong 😞",
          description: "You use others’ money without asking.",
          correct: false,
        },
        {
          text: "Neutral 😐",
          description: "You don’t really plan or save.",
          correct: false,
        },
      ],
    },
  ];

  const currentData = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleSelect = (option, index) => {
    if (showResult) return;

    const correct = option.correct;
    setSelectedIndex(index);
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
      setSelectedIndex(null);
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
            {["🧩", "🤝", "💰", "✅", "⚖️", "📜"][i % 6]}
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
            <Puzzle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500" />
            <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Puzzle of Honesty</span>
              <span className="xs:hidden">Honesty Puzzle</span>
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

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-emerald-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-3 sm:space-y-4">
                {/* Question Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-emerald-200 shadow-lg">
                  <p className="text-emerald-900 text-xs sm:text-sm md:text-base font-semibold text-center mb-3 sm:mb-4">
                    {currentData.text}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {currentData.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(option, index)}
                        disabled={showResult}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 border-2 ${
                          selectedIndex === index && showResult
                            ? option.correct
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white ring-2 ring-yellow-300"
                              : "bg-gradient-to-r from-red-500 to-rose-600 border-red-400 text-white opacity-90"
                            : option.correct && showResult
                            ? "bg-gradient-to-r from-green-500/80 to-emerald-600/80 border-green-400/80 text-white"
                            : "bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50 border-emerald-200 text-emerald-900"
                        } ${showResult ? "cursor-default" : ""}`}
                      >
                        <h3 className="font-bold text-xs sm:text-sm md:text-base mb-1 sm:mb-2 text-center">
                          {option.text}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-center leading-snug text-emerald-800/80">
                          {option.description}
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
                            ? "bg-emerald-500 w-5 sm:w-6 animate-pulse"
                            : "bg-emerald-200 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
                  <div
                    className={`text-6xl sm:text-7xl md:text-8xl mb-4 ${
                      isCorrect ? "animate-bounce" : ""
                    }`}
                  >
                    {isCorrect ? "✅" : "🤔"}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 mb-2 sm:mb-4">
                    {isCorrect ? "Great Match!" : "Better Match Possible"}
                  </h3>
                  <p className="text-lg sm:text-xl text-emerald-900 mb-6 sm:mb-8 leading-relaxed px-1">
                    {isCorrect
                      ? "Nice! You matched the honest action correctly."
                      : "The best match is: " +
                        currentData.options.find((opt) => opt.correct)?.text}
                  </p>
                  <button
                    onClick={handleNext}
                    className="px-8 sm:px-10 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                  >
                    {currentQuestion < totalQuestions - 1 ? "Next Puzzle" : "See Result"}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 animate-bounce">
                🧩💚
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3">
                Honesty Puzzle Master!
              </h3>
              <p className="text-emerald-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You solved {finalScore} out of {totalQuestions} honesty puzzles.
                <br />
                Matching “good” with honest actions helps you remember what is right with
                money.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-emerald-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Returning money, telling the truth, and asking before borrowing are
                always the “good” matches in real life too.
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
          gameId="finance-kids-94"
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

export default HonestyPuzzleGame;