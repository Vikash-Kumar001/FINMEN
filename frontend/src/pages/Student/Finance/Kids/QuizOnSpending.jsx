import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSpending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
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
      text: "What is the best spending habit?",
      options: [
        { 
          id: "a", 
          text: "Buy without thinking", 
          emoji: "💸", 
          description: "Purchase things immediately when you want them",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Compare and choose", 
          emoji: "🤔", 
          description: "Look at different options and choose the best one",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Borrow for fun", 
          emoji: "💳", 
          description: "Use credit to buy things you want",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which is a smart way to spend money?",
      options: [
        { 
          id: "a", 
          text: "Spend all at once", 
          emoji: "🛍️", 
          description: "Use all your money on one big purchase",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Budget first", 
          emoji: "📋", 
          description: "Plan what you'll spend before buying",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Buy what's popular", 
          emoji: "🔥", 
          description: "Buy things just because others have them",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do before a big purchase?",
      options: [
        { 
          id: "a", 
          text: "Save up first", 
          emoji: "🏦", 
          description: "Set aside money over time for the purchase",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Buy on credit", 
          emoji: "💳", 
          description: "Use a credit card even if you can't pay immediately",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask friends", 
          emoji: "👥", 
          description: "Buy what your friends think you should buy",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which spending habit helps you in the future?",
      options: [
        { 
          id: "a", 
          text: "Spend on wants", 
          emoji: "🎯", 
          description: "Buy things you want right now",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Save for needs", 
          emoji: "💰", 
          description: "Set money aside for important future needs",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Buy expensive items", 
          emoji: "💎", 
          description: "Always choose the most expensive options",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the smartest approach to shopping?",
      options: [
        { 
          id: "a", 
          text: "Impulse buying", 
          emoji: "⚡", 
          description: "Buy things immediately when you see them",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Make a list", 
          emoji: "📝", 
          description: "Plan what you need before going shopping",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Follow trends", 
          emoji: "📈", 
          description: "Buy what's currently popular",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === selectedChoice);
    const isCorrect = selectedOption?.isCorrect || false;
    
    setChoice(selectedChoice);
    
    // Save the answer
    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect
    }];
    setChoices(newChoices);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show result, then move to next question or finish
    setTimeout(() => {
      setShowResult(true);
    }, isCorrect ? 1000 : 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setChoice(null);
      setShowResult(false);
      resetFeedback();
    } else {
      // Calculate final score
      const correctAnswers = choices.filter(c => c.isCorrect).length;
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
    navigate("/student/finance/kids/reflex-spending");
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const currentQuestionData = getCurrentQuestion();
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = choices.length === questions.length;
  const isCorrect = choice && currentQuestionData?.options.find(opt => opt.id === choice)?.isCorrect;

  // Calculate final score when all questions are answered
  useEffect(() => {
    if (allQuestionsAnswered && finalScore === 0) {
      const correctCount = choices.filter(c => c.isCorrect).length;
      setFinalScore(correctCount);
      // Award 5 coins when game finishes
      setCoins(5);
    }
  }, [allQuestionsAnswered, choices, finalScore]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Floating Quiz Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-lg sm:text-2xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {['📝', '❓', '💡', '✅'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {allQuestionsAnswered && finalScore >= 3 && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-indigo-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-indigo-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-indigo-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">📝</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Quiz on Spending</span>
              <span className="xs:hidden">Quiz Spending</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-indigo-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">📝</span>
            <span className="text-indigo-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
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
              Quiz Complete!
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center min-h-0">
          {!allQuestionsAnswered && !showResult && currentQuestionData ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Question Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-indigo-300 shadow-xl">
                {/* Quiz Icon */}
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">❓</div>
                
                <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                  {currentQuestionData.text}
                </p>
                
                {/* Options */}
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option.id)}
                      disabled={showResult}
                      className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-left border-2 ${
                        showResult && choice === option.id
                          ? option.isCorrect
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400"
                            : "bg-gradient-to-r from-red-500 to-orange-600 text-white border-red-400"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-indigo-400"
                      } ${showResult ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-white/20 rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm sm:text-base md:text-lg">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl">{option.emoji}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1">{option.text}</h3>
                          <p className="text-white/95 text-xs sm:text-sm">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progress Indicator */}
                <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index < currentQuestion
                          ? "bg-green-500 w-5 sm:w-6"
                          : index === currentQuestion
                          ? "bg-indigo-500 w-5 sm:w-6 animate-pulse"
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
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-indigo-300 shadow-xl text-center">
              {isCorrect ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎯</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">✅</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Correct!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    Great answer! You're learning about smart spending!
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                  >
                    {isLastQuestion ? "See Results" : "Next Question"} →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">❌</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Not Quite</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    Think about smart spending habits like planning and comparing!
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
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
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-indigo-300 shadow-xl text-center">
              {finalScore >= 3 ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎉</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">📝✅</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Excellent!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-green-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct!
                    <br />
                    You know how to make smart spending choices! 📝
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                    You understand the importance of comparing options and planning before spending!
                  </p>
                  {finalScore >= 3 && (
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
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">📝</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Learning!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-indigo-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct.
                    <br />
                    Remember, smart spending means thinking before you buy!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <button
                    onClick={handleTryAgain}
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 📝
                  </button>
                  <p className="text-gray-600 text-xs sm:text-sm px-1">
                    Try to choose the option that involves planning and comparing before spending.
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
          gameId="finance-kids-12"
          gameType="finance"
          totalLevels={1}
          coinsPerLevel={1}
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

export default QuizOnSpending;