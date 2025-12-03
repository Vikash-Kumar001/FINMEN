import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ResolveStepsPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-74";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [arrangements, setArrangements] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      steps: ["Listen", "Understand", "Propose", "Agree"],
      correctOrder: ["Listen", "Understand", "Propose", "Agree"]
    },
    {
      id: 2,
      steps: ["Talk", "Compromise", "Agree", "Check"],
      correctOrder: ["Talk", "Compromise", "Agree", "Check"]
    },
    {
      id: 3,
      steps: ["Calm", "Share", "Solve", "Confirm"],
      correctOrder: ["Calm", "Share", "Solve", "Confirm"]
    },
    {
      id: 4,
      steps: ["Hear both", "Find fair", "Check happy", "Finalize"],
      correctOrder: ["Hear both", "Find fair", "Check happy", "Finalize"]
    },
    {
      id: 5,
      steps: ["Stop argue", "Think win-win", "Try plan", "Review"],
      correctOrder: ["Stop argue", "Think win-win", "Try plan", "Review"]
    }
  ];

  const handleStepClick = (step) => {
    // Add step to user order if not already selected
    if (!userOrder.includes(step)) {
      setUserOrder([...userOrder, step]);
    }
  };

  const handleRemoveStep = (step) => {
    // Remove step from user order
    setUserOrder(userOrder.filter(s => s !== step));
  };

  const handleArrange = () => {
    const newArrangements = [...arrangements, userOrder];
    setArrangements(newArrangements);

    const isCorrect = userOrder.join(',') === questions[currentLevel].correctOrder.join(',');
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setUserOrder([]); // Reset user order for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctArrangements = newArrangements.filter((uo, idx) => uo.join(',') === questions[idx].correctOrder.join(',')).length;
      setFinalScore(correctArrangements);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setArrangements([]);
    setCoins(0);
    setFinalScore(0);
    setUserOrder([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Resolve Steps Puzzle"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-74"
      gameType="uvls"
      totalLevels={100}
      currentLevel={74}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Order mediation steps!</p>
              
              {/* Display user's current selection order */}
              <div className="mb-4 min-h-[40px]">
                <p className="text-white/80 mb-2">Your order:</p>
                <div className="flex flex-wrap gap-2">
                  {userOrder.map((step, index) => (
                    <div 
                      key={`${step}-${index}`} 
                      className="bg-green-500 p-2 rounded flex items-center cursor-pointer"
                      onClick={() => handleRemoveStep(step)}
                    >
                      {index + 1}. {step} ❌
                    </div>
                  ))}
                  {userOrder.length === 0 && (
                    <p className="text-white/50 italic">Click on steps below to add them in order</p>
                  )}
                </div>
              </div>
              
              {/* Available steps to select */}
              <div className="flex flex-wrap gap-4 mb-4">
                {getCurrentLevel().steps
                  .filter(step => !userOrder.includes(step))
                  .map(step => (
                    <div 
                      key={step} 
                      className="bg-blue-500 p-2 rounded cursor-pointer hover:bg-blue-600 transition"
                      onClick={() => handleStepClick(step)}
                    >
                      {step} 🧩
                    </div>
                  ))}
              </div>
              
              <button 
                onClick={handleArrange} 
                className="mt-4 bg-purple-500 text-white p-2 rounded disabled:opacity-50"
                disabled={userOrder.length !== getCurrentLevel().steps.length}
              >
                Submit Order
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Steps Solver!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You ordered correctly {finalScore} out of {questions.length} times!
                  You know the steps to resolve conflicts!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Following the right steps helps resolve conflicts peacefully and fairly!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Order Better!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You ordered correctly {finalScore} out of {questions.length} times.
                  Keep learning the steps to resolve conflicts!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Remember the steps: Listen, understand, then propose solutions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ResolveStepsPuzzle;