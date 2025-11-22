import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CandyOfferStory = () => {
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
      text: "A shop offers 'Buy 1, Get 1 Free' candy. You don't really need more candy. What should you do?",
      options: [
        { 
          id: "need", 
          text: "Don't buy", 
          emoji: "🙅", 
          description: "Don't buy because you don't need extra candy",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy anyway", 
          emoji: "🙋", 
          description: "Buy because it's a good deal",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A 'Buy 2, Get 1 Free' offer on toys. You already have many toys. What's smart?",
      options: [
        { 
          id: "need", 
          text: "Skip the offer", 
          emoji: "⏭️", 
          description: "Don't buy because you have enough toys",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Take the deal", 
          emoji: "🛒", 
          description: "Buy because you're getting a free item",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A '3 for the price of 2' deal on snacks. You just bought snacks yesterday. What should you do?",
      options: [
        { 
          id: "need", 
          text: "Wait until needed", 
          emoji: "⏳", 
          description: "Wait until you need more snacks",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy now", 
          emoji: "😋", 
          description: "Buy because it's a savings opportunity",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A 'Buy 1, Get 1 Half Off' deal on books. You need one book for school. What's wise?",
      options: [
        { 
          id: "need", 
          text: "Buy just one", 
          emoji: "📚", 
          description: "Buy only the book you need",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy two", 
          emoji: "📖", 
          description: "Buy two to get the discount",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A 'Buy 3, Get 50% Off' deal on clothes. You have enough clothes. What should you choose?",
      options: [
        { 
          id: "need", 
          text: "Pass on deal", 
          emoji: "❌", 
          description: "Don't buy because you don't need more clothes",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Take advantage", 
          emoji: "👗", 
          description: "Buy because it's a big discount",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (choice !== null) return; // Prevent multiple selections
    
    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === selectedChoice);
    const isCorrect = selectedOption?.isCorrect || false;
    
    setChoice(selectedChoice);
    const newAnswers = [...answers, { questionId: currentQ.id, choice: selectedChoice, isCorrect }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      // Update coins in real-time for correct answers
      setCoins(prevCoins => prevCoins + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setChoice(null);
        resetFeedback();
      } else {
        // Calculate final score
        const correctAnswers = newAnswers.filter(a => a.isCorrect).length;
        setFinalScore(correctAnswers);
        setShowResult(true);
      }
    }, isCorrect ? 1500 : 1000);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/reflex-needs-first");
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setChoice(null);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const allQuestionsAnswered = answers.length === questions.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-pink-100 via-rose-50 to-orange-100 flex flex-col relative overflow-hidden">
      {/* Floating Candy Elements Background */}
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
            {['🍬', '🍭', '🍫', '🛒', '💰', '🎁'][i % 6]}
          </div>
        ))}
      </div>

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
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🍬</span>
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Candy Offer Story</span>
              <span className="xs:hidden">Candy Offer</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-pink-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🍬</span>
            <span className="text-pink-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult ? (
          <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-2 sm:mb-3">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all ${
                    index === currentQuestion
                      ? 'bg-pink-500 w-6 sm:w-8'
                      : index < currentQuestion
                      ? 'bg-pink-300'
                      : 'bg-pink-200'
                  }`}
                />
              ))}
            </div>

            {/* Question Counter */}
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>

            {/* Question Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-pink-300 shadow-xl">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🍬</div>
              
              <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-semibold leading-relaxed px-1">
                {questions[currentQuestion].text}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {questions[currentQuestion].options.map((option) => {
                  const isSelected = choice === option.id;
                  const isCorrect = option.isCorrect;
                  const showFeedback = choice !== null;
                  
                  let buttonClass = "bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 hover:from-pink-500 hover:via-rose-500 hover:to-orange-500 text-white";
                  
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
                      <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2">{option.text}</h3>
                      <p className="text-white/90 text-xs sm:text-sm leading-relaxed">{option.description}</p>
                      {showFeedback && isSelected && (
                        <div className="mt-2 text-2xl">
                          {isCorrect ? "✓" : "✗"}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Results Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-pink-300 shadow-xl text-center max-w-2xl w-full">
              {finalScore >= 3 ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">🍬</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">✨</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Smart Decision Maker!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got {finalScore} out of {questions.length} questions correct!
                    You understand when to pass on deals that aren't necessary!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                    You know that good deals aren't always good if you don't need the items!
                  </p>
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
                    Remember, just because something is on sale doesn't mean you should buy it!
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 🍬
                  </button>
                  <p className="text-gray-600 text-xs sm:text-sm px-1">
                    Try to choose the option that considers whether you actually need the item.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confetti and Score Flash */}
      {showAnswerConfetti && <Confetti duration={2000} />}
      {flashPoints > 0 && <ScoreFlash points={flashPoints} />}

      {/* Game Over Modal */}
      {showResult && finalScore >= 3 && (
        <GameOverModal
          score={5}
          gameId="finance-kids-18"
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

export default CandyOfferStory;
