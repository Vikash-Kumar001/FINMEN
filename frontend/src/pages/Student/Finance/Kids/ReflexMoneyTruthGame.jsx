import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexMoneyTruthGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
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

  const stages = [
    {
      id: 1,
      prompt: "You get more change than you should. What is the fair choice?",
      action: "Be Fair",
      wrong: "Be Greedy",
    },
    {
      id: 2,
      prompt: "You broke something in a shop. What should you choose?",
      action: "Tell Truth",
      wrong: "Lie",
    },
    {
      id: 3,
      prompt: "You and a friend shared money for snacks. What is right?",
      action: "Share",
      wrong: "Hoard",
    },
    {
      id: 4,
      prompt: "You are helping someone buy a toy. How should you act?",
      action: "Honest Deal",
      wrong: "Cheat",
    },
    {
      id: 5,
      prompt: "You need to choose how to behave with money every day. What is best?",
      action: "Be Ethical",
      wrong: "Be Dishonest",
    },
  ];

  const handleTap = (choice) => {
    if (showResult) return;

    const correct = choice === stages[currentStage].action;
    setSelectedChoice(choice);
    setIsCorrect(correct);

    const newAnswers = [...answers, { stageId: stages[currentStage].id, correct }];
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

  const handleNextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setSelectedChoice(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
    }
  };

  const currentStageData = stages[currentStage];
  const totalStages = stages.length;
  const allStagesAnswered = answers.length === totalStages;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-emerald-100 via-sky-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
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
            {["⚖️", "💬", "💰", "🤝", "✅", "🧠"][i % 6]}
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
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500" />
            <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Reflex: Money Truth</span>
              <span className="xs:hidden">Money Truth</span>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-emerald-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Round {currentStage + 1} of {totalStages}
            </p>
          </div>
        )}

        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Reflex Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-emerald-200 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-500" />
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-emerald-700">
                      Tap the truthful choice
                    </span>
                  </div>
                  <p className="text-emerald-950 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                    {currentStageData.prompt}
                  </p>

                  {/* Buttons in single row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    <button
                      onClick={() => handleTap(currentStageData.action)}
                      disabled={showResult}
                      className="flex-1 min-w-[120px] sm:min-w-[140px] px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-bold transition-all transform hover:scale-105 shadow-md disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {currentStageData.action}
                    </button>
                    <button
                      onClick={() => handleTap(currentStageData.wrong)}
                      disabled={showResult}
                      className="flex-1 min-w-[120px] sm:min-w-[140px] px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-bold transition-all transform hover:scale-105 shadow-md disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {currentStageData.wrong}
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
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
                  <div
                    className={`text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 ${
                      isCorrect ? "animate-bounce" : ""
                    }`}
                  >
                    {isCorrect ? "✅" : "🤔"}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 mb-2 sm:mb-3">
                    {isCorrect ? "Money Truth Win!" : "Think About What’s Fair"}
                  </h3>
                  <p className="text-emerald-900 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-1">
                    {isCorrect
                      ? "Great! You chose the fair and truthful action with money."
                      : "A fairer choice is: " + currentStageData.action + "."}
                  </p>
                  <button
                    onClick={handleNextStage}
                    className="px-8 sm:px-10 py-2.5 sm:py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 shadow-lg"
                  >
                    {currentStage < totalStages - 1 ? "Next Round" : "See Result"}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                ⚖️💚✨
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3">
                Money Truth Reflex Star!
              </h3>
              <p className="text-emerald-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You chose the truthful and fair option in {finalScore} out of {totalStages}{" "}
                rounds.
                <br />
                Standing for fairness and honesty makes you someone others can trust with
                money.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-emerald-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Money truth means not just winning, but doing what’s right — even
                when nobody is watching.
              </p>
              {allStagesAnswered && (
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
          totalQuestions={totalStages}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-99"
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

export default ReflexMoneyTruthGame;