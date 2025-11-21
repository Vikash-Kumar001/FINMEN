import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolFairStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [choice, setChoice] = useState(null);
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
      text: "You have ₹50 for the fair. What do you do?",
      options: [
        { 
          id: "plan", 
          text: "Plan for Both", 
          emoji: "🎯", 
          description: "Budget for food and fun activities",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend on Toys", 
          emoji: "🧸", 
          description: "Buy toys right away",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You want snacks and games. What's smarter?",
      options: [
        { 
          id: "budget", 
          text: "Budget Food", 
          emoji: "🍎", 
          description: "Plan money for both snacks and games",
          isCorrect: true
        },
        { 
          id: "games", 
          text: "Buy Games", 
          emoji: "🎮", 
          description: "Spend all on games only",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You get ₹30 more. What now?",
      options: [
        { 
          id: "save", 
          text: "Save Some", 
          emoji: "💰", 
          description: "Save part of it for later",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend All", 
          emoji: "💸", 
          description: "Spend everything immediately",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your friend has no money. What do you do?",
      options: [
        { 
          id: "share", 
          text: "Share with Friend", 
          emoji: "🤝", 
          description: "Share some money with your friend",
          isCorrect: true
        },
        { 
          id: "keep", 
          text: "Keep All", 
          emoji: "💼", 
          description: "Keep all money for yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see cool toys. What's the best choice?",
      options: [
        { 
          id: "one", 
          text: "Buy One Toy", 
          emoji: "🎁", 
          description: "Choose one toy you really want",
          isCorrect: true
        },
        { 
          id: "many", 
          text: "Buy Many", 
          emoji: "🛍️", 
          description: "Buy as many toys as possible",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (choice !== null) return;
    
    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === selectedChoice);
    const isCorrect = selectedOption?.isCorrect || false;
    
    setChoice(selectedChoice);
    setChoices([...choices, { questionId: currentQ.id, choice: selectedChoice, isCorrect }]);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setChoice(null);
        resetFeedback();
      } else {
        const correctAnswers = [...choices, { questionId: currentQ.id, choice: selectedChoice, isCorrect }].filter(a => a.isCorrect).length;
        setFinalScore(correctAnswers);
        setCoins(5);
        setShowResult(true);
      }
    }, isCorrect ? 1500 : 1000);
  };

  const handleNext = () => {
    navigate(resolvedBackPath);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setChoice(null);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const allQuestionsAnswered = choices.length === questions.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-teal-100 via-emerald-50 to-green-100 flex flex-col relative overflow-hidden">
      {/* Floating Fair Elements Background */}
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
            {['🎪', '🎈', '🎯', '🎮', '🍎', '🎁'][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-teal-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-teal-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-teal-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🎪</span>
            <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">School Fair Story</span>
              <span className="xs:hidden">Fair Story</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-teal-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🎪</span>
            <span className="text-teal-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
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
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-teal-300 shadow-xl">
              <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-semibold leading-relaxed px-1">
                {questions[currentQuestion].text}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                {questions[currentQuestion].options.map((option) => {
                  const isSelected = choice === option.id;
                  const isCorrect = option.isCorrect;
                  const showFeedback = choice !== null;
                  
                  let buttonClass = "bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 hover:from-teal-500 hover:via-emerald-500 hover:to-green-500 text-white";
                  
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
                      className={`${buttonClass} p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      <div className="text-3xl sm:text-4xl mb-2">{option.emoji}</div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1">{option.text}</h3>
                      <p className="text-xs sm:text-sm text-white/90">{option.description}</p>
                      {showFeedback && isSelected && (
                        <div className="mt-2 text-2xl">
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
                        ? "bg-teal-500 w-5 sm:w-6 animate-pulse"
                        : "bg-gray-300 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>
            </div>
          ) : (
            /* Results Card */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-teal-300 shadow-xl text-center max-w-2xl w-full">
              {finalScore >= 3 ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">🎪✨</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Fair Budget Star!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You scored {finalScore} out of {questions.length}!
                    <br />
                    You made smart budgeting choices at the fair! 🎯
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                    Lesson: Budget for fun and needs!
                  </p>
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
                    Remember to budget for both fun and needs!
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 🎪
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
          gameId="finance-kids-28"
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

export default SchoolFairStory;
