import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const IceCreamVsBookStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choice, setChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
      text: "You have ₹20. Buy ice cream or a book for class?",
      options: [
        { id: "icecream", text: "Buy ice cream", emoji: "🍦", isCorrect: false },
        { id: "book", text: "Buy a book", emoji: "📚", isCorrect: true },
        { id: "toys", text: "Spend on toys", emoji: "🧸", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "A book costs ₹15, ice cream ₹10. You have ₹12. What's smart?",
      options: [
        { id: "save", text: "Save ₹3 more for the book", emoji: "💰", isCorrect: true },
        { id: "icecream", text: "Buy ice cream now", emoji: "🍦", isCorrect: false },
        { id: "borrow", text: "Borrow ₹3", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "You saved ₹20. A sale offers books for ₹18. Can you buy one?",
      options: [
        { id: "yes", text: "Yes, and have ₹2 left", emoji: "📚", isCorrect: true },
        { id: "no", text: "No, need ₹2 more", emoji: "📉", isCorrect: false },
        { id: "icecream", text: "Buy ice cream instead", emoji: "🍦", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "Your friend wants ice cream but you need a book. What do you do?",
      options: [
        { id: "stick", text: "Stick to buying the book", emoji: "✅", isCorrect: true },
        { id: "split", text: "Split money for ice cream", emoji: "🎉", isCorrect: false },
        { id: "give", text: "Give money to friend", emoji: "🎁", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "Why is choosing a book over ice cream smart?",
      options: [
        { id: "learn", text: "Helps you learn and grow", emoji: "🧠", isCorrect: true },
        { id: "taste", text: "Tastes better than ice cream", emoji: "🍦", isCorrect: false },
        { id: "friends", text: "Gets you more friends", emoji: "👥", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (selectedChoice) => {
    if (choice !== null) return;
    
    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === selectedChoice);
    const isCorrect = selectedOption?.isCorrect || false;
    
    setChoice(selectedChoice);
    setAnswers([...answers, { questionId: currentQ.id, choice: selectedChoice, isCorrect }]);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setChoice(null);
        resetFeedback();
      } else {
        const correctAnswers = [...answers, { questionId: currentQ.id, choice: selectedChoice, isCorrect }].filter(a => a.isCorrect).length;
        setFinalScore(correctAnswers);
        setCoins(5);
        setShowResult(true);
      }
    }, isCorrect ? 1500 : 1000);
  };

  const handleNext = () => {
    navigate(resolvedBackPath);
  };

  const allQuestionsAnswered = answers.length === questions.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Floating Book/Ice Cream Elements Background */}
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
            {['📚', '🍦', '🧠', '💰', '✅', '🎓'][i % 6]}
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
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">📚</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Ice Cream vs Book Story</span>
              <span className="xs:hidden">Book Story</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-blue-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">📚</span>
            <span className="text-blue-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {!showResult ? (
            <div className="space-y-2 sm:space-y-3">
              {/* Question Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">📚🍦</div>
              <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-semibold leading-relaxed px-1">
                {questions[currentQuestion].text}
              </p>

              {/* Options - Single Row */}
              <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                {questions[currentQuestion].options.map((option) => {
                  const isSelected = choice === option.id;
                  const isCorrect = option.isCorrect;
                  const showFeedback = choice !== null;
                  
                  let buttonClass = "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white";
                  
                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = isCorrect
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white ring-4 ring-green-200"
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white ring-4 ring-red-200";
                    } else if (isCorrect) {
                      buttonClass = "bg-gradient-to-r from-green-500 to-emerald-600 text-white ring-4 ring-green-200";
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option.id)}
                      disabled={choice !== null}
                      className={`${buttonClass} flex-1 min-w-[120px] sm:min-w-[150px] p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl mb-2">{option.emoji}</div>
                      <h3 className="font-bold text-xs sm:text-sm md:text-base">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <div className="mt-2 text-xl sm:text-2xl">
                          {isCorrect ? "✓" : "✗"}
                        </div>
                      )}
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
            /* Results Card */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-300 shadow-xl text-center max-w-2xl w-full">
              {finalScore >= 3 ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">🎉📚</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Smart Learner!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You earned {finalScore} out of {questions.length} — great choices!
                    <br />
                    You understand the value of choosing needs over wants! 🧠
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                    Lesson: Choosing needs over wants helps you learn and grow!
                  </p>
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                    >
                      <span className="hidden sm:inline">Continue to Next Level</span>
                      <span className="sm:hidden">Next Level</span> →
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">😔</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Learning!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got {finalScore} out of {questions.length} questions correct.
                    Remember, books help you learn while ice cream is just a treat!
                  </p>
                  <button
                    onClick={() => {
                      setShowResult(false);
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setChoice(null);
                      setCoins(0);
                      setFinalScore(0);
                      resetFeedback();
                    }}
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 📚
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confetti and Score Flash */}
      {showAnswerConfetti && <Confetti duration={2000} />}
      {flashPoints > 0 && <ScoreFlash points={flashPoints} />}

      {/* Game Over Modal */}
      {showResult && finalScore >= 3 && (
        <GameOverModal
          score={5}
          gameId="finance-kids-31"
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

export default IceCreamVsBookStory;
