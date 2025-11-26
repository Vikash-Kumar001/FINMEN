import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 5;

const ReflexMoneyPlan = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-29";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const timerRef = useRef(null);
  const currentStageRef = useRef(0);

  const stages = [
    {
      question: "Before buying something, what should you do first?",
      action: "Plan & Budget",
      wrong: "Buy Immediately",
      prompt: "What's the smart way to handle money before spending?",
      correctExplanation: "Planning helps you make smart choices!",
      wrongExplanation: "Planning first saves money!"
    },
    {
      question: "You want a toy that costs ₹200, but you only have ₹150. What should you do?",
      action: "Save More First",
      wrong: "Borrow Money",
      prompt: "What's the best way to get something you want?",
      correctExplanation: "Saving first teaches patience and planning!",
      wrongExplanation: "Saving is better than borrowing!"
    },
    {
      question: "What helps you know where your money goes?",
      action: "Track Expenses",
      wrong: "Ignore Spending",
      prompt: "How do you keep track of your money?",
      correctExplanation: "Tracking helps you understand your spending!",
      wrongExplanation: "Tracking expenses is important!"
    },
    {
      question: "You get ₹100. What's the smart way to use it?",
      action: "Save Some, Spend Some",
      wrong: "Spend Everything",
      prompt: "What's a balanced way to handle your money?",
      correctExplanation: "Balancing saving and spending is smart!",
      wrongExplanation: "Balance is key to good money habits!"
    },
    {
      question: "What should you do to reach a big money goal?",
      action: "Set a Savings Plan",
      wrong: "Spend on Small Things",
      prompt: "How do you achieve big financial goals?",
      correctExplanation: "Planning helps you reach your goals!",
      wrongExplanation: "Planning is essential for big goals!"
    },
  ];

  // Update ref when currentStage changes
  useEffect(() => {
    currentStageRef.current = currentStage;
  }, [currentStage]);

  // Reset timer when stage changes
  useEffect(() => {
    if (showResult) return;
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    setLastAnswerCorrect(false);
  }, [currentStage, showResult]);

  // Timer effect - countdown from 5 seconds for each question
  useEffect(() => {
    if (showResult) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this question
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          setAnswered(true);
          resetFeedback();
          
          const isLastQuestion = currentStageRef.current >= TOTAL_ROUNDS - 1;
          
          setTimeout(() => {
            if (isLastQuestion) {
              setShowResult(true);
            } else {
              setCurrentStage((prev) => prev + 1);
            }
          }, 1000);
          
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // Cleanup on unmount or stage change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentStage, showResult, resetFeedback]);

  const handleTap = (choice) => {
    if (answered || showResult) return; // Prevent multiple clicks
    
    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = choice === stages[currentStage].action;
    const isLastQuestion = currentStage === stages.length - 1;
    
    setLastAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results after 1.5 seconds (to show feedback)
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentStage((prev) => prev + 1);
        setLastAnswerCorrect(false);
      }
    }, 1500);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Reflex Money Plan"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: ${stages[currentStage]?.prompt || "Test your planning reflexes!"}` : "Game Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult && stages[currentStage] && (
          <>
            {/* Status Bar with Timer - Similar to ReflexSavings */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentStage + 1}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">              
              <h4 className="text-xl font-semibold mb-4 text-white">
                {stages[currentStage].question}
              </h4>
              <p className="text-white/70 text-sm mb-6">{stages[currentStage].prompt}</p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <button
                  onClick={() => handleTap(stages[currentStage].action)}
                  disabled={answered || showResult}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {stages[currentStage].action}
                </button>
                <button
                  onClick={() => handleTap(stages[currentStage].wrong)}
                  disabled={answered || showResult}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {stages[currentStage].wrong}
                </button>
              </div>
              
              {/* Show feedback after answering */}
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  lastAnswerCorrect
                    ? 'bg-green-500/20 border-2 border-green-400' 
                    : 'bg-red-500/20 border-2 border-red-400'
                }`}>
                  <p className="text-white font-semibold">
                    {lastAnswerCorrect
                      ? stages[currentStage].correctExplanation
                      : stages[currentStage].wrongExplanation}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexMoneyPlan;