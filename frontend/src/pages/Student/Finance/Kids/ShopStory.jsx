import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShopStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
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
      text: "You're walking home from school and see your favorite candy in the shop window. You have ₹10 in your pocket. You've been saving ₹5 each week for a toy that costs ₹50. You've saved ₹20 so far. What do you do?",
      options: [
        { id: "save", text: "Save for Toy", emoji: "🏦", description: "Keep saving for the ₹50 toy you want", isCorrect: true },
        { id: "spend", text: "Buy Candy", emoji: "🍬", description: "Spend ₹10 on candy now", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "You have ₹30 saved for a new book. You see a cool pen set for ₹15 at the store. What's the smart choice?",
      options: [
        { id: "save", text: "Keep Saving", emoji: "📚", description: "Continue saving for the book", isCorrect: true },
        { id: "spend", text: "Buy Pen Set", emoji: "✏️", description: "Buy the pen set now", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "You saved ₹40 for a bicycle. Your friend wants to go to the movies which costs ₹20. What should you do?",
      options: [
        { id: "save", text: "Save More", emoji: "🚲", description: "Keep saving for the bicycle", isCorrect: true },
        { id: "spend", text: "Go to Movies", emoji: "🎬", description: "Spend ₹20 on the movie", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "You have ₹25 saved. You see a toy you want for ₹20, but you're also saving for a bigger toy that costs ₹100. What do you choose?",
      options: [
        { id: "save", text: "Save for Bigger", emoji: "🎯", description: "Keep saving for the ₹100 toy", isCorrect: true },
        { id: "spend", text: "Buy Now", emoji: "🧸", description: "Buy the ₹20 toy now", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "You've saved ₹60 for a video game. You see snacks at the store for ₹10. Your friend says to buy snacks. What's your decision?",
      options: [
        { id: "save", text: "Save for Game", emoji: "🎮", description: "Keep saving for the video game", isCorrect: true },
        { id: "spend", text: "Buy Snacks", emoji: "🍿", description: "Spend ₹10 on snacks", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === selectedChoice);
    const isCorrect = selectedOption?.isCorrect || false;
    
    setChoice(selectedChoice);
    
    // Save the answer
    const newAnswers = [...answers, { questionId: currentQ.id, choice: selectedChoice, isCorrect }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      // Update coins in real-time for correct answers
      setCoins(prevCoins => prevCoins + 1);
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
      // All questions answered - calculate final score
      // Use the current answers array which should have all answers
      const correctCount = answers.filter(a => a.isCorrect).length;
      setFinalScore(correctCount);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/reflex-money-choice");
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChoice(null);
    resetFeedback();
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setChoice(null);
    setShowResult(false);
    setAnswers([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const getCurrentQuestionData = () => {
    return questions[currentQuestion];
  };

  const currentQuestionData = getCurrentQuestionData();
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = answers.length === questions.length;
  const isCorrect = choice && currentQuestionData?.options.find(opt => opt.id === choice)?.isCorrect;

  // Calculate final score when all questions are answered
  useEffect(() => {
    if (allQuestionsAnswered && finalScore === 0) {
      const correctCount = answers.filter(a => a.isCorrect).length;
      setFinalScore(correctCount);
    }
  }, [allQuestionsAnswered, answers, finalScore]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-teal-100 via-green-50 to-emerald-100 flex flex-col relative overflow-hidden">
      {/* Floating Shop Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
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
            {['🛍️', '🏪', '💰', '🛒'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {showResult && allQuestionsAnswered && finalScore >= 3 && <Confetti />}

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
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🛍️</span>
            <span className="bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Shop Story</span>
              <span className="xs:hidden">Shop</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-teal-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🛍️</span>
            <span className="text-teal-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && !allQuestionsAnswered && (
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
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-teal-300 shadow-xl transform transition-all hover:scale-[1.01]">
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
                          : "bg-gradient-to-r from-teal-500 via-green-500 to-emerald-600 hover:from-teal-600 hover:via-green-600 hover:to-emerald-700 text-white border-teal-400"
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
                          ? "bg-teal-500 w-5 sm:w-6 animate-pulse"
                          : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : !allQuestionsAnswered && showResult ? (
            /* Question Result */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-teal-300 shadow-xl text-center">
              {isCorrect ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎯</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛍️💰</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Great Choice!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You made a smart saving decision!
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                  >
                    {isLastQuestion ? "See Results" : "Next Question"} →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛍️</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Think About It!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    Remember to think about your saving goals before spending.
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    {isLastQuestion ? "See Results" : "Next Question"} →
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Final Results Card */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-teal-300 shadow-xl text-center">
              {finalScore >= 3 ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎯</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛍️💰</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Excellent Work!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-green-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct!
                    <br />
                    You're becoming a smart shopper! 🛍️
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                    You're learning that delayed gratification leads to bigger rewards!
                  </p>
                  {finalScore >= 3 && (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                    >
                      <span className="hidden sm:inline">Continue to Next Level</span>
                      <span className="sm:hidden">Next Level</span> →
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🛍️</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Learning!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-teal-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct.
                    <br />
                    Practice makes perfect! Keep learning about smart shopping!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 🛍️
                  </button>
                  <p className="text-gray-600 text-xs sm:text-sm px-1">
                    Try choosing to stay focused on your bigger goals.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {allQuestionsAnswered && finalScore >= 3 && (
        <GameOverModal
          score={5}
          gameId="finance-kids-8"
          gameType="finance"
          totalLevels={questions.length}
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

export default ShopStory;