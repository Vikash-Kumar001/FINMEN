import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BirthdayMoneyStory = () => {
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
      text: "You received ₹50 as a birthday gift. Your friend wants you to spend it all on toys right away. What do you do?",
      options: [
        { id: "save", text: "Save Some", emoji: "🏦", description: "Put ₹30 in savings for something bigger later", isCorrect: true },
        { id: "spend", text: "Spend All", emoji: "🛍️", description: "Buy toys and treats right now with all ₹50", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "You got ₹100 for your birthday. You want a video game that costs ₹80, but you're also saving for a bicycle. What's your choice?",
      options: [
        { id: "save", text: "Save for Bicycle", emoji: "🚲", description: "Keep saving for the bicycle you want", isCorrect: true },
        { id: "spend", text: "Buy Game Now", emoji: "🎮", description: "Buy the video game immediately", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Your birthday money is ₹60. You see a cool toy for ₹40, but you're saving for a book set that costs ₹200. What do you do?",
      options: [
        { id: "save", text: "Save for Books", emoji: "📚", description: "Add to your savings for the book set", isCorrect: true },
        { id: "spend", text: "Buy Toy", emoji: "🧸", description: "Buy the toy you want now", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "You received ₹30 as birthday money. Your sibling wants to go to the movies which costs ₹25. You're saving for a tablet. What's your decision?",
      options: [
        { id: "save", text: "Save for Tablet", emoji: "📱", description: "Keep saving for the tablet", isCorrect: true },
        { id: "spend", text: "Go to Movies", emoji: "🎬", description: "Spend the money on the movie", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "You got ₹40 for your birthday. You see snacks you want for ₹15, but you're saving for a bigger goal. What's the smart choice?",
      options: [
        { id: "save", text: "Save for Goal", emoji: "🎯", description: "Keep saving for your bigger goal", isCorrect: true },
        { id: "spend", text: "Buy Snacks", emoji: "🍿", description: "Buy the snacks you want", isCorrect: false }
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
      const correctCount = answers.filter(a => a.isCorrect).length;
      setFinalScore(correctCount);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/poster-saving-habit");
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
      // Award 5 coins when game finishes
      setCoins(5);
    }
  }, [allQuestionsAnswered, answers, finalScore]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 flex flex-col relative overflow-hidden">
      {/* Floating Birthday Elements Background */}
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
            {['🎉', '🎈', '🎁', '🎂'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {allQuestionsAnswered && finalScore >= 3 && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-pink-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-pink-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-pink-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🎂</span>
            <span className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Birthday Money Story</span>
              <span className="xs:hidden">Birthday Story</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-pink-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🎂</span>
            <span className="text-pink-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
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
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-pink-300 shadow-xl transform transition-all hover:scale-[1.01]">
                {/* Birthday Icon */}
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 animate-bounce">🎂</div>
                
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
                          : "bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 hover:from-pink-600 hover:via-yellow-600 hover:to-blue-600 text-white border-pink-400"
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
                          ? "bg-pink-500 w-5 sm:w-6 animate-pulse"
                          : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : !allQuestionsAnswered && showResult ? (
            /* Question Result */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-pink-300 shadow-xl text-center">
              {isCorrect ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎯</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🎂💰</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Great Choice!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You made a smart saving decision!
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 hover:from-pink-600 hover:via-yellow-600 hover:to-blue-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                  >
                    {isLastQuestion ? "See Results" : "Next Question"} →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🎂</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Think About It!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    Remember, saving helps you reach bigger goals!
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 hover:from-pink-600 hover:via-yellow-600 hover:to-blue-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    {isLastQuestion ? "See Results" : "Next Question"} →
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Final Results Card */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-pink-300 shadow-xl text-center">
              {finalScore >= 3 ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎉</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🎂💰</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Excellent Work!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-green-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct!
                    <br />
                    You're learning to balance enjoying today with planning for tomorrow! 🎂
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                    You're learning to balance enjoying today with planning for tomorrow!
                  </p>
                  {finalScore >= 3 && (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 hover:from-pink-600 hover:via-yellow-600 hover:to-blue-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                    >
                      <span className="hidden sm:inline">Continue to Next Level</span>
                      <span className="sm:hidden">Next Level</span> →
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🎂</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Learning!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-pink-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct.
                    <br />
                    Remember, saving helps you reach bigger goals!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 hover:from-pink-600 hover:via-yellow-600 hover:to-blue-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 🎂
                  </button>
                  <p className="text-gray-600 text-xs sm:text-sm px-1">
                    Try choosing to save some money for later.
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
          gameId="finance-kids-5"
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

export default BirthdayMoneyStory;