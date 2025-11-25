import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexSmartSaver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-3";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef(null);

  const stages = [
    {
      id: 1,
      action: "Plan Savings",
      wrong: "Spend Instantly",
      prompt: "Tap to plan your savings!",
      emoji: "📝"
    },
    {
      id: 2,
      action: "Budget First",
      wrong: "Impulse Buy",
      prompt: "Tap to budget first!",
      emoji: "📊"
    },
    {
      id: 3,
      action: "Save Regularly",
      wrong: "Buy on Credit",
      prompt: "Tap to save regularly!",
      emoji: "💰"
    },
    {
      id: 4,
      action: "Set Goals",
      wrong: "Spend All",
      prompt: "Tap to set goals!",
      emoji: "🎯"
    },
    {
      id: 5,
      action: "Track Expenses",
      wrong: "No Plan",
      prompt: "Tap to track expenses!",
      emoji: "📈"
    }
  ];

  // Timer for each stage (5 seconds)
  useEffect(() => {
    if (currentStage < stages.length && !showResult) {
      setTimeLeft(5);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - move to next stage without scoring
            if (currentStage < stages.length - 1) {
              setTimeout(() => {
                setCurrentStage(prev => prev + 1);
                resetFeedback();
              }, 500);
            } else {
              // Last stage - show results
              setFinalScore(coins);
              setTimeout(() => {
                setShowResult(true);
              }, 500);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentStage, showResult, coins]);

  const handleTap = (choice) => {
    // Clear the timer when user makes a choice
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    resetFeedback();
    const isCorrect = choice === stages[currentStage].action;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Move to next stage after a short delay
    if (currentStage < stages.length - 1) {
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        resetFeedback();
      }, 800);
    } else {
      // Last stage - show results
      const finalCoins = isCorrect ? coins + 1 : coins;
      setFinalScore(finalCoins);
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    }
  };

  const handleTryAgain = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setShowResult(false);
    setCurrentStage(0);
    setCoins(0);
    setFinalScore(0);
    setTimeLeft(5);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/teen/puzzle-of-saving-goals");
  };

  return (
    <GameShell
      title="Reflex Smart Saver"
      subtitle={stages[currentStage]?.prompt || "Test your saving reflexes!"}
      onNext={showResult ? handleNext : null}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="finance-teens-3"
      gameType="finance"
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      currentLevel={currentStage + 1}
      showConfetti={showResult && finalScore >= 3}
      maxScore={stages.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold">Stage {currentStage + 1} of {stages.length}</h3>
              <div className={`text-4xl font-bold ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                {timeLeft}s
              </div>
            </div>
            
            {stages[currentStage] && (
              <>
                <div className="text-6xl mb-6">{stages[currentStage].emoji}</div>
                <div className="flex justify-center gap-6 mb-6">
                  <button
                    onClick={() => handleTap(stages[currentStage].action)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-6 rounded-full text-xl font-bold transition-transform hover:scale-105 shadow-lg"
                  >
                    {stages[currentStage].action}
                  </button>
                  <button
                    onClick={() => handleTap(stages[currentStage].wrong)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-8 py-6 rounded-full text-xl font-bold transition-transform hover:scale-105 shadow-lg"
                  >
                    {stages[currentStage].wrong}
                  </button>
                </div>
                <p className="text-white/80 text-lg">
                  Choose the smart saving habit quickly!
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-4">Smart Saver Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {finalScore} out of {stages.length}!</p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
              <span>+{coins} Coins</span>
            </div>
            <p className="text-white/80 mt-4">Lesson: Quick decisions on smart saving habits!</p>
            {finalScore < 3 && (
              <button
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-transform hover:scale-105 mt-4"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexSmartSaver;