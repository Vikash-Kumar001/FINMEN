import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeSmartSpenderKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [coins, setCoins] = useState(0);
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

  const scenarios = [
    {
      id: 1,
      title: "Birthday Money",
      description: "You received ₹500 as a birthday gift. What do you do?",
      choices: [
        { 
          id: "save", 
          text: "Save ₹300, spend ₹200", 
          emoji: "💰", 
          description: "Save most of it for future needs",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all on toys", 
          emoji: "🧸", 
          description: "Buy toys and treats with all the money",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Sale Offer",
      description: "Your favorite toy is on 50% off, but you already have similar toys. Do you buy it?",
      choices: [
        { 
          id: "need", 
          text: "Don't buy", 
          emoji: "🙅", 
          description: "Don't buy because you don't need another toy",
          isCorrect: true
        },
        { 
          id: "want", 
          text: "Buy because it's cheap", 
          emoji: "🛒", 
          description: "Buy because it's a good deal",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Shopping List",
      description: "You're going to the market with ₹300. What's the smart approach?",
      choices: [
        { 
          id: "plan", 
          text: "Make a list first", 
          emoji: "📋", 
          description: "Plan what you need before shopping",
          isCorrect: true
        },
        { 
          id: "impulse", 
          text: "Buy what looks good", 
          emoji: "🛍️", 
          description: "Buy things that catch your eye",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Comparing Prices",
      description: "The same notebook is ₹50 at one store and ₹40 at another. Which do you choose?",
      choices: [
        { 
          id: "compare", 
          text: "Buy for ₹40", 
          emoji: "🔍", 
          description: "Save ₹10 by choosing the cheaper option",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Buy for ₹50", 
          emoji: "💸", 
          description: "Buy from the first store you visited",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Impulse Purchase",
      description: "You planned to buy fruits for ₹100 but see candy on the way. What do you do?",
      choices: [
        { 
          id: "stick", 
          text: "Buy only fruits", 
          emoji: "🍎", 
          description: "Stick to your original plan",
          isCorrect: true
        },
        { 
          id: "add", 
          text: "Buy fruits and candy", 
          emoji: "🍬", 
          description: "Add candy to your purchase",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const currentS = scenarios[currentScenario];
    const selectedOption = currentS.choices.find(opt => opt.id === selectedChoice);
    const isCorrect = selectedOption?.isCorrect || false;
    
    setChoice(selectedChoice);
    
    // Save the answer
    const newAnswers = [...answers, { scenarioId: currentS.id, choice: selectedChoice, isCorrect }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show result
    setTimeout(() => {
      setShowResult(true);
    }, isCorrect ? 1000 : 0);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setChoice(null);
      setShowResult(false);
      resetFeedback();
    } else {
      // Last scenario - the useEffect will handle final score and badge
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setChoice(null);
    setShowResult(false);
    setAnswers([]);
    setCoins(0);
    setFinalScore(0);
    setShowBadge(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
  };

  const getCurrentScenarioData = () => {
    return scenarios[currentScenario];
  };

  const currentScenarioData = getCurrentScenarioData();
  const isLastScenario = currentScenario === scenarios.length - 1;
  const allScenariosAnswered = answers.length === scenarios.length;
  const isCorrect = choice && currentScenarioData?.choices.find(opt => opt.id === choice)?.isCorrect;

  // Calculate final score when all scenarios are answered
  useEffect(() => {
    if (allScenariosAnswered && answers.length === scenarios.length && !showBadge && finalScore === 0) {
      const correctCount = answers.filter(a => a.isCorrect).length;
      setFinalScore(correctCount);
      // Award 5 coins when game finishes
      setCoins(5);
      if (correctCount === scenarios.length) {
        // All correct - show badge
        setTimeout(() => {
          setShowBadge(true);
          showCorrectAnswerFeedback(5, true);
        }, 500);
      } else {
        // Not all correct - show results
        setShowResult(true);
      }
    }
  }, [allScenariosAnswered, answers.length, scenarios.length, showBadge, finalScore]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Celebration Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
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
            {['🏆', '🎉', '⭐', '✨', '🎊'][i % 5]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={2000} />}
      {showBadge && <Confetti />}
      {allScenariosAnswered && finalScore === scenarios.length && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-purple-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-purple-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-purple-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">🏅</span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Badge: Smart Spender Kid</span>
              <span className="xs:hidden">Smart Spender</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-purple-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">🏅</span>
            <span className="text-purple-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showBadge && !allScenariosAnswered && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Scenario {currentScenario + 1} of {scenarios.length}
            </p>
          </div>
        )}
        {allScenariosAnswered && !showBadge && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Complete! Earn your badge by making smart spending decisions in all scenarios.
            </p>
          </div>
        )}
        {showBadge && (
          <div className="mb-2 sm:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
              Badge Unlocked! 🎉
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center min-h-0">
          {!allScenariosAnswered && !showResult && currentScenarioData ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Scenario Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-purple-300 shadow-xl">
                {/* Medal Icon */}
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🏅</div>
                
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 mb-2 sm:mb-3">{currentScenarioData.title}</h3>
                
                <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                  {currentScenarioData.description}
                </p>
                
                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {currentScenarioData.choices.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option.id)}
                      disabled={showResult}
                      className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 ${
                        showResult && choice === option.id
                          ? option.isCorrect
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400"
                            : "bg-gradient-to-r from-red-500 to-orange-600 text-white border-red-400"
                          : "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white border-purple-400"
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
                  {scenarios.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index < currentScenario
                          ? "bg-green-500 w-5 sm:w-6"
                          : index === currentScenario
                          ? "bg-purple-500 w-5 sm:w-6 animate-pulse"
                          : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : !allScenariosAnswered && showResult ? (
            /* Scenario Result */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-purple-300 shadow-xl text-center">
              {isCorrect ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎯</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">💰✨</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Great Choice!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You made a smart spending decision! Keep it up!
                  </p>
                  <button
                    onClick={handleNextScenario}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                  >
                    {isLastScenario ? "See Results" : "Next Scenario"} →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">💸</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Think About Smart Spending!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    Remember, smart spending means saving money, comparing prices, and making plans before buying!
                  </p>
                  <button
                    onClick={handleNextScenario}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    {isLastScenario ? "See Results" : "Next Scenario"} →
                  </button>
                </div>
              )}
            </div>
          ) : allScenariosAnswered && !showBadge ? (
            /* Final Results - Not All Correct */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-purple-300 shadow-xl text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🏅</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700 mb-3 sm:mb-4">Keep Practicing!</h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You got <span className="font-bold text-purple-600">{finalScore}</span> out of{" "}
                <span className="font-bold">{scenarios.length}</span> scenarios correct.
                <br />
                To earn the Smart Spender Kid badge, you need to make smart spending decisions in all 5 scenarios!
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-4 sm:mb-5 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
              </div>
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
              >
                Try Again 🏅
              </button>
            </div>
          ) : (
            /* Badge Unlocked Card */
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-purple-300 shadow-xl">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 animate-bounce">🏆</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700 mb-3 sm:mb-4">Smart Spender Kid Badge Unlocked!</h3>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 leading-relaxed px-1">
                You made smart spending decisions in all <span className="font-bold text-purple-600">5 scenarios</span>! You are now a <span className="font-bold text-purple-600">certified Smart Spender Kid</span>! 🎉
              </p>
              
              {/* Badge Display */}
              <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 text-white py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl inline-block mb-4 sm:mb-5 shadow-lg border-2 border-purple-300">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">🛒</div>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Smart Spender Kid</h4>
                <p className="text-sm sm:text-base md:text-lg">Master of Smart Spending</p>
              </div>
              
              {/* Coins Display */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-4 sm:mb-5 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
              </div>
              
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 sm:mb-5 px-1">
                Congratulations on completing all finance games! You're well on your way to becoming financially literate. 🎉
              </p>
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
              >
                <span className="hidden sm:inline">Continue to Next Level</span>
                <span className="sm:hidden">Next Level</span> →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {showBadge && (
        <GameOverModal
          score={5}
          gameId="finance-kids-20"
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

export default BadgeSmartSpenderKid;
