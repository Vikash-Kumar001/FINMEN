import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexNeedVsWant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [choice, setChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [target, setTarget] = useState("");
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

  const stages = [
    { action: "Shoes for School", wrong: "10th Toy Car", prompt: "Tap for the need!", emoji: "👟" },
    { action: "Healthy Food", wrong: "Extra Candy", prompt: "Tap for the need!", emoji: "🍎" },
    { action: "School Books", wrong: "Video Game", prompt: "Tap for the need!", emoji: "📚" },
    { action: "Winter Jacket", wrong: "Fancy Sunglasses", prompt: "Tap for the need!", emoji: "🧥" },
    { action: "Bus Fare", wrong: "New Headphones", prompt: "Tap for the need!", emoji: "🚌" },
  ];

  useEffect(() => {
    if (currentStage < stages.length && !showResult) {
      setTarget(Math.random() < 0.7 ? stages[currentStage].action : stages[currentStage].wrong);
    }
  }, [currentStage, showResult]);

  const handleTap = (isNeed) => {
    if (choice !== null) return;
    
    const currentStageData = stages[currentStage];
    // Correct if: tapped NEED and target is the need, OR tapped WANT and target is the want
    const isCorrect = (isNeed && target === currentStageData.action) || (!isNeed && target === currentStageData.wrong);
    
    setChoice(isNeed ? "need" : "want");
    setAnswers([...answers, { stageId: currentStage + 1, isCorrect }]);
    
    if (isCorrect) {
      // Update coins in real-time for correct answers
      setCoins(prevCoins => prevCoins + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      setShowResult(true);
    }, isCorrect ? 1500 : 1000);
  };

  const handleNextQuestion = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(prev => prev + 1);
      setChoice(null);
      setShowResult(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter(a => a.isCorrect).length;
      setFinalScore(correctCount);
    }
  };

  useEffect(() => {
    if (finalScore > 0) {
      setShowResult(true);
    }
  }, [finalScore]);

  const currentStageData = stages[currentStage];
  const isCorrect = choice && ((choice === "need" && target === currentStageData.action) || (choice === "want" && target === currentStageData.wrong));
  const allQuestionsAnswered = answers.length === stages.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex flex-col relative overflow-hidden">
      {/* Floating Background Elements */}
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
            {['✅', '📚', '👟', '🍎', '💧', '💰'][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-green-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-green-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-green-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">⚡</span>
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Reflex: Need vs Want</span>
              <span className="xs:hidden">Need vs Want</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-green-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">⚡</span>
            <span className="text-green-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Round {currentStage + 1} of {stages.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Question Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-green-300 shadow-xl">
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">⚡</div>
                  <p className="text-gray-800 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                    {currentStageData.prompt}
                  </p>
                  
                  {/* Target Word Display */}
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 rounded-xl border-2 border-green-200">
                    {target}
                  </div>

                  {/* Action Buttons - Single Row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    <button
                      onClick={() => handleTap(true)}
                      disabled={choice !== null}
                      className="flex-1 min-w-[100px] sm:min-w-[120px] px-4 sm:px-5 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl font-bold transition-all transform hover:scale-105 shadow-md disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      NEED
                    </button>
                    <button
                      onClick={() => handleTap(false)}
                      disabled={choice !== null}
                      className="flex-1 min-w-[100px] sm:min-w-[120px] px-4 sm:px-5 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl font-bold transition-all transform hover:scale-105 shadow-md disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      WANT
                    </button>
                  </div>

                  {/* Progress Indicator - Inside Card */}
                  <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                    {stages.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index < currentStage
                            ? "bg-green-500 w-5 sm:w-6"
                            : index === currentStage
                            ? "bg-green-500 w-5 sm:w-6 animate-pulse"
                            : "bg-gray-300 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-green-300 shadow-xl text-center">
                <div className={`text-6xl sm:text-7xl md:text-8xl mb-4 ${isCorrect ? "animate-bounce" : ""}`}>
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
                  {isCorrect
                    ? "Great choice! You identified the need correctly!"
                    : `The correct answer is: "${currentStageData.action}" is a NEED`}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                >
                  {currentStage < stages.length - 1 ? "Next Round" : "Finish"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-green-300 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">⚡🎉</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Needs Reflex Star!</h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You finished all {stages.length} rounds! ⭐
                <br />
                You scored {finalScore} out of {stages.length}!
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">+{coins} Coins</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Prioritize needs over wants!
              </p>
              {allQuestionsAnswered && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                >
                  <span className="hidden sm:inline">Continue to Next Level</span>
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
      {finalScore > 0 && coins === 5 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={stages.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-33"
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

export default ReflexNeedVsWant;