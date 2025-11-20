import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShopStory2 = () => {
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
      text: "You see two pens in the store. One costs ₹50 and the other costs ₹15. Both work the same. Which should you buy?",
      options: [
        { 
          id: "affordable", 
          text: "Affordable pen", 
          emoji: "✏️", 
          description: "Buy the ₹15 pen that works just as well",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Costly pen", 
          emoji: "🖋️", 
          description: "Buy the ₹50 pen because it looks better",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have ₹100 to spend on clothes. You find a shirt you like for ₹80 and another similar one for ₹30. What's smart?",
      options: [
        { 
          id: "affordable", 
          text: "Buy cheaper shirt", 
          emoji: "👕", 
          description: "Save ₹50 by buying the ₹30 shirt",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy expensive shirt", 
          emoji: "👔", 
          description: "Spend more on the ₹80 shirt",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're buying snacks for a party. Brand A costs ₹200 and Brand B costs ₹120. Both have the same amount. Which?",
      options: [
        { 
          id: "affordable", 
          text: "Buy Brand B", 
          emoji: "🍪", 
          description: "Save ₹80 by choosing the cheaper brand",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy Brand A", 
          emoji: "🍫", 
          description: "Spend more on the expensive brand",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You need a backpack for school. One costs ₹800 and another costs ₹400. Both are good quality. What's wise?",
      options: [
        { 
          id: "affordable", 
          text: "Buy ₹400 backpack", 
          emoji: "🎒", 
          description: "Save ₹400 by choosing the affordable option",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy ₹800 backpack", 
          emoji: "💼", 
          description: "Spend more on the expensive backpack",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You're buying groceries. Organic vegetables cost ₹300 and regular ones cost ₹150. Both are nutritious. Which?",
      options: [
        { 
          id: "affordable", 
          text: "Buy regular veggies", 
          emoji: "🥕", 
          description: "Save ₹150 by choosing regular vegetables",
          isCorrect: true
        },
        { 
          id: "costly", 
          text: "Buy organic veggies", 
          emoji: "🥦", 
          description: "Spend more on organic vegetables",
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
      // Award 5 coins when game finishes
      setCoins(5);
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
    navigate("/student/finance/kids/poster-smart-shopping");
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const currentQuestionData = getCurrentQuestion();
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = choices.length === questions.length;
  const isCorrect = choice && currentQuestionData?.options.find(opt => opt.id === choice)?.isCorrect;

  // Calculate final score when all questions are answered
  useEffect(() => {
    if (allQuestionsAnswered && finalScore === 0 && choices.length > 0) {
      const correctCount = choices.filter(c => c.isCorrect).length;
      setFinalScore(correctCount);
      // Award 5 coins when game finishes
      setCoins(5);
    }
  }, [allQuestionsAnswered, choices, finalScore]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Floating Shop Elements Background */}
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
            {['🛒', '💰', '🏪', '💵'][i % 4]}
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
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🛒</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Shop Story 2</span>
              <span className="xs:hidden">Shop 2</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-indigo-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🛒</span>
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
              Story Complete!
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center min-h-0">
          {!allQuestionsAnswered && !showResult && currentQuestionData ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Story Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-indigo-300 shadow-xl transform transition-all hover:scale-[1.01]">
                {/* Shop Icon */}
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🏪</div>
                
                <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                  {currentQuestionData.text}
                </p>
                
                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {currentQuestionData.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option.id)}
                      disabled={showResult}
                      className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 ${
                        showResult && choice === option.id
                          ? option.isCorrect
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400"
                            : "bg-gradient-to-r from-red-500 to-orange-600 text-white border-red-400"
                          : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white border-indigo-400"
                      } ${showResult ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{option.emoji}</div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{option.text}</h3>
                      <p className="text-white/95 text-xs sm:text-sm">{option.description}</p>
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
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛒💰</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Smart Choice!</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      You're learning to compare prices and make wise purchases!
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
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛒</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Think About It!</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      Remember, choosing affordable options with similar quality saves money!
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
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛒💰</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Excellent!</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      You got <span className="font-bold text-green-600">{finalScore}</span> out of{" "}
                      <span className="font-bold">{questions.length}</span> questions correct!
                      <br />
                      You're becoming a smart shopper! 🛒
                    </p>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">💰</span>
                      <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                      You understand that comparing prices and choosing affordable options is smart!
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
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛒</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Learning!</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                      You got <span className="font-bold text-indigo-600">{finalScore}</span> out of{" "}
                      <span className="font-bold">{questions.length}</span> questions correct.
                      <br />
                      Remember, smart shopping means comparing prices!
                    </p>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                      <span className="text-xl sm:text-2xl">💰</span>
                      <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                    </div>
                    <button
                      onClick={handleTryAgain}
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                    >
                      Try Again 🛒
                    </button>
                    <p className="text-gray-600 text-xs sm:text-sm px-1">
                      Try to choose the option that saves money while still meeting your needs.
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
          gameId="finance-kids-15"
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

export default ShopStory2;
